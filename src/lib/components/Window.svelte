<script module>
	export const dragging: { el: HTMLElement | null } = $state({ el: null });
	let maxZIndex = 0;
</script>

<script lang="ts">
	import type AppInstance from '$lib/types/AppInstance';
	import type AppMetadata from '$lib/types/AppMetadata';

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
	let lastX = $state(0);
	let lastY = $state(0);
	let zIndex = $state(0);

	function focus() {
		zIndex = ++maxZIndex;
	}

	function startDrag(e: PointerEvent) {
		console.debug('startDrag');
		dragging.el = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function drag(e: PointerEvent) {
		if (dragging.el !== element) return;

		x += e.screenX - lastX;
		y += e.screenY - lastY;

		lastX = e.screenX;
		lastY = e.screenY;
	}

	function stopDrag() {
		dragging.el = null;
	}

	export function resetPosition() {
		x = 0;
		y = 0;
		zIndex = 0;
	}
</script>

<!-- TODO implement resize that works on mobile -->
<article
	bind:this={element}
	onpointerdown={focus}
	class="window"
	style:--x={`${x}px`}
	style:--y={`${y}px`}
	style:z-index={zIndex}
>
	<header class="windowTitle" onpointerdown={startDrag}>
		<button onclick={close}>X</button>
		{app.appBinding?.title ?? 'App'}
	</header>
	<div class="windowContent">
		<app.App bind:this={app.appBinding as AppMetadata} />
	</div>
</article>

<svelte:body onpointermove={drag} onpointerup={stopDrag} />

<style>
	.window {
		transform: translate(var(--x), var(--y));
		min-width: 200px;
		min-height: 200px;
		width: 600px;
		height: 600px;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		touch-action: auto; /* needed for dragging to work */
	}

	.windowTitle {
		flex: 0 0 auto;
		margin: 0;
		cursor: default;
	}

	.windowContent {
		padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
		overflow: auto;
	}
</style>
