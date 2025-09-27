<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	let text = $state(
		`Hi, I'm Fenny! Welcome to my dumb little corner of the internet 🦊❤️

This site is a work-in-progress, but feel free to poke around! You can find me elsewhere on the web at the links on the right.

(Hint: the folders at the bottom of the screen are clickable. To open icons on the desktop or in folders, double-click.)

TO-DO:
- more content
- better mobile layout
- themes

Googly eyes inspired by Sindre Sorhus: https://sindresorhus.com/googly-eyes`
	);
</script>

<TextEdit bind:text />
