<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';

	const { app } = getAppContext('TextEdit');

	const {
		children,
		monospace
	}: {
		children: Snippet;
		monospace?: boolean;
	} = $props();

	let element = $state<HTMLDivElement>();

	const oninput = () => {
		app.instance.saveData = new Blob([element!.innerHTML], {
			type: 'text/html'
		});
	};
	const onbeforeunload = (e: BeforeUnloadEvent) => {
		if (app.instance.saveData) e.preventDefault();
	};
</script>

<div
	bind:this={element}
	class={['textEdit', { monospace }]}
	contenteditable="true"
	role="textbox"
	{oninput}
>
	{@render children()}
</div>
<svelte:window {onbeforeunload} />

<style>
	.textEdit {
		background-color: white;
		outline: none;
		padding: 0 0.5em;
		font-size: 10pt;
		overflow-y: auto;

		> :global(pre) {
			text-wrap: stable;
		}

		&.monospace > :global(pre) {
			font-family: 'Monaco', 'Courier New', monospace;

			@media not (prefers-contrast: more) {
				-webkit-font-smoothing: none;
				-moz-osx-font-smoothing: grayscale;
			}
		}
	}
</style>
