<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { desktopPictures } from '$lib/data/desktopPictures';
	import FuraffinityIcon from '$lib/images/icons/furaffinity.webp';
	import HltbIcon from '$lib/images/icons/hltb.webp';
	import TelegramIcon from '$lib/images/icons/telegram.webp';
	import { onMount } from 'svelte';

	const windowServer = getWindowServerContext();

	let loading = $state(true);

	const desktopPicture = $derived(desktopPictures[windowServer.preferences.desktopPicture]);
	const desktopColor = $derived(loading ? null : desktopPicture.fallbackColor);

	onMount(async () => (loading = false));

	function onclick() {
		windowServer.desktopFocused = true;
	}
</script>

<svelte:head>
	<script>
		document.documentElement.style.setProperty(
			'--desktop-color',
			localStorage.getItem('desktopColor')
		);
	</script>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<nav
	class={['desktop', { loading }]}
	style:--desktop-color={desktopColor}
	style:--desktop-image="url('{desktopPicture.src}')"
	aria-label="Desktop"
	{onclick}
>
	<button class="desktopFocusButton" aria-label="Focus Desktop" {onclick}></button>
	<div class="desktopColumn">
		<FileIcon appName="readme" label="red" />
		<FileIcon appName="changelog" />
	</div>
	<div class="desktopColumn">
		<FileIcon appName="bluesky" />
		<FileIcon
			name="FurAffinity"
			icon={FuraffinityIcon}
			href="https://www.furaffinity.net/user/fuzzyfennekin"
		/>
		<FileIcon name="Telegram" icon={TelegramIcon} href="https://t.me/FennyFlametail" />
		<FileIcon
			name="HowLongToBeat"
			icon={HltbIcon}
			href="https://howlongtobeat.com/user/FennyFlametail/"
		/>
	</div>
</nav>

<style>
	.desktop {
		grid-area: desktop;
		display: flex;
		justify-content: space-between;
		background-color: var(--desktop-color);
		background-size: cover;
		background-position: 50% 25%;

		&:not(.loading) {
			background-image: var(--desktop-image);
		}
		@media (scripting: none) {
			background-image: var(--desktop-image);
		}

		@media (forced-colors: active) {
			background-image: none;
		}
	}

	.desktopFocusButton {
		all: unset;
		box-sizing: border-box;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: calc(100% - var(--menubar-height));

		&:focus-visible {
			border: 7.5px solid var(--accent-color);
		}
	}

	.desktopColumn {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap-reverse;
	}
</style>
