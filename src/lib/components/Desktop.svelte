<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { focusDesktop, openApp } from '$lib/components/WindowServer.svelte';
	import setupFileIconContainer from '$lib/fileIconContainer.svelte';
	const { onClickIconContainer } = setupFileIconContainer(true);

	function onclick(e: MouseEvent) {
		focusDesktop();
		onClickIconContainer(e);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="desktop" {onclick}>
	<FileIcon name="Bluesky" icon="icons/finder.png" href="https://bsky.app/profile/fenny.zone" />
	<FileIcon name="Fenny" icon="icons/fenny.png" onopen={() => console.debug('Fenny')} />
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
