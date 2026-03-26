<script lang="ts">
	import BlueskyPlayIcon from '$lib/components/bluesky/BlueskyPlayIcon.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import type { BlueskyImage } from '$lib/helpers/fetchBlueskyData.server';
	import { CircleX, ExternalLink } from 'lucide-svelte';

	const windowServer = getWindowServerContext();
	const { app, appName } = getAppContext();

	const {
		postLink,
		image
	}: {
		postLink: string;
		image: BlueskyImage;
	} = $props();

	$effect(() => {
		const { width, height } = image;
		const maxSize = Math.min(
			500,
			document.documentElement.clientWidth,
			document.documentElement.clientHeight
		);
		if (width && height) {
			const shorterEdge = (Math.min(width, height) * maxSize) / Math.max(width, height);
			const landscape = width >= height;
			app.instance.position.width = landscape ? maxSize : shorterEdge;
			app.instance.position.height = landscape ? shorterEdge : maxSize;
		}
	});

	let showControls = $state(true);
	let video = $state<HTMLVideoElement>();
	let canPlayVideo = $state(true);

	$effect(() => {
		if (video && !video.canPlayType('application/vnd.apple.mpegurl')) {
			canPlayVideo = false;
		}
	});

	function toggleControls(e: MouseEvent) {
		e.preventDefault();
		showControls = !showControls;
		if (video) {
			showControls ? video.pause() : video.play();
		}
	}
</script>

<div class="blueskyMediaContainer">
	<button class="blueskyMediaWrapper" onclick={toggleControls}>
		{#if image.isVideo && canPlayVideo}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				bind:this={video}
				class="blueskyMedia"
				src={image.src}
				width={image.width}
				height={image.height}
				controls
				onabort={() => 'video error'}
			></video>
			{#if showControls}
				<BlueskyPlayIcon data-allow-window-drag />
			{/if}
		{:else}
			<!-- TODO add indicator if this is a video that can't be played -->
			<img
				class="blueskyMedia"
				src={image.isVideo ? image.thumb : image.src}
				alt={''}
				width={image.width}
				height={image.height}
				draggable={false}
				data-allow-window-drag
			/>
		{/if}
	</button>
	<div class={['blueskyMediaControls', showControls && 'visible']} data-allow-window-drag>
		<button
			class="blueskyMediaCloseButton"
			aria-label="Close"
			title="Close"
			onclick={() => windowServer.closeApp(appName)}
		>
			<CircleX class="blueskyTabIcon fill" size={16} />
		</button>
		<a
			class="blueskyMediaOpenButton"
			href={postLink}
			target="_blank"
			aria-label="Open post in new tab"
			title="Open post in new tab"
		>
			<ExternalLink class="blueskyTabIcon" size={16} strokeWidth={3} />
		</a>
	</div>
	{#if image.alt}
		<p class={['blueskyMediaAltText', showControls && 'visible']}>
			{image.alt}
		</p>
	{/if}
</div>

<style>
	:global(#root .window.window[data-appname='blueskyMedia']) {
		--window-radius: 0;
	}

	.blueskyMediaContainer {
		display: grid;
		grid-template: 'media' 1fr / 1fr;
		overflow: hidden;
	}

	.blueskyMediaWrapper {
		all: unset;
		grid-area: media;
	}

	.blueskyMedia {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.blueskyMediaControls,
	.blueskyMediaAltText {
		--titlebar-opacity: 50%;
		grid-area: media;
		align-self: start;
		position: relative;
		isolation: isolate;
		display: flex;
		justify-content: space-between;
		padding: 8px;
		opacity: 0;
		transition: opacity 250ms;
		pointer-events: none;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: var(--titlebar-gradient);
			opacity: 0.9;
			z-index: -1;
		}

		&.visible {
			opacity: 1;
			pointer-events: auto;
		}
	}

	.blueskyMediaControls {
		border-bottom: 1px solid black;
	}

	.blueskyMediaAltText {
		align-self: end;
		border-top: 1px solid black;
		font-size: 14px;
		color: #ccced1;
		padding-inline: 16px;

		&::selection {
			color: black;
		}
	}

	.blueskyMediaCloseButton {
		all: unset;

		:global(path) {
			stroke: var(--tab-bg);
		}
	}

	.blueskyMediaCloseButton,
	.blueskyMediaOpenButton {
		cursor: pointer;

		&:active :global(.blueskyTabIcon) {
			--gradient: url('#tabIconActiveGradient');
		}
	}
</style>
