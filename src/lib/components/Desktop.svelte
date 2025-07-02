<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { openApp } from '$lib/components/WindowServer.svelte';
	import setupFileIconContainer from '$lib/fileIconContainer.svelte';
	const { onClickIconContainer } = setupFileIconContainer(true);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="desktop" onclick={onClickIconContainer}>
	<FileIcon name="Macintosh HD" icon="icons/textedit.png" onopen={() => openApp('readme')} />
	<FileIcon name="TextEdit" icon="icons/textedit.png" onopen={() => openApp('readme')} />
	<FileIcon name="Fenny" icon="icons/fenny.png" onopen={() => console.debug('Fenny')} />
	<FileIcon name="Aren" icon="icons/aren.png" onopen={() => console.debug('Aren')} />
	<FileIcon name="Ceph" icon="icons/ceph.png" onopen={() => console.debug('Ceph')} />
	<FileIcon name="Nocturne" icon="icons/nocturne.png" onopen={() => console.debug('Nocturne')} />
</div>

<style>
	.desktop {
		grid-area: desktop;
		background: gray;
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
