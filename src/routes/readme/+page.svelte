<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	let text = $state(
		`Welcome to fenny.zone! 🦊❤️

Click one of the folders in the dock at the bottom of the screen, or just poke around!

This site is a work in progress! Planned features include:
- more content
- themes
- a better mobile layout
- support for most functionality without JavaScript

It'll be done when it's done™`
	);
</script>

<TextEdit bind:text />
