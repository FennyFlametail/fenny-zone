<script module>
	export const dragging: { el: HTMLElement | null } = $state({ el: null });
	export const resizing: { el: HTMLElement | null } = $state({ el: null });
	let maxZIndex = 0;
</script>

<script lang="ts">
	import type AppInstance from '$lib/types/AppInstance';

	const {
		app = $bindable(),
		close
	}: {
		app: AppInstance;
		close: () => void;
	} = $props();

	let element: HTMLElement;

	let x = $state(0);
	let y = $state(0);
	let width = $state(600);
	let height = $state(600);
	let zIndex = $state(0);

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
		if (dragging.el === element) {
			x += e.screenX - lastX;
			y += e.screenY - lastY;

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (resizing.el === element) {
			width += e.screenX - lastX;
			height += e.screenY - lastY;

			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function pointerUp() {
		dragging.el = null;
		resizing.el = null;
	}

	function focus() {
		zIndex = ++maxZIndex;
	}

	export function resetPosition() {
		x = 0;
		y = 0;
		zIndex = 0;
	}
</script>

<article
	bind:this={element}
	onpointerdown={focus}
	class="window"
	style:--x={`${x}px`}
	style:--y={`${y}px`}
	style:--width={`${width}px`}
	style:--height={`${height}px`}
	style:z-index={zIndex}
>
	<header class="windowTitle" onpointerdown={startDrag}>
		<button onclick={close}>X</button>
		{app.metadata.title}
	</header>
	<div class="windowContent">
		<app.Component />
	</div>
	<div class="windowResizeHandle" onpointerdown={startResize}></div>
</article>

<svelte:body onpointermove={pointerMove} onpointerup={pointerUp} />

<style>
	.window {
		transform: translate(var(--x), var(--y));
		position: relative;
		overflow: hidden;
		min-width: 200px;
		min-height: 200px;
		width: var(--width);
		height: var(--height);
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		touch-action: auto; /* needed for dragging to work */
	}

	.windowTitle {
		flex: 0 0 auto;
		margin: 0;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
	}

	.windowContent {
		padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
		overflow: auto;
	}

	.windowResizeHandle {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 30px;
		height: 30px;
		cursor: nwse-resize;
		background-color: gray;
	}
</style>
