<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	let text = $state(
		`Welcome to fenny.zone! 🦊❤️

Click one of the folders in the dock at the bottom of the screen, or just poke around!

TO-DO:
- more content
- better mobile layout
- themes
- more functionality without JavaScript

Googly eyes shamelessly copied from Sindre Sorhus: https://sindresorhus.com/googly-eyes`
	);
</script>

<TextEdit bind:text />
