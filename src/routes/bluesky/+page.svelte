<script lang="ts">
	import { browser } from '$app/environment';
	import BlueskySidebar from '$lib/components/bluesky/BlueskySidebar.svelte';
	import BlueskyTimeline from '$lib/components/bluesky/BlueskyTimeline.svelte';
	import BlueskyTitlebar from '$lib/components/bluesky/BlueskyTitlebar.svelte';
	import BlueskyUserSheet from '$lib/components/bluesky/BlueskyUserSheet.svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import { getAppContext, getWindowServerContext } from '$lib/context.svelte';
	import type { BlueskyPost, BlueskyProfile } from '$lib/helpers/fetchBlueskyData.server';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { getBlueskyData } from './bluesky.remote';

	const { data }: PageProps = $props();

	const windowServer = getWindowServerContext();
	const { app, appName } = getAppContext();

	let { profile, posts } = $state(
		(data?.bluesky ?? browser) ? { profile: null, posts: null } : await getBlueskyData(undefined)
	);
	let customUsers: {
		profile: BlueskyProfile;
		posts: BlueskyPost[];
	}[] = $state([]);
	$effect(() => {
		app.instance.title = customUsers.at(-1)?.profile.displayName ?? profile?.displayName;
	});

	onMount(async () => {
		if (!profile || !posts) {
			try {
				({ profile, posts } = await getBlueskyData(undefined));
			} catch (e) {
				windowServer.closeAppWithError(appName, e);
			}
		}
	});

	let timelines = $state<HTMLDivElement>();

	// TODO add menu item for Change User

	let userSheetIsOpen = $state(false);
	function openUserSheet() {
		userSheetIsOpen = true;
	}
	function closeUserSheet() {
		userSheetIsOpen = false;
	}

	let errorSheetIsOpen = $state(false);
	function closeErrorSheet() {
		errorSheetIsOpen = false;
		loadingHandle = undefined;
	}

	let loadingHandle = $state<string>();
	async function loadCustomUser(handle: string) {
		if (loadingHandle) return;
		closeUserSheet();
		loadingHandle = handle.replace('@', '');
		try {
			const { profile, posts } = await getBlueskyData(handle);
			if (profile && posts) {
				customUsers.push({ profile, posts });
				loadingHandle = undefined;
			} else {
				errorSheetIsOpen = true;
			}
		} catch (e) {
			console.error(e);
			errorSheetIsOpen = true;
		}
	}
	async function closeCustomUser() {
		customUsers.pop();
	}
	async function closeAllCustomUsers() {
		customUsers = [];
	}

	function scrollToTop() {
		timelines?.lastElementChild?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<BlueskyTitlebar
	activeProfile={customUsers.at(-1)?.profile ?? profile}
	lastProfile={customUsers.at(-2)?.profile ?? profile}
	showBackButton={customUsers.length > 0}
	showChangeUserButton={!customUsers.length}
	{userSheetIsOpen}
	{openUserSheet}
	{closeCustomUser}
	{closeAllCustomUsers}
	{scrollToTop}
/>
<BlueskySidebar
	{profile}
	{openUserSheet}
	{userSheetIsOpen}
	customUserCount={customUsers.length}
	{closeAllCustomUsers}
/>
<!-- TODO two finger back swipe -->
<div bind:this={timelines} class={['blueskyContent', loadingHandle && 'loading']}>
	{#if loadingHandle && !errorSheetIsOpen}
		<div
			class="blueskyLoadingBar"
			transition:slide={{
				duration: 300,
				axis: 'y'
			}}
		>
			<div class="blueskyLoadingBarContent">
				<div role="progressbar" class="blueskyLoadingBarProgress"></div>
				<span class="blueskyLoadingBarLabel">Loading @{loadingHandle}...</span>
			</div>
		</div>
	{/if}
	<BlueskyTimeline {profile} {posts} {userSheetIsOpen} {loadCustomUser} />
	{#each customUsers as { profile, posts }}
		<BlueskyTimeline {profile} {posts} {userSheetIsOpen} isCustomUser={true} {loadCustomUser} />
	{/each}
</div>
<div class="blueskyFooter" data-allow-window-drag></div>

<BlueskyUserSheet isOpen={userSheetIsOpen} close={closeUserSheet} submit={loadCustomUser} />
<Sheet isOpen={errorSheetIsOpen}>
	<div class="blueskyErrorSheet">
		<h3>Unable to Access Account</h3>
		<p>There was a problem loading the account {loadingHandle}.</p>
		<button class="aqua-button primary" onclick={closeErrorSheet}>OK</button>
	</div>
</Sheet>

<style>
	:global {
		:where(.window[data-appname='bluesky']) {
			.blueskyTabIcon {
				--gradient: url('#tabIconGradient');
				--outline-shadow: drop-shadow(0 0 0.5px black) drop-shadow(0 0 0.5px black)
					drop-shadow(0 0 0.5px black);
				width: 20px;
				height: 20px;
				stroke: var(--gradient);
				filter: var(--outline-shadow);

				&.fill {
					fill: var(--gradient);
				}

				&.lucide-mail path,
				&.lucide-message-circle-x path:not(:first-child) {
					stroke: var(--background);
				}

				&.lucide-search path {
					stroke: #909295;

					.blueskyTab.highlighted & {
						stroke: #218ef0;
					}
				}

				&.lucide-user {
					width: 24px;
					height: 24px;
				}

				&.lucide-list {
					stroke: #a4a6a9;
				}
			}

			.blueskyAvatar {
				position: relative;
				flex-shrink: 0;
				height: 48px;
				width: 48px;
				border-radius: 5px;
				overflow: hidden;
				-webkit-user-select: none;
				user-select: none;
				&::after {
					position: absolute;
					top: 0;
					left: 0;
					content: '';
					width: 100%;
					height: 100%;
					box-shadow: inset 0 0 2px 1px rgb(0 0 0 / 50%);
					border-radius: inherit;
					pointer-events: none;
				}
			}

			.blueskyAuthor {
				> * {
					text-box-trim: trim-both;
					text-box-edge: text;
				}
			}

			.blueskyDisplayName {
				font-weight: bold;
			}

			.blueskyHandle {
				display: inline;
			}

			.blueskyLink {
				a& {
					color: #286fb4;
				}

				&:not(:hover) {
					text-decoration: none;
				}
			}

			.blueskyMention {
				a& {
					color: #465a6e;
				}
				font-weight: bold;

				&:not(:hover) {
					text-decoration: none;
				}
			}
		}
	}

	.blueskyContent {
		grid-area: content;
		display: grid;
		grid-template:
			'loadingbar' auto
			'timeline' 1fr / 1fr;
		overflow: hidden;
	}

	.blueskyLoadingBar {
		--loadingbar-height: 30px;
		box-sizing: content-box;
		grid-area: loadingbar;
		height: var(--loadingbar-height);
		display: grid;
		align-content: end;
		background: linear-gradient(to bottom, #ecedef, #c1c5c9);
		border-bottom: 1px solid currentColor;
		color: #5a6069;
	}

	.blueskyLoadingBarContent {
		height: var(--loadingbar-height);
		display: flex;
		align-items: center;
		padding-inline: 10px;
		gap: 10px;
		overflow: hidden;
	}

	.blueskyLoadingBarProgress {
		--progressbar-width: 90px;
		flex-shrink: 0;
		width: var(--progressbar-width);
		height: 12px;
		border: 1px solid var(--text-medium);
		border-radius: 9999px;
		background:
			linear-gradient(to bottom, rgb(255 255 255 / 25%), transparent),
			repeating-linear-gradient(-45deg, #469be5, #469be5 3px, #297bb7 3px, #297bb7 5px);
		background-size: 92px;
		box-shadow: inset 0 0 2px 0 white;
		animation: progressbar 5s linear infinite;
	}

	@keyframes progressbar {
		from {
			background-position: 0 0;
		}
		to {
			background-position: calc(-1 * var(--progressbar-width)) 0;
		}
	}

	.blueskyLoadingBarLabel {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 12px;
		font-weight: bold;
		text-shadow: 0 1px #ecedef;
		-webkit-user-select: none;
		user-select: none;
	}

	.blueskyFooter {
		grid-area: footer;
		background-image: var(--titlebar-gradient);
		border-top: 1px solid black;
		border-bottom-left-radius: calc(var(--window-radius) - 1px);
		border-bottom-right-radius: calc(var(--window-radius) - 1px);

		:global(.window.inactive) & {
			background-image: linear-gradient(to bottom, #57585b 1px, #434447 1px, #3c3d3f);
		}
	}

	.blueskyErrorSheet {
		width: 300px;
		display: flex;
		flex-direction: column;
		gap: var(--spacing);
		-webkit-user-select: none;
		user-select: none;

		h3,
		p {
			font-size: 17px;
			text-wrap: pretty;
		}

		button {
			margin-top: 5px;
			align-self: flex-end;
		}
	}
</style>
