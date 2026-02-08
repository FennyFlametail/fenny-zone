<script lang="ts">
	import type { BlueskyPost, BlueskyProfile } from '$lib/helpers/fetchBlueskyData.server';
	import { intlFormatDistance } from 'date-fns';
	import { Repeat2 } from 'lucide-svelte';
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
		<!-- TODO handle facets -->
		<p class="blueskyPostText">{post.text}</p>
		{#if post.images}
			<a class="blueskyImageContainer" href={post.link} target="_blank" tabindex="-1">
				{#each post.images as img}
					<img
						class="blueskyImage"
						src={img.src}
						alt={img.alt}
						draggable="false"
						width={img.width}
						height={img.height}
					/>
				{/each}
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
