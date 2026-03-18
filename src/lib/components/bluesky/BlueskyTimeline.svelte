<script lang="ts">
	import BlueskyPost from '$lib/components/bluesky/BlueskyPost.svelte';
	import type {
		BlueskyPost as BlueskyPostType,
		BlueskyProfile
	} from '$lib/helpers/fetchBlueskyData.server';
	import { intlFormat } from 'date-fns';

	let {
		profile,
		posts,
		userSheetIsOpen,
		scrollToTop = $bindable()
	}: {
		profile: BlueskyProfile | null;
		posts: BlueskyPostType[] | null;
		userSheetIsOpen: boolean;
		scrollToTop: () => void;
	} = $props();

	const numberFormatter = new Intl.NumberFormat();

	let timeline = $state<HTMLDivElement>();
	scrollToTop = () =>
		timeline?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
</script>

<div bind:this={timeline} class="bluesky aqua-no-scrollbar" inert={userSheetIsOpen}>
	{#if profile && posts}
		<article class="blueskyProfile">
			<img class="blueskyBanner" src={profile.banner} alt="" draggable="false" />
			<div class="blueskyProfileHeader">
				<div class="blueskyAvatar">
					<img src={profile.avatar} alt="" draggable="false" />
				</div>
				<hgroup class="blueskyAuthor">
					<h3 class="blueskyDisplayName">{profile.displayName}</h3>
					<p class="blueskyHandle">@{profile.handle}</p>
				</hgroup>
				<a class="blueskyFollowButton" href={profile.link} target="_blank">View Profile</a>
			</div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="blueskyBio">{@html profile.description}</p>
			<div class="blueskyStatsContainer">
				<a class="blueskyStat" href={`${profile.link}/followers`} target="_blank">
					<span>Followers</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.followersCount)}</span>
				</a>
				<a class="blueskyStat" href={`${profile.link}/follows`} target="_blank">
					<span>Following</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.followsCount)}</span>
				</a>
				<a class="blueskyStat" href={profile.link} target="_blank">
					<span>Posts</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.postsCount)}</span>
				</a>
				<div class="blueskyStat">
					<span>Lists</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.listsCount)}</span>
				</div>
				<!-- <span class="blueskyStat blueskyStatLocation">
					<MapPin class="blueskyMapPin" aria-label="Location" />
					<span>your computer</span>
				</span> -->
			</div>
			<p class="blueskyJoinDate">
				Member Since {intlFormat(profile.createdAt, {
					month: 'long',
					year: 'numeric'
				})}
			</p>
		</article>
		<div class="blueskyPosts">
			{#each posts as post}
				<BlueskyPost {profile} {post} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.bluesky {
		grid-area: content;
		overflow-x: hidden;
		overflow-y: auto;
		color: #44484a;
	}

	.blueskyProfile {
		display: flex;
		flex-flow: column;
		padding: var(--spacing);
		gap: var(--spacing);
		background: linear-gradient(to bottom, #f4f8fa, #d9dde0);
		border-bottom: 1px solid #525556;
		box-shadow: 0 0 5px rgb(0 0 0 / 50%);
	}

	.blueskyBanner {
		/* TEST moved into profile element, double check */
		aspect-ratio: 3 / 1;
		min-height: 100px;
		max-height: 25cqh;
		width: 100%;
		object-fit: cover;
	}

	.blueskyProfileHeader {
		display: flex;
		align-items: center;
		gap: var(--spacing);
	}

	.blueskyAuthor {
		flex-grow: 1;
	}

	.blueskyDisplayName {
		color: black;
	}

	.blueskyHandle {
		font-size: 15px;
	}

	.blueskyFollowButton {
		--gradient-dir: bottom;
		height: 26px;
		display: flex;
		align-items: center;
		padding-inline: var(--spacing);
		border: 1px solid black;
		border-radius: 5px;
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 15%);
		background: linear-gradient(to var(--gradient-dir), #449df5, #1462aa);
		font-size: 14px;
		font-weight: bold;
		color: white;
		text-shadow: 0 -1px rgb(0 0 0 / 50%);
		text-decoration: none;
		-webkit-user-select: none;
		user-select: none;

		&:active {
			--gradient-dir: top;
		}
	}

	.blueskyBio {
		font-size: 15px;
		line-height: 1.3;
		white-space: pre-wrap;
		color: var(--text-medium);
	}

	.blueskyStatsContainer {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 40px);
		gap: 1px;
		border: 1px solid #a8abad;
		border-radius: 5px;
		overflow: hidden;
		background-color: #a8abad;
	}

	.blueskyStat {
		--stat-bg: #f3f6f8;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 17px;
		gap: var(--spacing);
		background-color: var(--stat-bg);
		font-size: 14px;
		color: var(--text-medium);
		text-decoration: none;
		-webkit-user-select: none;
		user-select: none;

		&:is(a):active {
			background-color: #caced0;
		}
	}

	/* .blueskyStatLocation {
		padding-inline-start: 12px;
		justify-content: flex-start;

		span {
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.blueskyMapPin {
		flex-shrink: 0;
		stroke: transparent;
		fill: url('#statIconGradient');

		> circle {
			fill: var(--stat-bg);
		}
	} */

	.blueskyStatNumber {
		height: 19px;
		display: flex;
		align-items: center;
		padding-inline: 8px;
		border: 1px solid #2368ad;
		border-radius: 9999px;
		background-color: #3982c7;
		font-weight: bold;
		color: white;
	}

	.blueskyJoinDate {
		text-align: center;
		font-size: 14px;
		color: var(--text-light);
		text-shadow: 0 1px white;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
