<script lang="ts">
	import BlueskyPlayIcon from '$lib/components/bluesky/BlueskyPlayIcon.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import type { BlueskyImage } from '$lib/helpers/fetchBlueskyData.server';
	import { CircleX, ExternalLink } from 'lucide-svelte';

	const windowServer = getWindowServerContext();
	const { app, appName } = getAppContext();

	const {
		image,
		postLink,
		handle
	}: {
		image: BlueskyImage;
		postLink: string;
		handle: string;
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

	$effect(() => {
		app.instance.ariaLabel = `Bluesky - ${image.isVideo ? 'Video' : 'Image'} from ${handle}`;
	});

	let showControlsMobile = $state(true);

	let video = $state<HTMLVideoElement>();
	let canPlayVideo = $state(true);
	let videoPaused = $state(true);

	$effect(() => {
		if (video && !video.canPlayType('application/vnd.apple.mpegurl')) {
			canPlayVideo = false;
		}
	});
</script>

<figure class={['blueskyMediaContainer', { showControlsMobile }]}>
	<button class="blueskyMediaWrapper" onclick={() => (showControlsMobile = !showControlsMobile)}>
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
		{:else}
			<img
				class="blueskyMedia"
				src={image.isVideo ? image.thumb : image.src}
				alt={image.alt}
				width={image.width}
				height={image.height}
				draggable={false}
				data-allow-window-drag
			/>
			{#if image.isVideo && !canPlayVideo}
				<BlueskyPlayIcon blocked data-allow-window-drag />
			{/if}
		{/if}
	</button>
	<div class="blueskyMediaControls" data-allow-window-drag>
		<button
			class="blueskyMediaCloseButton"
			aria-label="Close"
			title="Close"
			onclick={() => windowServer.closeApp(appName)}
		>
			<CircleX class="blueskyTabIcon fill" size={16} aria-hidden="true" />
		</button>
		<a
			class="blueskyMediaOpenButton"
			href={postLink}
			target="_blank"
			aria-label="Open post in new tab"
			title="Open post in new tab"
			onclick={() => (videoPaused = true)}
		>
			<ExternalLink class="blueskyTabIcon" size={16} strokeWidth={3} aria-hidden="true" />
		</a>
	</div>
	{#if image.alt}
		<figcaption class="blueskyMediaAltText aqua-no-scrollbar">
			{image.alt}
		</figcaption>
	{/if}
</figure>

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
	.blueskyMediaAltText,
	.blueskyMediaContainer :global(.blueskyPlayIcon:not(.blocked)) {
		opacity: 0;
		pointer-events: none;
		transition: opacity 250ms;

		@media (hover: hover) {
			.blueskyMediaContainer:hover & {
				opacity: 1;
				pointer-events: auto;
			}
		}
		@media (hover: none) {
			.blueskyMediaContainer.showControlsMobile & {
				opacity: 1;
				pointer-events: auto;
			}
		}
	}

	.blueskyMediaControls,
	.blueskyMediaAltText {
		grid-area: media;
		align-self: start;
		position: relative;
		display: flex;
		justify-content: space-between;
		padding: 8px;
		background: var(--titlebar-gradient-translucent);

		@media (prefers-reduced-transparency: reduce) {
			background: var(--titlebar-gradient);
		}

		@media (forced-colors: active) {
			background: Canvas;
		}
	}

	.blueskyMediaControls {
		border-bottom: 1px solid black;
	}

	.blueskyMediaAltText {
		align-self: end;
		z-index: 1;
		max-height: 80%;
		overflow-y: auto;
		padding-inline: 16px;
		border-top: 1px solid black;
		font-size: 14px;
		color: #ccced1;

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
