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
	const { appName } = getAppContext();

	let { profile, posts } = $state(
		(data?.bluesky ?? browser) ? { profile: null, posts: null } : await getBlueskyData(undefined)
	);
	let customUsers: {
		profile: BlueskyProfile;
		posts: BlueskyPost[];
	}[] = $state([]);

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

	// TODO update title in Window menu to match display name
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

<svg class="blueskyGradientDefs">
	<defs>
		<linearGradient id="statIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#BFC3C6" />
			<stop offset="100%" stop-color="#A9AFB3" />
		</linearGradient>
		<linearGradient id="tabIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#CCCED1" />
			<stop offset="100%" stop-color="#7C7E81" />
		</linearGradient>
		<linearGradient id="tabHighlightedIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#84C6FF" />
			<stop offset="100%" stop-color="#007BEB" />
		</linearGradient>
		<linearGradient id="tabIconActiveGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#606060" />
			<stop offset="100%" stop-color="#838383" />
		</linearGradient>
		<linearGradient id="tabIconDisabledGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#8F8F90" />
			<stop offset="100%" stop-color="#7C7C7D" />
		</linearGradient>
	</defs>
</svg>

<style>
	:global {
		#root .window[data-appname='bluesky'] {
			--window-radius: 5px;
			--sidebar-width: 66px;
			--spacing: 10px;
			--titlebar-height: 35px;
			--titlebar-gradient: linear-gradient(
				to bottom,
				#59595c 1px,
				#4b4c4f 1px,
				#4b4c4f 2px,
				#444548 2px,
				#2a2b2d
			);
			--profile-bg: linear-gradient(to bottom, #f4f8fa, #d9dde0);
			--glow-drop-shadow: drop-shadow(0 0 5px #3793e7);
			--text-medium: #2d2f31;
			--text-light: #81878b;
			background-color: #2a2b2d;
			background-image: none;
			background-clip: padding-box;
			border-color: rgb(0 0 0 / 75%);
			border-radius: 5px;
		}

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

	.blueskyGradientDefs {
		position: fixed;
		top: 100vh;
		left: 100vw;
	}
</style>
