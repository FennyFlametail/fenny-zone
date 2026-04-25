<script lang="ts">
	import { browser } from '$app/environment';
	import { type AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		appName,
		open
	}: {
		appName: AppName;
		open?: boolean;
	} = $props();
	const labelId = $props.id();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[appName];

	const icon = $derived(app.dockIcon ?? app.icon);

	const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		windowServer.openApp(appName);
	};

	const isOpen = $derived.by(() => {
		if (appName === 'finder') return true;
		if (typeof open === 'boolean') return open;
		if (!browser) {
			const childApps = Object.entries(windowServer.apps)
				.filter(([, app]) => app.parent === appName)
				.map(([name]) => name);
			return [appName, ...childApps].includes(windowServer.initialAppName as AppName);
		}
		return windowServer.runningAppsByParent.has(appName) || appName in windowServer.runningApps;
	});

	const bounceAnimDuration = 375;
	const bounceAnimSteps = 2;

	const delayRemove = (_: HTMLElement) => ({
		duration: bounceAnimDuration
	});
</script>

<svelte:element
	this={app.route ? 'a' : 'button'}
	role="link"
	tabindex="0"
	class={[
		'dockIcon',
		'noJS-pointer',
		{ open: isOpen, 'noJS-hide': !(browser || appName === 'finder' || app.route) }
	]}
	style:--bounceAnimDuration="{bounceAnimDuration}ms"
	style:--bounceAnimSteps={bounceAnimSteps}
	aria-labelledby={labelId}
	out:delayRemove|global
	{onclick}
	href={app.route ?? undefined}
>
	<span id={labelId} class="dockIconLabel">{app.dockTitle ?? app.title}</span>
	<img src={icon} alt="" class="dockIconImage" draggable="false" />
</svelte:element>

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
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: none;
			box-shadow: none;
		}

		@media not ((prefers-reduced-motion: reduce) or (hover: none)) {
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
				.dockSection:has(+ .dockSection &:nth-child(1 of :not(.noJS-hide)):hover)
					&:nth-last-child(1 of :not(.noJS-hide)),
				&:has(+ &:hover),
				&:hover + &,
				.dockSection:has(&:nth-last-child(1 of :not(.noJS-hide)):hover)
					+ .dockSection
					&:nth-child(1 of :not(.noJS-hide))
			) {
				margin-bottom: 10px;
				width: calc(var(--dock-icon-size) * 1.8);
				height: calc(var(--dock-icon-size) * 1.8);
			}

			/* icons two away from hovered */
			:global(
				.dockSection:has(+ .dockSection &:nth-child(1 of :not(.noJS-hide)):hover)
					&:nth-last-child(2 of :not(.noJS-hide)),
				.dockSection:has(+ .dockSection &:nth-child(2 of :not(.noJS-hide)):hover)
					&:nth-last-child(1 of :not(.noJS-hide)),
				&:has(+ & + &:hover),
				&:hover + & + &,
				.dockSection:has(&:nth-last-child(2 of :not(.noJS-hide)):hover)
					+ .dockSection
					&:nth-child(1 of :not(.noJS-hide)),
				.dockSection:has(&:nth-last-child(1 of :not(.noJS-hide)):hover)
					+ .dockSection
					&:nth-child(2 of :not(.noJS-hide))
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
	}

	.dockIconLabel {
		display: none;

		.dockIcon:is(:hover, :focus-visible) & {
			display: inline;
			position: absolute;
			bottom: calc(100% + 5px);
			translate: -50%;
			white-space: nowrap;
			color: white;
			text-shadow: var(--label-text-shadow);

			@media (prefers-reduced-transparency: reduce) or (prefers-contrast: more) {
				padding-inline: 5px;
				border-radius: 5px;
				background-color: rgb(255 255 255 / 75%);
				color: black;
				text-shadow: none;

				@media (prefers-reduced-transparency: reduce) {
					background-color: white;
				}
			}
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
			.dockIcon.open & {
				animation: var(--bounceAnimDuration) ease var(--bounceAnimSteps) alternate bounce;
			}
			:global(body.loading) & {
				--bounceAnimSteps: 0;
			}
		}

		&:active,
		.dockIcon:focus-visible & {
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
