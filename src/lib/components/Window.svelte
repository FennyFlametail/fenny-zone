<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName } from '$lib/apps.svelte';
	import WindowControls from '$lib/components/WindowControls.svelte';
	import {
		getWindowServerContext,
		setAppContext,
		setToolbarEntryContext
	} from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import { onMount } from 'svelte';

	let {
		appName
	}: {
		appName: AppName;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.runningApps[appName] ?? windowServer.openApp(appName);
	setAppContext({ appName, app });
	// FIXME hacky fix for runningApps out of sync issue
	const instance = $derived(app.instance);

	const title = $derived(app.windowTitle ?? app.title);

	const toolbarEntriesWrapper = $state<ReturnType<typeof setToolbarEntryContext>>({
		entries: []
	});
	setToolbarEntryContext(toolbarEntriesWrapper);

	const toolbarStyles = $derived.by(() => {
		const mergedStyles: Record<string, string> = Object.assign(
			{},
			...toolbarEntriesWrapper.entries.map(({ style }) => style)
		);
		return Object.entries(mergedStyles).reduce(
			(acc, [key, value]) => acc.concat(`${key}:${value};`),
			''
		);
	});

	const minWindowSize = 350;

	let element = $state<HTMLElement>();

	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	let focused = $derived(app === windowServer.focusedApp?.app);
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
			const deltaY = e.screenY - lastY;
			let newWidth = app.instance.position.width + deltaX;
			let newHeight = app.instance.position.height + deltaY;

			if (resizeFromCenter) {
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

			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function pointerUp() {
		windowServer.draggingEl = undefined;
		windowServer.resizingEl = undefined;
	}
</script>

<article
	bind:this={element}
	onpointerdown={startDrag}
	ontransitionend={() => (instance.animating = false)}
	class={{
		window: true,
		brushed: app.windowStyle === 'brushed',
		custom: app.windowStyle === 'custom',
		inactive: !focused && !ssr,
		animating: instance.animating
	}}
	style:--x={`${instance.position.x}px`}
	style:--y={`${instance.position.y}px`}
	style:--width={`${instance.position.width}px`}
	style:--height={`${instance.position.height}px`}
	style:z-index={instance.position.zIndex}
	data-appname={appName}
	data-allow-window-drag
>
	{#if app.windowStyle !== 'custom'}
		<header class="windowTitlebar" data-allow-window-drag>
			{#if !app.hideWindowControls}
				<WindowControls />
			{/if}
			{#if title}
				<h2 class="windowTitle" data-allow-window-drag>
					{title}
				</h2>
			{/if}
			{#if toolbarEntriesWrapper.entries.length}
				<menu class="windowToolbar" style={toolbarStyles} data-allow-window-drag>
					{#each toolbarEntriesWrapper.entries as { snippet }}
						{@render snippet()}
					{/each}
				</menu>
			{/if}
		</header>
	{/if}
	<div class="windowContent">
		{#if browser}
			<svelte:boundary
				onerror={(e) => {
					console.error(e);
					// TODO crash dialog
					windowServer.closeApp(appName);
				}}
			>
				<app.Page />
				{#snippet pending()}{/snippet}
			</svelte:boundary>
		{:else}
			<app.Page />
		{/if}
	</div>
	{#if !app.noResize}
		<div class="windowResizeHandle" onpointerdown={startResize}></div>
	{/if}
</article>

<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		grid-area: 1 / 1;
		transform: translate(var(--x), var(--y));
		width: var(--width);
		height: var(--height);
		display: grid;
		grid-template:
			'titlebar' auto
			'content' 1fr;
		background-color: white;
		border: 1px solid black;
		box-shadow: var(--panel-box-shadow);
		overflow: hidden;
		touch-action: auto; /* needed for touch dragging to work */

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
			left: max(0px, 50vw - var(--width) / 2);
			top: max(0px, (var(--desktop-safe-height) / 2 - var(--height) / 2) * (2/3));
			max-width: 100vw;
			max-height: var(--desktop-safe-height);
		}
	}

	.windowTitlebar {
		grid-area: titlebar;
		position: relative;
		display: grid;
		grid-template:
			'title' 28px
			'toolbar' auto / 100%;
		padding-inline: var(--titlebar-padding);
		touch-action: pinch-zoom;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
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

	.windowToolbar {
		&:empty {
			display: none;
		}
		grid-area: toolbar;
		display: grid;
		grid-auto-flow: column;
		justify-content: start;
		justify-items: start;
		padding-top: 8px;
		padding-bottom: 11px;
		padding-inline: 0;
		gap: 7px;
		list-style: none;
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

		@media (scripting: none) {
			display: none;
		}
	}
</style>
