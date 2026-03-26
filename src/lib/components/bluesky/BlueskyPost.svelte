<script lang="ts">
	import BlueskyPlayIcon from '$lib/components/bluesky/BlueskyPlayIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import type {
		BlueskyImage,
		BlueskyPost,
		BlueskyProfile
	} from '$lib/helpers/fetchBlueskyData.server';
	import { intlFormatDistance } from 'date-fns';
	import { Info, Repeat2 } from 'lucide-svelte';
	import Self from './BlueskyPost.svelte';

	const windowServer = getWindowServerContext();

	const {
		profile,
		post,
		isQuotePost = false,
		loadCustomUser
	}: {
		profile: BlueskyProfile;
		post: BlueskyPost;
		isQuotePost?: boolean;
		loadCustomUser: (handle: string) => void;
	} = $props();

	let postText = $state<HTMLParagraphElement>();
	$effect(() => {
		postText?.querySelectorAll('a.blueskyMention').forEach((el) => {
			(el as HTMLAnchorElement).onclick = (e) => {
				e.preventDefault();
				loadCustomUser(el.textContent);
			};
		});
	});

	let showContentWarning = $state(true);
	function bypassContentWarning(e: MouseEvent) {
		e.preventDefault();
		showContentWarning = false;
	}

	function formatTimestamp(timestamp: string) {
		return intlFormatDistance(timestamp, new Date(), {
			style: 'narrow',
			numeric: 'always'
		}).replace(' ago', '');
	}

	function openProfile(e: MouseEvent) {
		e.preventDefault();
		loadCustomUser(post.handle);
	}

	function openImage(e: MouseEvent, image: BlueskyImage) {
		e.preventDefault();
		windowServer.openApp('blueskyMedia', { props: { postLink: post.link, image } });
	}
</script>

<article class={['blueskyPost', isQuotePost && 'blueskyQuotePost']}>
	{#if post.handle !== profile.handle}
		<a
			class="blueskyAvatar"
			href={post.profileLink}
			target="_blank"
			onclick={openProfile}
			tabindex="-1"
		>
			<img src={post.avatar} alt="" draggable="false" />
		</a>
	{:else}
		<div class="blueskyAvatar">
			<img src={post.avatar} alt="" draggable="false" />
		</div>
	{/if}
	<div class="blueskyPostContent">
		<hgroup class="blueskyPostHeader">
			{#snippet authorContent()}
				<h3 class="blueskyDisplayName">
					<span>{post.displayName}</span>
				</h3>
				<p class="blueskyHandle">@{post.handle}</p>
			{/snippet}
			{#if post.handle !== profile.handle}
				<a class="blueskyAuthor" href={post.profileLink} target="_blank" onclick={openProfile}>
					{@render authorContent()}
				</a>
			{:else}
				<span class="blueskyAuthor">
					{@render authorContent()}
				</span>
			{/if}

			<a class="blueskyTimestamp" href={post.link} target="_blank"
				>{formatTimestamp(post.createdAt)}</a
			>
		</hgroup>
		<p bind:this={postText} class="blueskyPostText">{@html post.text}</p>
		{#if post.isLabeled && showContentWarning}
			<a
				class="blueskyLinkPreview blueskyContentWarning"
				href={post.link}
				target="_blank"
				onclick={bypassContentWarning}
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
			<div class="blueskyImageContainer">
				{#each post.images as img}
					<a
						class="blueskyImage"
						href={post.link}
						target="_blank"
						onclick={(e) => openImage(e, img)}
						tabindex="-1"
					>
						<img
							src={img.thumb}
							alt={img.alt}
							title={img.alt}
							draggable="false"
							width={img.width}
							height={img.height}
						/>
						{#if img.isVideo}
							<BlueskyPlayIcon />
						{/if}
					</a>
				{/each}
			</div>
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
			<Self {profile} post={post.quotePost} isQuotePost={true} {loadCustomUser} />
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
		text-decoration-color: var(--text-light);

		&:not(:hover) {
			text-decoration: none;
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

	.blueskyImageContainer {
		--gap: 2px;
		margin-inline-end: 5px;
		margin-block-end: 5px;
		position: relative;
		/* aspect-ratio: 1.825; */
		max-height: 500px;
		display: grid;
		grid-template-columns: repeat(2, calc(50% - var(--gap) / 2));
		grid-template-rows: repeat(2, calc(50% - var(--gap) / 2));
		gap: var(--gap);
		border-radius: 5px;
		overflow: hidden;
	}

	.blueskyImage {
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

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
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
