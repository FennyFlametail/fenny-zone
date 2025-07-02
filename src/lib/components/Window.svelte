<script module>
	export const dragging: { el?: HTMLElement } = $state({});
	export const resizing: { el?: HTMLElement } = $state({});
	let maxZIndex = 0;
	let focused = $state<HTMLElement>();
	export function unfocus() {
		focused = undefined;
	}
</script>

<script lang="ts">
	import type AppInstance from '$lib/types/AppInstance';

	const {
		app,
		index,
		close
	}: {
		app: AppInstance;
		index: number;
		close: () => void;
	} = $props();

	let element = $state<HTMLElement>();

	let x = $state(0);
	let y = $state(0);
	let width = $state(500);
	let height = $state(500);
	let zIndex = $state(++maxZIndex);

	let lastX = $state(0);
	let lastY = $state(0);

	function startDrag(e: PointerEvent) {
		dragging.el = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function startResize(e: PointerEvent) {
		resizing.el = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function pointerMove(e: PointerEvent) {
		const zoomRatio = screen.width / innerWidth;

		if (dragging.el === element) {
			x += (e.screenX - lastX) / zoomRatio;
			y += (e.screenY - lastY) / zoomRatio;

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (resizing.el === element) {
			width += (e.screenX - lastX) / zoomRatio;
			height += (e.screenY - lastY) / zoomRatio;

			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function pointerUp() {
		dragging.el = undefined;
		resizing.el = undefined;
	}

	export function focus() {
		zIndex = ++maxZIndex;
		focused = element;
	}

	export function resetPosition() {
		x = 50 * index;
		y = 50 * index;
		zIndex = 0;
	}
</script>

<article
	bind:this={element}
	onpointerdown={focus}
	class={['window', focused !== element && 'inactive']}
	style:--x={`${x}px`}
	style:--y={`${y}px`}
	style:--width={`${width}px`}
	style:--height={`${height}px`}
	style:z-index={zIndex}
>
	<header class="windowTitlebar" onpointerdown={startDrag}>
		<div class="windowControls">
			<!-- TODO glyphs on hover -->
			<button class="windowButton close" aria-label="Close" onclick={close}></button>
			<button class="windowButton minimize" aria-label="Minimize"></button>
			<button class="windowButton maximize" aria-label="Maximize"></button>
		</div>
		<hgroup class="windowTitleSection">
			<!-- TODO window icons -->
			<h2 class="windowTitle">{app.metadata.title}</h2>
		</hgroup>
	</header>
	<div class="windowContent">
		<app.Component />
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
		overflow: hidden;
		background-color: white;
		touch-action: auto; /* needed for touch dragging to work */
	}

	.windowTitlebar {
		flex: 0 0 auto;
		display: flex;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
	}

	.windowControls {
		display: flex;
		align-items: center;
	}

	.windowContent {
		flex-grow: 1;
		overflow: auto;
	}

	.windowResizeHandle {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 30px;
		height: 30px;
		background-color: lightgray;
		cursor: nwse-resize;
	}
</style>
