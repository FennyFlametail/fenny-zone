<script lang="ts">
	import { browser } from '$app/environment';
	import { type AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import AliasIcon from '$lib/images/alias.png';

	let {
		appName,
		href,
		name,
		icon,
		label
	}: (
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
		  }
	) & {
		label?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';
	} = $props();

	const windowServer = getWindowServerContext();
	const app = appName && windowServer.apps[appName];

	const labelColors: Record<NonNullable<typeof label>, [string, string]> = {
		red: ['#fda29e', '#fc5f59'],
		orange: ['#facf93', '#f7a843'],
		yellow: ['#faf49c', '#efdb48'],
		green: ['#d6ec9c', '#b2d948'],
		blue: ['#aad2ff', '#56a1ff'],
		purple: ['#dcbfea', '#c089d7'],
		gray: ['#cfcfcf', '#a8a8a8']
	};

	let opening = $state(false);
	const openAnimDuration = 200;

	function onclick(e: MouseEvent) {
		e.preventDefault();
	}

	function ondblclick() {
		opening = true;
		window.setTimeout(() => {
			opening = false;
			href ? open(href, '_blank') : windowServer.openApp(appName!);
		}, openAnimDuration);
	}
</script>

<a
	class={[
		'fileIcon',
		'noJS-pointer',
		{
			opening,
			hasColor: label
		}
	]}
	{onclick}
	{ondblclick}
	href={href ?? app?.url ?? app?.route}
	target={href || app?.url ? '_blank' : '_self'}
>
	<div class="fileIconImageWrapper">
		<img class="fileIconImage" src={icon ?? app?.icon} alt={''} draggable="false" />
		<img
			class="fileIconImage fileIconImageZoom"
			src={icon ?? app?.icon}
			alt=""
			draggable="false"
			style:--openAnimDuration="{openAnimDuration}ms"
		/>
		{#if href || (app?.url && !browser)}
			<img class="aliasIcon" src={AliasIcon} alt="" draggable="false" />
		{/if}
	</div>
	<div
		class="fileIconLabel"
		style:--color1={label && labelColors[label][0]}
		style:--color2={label && labelColors[label][1]}
		data-label={name ?? app?.title}
	>
		{name ?? app?.title}
	</div>
</a>

<style>
	.fileIcon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: inherit;
		text-decoration: none;
		-webkit-user-select: none;
		user-select: none;

		:global(.desktop) & {
			width: 200px;
			height: 120px;
		}

		&:focus {
			outline: none;
		}
	}

	.fileIconImageWrapper {
		display: grid;
		width: 68px;
		height: 68px;
		margin: 2.5px;
		padding: 5px;
		border-radius: 4px;

		.fileIcon:focus & {
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
		position: relative;
		padding-inline: 15px;
		border-radius: 9999px;
		text-align: center;
		font-size: 16px;
		line-height: 20px;
		white-space: nowrap;
		background: linear-gradient(to bottom, var(--color1), var(--color2));

		:global(.desktop) .fileIcon:not(.hasColor) & {
			font-weight: 600;
			color: white;
			text-shadow: var(--label-text-shadow);
		}

		.hasColor &,
		.fileIcon:focus & {
			box-shadow: 0 1px 0 0 rgb(0 0 0 / 50%);
		}

		.hasColor & {
			@media (forced-colors: active) {
				background-color: Mark;
			}
		}

		.fileIcon:focus & {
			background-color: var(--accent-color);
			color: white;

			:global(.desktop) & {
				text-shadow: none;
			}

			.hasColor & {
				color: transparent;
				&::after {
					content: attr(data-label) / '';
					position: absolute;
					inset: 0;
					padding: 4px;
					line-height: 12px;
					color: white;
					background-color: var(--accent-color);
					background-clip: content-box;
					border-radius: 9999px;

					@media (forced-colors: active) {
						background-color: SelectedItem;
					}
				}
			}

			:global(.window.inactive) & {
				background-color: rgb(0 0 0 / 20%);
				color: black;
			}

			@media (forced-colors: active) {
				background-color: SelectedItem;
			}
		}
	}
</style>
