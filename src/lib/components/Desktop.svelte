<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { getDesktopPicture } from '$lib/helpers/desktopPicture.svelte';
	import FuraffinityIcon from '$lib/images/icons/furaffinity.webp';
	import HltbIcon from '$lib/images/icons/hltb.webp';
	import TelegramIcon from '$lib/images/icons/telegram.webp';
	import { onMount } from 'svelte';

	const windowServer = getWindowServerContext();

	const desktopPicture = $derived(await getDesktopPicture(windowServer));

	let loading = $state(true);
	onMount(async () => (loading = false));

	let element = $state<HTMLElement>();

	function onfocusin() {
		if (element?.matches(':focus-within')) {
			windowServer.desktopFocused = true;
		}
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
<svelte:window {onfocusin} />

<nav
	bind:this={element}
	class={['desktop', { loading }]}
	style:--desktop-image="url('{desktopPicture.src}')"
	aria-label="Desktop"
>
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

	.desktopColumn {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap-reverse;
	}
</style>
