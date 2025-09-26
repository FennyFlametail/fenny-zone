<script lang="ts">
	import apps, { type AppName } from '$lib/apps.svelte';
	import { getAppsByParent, openApp } from '$lib/windowServer.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		appName,
		open
	}: {
		appName: AppName;
		open?: boolean;
	} = $props();

	const app = apps[appName];
	const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		openApp(appName);
	};

	const isOpen = $derived.by(() => {
		if (typeof open === 'boolean') return open;
		return getAppsByParent().get(appName)?.length;
	});
</script>

<a class={['dockIcon', { open: isOpen }]} {onclick} href={app.route}>
	<span class="dockIconLabel">{app.title}</span>
	<img src={app.icon} alt={app.title} class="dockIconImage" draggable="false" />
</a>

<style>
	.dockIcon {
		flex-shrink: 0;
		width: var(--icon-size);
		height: var(--icon-size);
		text-align: center;
		position: relative;
		box-sizing: content-box;
		padding: 0 calc(var(--padding) / 2);
		background: none;
		border: none;
		transition: 0.25s ease;
		transition-property: width, height, margin-bottom;
		cursor: default;
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

		@media (scripting: none) {
			cursor: pointer;
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
