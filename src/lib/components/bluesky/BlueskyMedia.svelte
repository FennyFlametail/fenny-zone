<script lang="ts">
	import BlueskyPlayIcon from '$lib/components/bluesky/BlueskyPlayIcon.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import type { BlueskyImage } from '$lib/helpers/fetchBlueskyData.server';
	import { CircleX, ExternalLink } from 'lucide-svelte';
	import { fade, type FadeParams } from 'svelte/transition';

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
	let videoPaused = $state(true);

	$effect(() => {
		if (video && !video.canPlayType('application/vnd.apple.mpegurl')) {
			canPlayVideo = false;
		}
	});

	function onpointerenter() {
		showControls = true;
	}
	function onpointerleave() {
		showControls = false;
	}

	const fadeParams: FadeParams = {
		duration: 250
	};
</script>

<div class="blueskyMediaContainer" {onpointerenter} {onpointerleave}>
	<button class="blueskyMediaWrapper">
		{#if image.isVideo && canPlayVideo}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				bind:this={video}
				bind:paused={videoPaused}
				class="blueskyMedia"
				src={image.src}
				width={image.width}
				height={image.height}
				controls
			></video>
			{#if videoPaused}
				<BlueskyPlayIcon
					onclick={() => (videoPaused = false)}
					{fadeParams}
					data-allow-window-drag
				/>
			{/if}
		{:else}
			<img
				class="blueskyMedia"
				src={image.isVideo ? image.thumb : image.src}
				alt={''}
				width={image.width}
				height={image.height}
				draggable={false}
				data-allow-window-drag
			/>
			{#if image.isVideo && !canPlayVideo && showControls}
				<BlueskyPlayIcon blocked {fadeParams} data-allow-window-drag />
			{/if}
		{/if}
	</button>
	{#if showControls}
		<div class="blueskyMediaControls" data-allow-window-drag transition:fade={fadeParams}>
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
			<p class="blueskyMediaAltText" transition:fade={fadeParams}>
				{image.alt}
			</p>
		{/if}
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

		:global(.window.inactive) & :global(.blueskyTabIcon) {
			--gradient: url('#tabIconDisabledGradient');
		}

		&:active :global(.blueskyTabIcon) {
			--gradient: url('#tabIconActiveGradient');
		}
	}
</style>
