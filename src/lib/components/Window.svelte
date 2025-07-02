<script module>
	export const dragging: { el: HTMLElement | null } = $state({ el: null });
	let maxZIndex = 0;
</script>

<script lang="ts">
	import { type Component } from 'svelte';
	const { App } = $props();

	type ComponentWithTitle = Component & { title: string };
	let windowRef: HTMLElement;
	let appRef: ComponentWithTitle = $state() as ComponentWithTitle;

	let lastX = $state(0);
	let lastY = $state(0);
	let deltaX = $state(0);
	let deltaY = $state(0);
	let zIndex = $state(0);

	function focus() {
		zIndex = ++maxZIndex;
	}

	function startDrag(e: PointerEvent) {
		dragging.el = windowRef;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function drag(e: PointerEvent) {
		if (dragging.el !== windowRef) return;

		deltaX += e.screenX - lastX;
		deltaY += e.screenY - lastY;

		lastX = e.screenX;
		lastY = e.screenY;
	}

	function stopDrag() {
		dragging.el = null;
	}
</script>

<article
	bind:this={windowRef}
	onpointerdown={focus}
	class="window"
	style:width="40vw"
	style:height="40vw"
	style:--deltaX={`${deltaX}px`}
	style:--deltaY={`${deltaY}px`}
	style:z-index={zIndex}
>
	<header class="windowTitle" onpointerdown={startDrag}>
		{appRef?.title ?? 'App'}
	</header>
	<App bind:this={appRef} />
</article>

<svelte:body onpointermove={drag} onpointerup={stopDrag} onpointercancel={stopDrag} />

<style>
	.window {
		resize: both;
		overflow: auto;
		position: relative;
		transform: translate(var(--deltaX), var(--deltaY));
	}

	.windowTitle {
		cursor: default;
	}
</style>
