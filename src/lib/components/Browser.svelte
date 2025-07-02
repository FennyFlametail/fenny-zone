<script lang="ts">
	import { dragging, resizing } from '$lib/components/Window.svelte';
	import type RunningApp from '$lib/types/RunningApp';
	import { focusApp } from '$lib/windowServer.svelte';
	import { getContext } from 'svelte';

	const app: RunningApp = getContext('app');
	let { src }: { src: string } = $props();
</script>

<iframe {src} title={app?.metadata.title}></iframe>
<div
	class={[
		'cover',
		{
			solid: dragging.el || resizing.el || !app?.window?.isFocused(),
			visible: !app?.window?.isFocused()
		}
	]}
	onclick={() => focusApp(app!)}
	aria-hidden="true"
></div>

<style>
	iframe {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	.cover {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transition: background-color 0.2s;
		pointer-events: none;

		&.solid {
			pointer-events: auto;
		}

		&.visible {
			background-color: rgb(0 0 0 / 50%);
		}
	}
</style>
