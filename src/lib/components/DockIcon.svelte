<script lang="ts">
	import apps from '$lib/apps.svelte';
	import { openApp, getRunningApps } from '$lib/components/WindowServer.svelte';
	import type { AppName } from '$lib/types/AppTypes';

	const {
		appName,
		title,
		icon,
		open
	}:
		| {
				appName: AppName;
				title?: never;
				icon?: never;
				open?: never;
		  }
		| {
				appName?: never;
				title: string;
				icon: string;
				open?: boolean;
		  } = $props();

	const app = appName && apps[appName];
	const isOpen = $derived(open ?? (appName && getRunningApps()[appName]));

	function onclick() {
		appName && openApp(appName);
	}
</script>

<button class={['dockIcon', { open: isOpen }]} {onclick}>
	<span class="dockIconLabel">{app?.title ?? title}</span>
	<img src={app?.icon ?? icon} alt={app?.title ?? title} class="dockIconImage" draggable="false" />
</button>

<style>
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
			:global(
				.dockSection:has(+ .dockSection &:nth-child(1):hover) &:nth-last-child(1),
				&:has(+ &:hover),
				&:hover + &,
				.dockSection:has(&:nth-last-child(1):hover) + .dockSection &:nth-child(1)
			) {
				margin-bottom: 10px;
				width: calc(var(--icon-size) * 1.8);
				height: calc(var(--icon-size) * 1.8);
			}

			/* icons two away from hovered */
			:global(
				.dockSection:has(+ .dockSection &:nth-child(1):hover) &:nth-last-child(2),
				.dockSection:has(+ .dockSection &:nth-child(2):hover) &:nth-last-child(1),
				&:has(+ & + &:hover),
				&:hover + & + &,
				.dockSection:has(&:nth-last-child(2):hover) + .dockSection &:nth-child(1),
				.dockSection:has(&:nth-last-child(1):hover) + .dockSection &:nth-child(2)
			) {
				margin-bottom: 5px;
				width: calc(var(--icon-size) * 1.4);
				height: calc(var(--icon-size) * 1.4);
			}
		}

		/* open indicator */
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

	.dockIconLabel {
		display: none;

		.dockIcon:hover & {
			display: inline;
			position: absolute;
			bottom: calc(100% + 5px);
			translate: -50%;
			white-space: nowrap;
			color: white;
			text-shadow: var(--label-shadow);
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
