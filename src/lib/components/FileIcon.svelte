<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { getFileIconContext } from '$lib/context';

	let {
		name,
		icon,
		alias,
		onopen
	}: {
		name: string;
		icon: string;
		alias?: boolean;
		onopen: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	const { getSelectedIcon, setSelectedIcon, isDesktop } = getFileIconContext();

	let open = $state(false);
	const openAnimDuration = 200;

	const ondblclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		open = true;
		window.setTimeout(() => (open = false), openAnimDuration);
		onopen(e);
	};
</script>

<button
	class={['fileIcon', { selected: getSelectedIcon() === name, open, desktopIcon: isDesktop }]}
	onclick={() => setSelectedIcon(name)}
	{ondblclick}
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
		{#if alias}
			<img class="aliasIcon" src="icons/alias.png" alt="" draggable="false" />
		{/if}
	</div>
	<div class="fileIconLabel">{name}</div>
</button>

<style>
	/* TODO better focus indicator */
	.fileIcon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: none;
		border: none;
		-webkit-user-select: none;
		user-select: none;
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
		object-fit: contain;
	}

	.fileIconImageZoom {
		visibility: hidden;
		opacity: 0.5;

		@media not (prefers-reduced-motion: reduce) {
			.open & {
				/* FIXME animation should show above titlebar */
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
