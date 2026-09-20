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
	const app = $derived(windowServer.apps[appName]);

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
	<div id={labelId} class="dockIconLabel">{app.dockTitle ?? app.title}</div>
	<img src={icon} alt="" class="dockIconImage" draggable="false" />
</svelte:element>

<style>
	.dockIcon {
		--bounce-target: 0 -25px;
		flex-shrink: 0;
		inline-size: var(--dock-icon-size);
		block-size: var(--dock-icon-size);
		display: flex;
		justify-content: center;
		text-align: center;
		position: relative;
		box-sizing: content-box;
		padding: 0 calc(var(--dock-padding) / 2);
		background: none;
		border: none;
		transition: 250ms ease;
		transition-property: inline-size, block-size, margin-block-end;
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: none;
			box-shadow: none;
		}

		:global(body.duoLayout) & {
			--bounce-target: -25px 0;
		}

		@media not ((prefers-reduced-motion: reduce) or (hover: none)) {
			:global(body:not(.loading)) & {
				/* zoom in and expand Dock */
				@starting-style {
					inline-size: 0;
				}
				&:global([inert]) {
					/* [inert] means the out transition is occurring */
					inline-size: 0;
					transition-timing-function: linear;
				}
			}

			&:hover {
				margin-block-end: 10px;
				inline-size: calc(var(--dock-icon-size) * 2);
				block-size: calc(var(--dock-icon-size) * 2);
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
				margin-block-end: 10px;
				inline-size: calc(var(--dock-icon-size) * 1.8);
				block-size: calc(var(--dock-icon-size) * 1.8);
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
				margin-block-end: 5px;
				inline-size: calc(var(--dock-icon-size) * 1.4);
				block-size: calc(var(--dock-icon-size) * 1.4);
			}
		}

		/* open indicator */
		&::after {
			display: block;
			position: fixed;
			inset-block-end: 1px;
			content: '';
			border-inline: 4px solid transparent;
			border-block-end: 5px solid black;
		}

		&:is(:global(body:not(.loading)) .dockIcon.open:not(:global([inert])))::after {
			@media not (prefers-reduced-motion: reduce) {
				/* delay appearance until partway through bounce */
				transition: 0ms visibility;
				transition-delay: calc(var(--bounceAnimDuration) * var(--bounceAnimSteps) / 2);
				@starting-style {
					visibility: hidden;
				}
			}
		}
	}

	.dockIconLabel {
		position: absolute;
		inset-block-end: calc(100% + 5px);
		inset-inline-start: 50%;
		translate: -50%;
		white-space: nowrap;
		color: white;
		text-shadow: var(--label-text-shadow);

		:global(body.duoLayout) & {
			writing-mode: horizontal-tb;
			inset-block-end: auto;
			inset-inline-end: calc(100% + 5px);
			inset-inline-start: auto;
			inset-block-start: 50%;
			translate: 0 -50%;
		}

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

	/* fade out label & open indicator */
	.dockIcon:not(.open:not(:global([inert])))::after,
	.dockIcon:not(:hover, :focus-visible) .dockIconLabel {
		display: none;
		opacity: 0;
		transition: 250ms linear allow-discrete;
		transition-property: display, opacity;

		/* don't fade labels when moving between icons */
		&:is(:global(.dock:is(:hover, :focus-within)) .dockIconLabel) {
			transition-duration: 0ms;
		}
	}

	.dockIconImage {
		inline-size: 100%;
		block-size: 100%;
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
			translate: var(--bounce-target);
		}
	}
</style>
