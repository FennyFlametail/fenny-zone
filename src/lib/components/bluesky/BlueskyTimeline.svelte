<script lang="ts">
	import BlueskyPost from '$lib/components/bluesky/BlueskyPost.svelte';
	import type {
		BlueskyPost as BlueskyPostType,
		BlueskyProfile
	} from '$lib/helpers/fetchBlueskyData.server';
	import { intlFormat } from 'date-fns';
	import { EyeOff, Loader } from 'lucide-svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	let {
		profile,
		posts,
		userSheetIsOpen,
		isCustomUser,
		loadCustomUser
	}: {
		profile: BlueskyProfile | null;
		posts: BlueskyPostType[] | null;
		userSheetIsOpen: boolean;
		isCustomUser?: boolean;
		loadCustomUser: (handle: string) => void;
	} = $props();

	const numberFormatter = new Intl.NumberFormat();

	let profileElement = $state<HTMLElement>();
	$effect(() => {
		profileElement?.querySelectorAll('a.blueskyMention').forEach((el) => {
			(el as HTMLAnchorElement).onclick = (e) => {
				e.preventDefault();
				loadCustomUser(el.textContent);
			};
		});
	});

	let animate = $derived(isCustomUser && !prefersReducedMotion.current);
</script>

<div
	class="blueskyTimeline aqua-no-scrollbar"
	inert={userSheetIsOpen}
	transition:fly={{
		duration: animate ? 300 : 0,
		x: animate ? '100%' : 0,
		opacity: animate ? 1 : 0
	}}
>
	{#if profile && posts}
		{#if !profile.private}
			<img class="blueskyBanner" src={profile.banner} alt="" draggable="false" />
			<article bind:this={profileElement} class="blueskyProfile">
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
					<a class="blueskyStat" href="{profile.link}/followers" target="_blank">
						<span>Followers</span>
						<span class="blueskyStatNumber">{numberFormatter.format(profile.followersCount)}</span>
					</a>
					<a class="blueskyStat" href="{profile.link}/follows" target="_blank">
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
					<BlueskyPost {profile} {post} {loadCustomUser} />
				{/each}
			</div>
		{:else}
			<article class="blueskyProfilePrivate">
				<EyeOff size={64} />
				<h3>Sign-in Required</h3>
				<p>This account has requested that users sign in to view their profile.</p>
			</article>
		{/if}
	{:else}
		<div class="blueskyTimelineLoadingBar">
			<div class="blueskyTimelineSpinner">
				<Loader size={24} />
			</div>
		</div>
	{/if}
</div>

<style>
	.blueskyTimeline {
		/* circle size */
		--sz: 3px;
		/* circle spacing */
		--sp: 15px;
		/* circle offset */
		--of: calc(var(--sp) / 2);
		/* circle smoothness */
		--sm: 0.75;
		grid-area: timeline;
		min-height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-color: rgb(0 0 0 / 50%) transparent;
		isolation: isolate;
		background:
			linear-gradient(to bottom, rgb(0 0 0 / 75%), transparent 20px),
			radial-gradient(circle, black calc(var(--sz) * var(--sm)), transparent var(--sz)) var(--sz)
				var(--sz) / var(--sp) var(--sp),
			radial-gradient(circle, hsl(none none 25%) calc(var(--sz) * var(--sm)), transparent var(--sz))
				var(--sz) calc(var(--sz) + 1px) / var(--sp) var(--sp),
			radial-gradient(circle, black calc(var(--sz) * var(--sm)), transparent var(--sz))
				calc(var(--of) + var(--sz)) calc(var(--of) + var(--sz)) / var(--sp) var(--sp),
			radial-gradient(circle, hsl(none none 25%) calc(var(--sz) * var(--sm)), transparent var(--sz))
				calc(var(--of) + var(--sz)) calc(var(--of) + var(--sz) + 1px) / var(--sp) var(--sp),
			#28282b;
		color: #44484a;
		box-shadow: inset var(--panel-box-shadow-inactive);
		filter: drop-shadow(0 2px 2px #8b8b8b);
	}

	.blueskyBanner {
		aspect-ratio: 3 / 1;
		min-height: 100px;
		max-height: 25cqh;
		object-fit: cover;
	}

	.blueskyProfile {
		display: flex;
		flex-flow: column;
		padding: var(--spacing);
		gap: var(--spacing);
		background: var(--profile-bg);
		border-bottom: 1px solid #525556;
		box-shadow: 0 0 5px rgb(0 0 0 / 50%);
		filter: drop-shadow(0 0 10px rgb(0 0 0 / 25%));
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

	.blueskyProfilePrivate {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--spacing);
		padding-inline: calc(var(--spacing) * 2);
		background: var(--profile-bg);
		text-align: center;
		text-wrap: pretty;
		-webkit-user-select: none;
		user-select: none;

		:global(.lucide-icon) {
			background-color: var(--text-light);
			color: #e7ebed;
			padding: 16px;
			border-radius: 50%;
			margin-bottom: var(--spacing);
		}
	}

	.blueskyTimelineLoadingBar {
		height: 60px;
		display: grid;
		place-items: center;
		background: linear-gradient(to bottom, #707475, #383835);
		box-shadow: var(--panel-box-shadow);
	}

	.blueskyTimelineSpinner {
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
		background: linear-gradient(to bottom, #111618, #383b3a);
		border-radius: 50%;
		padding: 2px;
		color: rgb(255 255 255 / 50%);
		filter: drop-shadow(0 0 1px rgb(255 255 255 / 75%));

		:global(.lucide-loader) {
			animation: spin 1s steps(8) infinite;

			:global(path) {
				--lightness: 75%;
				color: hsl(none none var(--lightness));

				&:nth-child(1) {
					--lightness: 100%;
				}
				&:nth-last-child(1) {
					--lightness: 95%;
				}
				&:nth-last-child(2) {
					--lightness: 90%;
				}
				&:nth-last-child(3) {
					--lightness: 85%;
				}
				&:nth-last-child(4) {
					--lightness: 80%;
				}
			}
		}
	}

	@keyframes spin {
		from {
			rotate: 0;
		}
		to {
			rotate: 360deg;
		}
	}
</style>
