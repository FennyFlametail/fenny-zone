<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { getDesktopPicture } from '$lib/helpers/getDesktopPicture.svelte';
	import FuraffinityIcon from '$lib/images/icons/furaffinity.webp';
	import HltbIcon from '$lib/images/icons/hltb.webp';
	import TelegramIcon from '$lib/images/icons/telegram.webp';
	import { onMount } from 'svelte';

	const windowServer = getWindowServerContext();
	const promise = $derived(getDesktopPicture(windowServer));

	let loading = $state(true);
	onMount(() => (loading = false));

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
			localStorage.getItem('desktopColor')
		);
	</script>
</svelte:head>
<svelte:window {onfocusin} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- don't need keyboard support because focusing a desktop icon focuses the desktop -->
<nav
	bind:this={desktop}
	class={['desktop', { loading }]}
	aria-label="Desktop"
	onclick={() => (windowServer.desktopFocused = true)}
>
	{#await promise then desktopPicture}
		{#if desktopPicture.isVideo}
			<video
				class="desktopBackground"
				src={desktopPicture.src}
				autoplay
				loop
				muted
				aria-hidden="true"
			></video>
		{:else}
			<img
				class="desktopBackground"
				src={desktopPicture.src}
				alt=""
				aria-hidden="true"
				draggable="false"
			/>
		{/if}
	{/await}
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
		grid-area: desktop / desktop / dock;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: start;
		background-color: var(--desktop-color);
		background-size: cover;
		background-position: 50% 25%;

		@media (scripting: none) {
			background-image: var(--default-desktop-image);
		}

		@media (forced-colors: active) {
			background-image: none;
		}
	}

	.desktopBackground {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 25%;
		-webkit-user-select: none;
		user-select: none;

		.desktop.loading & {
			display: none;
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
