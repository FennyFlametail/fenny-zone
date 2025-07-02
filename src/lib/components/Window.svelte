<script module lang="ts">
	export const getInitialPosition = (zIndex: number) => ({
		x: 0,
		y: 0,
		width: 500,
		height: 500,
		zIndex
	});
	export type Position = ReturnType<typeof getInitialPosition>;

	export const dragging: { el?: HTMLElement } = $state({});
	export const resizing: { el?: HTMLElement } = $state({});
</script>

<script lang="ts">
	import { desktopPadding } from '$lib/components/Desktop.svelte';
	import { setAppContext } from '$lib/context';
	import type { AppName, RunningApp } from '$lib/types/AppTypes';
	import { closeApp, focusApp, getRunningApps } from '$lib/windowServer.svelte';
	import { Minus, Plus, X } from 'lucide-svelte';

	let {
		appName,
		app
	}: {
		appName: AppName;
		app: RunningApp;
	} = $props();

	setAppContext(appName, app);

	let element = $state<HTMLElement>();

	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	let focused = $derived(app.instance.position.zIndex === Object.keys(getRunningApps()).length - 1);
	export function isFocused() {
		return focused;
	}

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
			app.instance.position.x += e.screenX - lastX;
			app.instance.position.y += e.screenY - lastY;

			app.instance.position.y = Math.max(app.instance.position.y, desktopPadding * -1);

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (resizing.el === element) {
			app.instance.position.width += e.screenX - lastX;
			app.instance.position.height += e.screenY - lastY;

			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function pointerUp() {
		dragging.el = undefined;
		resizing.el = undefined;
	}

	export function resetPosition() {
		const zIndex = app.instance.position.zIndex;
		app.instance.position = {
			...getInitialPosition(zIndex),
			...app.defaultSize,
			x: 50 * zIndex,
			y: 50 * zIndex,
			zIndex
		};
	}
</script>

<article
	bind:this={element}
	onpointerdown={() => focusApp(appName)}
	class={['window', !focused && 'inactive']}
	style:--x={`${app.instance.position.x}px`}
	style:--y={`${app.instance.position.y}px`}
	style:--width={`${app.instance.position.width}px`}
	style:--height={`${app.instance.position.height}px`}
	style:z-index={app.instance.position.zIndex}
>
	<header class="windowTitlebar" onpointerdown={startDrag}>
		<div class="windowControls">
			<button
				class={['windowButton', 'close', app.modified && 'modified']}
				aria-label="Close"
				onclick={() => closeApp(appName)}
			>
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
			<h2 class="windowTitle">{app.title}</h2>
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
		position: relative;
		overflow: auto;
	}

	.windowResizeHandle {
		position: absolute;
		bottom: -5px;
		right: -5px;
		width: 10px;
		height: 10px;
		cursor: nwse-resize;
	}
</style>
