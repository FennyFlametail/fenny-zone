<script lang="ts">
	import BlueskyPost from '$lib/components/BlueskyPost.svelte';
	import { intlFormat, intlFormatDistance } from 'date-fns';
	import { MapPin } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { getBlueskyData } from './bluesky.remote';

	const { data }: PageProps = $props();
	const { profile, posts } = data?.bluesky ?? (await getBlueskyData());

	const numberFormatter = new Intl.NumberFormat();
</script>

<div class="bluesky aqua-no-scrollbar">
	{#if profile && posts}
		<img class="blueskyBanner" src={profile.banner} alt="" draggable="false" />
		<article class="blueskyProfile">
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
			<p class="blueskyBio">{@html profile.description}</p>
			<div class="blueskyStatsContainer">
				<a class="blueskyStat" href={profile.link} target="_blank">
					<span>Posts</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.postsCount)}</span>
				</a>
				<span class="blueskyStat blueskyStatLocation">
					<MapPin>
						<linearGradient id="mapPinGradient" gradientTransform="rotate(90)">
							<stop offset="0%" stop-color="#BFC3C6" />
							<stop offset="100%" stop-color="#A9AFB3" />
						</linearGradient>
					</MapPin>
					<span>your computer</span>
				</span>
				<a class="blueskyStat" href={`${profile.link}/followers`} target="_blank">
					<span>Followers</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.followersCount)}</span>
				</a>
				<a class="blueskyStat" href={`${profile.link}/follows`} target="_blank">
					<span>Following</span>
					<span class="blueskyStatNumber">{numberFormatter.format(profile.followsCount)}</span>
				</a>
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
		/* TODO don't forget inactive window style */
		--spacing: 10px;
		--text-medium: #2d2f31;
		--text-light: #81878b;
		overflow-y: auto;
		color: #44484a;
	}

	:global {
		.blueskyBanner {
			aspect-ratio: 3 / 1;
			min-height: 100px;
			max-height: 25cqh;
			width: 100%;
			object-fit: cover;
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

		.blueskyProfileHeader {
			display: flex;
			align-items: center;
			gap: var(--spacing);
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

		.blueskyAvatar {
			position: relative;
			flex-shrink: 0;
			height: 48px;
			width: 48px;
			border-radius: 5px;
			overflow: hidden;
			&::after {
				position: absolute;
				top: 0;
				left: 0;
				content: '';
				width: 100%;
				height: 100%;
				box-shadow: inset 0 0 2px 1px rgb(0 0 0 / 50%);
				border-radius: inherit;
			}

			.blueskyPost & {
				margin-block-start: 5px;
			}
		}

		.blueskyAuthor {
			> * {
				text-box-trim: trim-both;
				text-box-edge: text;
			}

			.blueskyProfile & {
				flex-grow: 1;
			}

			.blueskyPost & {
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
		}

		.blueskyDisplayName {
			font-weight: bold;

			.blueskyProfile & {
				color: black;
			}
		}

		.blueskyHandle {
			display: inline;

			.blueskyProfile & {
				font-size: 15px;
			}

			.blueskyPost & {
				color: var(--text-light);
			}
		}

		.blueskyBio {
			font-size: 15px;
			line-height: 1.3;
			white-space: pre-wrap;
			color: var(--text-medium);
		}

		.blueskyMention {
			color: #465a6e;
			font-weight: bold;
			&:not(:hover) {
				text-decoration: none;
			}
		}

		.blueskyLink {
			color: #286fb4;
			&:not(:hover) {
				text-decoration: none;
			}
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

			&:active {
				background-color: #caced0;
			}
		}

		.blueskyStatLocation {
			padding-inline-start: 12px;
			justify-content: flex-start;

			:global(svg) {
				flex-shrink: 0;
				stroke: url('#mapPinGradient');
				fill: url('#mapPinGradient');

				> :global(circle) {
					fill: var(--stat-bg);
				}
			}

			span {
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

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

		.blueskyPost {
			display: flex;
			padding: var(--spacing);
			padding-block-start: 5px;
			gap: var(--spacing);
			background-color: #fafafb;
			border-top: 1px solid white;
			border-bottom: 1px solid #d5d9dc;

			&.blueskyQuotePost {
				border: 1px solid #d5d9dc;
				border-radius: 5px;
			}

			&:has(a:active),
			&:focus-within,
			&:focus-within & {
				background: linear-gradient(to bottom, #e4e6ea, #caced0);
				border-color: #7e8082;
			}
		}

		.blueskyPostHeader {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
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

		.blueskyPostContent {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			gap: var(--spacing);
		}

		.blueskyPostText {
			margin-block-start: -10px;
			white-space: pre-wrap;
		}

		.blueskyImageContainer {
			--gap: 2px;
			margin-inline-end: 5px;
			margin-block-end: 5px;
			max-height: min(45cqw, 230px);
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
			&:first-child:last-child {
				grid-column: span 2;
				grid-row: span 2;
			}

			/* 2 images */
			&:first-child:nth-last-child(2),
			&:nth-child(2):last-child {
				grid-row: span 2;
			}

			/* 3 images */
			&:first-child:nth-last-child(3) {
				grid-row: span 2;
			}
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
	}
</style>
