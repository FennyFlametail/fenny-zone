<script lang="ts">
	import type { BlueskyPost, BlueskyProfile } from '$lib/helpers/fetchBlueskyData.server';
	import { intlFormatDistance } from 'date-fns';
	import { Info, Repeat2 } from 'lucide-svelte';
	import Self from './BlueskyPost.svelte';

	const {
		profile,
		post,
		isQuotePost = false
	}: {
		profile: BlueskyProfile;
		post: BlueskyPost;
		isQuotePost?: boolean;
	} = $props();

	let showWarnings = $state(true);
	function bypassWarnings(e: MouseEvent) {
		e.preventDefault();
		showWarnings = false;
	}

	function formatTimestamp(timestamp: string) {
		return intlFormatDistance(timestamp, new Date(), {
			style: 'narrow',
			numeric: 'always'
		}).replace(' ago', '');
	}
</script>

<article class={['blueskyPost', isQuotePost && 'blueskyQuotePost']}>
	<a class="blueskyAvatar" href={post.profileLink} target="_blank" tabindex="-1">
		<img src={post.avatar} alt="" draggable="false" />
	</a>
	<div class="blueskyPostContent">
		<hgroup class="blueskyPostHeader">
			<!-- TODO make these links change the active user in the parent -->
			<a class="blueskyAuthor" href={post.profileLink} target="_blank">
				<h3 class="blueskyDisplayName">
					<span>{post.displayName}</span>
				</h3>
				<p class="blueskyHandle">@{post.handle}</p>
			</a>

			<a class="blueskyTimestamp" href={post.link} target="_blank"
				>{formatTimestamp(post.createdAt)}</a
			>
		</hgroup>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="blueskyPostText">{@html post.text}</p>
		{#if post.isLabeled && showWarnings}
			<a
				class="blueskyLinkPreview blueskyContentWarning"
				href={post.link}
				target="_blank"
				onclick={bypassWarnings}
			>
				<div class="blueskyLinkPreviewText">
					<div class="blueskyLinkPreviewDescription">
						<Info size={20} />
						<span>Content Warning</span>
						<span>Show</span>
					</div>
				</div>
			</a>
		{:else if post.images}
			<a class="blueskyImageContainer" href={post.link} target="_blank" tabindex="-1">
				{#each post.images as img}
					<img
						class="blueskyImage"
						src={img.src}
						alt={img.alt}
						title={img.alt}
						draggable="false"
						width={img.width}
						height={img.height}
					/>
					{#if img.isVideo}
						<div class="blueskyPlayIcon">▶</div>
					{/if}
				{/each}
			</a>
		{/if}
		{#if post.linkPreview}
			<a class="blueskyLinkPreview" href={post.linkPreview.link} target="_blank">
				<img class="blueskyLinkPreviewThumb" src={post.linkPreview.thumb} alt="" />
				<div class="blueskyLinkPreviewText">
					<div class="blueskyLinkPreviewTitle">{post.linkPreview.title}</div>
					<div class="blueskyLinkPreviewDescription">{post.linkPreview.description}</div>
					<div class="blueskyLinkPreviewDomain">
						{URL.parse(post.linkPreview.link)?.hostname}
					</div>
				</div>
			</a>
		{/if}
		{#if post.quotePost && !isQuotePost}
			<Self {profile} post={post.quotePost} isQuotePost={true} />
		{/if}
		{#if post.isRepost && !isQuotePost}
			<div class="blueskyRepostLabel">
				<Repeat2 />
				<span>Reposted by {profile?.displayName}</span>
			</div>
		{/if}
	</div>
</article>

<style>
	.blueskyPost {
		--card-border-color: #d5d9dc;
		display: flex;
		padding: var(--spacing);
		padding-block-start: 5px;
		gap: var(--spacing);
		background-color: #fafafb;
		border-top: 1px solid white;
		border-bottom: 1px solid #d5d9dc;

		&.blueskyQuotePost {
			border: 1px solid var(--card-border-color);
			border-radius: 5px;
		}

		&:has(a:active),
		&:focus-within,
		&:focus-within :global(&) {
			--card-border-color: #7e8082;
			background: linear-gradient(to bottom, #e4e6ea, #caced0);
			border-color: var(--card-border-color);
		}
	}

	.blueskyAvatar {
		margin-block-start: 5px;
	}

	.blueskyPostContent {
		min-width: 0;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing);
	}

	.blueskyPostHeader {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.blueskyAuthor {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.5em;
		color: inherit;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
			text-decoration-color: var(--text-light);
		}
	}

	.blueskyHandle {
		color: var(--text-light);
	}

	.blueskyTimestamp {
		font-weight: bold;
		color: var(--text-light);
		text-box-trim: trim-both;
		text-box-edge: text;

		&:not(:hover) {
			text-decoration: none;
		}
	}

	.blueskyPostText {
		margin-block-start: -10px;
		white-space: pre-wrap;
	}

	:global(.blueskyLink) {
		color: #286fb4;

		&:not(:hover) {
			text-decoration: none;
		}
	}

	:global(.blueskyMention) {
		color: #465a6e;
		font-weight: bold;

		&:not(:hover) {
			text-decoration: none;
		}
	}

	.blueskyImageContainer {
		--gap: 2px;
		margin-inline-end: 5px;
		margin-block-end: 5px;
		position: relative;
		aspect-ratio: 1.825;
		max-height: 230px;
		display: grid;
		grid-template-columns: repeat(2, calc(50% - var(--gap) / 2));
		grid-template-rows: repeat(2, calc(50% - var(--gap) / 2));
		gap: var(--gap);
		border-radius: 5px;
		overflow: hidden;
	}

	.blueskyImage {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;

		/* 1 image */
		&:first-of-type:last-of-type {
			grid-column: span 2;
			grid-row: span 2;
		}

		/* 2 images */
		&:first-of-type:nth-last-of-type(2),
		&:nth-child(2):last-of-type {
			grid-row: span 2;
		}

		/* 3 images */
		&:first-of-type:nth-last-of-type(3) {
			grid-row: span 2;
		}
	}

	.blueskyPlayIcon {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 72px;
		height: 72px;
		display: grid;
		place-items: center;
		padding-left: 7.5px;
		background-color: rgb(255 255 255 / 75%);
		border-radius: 50%;
		font-size: 42px;
		color: rgb(0 0 0 / 75%);
	}

	.blueskyLinkPreview {
		max-height: 230px;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--card-border-color);
		border-radius: 5px;
		overflow: hidden;
		color: inherit;
		text-decoration: none;

		&:hover .blueskyLinkPreviewTitle {
			text-decoration: underline;
		}
	}

	.blueskyLinkPreviewThumb {
		min-height: 0;
		object-fit: cover;
		object-position: center;
	}

	.blueskyLinkPreviewText {
		padding: var(--spacing);
	}

	.blueskyLinkPreviewDescription {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.blueskyContentWarning .blueskyLinkPreviewDescription {
		display: flex;
		align-items: center;
		gap: 10px;

		span:first-of-type {
			flex-grow: 1;
			font-weight: bold;
		}
	}

	.blueskyLinkPreviewTitle {
		font-weight: bold;
	}

	.blueskyLinkPreviewDomain {
		font-size: 14px;
		color: var(--text-light);
	}

	.blueskyRepostLabel {
		margin-top: -5px;
		display: flex;
		gap: 5px;
		font-weight: bold;
		-webkit-user-select: none;
		user-select: none;

		:global(svg) {
			color: #b2b7be;
			stroke-width: 3;
		}
	}
</style>
