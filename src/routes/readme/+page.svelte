<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	let text = $state(
		`Hi, I'm Fenny! Welcome to my dumb little corner of the internet 🦊❤️

This site is a work-in-progress, but feel free to poke around! You can find me at the links on the right.

TO-DO:
- more content
- better mobile layout
- themes
- more functionality without JavaScript

Googly eyes inspired by Sindre Sorhus: https://sindresorhus.com/googly-eyes`
	);
</script>

<TextEdit bind:text />
