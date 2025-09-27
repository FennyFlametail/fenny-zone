<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { getWindowServerContext } from '$lib/context';
	import setupFileIconContainer from '$lib/fileIconContainer.svelte';

	const windowServer = getWindowServerContext();
	const { onClickIconContainer } = setupFileIconContainer(true);

	function onclick(e: MouseEvent) {
		windowServer.focusDesktop();
		onClickIconContainer(e);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="desktop" {onclick}>
	<FileIcon appName="readme" />
	<FileIcon name="Bluesky" icon="/icons/bluesky.png" href="https://bsky.app/profile/fenny.zone" />
	<FileIcon
		name="FurAffinity"
		icon="/icons/furaffinity.png"
		href="https://www.furaffinity.net/user/fuzzyfennekin"
	/>
	<FileIcon name="Telegram" icon="/icons/telegram.png" href="https://t.me/FennyFlametail" />
	<FileIcon
		name="HowLongToBeat"
		icon="/icons/hltb.png"
		href="https://howlongtobeat.com/user/FennyFlametail/"
	/>
</div>

<style>
	.desktop {
		grid-area: desktop;
		background-color: gray;
		background-size: cover;
		background-position: top center;
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(auto-fill, 116px);
		justify-content: start;
		direction: rtl;

		> :global(*) {
			direction: ltr;
		}
	}
</style>
