<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import setupFileIconContainer from '$lib/helpers/fileIconContainer.svelte';
	import BlueskyIcon from '$lib/images/icons/bluesky.webp';
	import FuraffinityIcon from '$lib/images/icons/furaffinity.webp';
	import HltbIcon from '$lib/images/icons/hltb.webp';
	import TelegramIcon from '$lib/images/icons/telegram.webp';

	const windowServer = getWindowServerContext();
	const { onClickIconContainer } = setupFileIconContainer(true);

	function onclick(e: MouseEvent) {
		windowServer.desktopFocused = true;
		onClickIconContainer(e);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="desktop" {onclick}>
	<div class="desktopColumn">
		<FileIcon appName="readme" label="red" />
		<FileIcon appName="changelog" />
	</div>
	<div class="desktopColumn">
		<FileIcon name="Bluesky" icon={BlueskyIcon} href="https://bsky.app/profile/fenny.zone" />
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
</div>

<style>
	.desktop {
		grid-area: desktop;
		display: flex;
		justify-content: space-between;
		background-color: var(--desktop-color);
		background-size: cover;
		background-position: top center;
	}
	.desktopColumn {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap-reverse;
	}
</style>
