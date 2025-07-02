<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		name,
		icon,
		selected = $bindable(false),
		onselect,
		onopen
	}: {
		name: string;
		icon: string;
		selected: boolean;
		onselect: MouseEventHandler<HTMLButtonElement>;
		onopen: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	let open = $state(false);
	const openAnimDuration = 200;

	const ondblclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		open = true;
		window.setTimeout(() => (open = false), openAnimDuration);
		onopen(e);
	};
</script>

<button class={['fileIcon', { selected, open }]} onclick={onselect} {ondblclick}>
	<div class="fileIconContainer">
		<img class="fileIconImage" src={icon} alt={name} draggable="false" />
		<img
			class="fileIconImage fileIconImageZoom"
			src={icon}
			alt=""
			draggable="false"
			style:--openAnimDuration={`${openAnimDuration}ms`}
		/>
	</div>
	<div class="fileIconLabel">{name}</div>
</button>

<style>
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

	.fileIconContainer {
		position: relative;
		width: 64px;
		height: 64px;
		margin: 2.5px;
		padding: 2.5px;
		border-radius: 4px;

		.selected & {
			background: rgb(0 0 0 / 25%);
		}
	}

	.fileIconImage {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.fileIconImageZoom {
		visibility: hidden;
		opacity: 0.5;

		.open & {
			visibility: visible;
			animation: var(--openAnimDuration) linear iconOpen;
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

	.fileIconLabel {
		line-height: 20px;
		padding-inline: 15px;

		.selected & {
			background: var(--accent-color);
			color: white;
			border-radius: 9999px;

			:global(.window.inactive) & {
				background: rgb(0 0 0 / 20%);
				color: black;
			}
		}
	}
</style>
