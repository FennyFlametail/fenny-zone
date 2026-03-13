<script lang="ts">
	import BlueskyPost from '$lib/components/BlueskyPost.svelte';
	import WindowControls from '$lib/components/WindowControls.svelte';
	import { intlFormat } from 'date-fns';
	import {
		AtSign,
		List,
		Mail,
		MessageCircle,
		MessageCircleX,
		Repeat2,
		Search,
		Star,
		User
	} from 'lucide-svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PageProps } from './$types';
	import { getBlueskyData } from './bluesky.remote';

	const { data }: PageProps = $props();
	let { profile, posts } = $state(data?.bluesky ?? (await getBlueskyData()));

	// TODO update title in Window menu to match display name
	// TODO add menu item for Change User

	const numberFormatter = new Intl.NumberFormat();

	let content = $state<HTMLDivElement>();
	let lastX = $state(0);
	let lastY = $state(0);
	function onTitleDown() {
		if (!content) return;
		const { left, top } = content.getBoundingClientRect();
		lastX = left;
		lastY = top;
	}
	function onTitleUp() {
		if (!content) return;
		const { left, top } = content.getBoundingClientRect();
		if (Math.abs(left - lastX) < 1 && Math.abs(top - lastY) < 1) {
			content?.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}

	async function changeUser() {
		// TODO proper sheet with loading and error states
		const userHandle = prompt('Enter handle...');
		if (userHandle) {
			({ profile, posts } = await getBlueskyData(userHandle));
		}
	}

	let highlightedTabs = $state(new SvelteSet([0]));

	const tabs: [
		any,
		{
			classes?: string[];
			iconClass?: string[];
			strokeWidth?: number;
		}
	][] = [
		[MessageCircle, { iconClass: ['fill'] }],
		[AtSign, { strokeWidth: 3 }],
		[Mail, { iconClass: ['fill'] }],
		[Star, { iconClass: ['fill'] }],
		[Search, { strokeWidth: 4 }],
		[User, { classes: ['selected'], iconClass: ['fill'], strokeWidth: 0 }],
		[List, { strokeWidth: 3 }],
		[Repeat2, { strokeWidth: 3 }],
		[MessageCircleX, { iconClass: ['fill'] }]
	];
</script>

<div class="blueskyTitlebar" data-allow-window-drag>
	<WindowControls />
	<button
		class="blueskyWindowTitle"
		onpointerdown={onTitleDown}
		onpointerup={onTitleUp}
		data-allow-window-drag
	>
		<h2 data-allow-window-drag>{profile?.displayName}</h2>
	</button>
	<!-- <button
		class="blueskyUserButton"
		onclick={changeUser}
		title="Change User"
		aria-label="Change User"
	>
		<User class="blueskyTabIcon fill" strokeWidth={0} />
	</button> -->
</div>
<div class="blueskySidebar" data-allow-window-drag>
	<div class="blueskyAvatar">
		<img src={profile?.avatar} alt="" draggable="false" width={35} height={35} />
	</div>
	<div class="blueskyTabContainer">
		{#each tabs as [Icon, { classes = [], iconClass = [], strokeWidth }], index (index)}
			{@const highlighted = highlightedTabs.has(index)}
			<button
				class={['blueskyTab', highlighted && 'highlighted', ...classes]}
				onclick={/* () => (highlighted ? highlightedTabs.delete(index) : highlightedTabs.add(index)) */
				() => {}}
			>
				<div class="blueskyTabIconWrapper">
					<Icon class={['blueskyTabIcon', ...iconClass].join(' ')} {strokeWidth} />
				</div>
			</button>
		{/each}
	</div>
</div>
<div class="bluesky aqua-no-scrollbar" bind:this={content}>
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
<div class="blueskyFooter" data-allow-window-drag></div>

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
	</defs>
</svg>

<!-- TODO un-globalize CSS -->
<style>
	:global {
		#root .window[data-appname='bluesky'] {
			--sidebar-width: 65px;
			--spacing: 10px;
			--titlebar-gradient: linear-gradient(
				to bottom,
				#59595c 1px,
				#4b4c4f 1px,
				#4b4c4f 2px,
				#444548 2px,
				#2a2b2d
			);
			--text-medium: #2d2f31;
			--text-light: #81878b;

			background-color: #2a2b2d;
			background-image: none;
			background-clip: padding-box;
			border-color: rgb(0 0 0 / 75%);
			border-radius: 5px;

			.windowControls {
				grid-area: controls;
				width: calc(var(--sidebar-width) + 1px);
				height: 100%;
				padding-inline: 6px;
				justify-content: space-between;
				gap: 0;
				background-image: linear-gradient(
					to left,
					#535357 1px,
					#18191a 1px,
					#18191a 2px,
					transparent 2px
				);

				.window.inactive & {
					background-image: linear-gradient(
						to left,
						#535357 1px,
						#2e2f31 1px,
						#2e2f31 2px,
						transparent 2px
					);
				}
			}

			.windowButton {
				width: 12px;
				height: 12px;
				box-shadow: 0 1px 1px rgb(255 255 255 / 15%);
			}

			.windowContent {
				grid-template:
					'titlebar titlebar' auto
					'sidebar content' 1fr
					'footer footer' auto / var(--sidebar-width) auto;
			}
		}

		.blueskyTitlebar {
			grid-area: titlebar;
			height: 35px;
			display: grid;
			grid-template: 'controls title userButton' / auto 1fr auto;
			background-image: var(--titlebar-gradient);
			border-bottom: 1px solid black;
			-webkit-user-select: none;
			user-select: none;

			.window.inactive & {
				background-image: linear-gradient(to bottom, #57585b 1px, #444548 1px, #444548);
			}
		}

		.blueskyWindowTitle {
			all: unset;
			grid-area: title;
			cursor: pointer;

			h2 {
				text-align: center;
				font-size: 14px;
				color: white;
				text-shadow: 0 -1px black;
			}

			.window.inactive & {
				color: #c7c7c8;
			}
		}

		.blueskyUserButton {
			--gradient: url('#tabIconGradient');
			all: unset;
			grid-area: userButton;
			padding-inline: 5px;
			cursor: pointer;

			&:active .blueskyTabIcon {
				--gradient: url('#tabIconActiveGradient');
			}

			@media (scripting: none) {
				display: none;
			}
		}

		.blueskySidebar {
			grid-area: 'sidebar';
			padding: var(--spacing);
			display: flex;
			flex-direction: column;
			gap: var(--spacing);
			background-color: #4f5153;
			border-right: 1px solid black;
		}

		.blueskyTabContainer {
			position: relative;
			display: flex;
			flex-flow: column;
			gap: 1px;
			border: 1px solid black;
			border-radius: 5px;
			background-color: black;
			box-shadow: 0 1px 1px 0 #6d6f71;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				height: 100%;
				width: 100%;
				border-radius: 4px;
				border-top: 1px solid #2f3132;
				pointer-events: none;
			}
		}

		.blueskyTab {
			all: unset;
			display: grid;
			grid-template: 'indicator icon' 44px / 5px 1fr;
			gap: 1px;

			/* indicator */

			&::after {
				grid-area: indicator;
				content: '';
				background: #4c4f51;
				border-top: 1px solid #5e6163;
				border-right: 1px solid #5e6163;
			}

			&.highlighted::after {
				background: linear-gradient(to right, #2182db, #3793e7);
				border-top: none;
				border-right-color: #48b8f7;
				isolation: isolate;
			}

			&.highlighted::before {
				grid-area: indicator;
				content: '';
				background-color: #3793e7;
				scale: 1.75 1.25;
				filter: blur(4px);
			}
		}

		.blueskyTabIconWrapper {
			--background: #3d3f41;
			grid-area: icon;
			display: grid;
			justify-content: center;
			align-items: center;
			border-top: 1px solid #515354;
			border-bottom: 1px solid transparent;
			background-color: var(--background);

			.blueskyTab.selected &,
			.blueskyTab:active & {
				--background: #242425;
				border-top-color: #1d1d1e;
			}
		}

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

			.blueskyTab.highlighted & {
				--gradient: url('#tabHighlightedIconGradient');
				filter: var(--outline-shadow) drop-shadow(0 0 5px #3793e7);

				&.lucide-list {
					stroke: #42a1f5;
				}
			}
		}

		.bluesky {
			grid-area: content;
			overflow-x: hidden;
			overflow-y: auto;
			color: #44484a;
		}

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

			.blueskySidebar & {
				--top-highlight: #a9adb1;
				height: auto;
				width: auto;
				aspect-ratio: 1 / 1;
				display: grid;
				place-items: center;
				border: 1px solid black;
				background-image: linear-gradient(to bottom, #92969a, #7b8084);
				box-shadow: 0 1px 1px 0 #6d6f71;

				&.highlighted {
					box-shadow: 0 0 5px 2px #3793e7;
				}

				&:active {
					--top-highlight: #2f3132;
					background-image: linear-gradient(to bottom, #3d3f41, #3d3f41);
				}

				&::after {
					border-radius: 4px;
					box-shadow: inset 0 1px 0 0 var(--top-highlight);
				}

				img {
					border: 1px solid black;
					border-radius: 3px;
				}
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

			> :global(circle) {
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
			&:focus-within & {
				--card-border-color: #7e8082;
				background: linear-gradient(to bottom, #e4e6ea, #caced0);
				border-color: var(--card-border-color);
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
			min-width: 0;
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

		.blueskyFooter {
			grid-area: footer;
			height: 25px;
			background-image: var(--titlebar-gradient);
			border-top: 1px solid black;

			.window.inactive & {
				background-image: linear-gradient(to bottom, #57585b 1px, #434447 1px, #3c3d3f);
			}
		}

		.blueskyGradientDefs {
			position: fixed;
			top: 100vh;
			left: 100vw;
		}
	}
</style>
