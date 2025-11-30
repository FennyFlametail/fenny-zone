<script lang="ts">
	import { browser } from '$app/environment';
	import type { AppName } from '$lib/apps.svelte';
	import { getWindowServerContext, setAppContext, setToolbarContext } from '$lib/context.svelte';
	import WindowServer from '$lib/windowServer.svelte';
	import { Minus, Plus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {
		appName
	}: {
		appName: AppName;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.runningApps[appName] ?? windowServer.openApp(appName);
	setAppContext({ appName, app });

	const title = $derived(app.windowTitle || app.title);

	const toolbarWrapper = $state<ReturnType<typeof setToolbarContext>>({});
	setToolbarContext(toolbarWrapper);

	const minWindowSize = 250;

	let element = $state<HTMLElement>();

	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	let focused = $derived(app === windowServer.focusedApp?.app);
	// used to focus single window when JavaScript is disabled
	let ssr = $state(true);
	onMount(() => (ssr = false));

	let allowDrag = $state(true);
	function blockDrag() {
		allowDrag = false;
	}

	function focusWithoutDrag(e: PointerEvent) {
		e.stopPropagation();
		windowServer.focusApp(appName);
	}

	function startDrag(e: PointerEvent) {
		windowServer.focusApp(appName);
		windowServer.draggingEl = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function startResize(e: PointerEvent) {
		e.stopPropagation();
		windowServer.focusApp(appName);
		windowServer.resizingEl = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function pointerMove(e: PointerEvent) {
		if (windowServer.draggingEl === element && allowDrag) {
			app.instance.position.x += e.screenX - lastX;
			app.instance.position.y += e.screenY - lastY;
			app.instance.position.y = Math.max(app.instance.position.y, 0);

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (windowServer.resizingEl === element) {
			const newWidth = app.instance.position.width + e.screenX - lastX;
			const newHeight = app.instance.position.height + e.screenY - lastY;

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
		allowDrag = true;
		windowServer.draggingEl = undefined;
		windowServer.resizingEl = undefined;
	}

	function stopAnimating() {
		app.instance.animating = false;
	}
</script>

<article
	bind:this={element}
	onpointerdown={startDrag}
	ontransitionend={stopAnimating}
	class={{
		window: true,
		brushed: app.brushed,
		inactive: !focused && !ssr,
		animating: app.instance.animating
	}}
	style:--x={`${app.instance.position.x}px`}
	style:--y={`${app.instance.position.y}px`}
	style:--width={`${app.instance.position.width}px`}
	style:--height={`${app.instance.position.height}px`}
	style:z-index={app.instance.position.zIndex}
	style:--minWindowSize={`${minWindowSize}px`}
>
	<header class="windowTitlebar">
		<div class="windowControls">
			<svelte:element
				this={browser ? 'button' : 'a'}
				role={browser ? 'button' : 'link'}
				class={['windowButton', 'close', app.instance?.modified && 'modified']}
				aria-label="Close"
				onclick={() => windowServer.closeApp(appName)}
				onpointerdown={blockDrag}
				href={app.backTo ?? '/'}
			>
				<X class="windowButtonGlyph" size={14} />
			</svelte:element>
			<button class="windowButton minimize" aria-label="Minimize" onpointerdown={blockDrag}>
				<Minus class="windowButtonGlyph" size={14} />
			</button>
			<button
				class="windowButton maximize"
				aria-label="Maximize"
				onclick={() => windowServer.zoomApp(appName)}
				onpointerdown={blockDrag}
			>
				<Plus class="windowButtonGlyph" size={14} />
			</button>
		</div>
		<h2 class="windowTitle">
			{title}
		</h2>
		<menu class="windowToolbar">
			{@render toolbarWrapper.toolbar?.()}
		</menu>
	</header>
	<div class="windowContent" onpointerdown={focusWithoutDrag}>
		<app.Page />
	</div>
	<div class="windowResizeHandle" onpointerdown={startResize}></div>
</article>

<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		grid-area: 1 / 1;
		transform: translate(var(--x), var(--y));
		min-width: var(--minWindowSize);
		min-height: var(--minWindowSize);
		width: var(--width);
		height: var(--height);
		display: flex;
		flex-direction: column;
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

	.windowControls {
		grid-area: title;
		align-self: center;
		display: flex;
		align-items: center;
		gap: 9px;
		z-index: 1;
	}

	.windowButton {
		display: flex;
		justify-content: center;
		align-items: center;

		/* TODO remove when minimize is implemented */
		@media not (scripting: none) {
			&.minimize {
				cursor: not-allowed;
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
		font-size: 16px;
		white-space: nowrap;
	}

	.windowToolbar {
		&:empty {
			display: none;
		}

		grid-area: toolbar;
		display: flex;
		padding-top: 8px;
		padding-bottom: 11px;
		padding-inline: 0;
		gap: 7px;
		list-style: none;
	}

	.windowContent {
		flex-grow: 1;
		position: relative;
		overflow: auto;
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
