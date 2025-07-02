<script lang="ts">
	import Finder from '$lib/components/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { openApp } from '$lib/components/WindowServer.svelte';
</script>

<Finder>
	<FileIcon name="Toddspin" icon="icons/toddspin.png" onopen={() => openApp('toddspin')} />
	<FileIcon name="Sauce" icon="icons/sauce.png" onopen={() => openApp('sauce')} />
	<FileIcon name="Goat Game" icon="icons/goat.png" onopen={() => openApp('goat')} />
	<FileIcon
		name="Better Bluesky"
		icon="icons/stylus.png"
		href="https://userstyles.world/style/11956/better-bluesky"
	/>
</Finder>
