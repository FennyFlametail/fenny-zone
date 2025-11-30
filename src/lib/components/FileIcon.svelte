<script lang="ts">
	import { browser } from '$app/environment';
	import { type AppName } from '$lib/apps.svelte';
	import { getFileIconContext, getWindowServerContext } from '$lib/context.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		appName,
		href,
		name,
		icon
	}:
		| {
				appName: AppName;
				href?: never;
				name?: never;
				icon?: never;
		  }
		| {
				appName?: never;
				href: string;
				name: string;
				icon: string;
		  } = $props();

	const windowServer = getWindowServerContext();
	const app = appName && windowServer.apps[appName];

	const { getSelectedIcon, setSelectedIcon, isDesktop } = getFileIconContext();

	const identifier = Symbol(`FileIcon-${appName}`);

	let opening = $state(false);
	const openAnimDuration = 200;

	const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		setSelectedIcon(identifier);
	};

	const ondblclick: MouseEventHandler<HTMLAnchorElement> = () => {
		opening = true;
		window.setTimeout(() => {
			opening = false;
			href ? open(href, '_blank') : windowServer.openApp(appName!);
		}, openAnimDuration);
	};
</script>

<a
	class={[
		'fileIcon',
		{ selected: getSelectedIcon() === identifier, opening, desktopIcon: isDesktop }
	]}
	{onclick}
	{ondblclick}
	href={href ?? app?.url ?? app?.route}
	target={href || app?.url ? '_blank' : '_self'}
>
	<div class="fileIconImageWrapper">
		<img class="fileIconImage" src={icon ?? app?.icon} alt={name ?? app?.title} draggable="false" />
		<img
			class="fileIconImage fileIconImageZoom"
			src={icon ?? app?.icon}
			alt=""
			draggable="false"
			style:--openAnimDuration={`${openAnimDuration}ms`}
		/>
		{#if href || (app?.url && !browser)}
			<img class="aliasIcon" src="/icons/alias.png" alt="" draggable="false" />
		{/if}
	</div>
	<div class="fileIconLabel">{name ?? app?.title}</div>
</a>

<style>
	.fileIcon {
		all: unset;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;

		@media (scripting: none) {
			cursor: pointer;
		}
	}

	.fileIconImageWrapper {
		display: grid;
		width: 68px;
		height: 68px;
		margin: 2.5px;
		padding: 5px;
		border-radius: 4px;

		.selected & {
			background-color: rgb(0 0 0 / 25%);
		}
	}

	.fileIconImage {
		grid-area: 1 / 1;
		width: 100%;
		min-width: 0;
		height: 100%;
		min-height: 0;
		object-fit: contain;
	}

	.fileIconImageZoom {
		visibility: hidden;
		opacity: 0.5;

		@media not (prefers-reduced-motion: reduce) {
			.opening & {
				visibility: visible;
				animation: var(--openAnimDuration) linear iconOpen;
			}
		}
	}

	@keyframes iconOpen {
		from {
			scale: 1;
			opacity: 1;
		}
		to {
			scale: 4;
			opacity: 0;
		}
	}

	.aliasIcon {
		grid-area: 1 / 1;
	}

	.fileIconLabel {
		line-height: 20px;
		padding-inline: 15px;
		text-align: center;
		white-space: nowrap;

		.desktopIcon & {
			font-weight: 600;
			color: white;
			text-shadow: var(--label-shadow);
		}

		.selected & {
			background-color: var(--accent-color);
			color: white;
			border-radius: 9999px;

			.desktopIcon & {
				text-shadow: none;
				box-shadow: 0 1px 0 0 rgb(0 0 0 / 50%);
			}

			:global(.window.inactive) & {
				background-color: rgb(0 0 0 / 20%);
				color: black;
			}
		}
	}
</style>
