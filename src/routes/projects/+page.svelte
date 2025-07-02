<script lang="ts">
	import Finder from '$lib/components/apps/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { openApp } from '$lib/components/WindowServer.svelte';
</script>

<Finder>
	<FileIcon appName="toddspin" />
	<FileIcon appName="sauce" />
	<FileIcon appName="goat" />
	<FileIcon
		name="Better Bluesky"
		icon="icons/stylus.png"
		href="https://userstyles.world/style/11956/better-bluesky"
	/>
</Finder>
