<script lang="ts">
	import { browser, dev } from '$app/environment';
	import type { AppName, RunningApp } from '$lib/apps.svelte';
	import { getWindowServerContext, setAppContext } from '$lib/context';
	import { Minus, Plus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {
		appName,
		app
	}: {
		appName: AppName;
		app: RunningApp;
	} = $props();

	const windowServer = getWindowServerContext();

	setAppContext(appName, app);

	let element = $state<HTMLElement>();

	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	let focused = $derived(app === windowServer.focusedApp.app);
	// used to focus single window when JavaScript is disabled
	let ssr = $state(true);
	onMount(() => (ssr = false));

	let allowDrag = $state(true);
	function blockDrag() {
		allowDrag = false;
	}

	function startDrag(e: PointerEvent) {
		windowServer.draggingEl = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function startResize(e: PointerEvent) {
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
			app.instance.position.width += e.screenX - lastX;
			app.instance.position.height += e.screenY - lastY;

			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function pointerUp() {
		allowDrag = true;
		windowServer.draggingEl = undefined;
		windowServer.resizingEl = undefined;
	}
</script>

<article
	bind:this={element}
	onpointerdown={() => windowServer.focusApp(appName)}
	class={['window', !focused && !ssr && 'inactive']}
	style:--x={`${app.instance.position.x}px`}
	style:--y={`${app.instance.position.y}px`}
	style:--width={`${app.instance.position.width}px`}
	style:--height={`${app.instance.position.height}px`}
	style:z-index={app.instance.position.zIndex}
>
	<header class="windowTitlebar" onpointerdown={startDrag}>
		<div class="windowControls">
			<svelte:element
				this={browser ? 'button' : 'a'}
				role={browser ? 'button' : 'link'}
				class={['windowButton', 'close', app.instance?.modified && 'modified']}
				aria-label="Close"
				onclick={() => windowServer.closeApp(appName)}
				onpointerdown={blockDrag}
				href="/"
			>
				<X class="windowButtonGlyph" size={14} />
			</svelte:element>
			<button class="windowButton minimize" aria-label="Minimize" onpointerdown={blockDrag}>
				<Minus class="windowButtonGlyph" size={14} />
			</button>
			<button class="windowButton maximize" aria-label="Maximize" onpointerdown={blockDrag}>
				<Plus class="windowButtonGlyph" size={14} />
			</button>
		</div>
		<hgroup class="windowTitleSection">
			<h2 class="windowTitle">
				{app.title}{dev
					? ` - ${Math.round(app.instance.position.width)}x${Math.round(app.instance.position.height)}`
					: null}
			</h2>
		</hgroup>
	</header>
	<div class="windowContent">
		<app.Page />
	</div>
	<div class="windowResizeHandle" onpointerdown={startResize}></div>
</article>

<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		grid-area: 1 / 1;
		transform: translate(var(--x), var(--y));
		min-width: 200px;
		min-height: 200px;
		width: var(--width);
		height: var(--height);
		display: flex;
		flex-direction: column;
		background-color: white;
		box-shadow: var(--panel-box-shadow);
		touch-action: auto; /* needed for touch dragging to work */

		&.inactive {
			box-shadow: var(--panel-box-shadow-inactive);
		}

		@media (scripting: none) {
			position: absolute;
			left: max(0px, 50vw - var(--width) / 2);
			/* space between the menubar and Dock */
			--safe-height: calc(100vh - var(--menubar-height) - var(--dock-height));
			top: max(0px, (var(--safe-height) / 2 - var(--height) / 2) * (2/3));
			max-width: 100vw;
			max-height: calc(100vh - var(--menubar-height) - var(--dock-height));
		}
	}

	.windowTitlebar {
		flex: 0 0 auto;
		height: 28px;
		position: relative;
		display: flex;
		gap: 0.5rem;
		padding-inline: 10px;
		touch-action: pinch-zoom;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
	}

	.windowControls {
		align-self: center;
		display: flex;
		align-items: center;
		gap: 8px;
		z-index: 1;
	}

	.windowButton {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.windowTitleSection {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
	}

	.windowTitle {
		font-weight: normal;
		font-size: 16px;
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
	}
</style>
