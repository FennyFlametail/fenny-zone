<script lang="ts">
	import { focusApp, openApp, getRunningApps } from '$lib/components/WindowServer.svelte';
	import type { AppEntry, AppName } from '$lib/types/AppTypes';

	const {
		appName,
		app
	}: {
		appName: AppName;
		app: AppEntry;
	} = $props();

	function onclick() {
		getRunningApps()[appName] ? focusApp(appName) : openApp(appName);
	}
</script>

<button class={['dockIcon', { open: getRunningApps()[appName] }]} {onclick}>
	<span class="dockIconLabel">{app.title}</span>
	<img src={app.icon} alt={app.title} class="dockIconImage" draggable="false" />
</button>

<style>
	/* TODO better focus indicator */
	.dockIcon {
		flex-shrink: 0;
		width: var(--icon-size);
		height: var(--icon-size);
		position: relative;
		box-sizing: content-box;
		padding: 0 calc(var(--padding) / 2);
		background: none;
		border: none;
		transition: 0.25s ease;
		transition-property: width, height, margin-bottom;
		-webkit-user-select: none;
		user-select: none;

		@media not (prefers-reduced-motion: reduce) {
			&:hover {
				margin-bottom: 10px;
				width: calc(var(--icon-size) * 2);
				height: calc(var(--icon-size) * 2);
			}

			/* icons next to hovered */
			:global(&:has(+ &:hover), &:hover + &) {
				margin-bottom: 10px;
				width: calc(var(--icon-size) * 1.8);
				height: calc(var(--icon-size) * 1.8);
			}

			/* icons two away from hovered */
			:global(&:has(+ & + &:hover), &:hover + & + &) {
				margin-bottom: 5px;
				width: calc(var(--icon-size) * 1.4);
				height: calc(var(--icon-size) * 1.4);
			}
		}

		/* open indicator */
		/* TODO fade in/out? */
		&.open::after {
			position: fixed;
			bottom: 1px;
			translate: -50%;
			content: '';
			border-left: 4px solid transparent;
			border-right: 4px solid transparent;
			border-bottom: 5px solid black;
		}
	}

	/* TODO fade out */
	.dockIconLabel {
		display: none;

		.dockIcon:hover & {
			display: inline;
			position: absolute;
			bottom: calc(100% + 5px);
			translate: -50%;
			white-space: nowrap;
			color: white;
			text-shadow:
				black 0 1px 1px,
				black 0 1px 3px,
				black 0 1px 5px;
		}
	}

	.dockIconImage {
		width: 100%;
		height: 100%;
		object-fit: contain;
		&:active {
			filter: brightness(0.5);
		}
	}
</style>
