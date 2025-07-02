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

	let lastX = $state(0);
	let lastY = $state(0);

	function focus() {
		app.zIndex = ++maxZIndex;
	}

	function startDrag(e: PointerEvent) {
		dragging.el = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function drag(e: PointerEvent) {
		if (dragging.el !== element) return;

		app.x += e.screenX - lastX;
		app.y += e.screenY - lastY;

		lastX = e.screenX;
		lastY = e.screenY;
	}

	function stopDrag() {
		dragging.el = null;
	}

	export function resetPosition() {
		app.x = 0;
		app.y = 0;
		app.zIndex = 0;
	}
</script>

<article
	bind:this={element}
	onpointerdown={focus}
	class="window"
	style:--x={`${app.x}px`}
	style:--y={`${app.y}px`}
	style:z-index={app.zIndex}
>
	<header class="windowTitle" onpointerdown={startDrag}>
		<button onclick={close}>X</button>
		{app.appBinding?.title ?? 'App'}
	</header>
	<div class="windowContent">
		<app.App bind:this={app.appBinding as AppMetadata} />
	</div>
</article>

<svelte:body onpointermove={drag} onpointerup={stopDrag} onpointercancel={stopDrag} />

<style>
	.window {
		padding-top: 0;
		min-width: 200px;
		min-height: 200px;
		width: 600px;
		height: 600px;
		resize: both;
		overflow: auto;
		position: relative;
		transform: translate(var(--x), var(--y));
	}

	.windowTitle {
		cursor: default;
		position: sticky;
		top: 0;
	}

	.windowContent {
		padding-top: var(--pico-block-spacing-vertical);
	}
</style>
