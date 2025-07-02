<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	let text = $state(
		`Welcome to fenny.zone! 🦊❤️ This site is a work-in-progress, but feel free to poke around!

TO-DO:
- more content
- better mobile layout
- themes
- more functionality without JavaScript

Googly eyes shamelessly copied from Sindre Sorhus: https://sindresorhus.com/googly-eyes`
	);
</script>

<TextEdit bind:text />
