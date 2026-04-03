<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName } from '$lib/apps.svelte';
	import WindowControls from '$lib/components/WindowControls.svelte';
	import { getWindowServerContext, setAppContext } from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { scale } from 'svelte/transition';

	let {
		appName,
		props
	}: {
		appName: AppName;
		props?: Record<string, any>;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.runningApps[appName] ?? windowServer.openApp(appName);
	setAppContext({ appName, app });

	const title = $derived(app.instance.title ?? app.windowTitle ?? app.title);
	const displayTitle = $derived(app.hideWindowTitle ? '' : title);

	let minWindowSize = app.minWindowSize ?? 500;
	if (browser) {
		minWindowSize = Math.min(minWindowSize, document.documentElement.clientWidth);
	}

	let element = $state<HTMLElement>();

	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	// used to focus single window when JavaScript is disabled
	let ssr = $state(true);
	onMount(() => (ssr = false));

	function startDrag(e: PointerEvent) {
		delete app.instance.preZoomPosition;
		windowServer.focusApp(appName);
		if ((e.target as Element).hasAttribute('data-allow-window-drag')) {
			windowServer.draggingEl = element;
			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function startResize(e: PointerEvent) {
		if (app.noResize) return;
		delete app.instance.preZoomPosition;
		windowServer.resizingEl = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function pointerMove(e: PointerEvent) {
		if (windowServer.draggingEl === element) {
			app.instance.position.x += e.screenX - lastX;
			app.instance.position.y += e.screenY - lastY;
			app.instance.position.y = Math.max(app.instance.position.y, 0);

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (windowServer.resizingEl === element) {
			const resizeFromCenter = e.altKey;

			const deltaX = e.screenX - lastX;
			let deltaY = e.screenY - lastY;
			if (app.lockAspectRatio) {
				deltaY = (deltaX * app.instance.position.height) / app.instance.position.width;
			}

			lastX = e.screenX;
			lastY = e.screenY;

			let newWidth = app.instance.position.width + deltaX;
			let newHeight = app.instance.position.height + deltaY;

			if (app.lockAspectRatio) {
				if (
					Math.min(newWidth, newHeight) <= minWindowSize ||
					newHeight >= WindowServer.safeHeight - app.instance.position.y
				) {
					return;
				}
			}

			if (resizeFromCenter) {
				// FIXME can break lockAspectRatio by resizing against menubar
				if (app.instance.position.width > minWindowSize) {
					newWidth += deltaX;
					app.instance.position.x -= deltaX;
				}
				const newY = Math.max(app.instance.position.y - deltaY, 0);
				if (app.instance.position.height > minWindowSize && newY > 0) {
					newHeight += deltaY;
					app.instance.position.y = newY;
				}
			}

			app.instance.position.width = Math.max(newWidth, minWindowSize);
			app.instance.position.height = Math.min(
				Math.max(newHeight, minWindowSize),
				WindowServer.safeHeight - app.instance.position.y
			);
		}
	}

	function pointerUp() {
		windowServer.draggingEl = undefined;
		windowServer.resizingEl = undefined;
	}

	function onfocusin() {
		if (element?.matches(':focus-within')) {
			windowServer.focusApp(appName);
		}
	}
</script>

<article
	bind:this={element}
	onpointerdown={startDrag}
	ontransitionend={() => (app.instance.animating = false)}
	class={{
		window: true,
		brushed: app.windowStyle === 'brushed',
		custom: app.windowStyle === 'custom',
		inactive: !app.instance.focused && !ssr,
		animating: app.instance.animating
	}}
	style:--window-x="{app.instance.position.x}px"
	style:--window-y="{app.instance.position.y}px"
	style:--window-width="{app.instance.position.width}px"
	style:--window-height="{app.instance.position.height}px"
	style:z-index={app.instance.position.zIndex}
	aria-label={app.instance.ariaLabel ?? title}
	data-appname={appName}
	data-allow-window-drag
	out:scale={{ duration: 150, start: !prefersReducedMotion.current ? 0.97 : 1, opacity: 0 }}
>
	{#if app.windowStyle !== 'custom'}
		<header class="windowTitlebar" aria-label={title} data-allow-window-drag>
			{#if !app.hideWindowControls}
				<WindowControls />
			{/if}
			{#if displayTitle}
				<h2 class="windowTitle" data-allow-window-drag>
					{displayTitle}
				</h2>
			{/if}
		</header>
	{/if}
	<div class="windowContent">
		{#if browser}
			<svelte:boundary onerror={(e) => windowServer.closeAppWithError(appName, e)}>
				<app.Page {...props} />
				{#snippet pending()}{/snippet}
			</svelte:boundary>
		{:else}
			<app.Page {...props} />
		{/if}
	</div>
	{#if !app.noResize}
		<div class="windowResizeHandle noJS-hide" onpointerdown={startResize}></div>
	{/if}
</article>

<svelte:window {onfocusin} />
<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		grid-area: 1 / 1;
		transform: translate(var(--window-x), var(--window-y));
		width: var(--window-width);
		height: var(--window-height);
		display: grid;
		grid-template:
			'titlebar' auto
			'content' 1fr;
		background-color: white;
		border: 1px solid black;
		box-shadow: var(--panel-box-shadow);
		touch-action: manipulation; /* needed for touch dragging to work */

		&.inactive {
			box-shadow: var(--panel-box-shadow-inactive);
		}

		&.animating {
			@media not (prefers-reduced-motion: reduce) {
				transition: 0.25s ease;
				transition-property: width, height, transform;
			}
		}

		@media (scripting: none) {
			position: absolute;
			left: max(0px, 50vw - var(--window-width) / 2);
			top: max(0px, (var(--desktop-safe-height) / 2 - var(--window-height) / 2) * (2/3));
			max-width: 100vw;
			max-height: var(--desktop-safe-height);
		}
	}

	.windowTitlebar {
		grid-area: titlebar;
		position: relative;
		display: grid;
		grid-template: 'title' var(--titlebar-height) / 100%;
		padding-inline: var(--titlebar-padding);
		-webkit-user-select: none;
		user-select: none;
	}

	.windowTitle {
		grid-area: title;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-weight: normal;
		font-size: 16px;
		white-space: nowrap;
	}

	.windowContent {
		container: window / inline-size;
		grid-area: content;
		display: grid;
		justify-items: stretch;
		align-items: stretch;
		min-height: 0;
		position: relative;
		overscroll-behavior: none;
	}

	.windowResizeHandle {
		position: absolute;
		bottom: -5px;
		right: -5px;
		width: 20px;
		height: 20px;
		touch-action: pinch-zoom;
		cursor: nwse-resize;
	}
</style>
