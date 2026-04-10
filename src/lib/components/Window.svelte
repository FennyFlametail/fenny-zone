<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName } from '$lib/apps.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import WindowControls from '$lib/components/WindowControls.svelte';
	import { getWindowServerContext, setAppContext } from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
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
	const parent = app.parent ? windowServer.apps[app.parent] : null;

	const title = $derived(app.instance.title ?? app.windowTitle ?? app.title);
	const displayTitle = $derived(app.hideWindowTitle ? '' : title);

	let minSize = app.minSize ?? 500;
	if (browser) {
		minSize = Math.min(minSize, document.documentElement.clientWidth);
	}

	let element = $state<HTMLElement>();

	let dragging = $state(false);
	$effect(() => {
		// using $derived breaks the menu bar hover for some reason - maybe accessing windowServer too early?
		dragging = windowServer.draggingEl === element;
	});
	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

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
					Math.min(newWidth, newHeight) <= minSize ||
					newHeight >= WindowServer.safeHeight - app.instance.position.y
				) {
					return;
				}
			}

			if (resizeFromCenter) {
				// FIXME can break lockAspectRatio by resizing against menubar
				if (app.instance.position.width > minSize) {
					newWidth += deltaX;
					app.instance.position.x -= deltaX;
				}
				const newY = Math.max(app.instance.position.y - deltaY, 0);
				if (app.instance.position.height > minSize && newY > 0) {
					newHeight += deltaY;
					app.instance.position.y = newY;
				}
			}

			app.instance.position.width = Math.max(newWidth, minSize);
			app.instance.position.height = Math.min(
				Math.max(newHeight, minSize),
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

	function dontSave() {
		windowServer.closeApp(appName, { closeSaveSheet: true });
	}

	function save() {
		if (app.instance.saveData) {
			const url = URL.createObjectURL(app.instance.saveData);
			// extend if needed for other data types
			const extension = 'html';
			const link = document.createElement('a');
			link.download = `${app.title}.${extension}`;
			link.href = url;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
		windowServer.closeApp(appName, { closeSaveSheet: true });
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
		inactive: browser && !app.instance.focused,
		dragging,
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
	{#if app.instance.showSaveSheet && app.instance.saveData}
		<Sheet isOpen={true}>
			<div class="saveSheet">
				<Prompt
					title="Do you want to save changes to this document before closing?"
					body="If you don't save, your changes will be lost."
					icon={parent?.icon ?? app.icon}
				>
					{#snippet buttonsLeft()}
						<button class="aqua-button" onclick={dontSave}>Don't Save</button>
					{/snippet}
					{#snippet buttonsRight()}
						<button class="aqua-button" onclick={() => (app.instance.showSaveSheet = false)}
							>Cancel</button
						>
						<button class="aqua-button primary" onclick={save}>Save</button>
					{/snippet}
				</Prompt>
			</div>
		</Sheet>
	{/if}
</article>

<svelte:window {onfocusin} />
<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		grid-area: 1 / 1;
		translate: var(--window-x) var(--window-y);
		width: var(--window-width);
		height: var(--window-height);
		display: grid;
		grid-template:
			'titlebar' auto
			'content' 1fr;
		background: var(--pinstripe-bg-image);
		background-clip: padding-box;
		border-top-right-radius: var(--window-radius);
		border-top-left-radius: var(--window-radius);
		box-shadow: var(--panel-box-shadow), var(--panel-border-box-shadow);
		touch-action: manipulation; /* needed for touch dragging to work */

		&.inactive {
			box-shadow: var(--panel-box-shadow-inactive), var(--panel-border-box-shadow);
		}

		&.dragging {
			will-change: translate;
		}

		&.animating {
will-change: width, height, translate;
			@media not (prefers-reduced-motion: reduce) {
				transition: 0.25s ease;
				transition-property: width, height, translate;
			}
		}

		@media (scripting: none) {
			position: absolute;
			left: max(0px, 50vw - var(--window-width) / 2);
			top: max(0px, (var(--desktop-safe-height) / 2 - var(--window-height) / 2) * (2/3));
			max-width: 100vw;
			max-height: var(--desktop-safe-height);
		}

		@media (forced-colors: active) {
			border: 1px solid CanvasText;
		}
	}

	.windowTitlebar {
		grid-area: titlebar;
		position: relative;
		display: grid;
		grid-template: 'title' var(--titlebar-height) / 100%;
		padding-inline: var(--titlebar-padding);
		border-radius: inherit;
		border-bottom: 1px solid #8c8c8c;
		background: linear-gradient(to bottom, #efefef, #cacaca);
		-webkit-user-select: none;
		user-select: none;

		.window.inactive & {
			background: none;
			color: var(--text-secondary);
		}

		&:not(.window.brushed &) {
			@media (forced-colors: active) {
				background-color: Canvas;
				border-bottom: 1px solid CanvasText;
			}
		}
	}

	.windowTitle {
		grid-area: title;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-weight: normal;
		font-size: 17px;
		line-height: 1;
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

	/* keep this at the bottom to override regular window styles */
	.window.brushed {
		--top-highlight-shadow: inset 0 2px 0px 0px rgb(217 217 217);
		box-shadow:
			var(--panel-box-shadow), var(--panel-border-box-shadow), var(--top-highlight-shadow);
		border-bottom-right-radius: var(--window-radius);
		border-bottom-left-radius: var(--window-radius);
		background: linear-gradient(
			to right,
			rgb(175 175 175),
			rgb(220 220 220) 40%,
			rgb(220 220 220) 60%,
			rgb(175 175 175)
		);
		padding-bottom: 32px;
		padding-inline: var(--titlebar-padding);

		@media (forced-colors: active) {
			background: Canvas;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			opacity: 50%;
			/* background on separate layer to control opacity */
			background: url('$lib/images/metal.webp');
			width: 100%;
			height: 100%;
			border-top-left-radius: inherit;
			border-top-right-radius: inherit;
		}

		&.inactive {
			box-shadow:
				var(--panel-box-shadow-inactive), var(--panel-border-box-shadow),
				var(--top-highlight-shadow);
		}

		.windowTitlebar {
			background: none;
			border-bottom: none;
			padding-inline: 0;
		}

		.windowTitle {
			text-shadow: 0 1px 1px white;
		}

		.windowContent {
			:global(> :not(.brushedInset, .brushedNoInset)::before) {
				content: '⚠️ Use the .brushedInset class to render the inset border, or .brushedNoInset to hide this message ⚠️';
				font-size: 1rem;
			}
		}

		.windowResizeHandle {
			right: 0;
			bottom: 0;
			background: url('$lib/images/resize.webp');
			background-position: center;
			background-size: 20px 20px;
			background-repeat: no-repeat;
			width: 36px;
			height: 32px;
		}
	}

	.saveSheet {
		padding-left: 10px;
		padding-right: 20px;
		padding-bottom: 10px;
	}
</style>
