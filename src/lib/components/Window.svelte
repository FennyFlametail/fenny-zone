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
		appName
	}: {
		appName: AppName;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.runningApps[appName] ?? windowServer.openApp(appName);
	setAppContext({ appName, app });
	const parent = app.parent ? windowServer.apps[app.parent] : null;

	const title = $derived(app.instance.windowTitle ?? app.windowTitle ?? app.title);

	let minWidth = app.minSize ?? WindowServer.defaultWindowWidth;
	let minHeight = app.minSize ?? WindowServer.defaultWindowHeight;
	if (browser) {
		minWidth = Math.min(minWidth, document.documentElement.clientWidth);
		minHeight = Math.min(minHeight, WindowServer.safeHeight);
	}

	let element = $state<HTMLElement>();

	let dragging = $state(false);
	let resizing = $state(false);
	$effect(() => {
		// using $derived breaks the menu bar hover for some reason - maybe accessing windowServer too early?
		dragging = windowServer.draggingEl === element;
		resizing = windowServer.resizingEl === element;
	});
	let lastX = $state(app.instance.position.x);
	let lastY = $state(app.instance.position.y);

	function startDrag(e: PointerEvent) {
		windowServer.focusApp(appName);
		if ((e.target as Element).hasAttribute('data-allow-window-drag')) {
			windowServer.draggingEl = element;
			lastX = e.screenX;
			lastY = e.screenY;
		}
	}

	function startResize(e: PointerEvent) {
		if (app.noResize) return;
		windowServer.resizingEl = element;
		lastX = e.screenX;
		lastY = e.screenY;
	}

	function pointerMove(e: PointerEvent) {
		const deltaX = e.screenX - lastX;
		const deltaY = e.screenY - lastY;

		if (windowServer.draggingEl === element || windowServer.resizingEl === element) {
			delete app.instance.preZoomPosition;
		}

		if (windowServer.draggingEl === element) {
			app.instance.position.x += deltaX;
			app.instance.position.y += deltaY;
			app.instance.position.y = Math.max(app.instance.position.y, 0);

			lastX = e.screenX;
			lastY = e.screenY;
		} else if (windowServer.resizingEl === element) {
			const resizeFromCenter = e.altKey;

			lastX = e.screenX;
			lastY = e.screenY;

			const { maxHeight } = WindowServer.getMaxDimensions(app.windowStyle);

			let newWidth = app.instance.position.width + deltaX;
			let newHeight = app.instance.position.height + deltaY;

			if (app.lockAspectRatio) {
				if (newWidth <= minWidth || newHeight <= minHeight || newHeight >= maxHeight) {
					return;
				}
			}

			if (resizeFromCenter) {
				if (app.instance.position.width > minWidth) {
					newWidth += deltaX;
					app.instance.position.x -= deltaX;
				}
				const newY = Math.max(app.instance.position.y - deltaY, 0);
				if (app.instance.position.height > minHeight && newY > 0) {
					newHeight += deltaY;
					app.instance.position.y = newY;
				}
			}

			let clampedWidth = Math.max(newWidth, minWidth);
			let clampedHeight = Math.min(
				Math.max(newHeight, minHeight),
				maxHeight - app.instance.position.y
			);

			if (app.lockAspectRatio) {
				({ width: clampedWidth, height: clampedHeight } = WindowServer.scaleToAspectRatio(
					clampedWidth,
					clampedHeight,
					app.instance.position.width,
					app.instance.position.height
				));
			}

			app.instance.position.width = clampedWidth;
			app.instance.position.height = clampedHeight;
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

	const saveSheetOpen = $derived(Boolean(app.instance.showSaveSheet && app.instance.saveData));
	let anySheetOpen = $state(false);

	$effect(() => {
		const observer = new MutationObserver(() => {
			anySheetOpen = Boolean(element?.querySelector('.sheet'));
		});
		observer.observe(element!, {
			childList: true,
			subtree: true
		});
		return () => observer.disconnect();
	});

	function saveSheetCancel() {
		app.instance.showSaveSheet = false;
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
		unified: app.windowStyle === 'unified',
		custom: app.windowStyle === 'custom',
		inactive: browser && !app.instance.focused,
		sheetOpen: anySheetOpen,
		dragging,
		resizing,
		animating: app.instance.animating
	}}
	data-lock-aspect-ratio={app.lockAspectRatio
		? app.instance.position.width > app.instance.position.height
			? 'landscape'
			: 'portrait'
		: undefined}
	style:--window-x="{app.instance.position.x}px"
	style:--window-y="{app.instance.position.y}px"
	style:--window-width="{app.instance.position.width}px"
	style:--window-height="{app.instance.position.height}px"
	style:z-index={app.instance.position.zIndex}
	aria-label={app.instance.ariaLabel ?? title}
	data-appname={appName}
	data-allow-window-drag={saveSheetOpen ? undefined : true}
	out:scale={{ duration: 150, start: !prefersReducedMotion.current ? 0.97 : 1, opacity: 0 }}
>
	{#if app.windowStyle !== 'custom'}
		<header class="windowTitlebar" aria-label={title} data-allow-window-drag>
			{#if !app.hideWindowControls}
				<WindowControls sheetOpen={anySheetOpen} />
			{/if}
			{#if title && !app.hideWindowTitle}
				<h2 class="windowTitle" data-allow-window-drag>
					{#if !app.hideTitleIcon}
						<img
							class="windowTitleIcon"
							src={app.instance.titleIcon ?? app.titleIcon ?? app.icon}
							alt=""
							aria-hidden="true"
							draggable="false"
						/>
					{/if}
					{title}
				</h2>
			{/if}
		</header>
	{/if}
	<div class="windowContent" inert={saveSheetOpen}>
		{#if browser}
			<svelte:boundary onerror={(e) => windowServer.closeAppWithError(appName, e)}>
				<app.Page {...app.instance.props} />
				{#snippet pending()}{/snippet}
			</svelte:boundary>
		{:else}
			<app.Page {...app.instance.props} />
		{/if}
	</div>
	{#if !app.noResize}
		<div class="windowResizeHandle noJS-hide" onpointerdown={startResize}></div>
	{/if}
	{#if saveSheetOpen}
		<Sheet isOpen={true} close={saveSheetCancel}>
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
						<button class="aqua-button" onclick={saveSheetCancel}>Cancel</button>
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
		position: absolute;
		/* FIXME translate while dragging and then change position when letting go */
		left: var(--window-x);
		top: var(--window-y);
		display: grid;
		grid-template:
			'titlebar' auto
			'content' 1fr;
		background: var(--pinstripe-bg-image);
		background-clip: padding-box;
		border-top-right-radius: var(--window-radius);
		border-top-left-radius: var(--window-radius);
		outline: 1px solid var(--panel-border-color);
		box-shadow: var(--panel-box-shadow);
		touch-action: manipulation; /* needed for touch dragging to work */

		&.inactive {
			box-shadow: var(--panel-box-shadow-inactive);
		}

		&.dragging {
			will-change: left, top;
		}

		&.resizing {
			will-change: width, height;
		}

		&.animating {
			will-change: left, top;
			@media not (prefers-reduced-motion: reduce) {
				transition: 0.25s ease;
				transition-property: left, top;
			}
		}

		@media (scripting: none) {
			position: absolute;
			left: 50%;
			top: 33.33%;
			translate: -50% -33.33%;
		}

		@media (forced-colors: active) {
			border: 1px solid CanvasText;
		}
	}

	.windowTitlebar {
		grid-area: titlebar;
		position: relative;
		height: var(--titlebar-height);
		display: grid;
		grid-template: 'title' auto / 100%;
		padding-inline: var(--titlebar-padding);
		border-radius: inherit;
		border-bottom: 1px solid var(--titlebar-border-color);
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

	.windowTitleIcon {
		width: 18px;
		height: 18px;
		object-fit: contain;
		pointer-events: none;
	}

	.windowTitle {
		grid-area: title;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		text-align: center;
		font-weight: normal;
		font-size: 17px;
		line-height: var(--titlebar-height);
		white-space: nowrap;
	}

	.windowContent {
		container: window / inline-size;
		grid-area: content;
		width: var(--window-width);
		height: var(--window-height);
		display: grid;
		justify-items: stretch;
		align-items: stretch;
		min-height: 0;
		position: relative;
		overscroll-behavior: none;

		.window.animating & {
			will-change: width, height;

			@media not (prefers-reduced-motion: reduce) {
				transition: inherit;
				transition-property: width, height;
			}
		}

		@media (scripting: none) {
			aspect-ratio: var(--window-width) / var(--window-height);
			max-width: var(--window-content-max-width);
			max-height: var(--window-content-max-height);

			.window[data-lock-aspect-ratio='landscape'] & {
				height: auto;
			}
			.window[data-lock-aspect-ratio='portrait'] & {
				width: auto;
			}
		}
	}

	.windowResizeHandle {
		z-index: 9999;
		position: absolute;
		bottom: -5px;
		right: -5px;
		width: 20px;
		height: 20px;
		touch-action: pinch-zoom;
		cursor: nwse-resize;
	}

	.window.brushed {
		--top-highlight-shadow: inset 0 2px 0px 0px rgb(217 217 217);
		box-shadow: var(--panel-box-shadow), var(--top-highlight-shadow);
		border-bottom-right-radius: var(--window-radius);
		border-bottom-left-radius: var(--window-radius);
		background: linear-gradient(
			to right,
			rgb(175 175 175),
			rgb(220 220 220) 40%,
			rgb(220 220 220) 60%,
			rgb(175 175 175)
		);
		padding-bottom: var(--window-brushed-bottom-padding);
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
			box-shadow: var(--panel-box-shadow-inactive), var(--top-highlight-shadow);
		}

		.windowTitlebar {
			background: none;
			border-bottom: none;
			padding-inline: 0;
		}

		.windowTitle {
			text-shadow: var(--window-brushed-text-shadow);
		}

		.windowContent {
			:global(> :not(.brushedInset, .brushedNoInset)::before) {
				content: '⚠️ Use the .brushedInset class to render the inset border, or .brushedNoInset to hide this message ⚠️';
				font-size: 1rem;
			}

			@media (scripting: none) {
				max-width: var(--window-content-max-width-brushed);
				max-height: var(--window-content-max-height-brushed);
			}
		}

		.windowResizeHandle {
			right: 0;
			bottom: 0;
			background: url('$lib/images/resize.webp');
			background-position: 4px center;
			background-size: 20px 20px;
			background-repeat: no-repeat;
			width: 36px;
			height: 32px;
		}
	}

	.window.unified .windowTitlebar {
		border-bottom: none;

		&:not(.window.inactive .windowTitlebar) {
			box-shadow: inset 0 1px 0 0px #fbfbfb;
			background: linear-gradient(to bottom, #ebebeb, #e5e5e5);
		}
	}

	.window.custom {
		.windowContent {
			@media (scripting: none) {
				max-height: var(--window-content-max-height-custom);
			}
		}
	}

	.saveSheet {
		padding-left: 10px;
		padding-right: 20px;
		padding-bottom: 10px;
	}
</style>
