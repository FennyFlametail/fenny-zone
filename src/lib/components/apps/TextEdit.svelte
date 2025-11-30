<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';

	const { app } = getAppContext();
	let { text = $bindable('') }: { text: string } = $props();

	const initialText = text;
	$effect(() => {
		app.instance!.modified = text !== initialText;
	});
</script>

<textarea class="textEdit" bind:value={text}></textarea>

<style>
	.textEdit {
		display: block;
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
		resize: none;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 10pt;
		padding-inline: 0.5em;
		-webkit-font-smoothing: none;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
