<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { getFileIconContext } from '$lib/context';
	import type { AppName } from '$lib/types/AppTypes';
	import { openApp } from '$lib/components/WindowServer.svelte';

	type FileIconProps = {
		name: string;
		icon: string;
	} & (
		| {
				appName: AppName;
				href?: never;
		  }
		| {
				appName?: never;
				href: string;
		  }
	);

	let { name, icon, appName, href }: FileIconProps = $props();
	const isLink = $derived(href);

	const { getSelectedIcon, setSelectedIcon, isDesktop } = getFileIconContext();

	let isOpen = $state(false);
	const openAnimDuration = 200;

	const onclick: MouseEventHandler<HTMLButtonElement | HTMLLinkElement> = (e) => {
		if (isLink) e.preventDefault();
		setSelectedIcon(name);
	};

	const ondblclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		isOpen = true;
		window.setTimeout(() => (isOpen = false), openAnimDuration);
		isLink ? open(href, '_blank') : openApp(appName!);
	};
</script>

<svelte:element
	this={isLink ? 'a' : 'button'}
	role={isLink ? 'link' : 'button'}
	class={[
		'fileIcon',
		{ selected: getSelectedIcon() === name, open: isOpen, desktopIcon: isDesktop }
	]}
	{onclick}
	{ondblclick}
	href={isLink ? href : undefined}
	target={isLink ? '_blank' : undefined}
>
	<div class="fileIconImageWrapper">
		<img class="fileIconImage" src={icon} alt={name} draggable="false" />
		<img
			class="fileIconImage fileIconImageZoom"
			src={icon}
			alt=""
			draggable="false"
			style:--openAnimDuration={`${openAnimDuration}ms`}
		/>
		{#if isLink}
			<img class="aliasIcon" src="icons/alias.png" alt="" draggable="false" />
		{/if}
	</div>
	<div class="fileIconLabel">{name}</div>
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
		height: 100%;
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
