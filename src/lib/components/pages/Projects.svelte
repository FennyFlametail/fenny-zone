<script lang="ts">
	import Finder from '$lib/components/apps/Finder.svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
	import StylusIcon from '$lib/images/icons/stylus.png';
</script>

<Finder>
	<FileIcon appName="toddspin" />
	<FileIcon appName="sauce" />
	<FileIcon appName="goat" />
	<FileIcon
		name="Better Bluesky"
		icon={StylusIcon}
		href="https://userstyles.world/style/11956/better-bluesky"
	/>
</Finder>
