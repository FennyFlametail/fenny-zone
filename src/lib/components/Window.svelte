<script module lang="ts">
	export const dragging: { el?: HTMLElement } = $state({});
	export const resizing: { el?: HTMLElement } = $state({});
	let maxZIndex = 0;
	let focused = $state<HTMLElement>();
	export function unfocus() {
		focused = undefined;
	}
</script>

<script lang="ts">
	import { desktopPadding } from '$lib/components/Desktop.svelte';
	import type AppInstance from '$lib/types/AppInstance';
	import { closeApp } from '$lib/windowServer.svelte';
	import { Minus, Plus, X } from 'lucide-svelte';

	const {
		app,
		index
	}: {
		app: AppInstance;
		index: number;
	} = $props();

	let title = $state(app.metadata.name);
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
		if (dragging.el === element) {
			x += e.screenX - lastX;
			y += e.screenY - lastY;

			y = Math.max(y, desktopPadding * -1);

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
		dragging.el = undefined;
		resizing.el = undefined;
	}

	export function isFocused() {
		return focused === element;
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

	export function setTitle(newTitle: string) {
		title = newTitle;
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
			<button class="windowButton close" aria-label="Close" onclick={() => closeApp(app)}>
				<X class="windowButtonGlyph" size={14} />
			</button>
			<button class="windowButton minimize" aria-label="Minimize">
				<Minus class="windowButtonGlyph" size={14} />
			</button>
			<button class="windowButton maximize" aria-label="Maximize">
				<Plus class="windowButtonGlyph" size={14} />
			</button>
		</div>
		<hgroup class="windowTitleSection">
			<!-- TODO window icons -->
			<h2 class="windowTitle">{title}</h2>
		</hgroup>
	</header>
	<div class="windowContent">
		<app.Component bind:this={app.instance} {...app.props} _app={app} />
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
		height: 32px;
		position: relative;
		display: flex;
		gap: 0.5rem;
		padding-inline: 12px;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
	}

	.windowControls {
		align-self: center;
		display: flex;
		align-items: center;
		gap: 10px;
		z-index: 1;
	}

	.windowButton {
		display: flex;
		justify-content: center;
		align-items: center;

		.window.inactive & {
			opacity: 0.5;
		}
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
