<script lang="ts">
	import FileIcon from '$lib/components/FileIcon.svelte';
	import StylishIcon from '$lib/images/icons/stylish.svg';
	import XcodeIcon from '$lib/images/icons/xcode.webp';
</script>

<FileIcon appName="toddspin" />
<FileIcon appName="sauce" />
<FileIcon appName="goat" />
<!-- FIXME link Better Bluesky -->
<FileIcon name="GitHub" icon={XcodeIcon} href="https://github.com/FennyFlametail/" />
<FileIcon
	name="Userstyles"
	icon={StylishIcon}
	href="https://userstyles.world/user/FennyFlametail"
/>
