<script lang="ts">
	import { type AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		appName,
		open
	}: {
		appName: AppName;
		open?: boolean;
	} = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[appName];

	const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		windowServer.openApp(appName);
	};

	const isOpen = $derived.by(() => {
		if (typeof open === 'boolean') return open;
		return windowServer.appsByParent.get(appName)?.length;
	});

	const bounceAnimDuration = 375;
	const bounceAnimSteps = 2;

	const delayRemove = (_: HTMLElement) => ({
		duration: bounceAnimDuration
	});
</script>

<a
	class={['dockIcon', { open: isOpen }]}
	style:--bounceAnimDuration={`${bounceAnimDuration}ms`}
	style:--bounceAnimSteps={bounceAnimSteps}
	out:delayRemove|global
	{onclick}
	href={app.route}
>
	<span class="dockIconLabel">{app.title}</span>
	<img src={app.icon} alt={app.title} class="dockIconImage" draggable="false" />
</a>

<style>
	.dockIcon {
		flex-shrink: 0;
		width: var(--dock-icon-size);
		height: var(--dock-icon-size);
		text-align: center;
		position: relative;
		box-sizing: content-box;
		padding: 0 calc(var(--dock-padding) / 2);
		background: none;
		border: none;
		transition: 250ms ease;
		transition-property: width, height, margin-bottom;
		cursor: default;
		-webkit-user-select: none;
		user-select: none;

		@media not (prefers-reduced-motion: reduce) {
			:global(body:not(.loading)) & {
				/* zoom in and expand Dock */
				@starting-style {
					width: 0;
				}
				&:global([inert]) {
					/* [inert] means the out transition is occurring */
					width: 0;
					transition-timing-function: linear;
				}
			}

			&:hover {
				margin-bottom: 10px;
				width: calc(var(--dock-icon-size) * 2);
				height: calc(var(--dock-icon-size) * 2);
			}

			/* icons next to hovered */
			:global(
				.dockSection:has(+ .dockSection &:nth-child(1):hover) &:nth-last-child(1),
				&:has(+ &:hover),
				&:hover + &,
				.dockSection:has(&:nth-last-child(1):hover) + .dockSection &:nth-child(1)
			) {
				margin-bottom: 10px;
				width: calc(var(--dock-icon-size) * 1.8);
				height: calc(var(--dock-icon-size) * 1.8);
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
				width: calc(var(--dock-icon-size) * 1.4);
				height: calc(var(--dock-icon-size) * 1.4);
			}
		}

		/* open indicator */
		&.open:not(:global([inert]))::after {
			position: fixed;
			bottom: 1px;
			translate: -50%;
			content: '';
			border-left: 4px solid transparent;
			border-right: 4px solid transparent;
			border-bottom: 5px solid black;

			:global(body:not(.loading)) & {
				@media not (prefers-reduced-motion: reduce) {
					/* delay appearance until bounce finishes */
					transition: 0ms visibility;
					transition-delay: calc(var(--bounceAnimDuration) * var(--bounceAnimSteps));
					@starting-style {
						visibility: hidden;
					}
				}
			}
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

		:global(body:not(.loading)) & {
			/* fade in and bounce */
			transition: opacity var(--bounceAnimDuration) ease;
			@starting-style {
				opacity: 0;
			}
			.dockIcon:global([inert]) & {
				opacity: 0;
			}
		}
		@media not (prefers-reduced-motion: reduce) {
			animation: var(--bounceAnimDuration) ease var(--bounceAnimSteps) alternate bounce;

			:global(body.loading) & {
				--bounceAnimSteps: 0;
			}
		}

		&:active {
			filter: brightness(0.5);
		}
	}

	@keyframes bounce {
		from {
			translate: 0 0;
		}
		to {
			translate: 0 -25px;
		}
	}
</style>
