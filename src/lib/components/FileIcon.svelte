<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { type AppName } from '$lib/apps.svelte';
	import { getFileIconContext } from '$lib/context';
	// FIXME importing apps from here instead of apps.svelte fixes this build error, find a better solution https://github.com/sveltejs/kit/issues/10745
	import { apps, openApp } from '$lib/components/WindowServer.svelte';

	const identifier = Symbol('FileIcon');

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
	const app = appName && apps[appName];

	const { getSelectedIcon, setSelectedIcon, isDesktop } = getFileIconContext();

	let isOpen = $state(false);
	const openAnimDuration = 200;

	const onclick: MouseEventHandler<HTMLButtonElement | HTMLLinkElement> = (e) => {
		if (href) e.preventDefault();
		setSelectedIcon(identifier);
	};

	const ondblclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		isOpen = true;
		window.setTimeout(() => (isOpen = false), openAnimDuration);
		href ? open(href, '_blank') : openApp(appName!);
	};
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? 'link' : 'button'}
	class={[
		'fileIcon',
		{ selected: getSelectedIcon() === identifier, open: isOpen, desktopIcon: isDesktop }
	]}
	{onclick}
	{ondblclick}
	href={href ?? undefined}
	target={href ? '_blank' : undefined}
>
	<div class="fileIconImageWrapper">
		<img class="fileIconImage" src={app?.icon ?? icon} alt={app?.title ?? name} draggable="false" />
		<img
			class="fileIconImage fileIconImageZoom"
			src={app?.icon ?? icon}
			alt=""
			draggable="false"
			style:--openAnimDuration={`${openAnimDuration}ms`}
		/>
		{#if href}
			<img class="aliasIcon" src="icons/alias.png" alt="" draggable="false" />
		{/if}
	</div>
	<div class="fileIconLabel">{app?.title ?? name}</div>
</svelte:element>

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
			.open & {
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
