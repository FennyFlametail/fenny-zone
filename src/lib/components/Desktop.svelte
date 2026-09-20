<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { getDesktopPicture } from '$lib/helpers/getDesktopPicture.svelte';
	import HltbIcon from '$lib/images/icons/hltb.webp';
	import iPhotoIcon from '$lib/images/icons/iphoto.webp';
	import NetNewsWireIcon from '$lib/images/icons/netnewswire.webp';
	import SteamIcon from '$lib/images/icons/steam.webp';
	import TelegramIcon from '$lib/images/icons/telegram.webp';
	import { onMount } from 'svelte';

	const windowServer = getWindowServerContext();
	const promise = $derived(getDesktopPicture(windowServer));

	let desktop = $state<HTMLElement>();

	function onfocusin() {
		if (desktop?.matches(':focus-within')) {
			windowServer.desktopFocused = true;
		}
	}
</script>

<svelte:head>
	<script>
		document.documentElement.style.setProperty(
			'--desktop-color',
			JSON.parse(localStorage.getItem('desktopColor'))
		);
	</script>
</svelte:head>
<svelte:window {onfocusin} />

{#await promise}
	<div class="desktopPicture"></div>
{:then desktopPicture}
	{#if desktopPicture.isVideo}
		<video class="desktopPicture" src={desktopPicture.src} autoplay loop muted aria-hidden="true"
		></video>
	{:else}
		<img
			class="desktopPicture"
			src={desktopPicture.src}
			alt=""
			aria-hidden="true"
			draggable="false"
		/>
	{/if}
{/await}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- don't need keyboard support because focusing a desktop icon focuses the desktop -->
<nav
	bind:this={desktop}
	class="desktop"
	aria-label="Desktop"
	onclick={() => (windowServer.desktopFocused = true)}
>
	<div class="desktopColumn">
		<FileIcon appName="readme" label="red" />
		<FileIcon appName="changelog" />
		<FileIcon name="RSS" icon={NetNewsWireIcon} href="https://www.fenny.zone/feed" />
	</div>
	<div class="desktopColumn">
		<FileIcon appName="bluesky" />
		<FileIcon
			name="FurAffinity"
			icon={iPhotoIcon}
			href="https://www.furaffinity.net/user/fuzzyfennekin"
		/>
		<FileIcon name="Telegram" icon={TelegramIcon} href="https://t.me/FennyFlametail" />
		<FileIcon name="Steam" icon={SteamIcon} href="https://steamcommunity.com/id/fennyflametail/" />
		<FileIcon
			name="HowLongToBeat"
			icon={HltbIcon}
			href="https://howlongtobeat.com/user/FennyFlametail/"
		/>
	</div>
</nav>

<style>
	.desktopPicture {
		grid-area: desktop / desktop / dock / dock;
		background-color: var(--desktop-color);
		object-fit: cover;
		object-position: 50% 25%;
		-webkit-user-select: none;
		user-select: none;
	}

	.desktop {
		grid-area: desktop;
		display: flex;
		justify-content: space-between;
		align-items: start;

		@media (scripting: none) {
			background-image: var(--default-desktop-image);
		}

		@media (forced-colors: active) {
			background-image: none;
		}
	}

	.desktopColumn {
		max-height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap-reverse;
	}
</style>
