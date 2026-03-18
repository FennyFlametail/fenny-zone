<script lang="ts">
	import BlueskySidebar from '$lib/components/bluesky/BlueskySidebar.svelte';
	import BlueskyTimeline from '$lib/components/bluesky/BlueskyTimeline.svelte';
	import BlueskyTitlebar from '$lib/components/bluesky/BlueskyTitlebar.svelte';
	import BlueskyUserSheet from '$lib/components/bluesky/BlueskyUserSheet.svelte';
	import type { PageProps } from './$types';
	import { getBlueskyData } from './bluesky.remote';

	const { data }: PageProps = $props();

	// eslint-disable-next-line svelte/valid-compile
	let { profile, posts } = $state(data?.bluesky ?? (await getBlueskyData(undefined)));

	// TODO update title in Window menu to match display name
	// TODO add menu item for Change User

	let userSheetIsOpen = $state(false);
	let scrollToTop = $state(() => {});

	function openUserSheet() {
		userSheetIsOpen = true;
	}

	function closeUserSheet() {
		userSheetIsOpen = false;
	}

	async function loadUser(handle: string) {
		// FIXME
		({ profile, posts } = await getBlueskyData(handle));
	}

	async function closeUser() {
		// FIXME
		({ profile, posts } = await getBlueskyData(undefined));
	}
</script>

<BlueskyTitlebar {profile} {userSheetIsOpen} {openUserSheet} {closeUser} {scrollToTop} />
<BlueskySidebar {profile} {userSheetIsOpen} />
<BlueskyTimeline {profile} {posts} {userSheetIsOpen} bind:scrollToTop />
<div class="blueskyFooter" data-allow-window-drag></div>
<BlueskyUserSheet isOpen={userSheetIsOpen} close={closeUserSheet} submit={loadUser} />

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

	.blueskyGradientDefs {
		position: fixed;
		top: 100vh;
		left: 100vw;
	}
</style>
