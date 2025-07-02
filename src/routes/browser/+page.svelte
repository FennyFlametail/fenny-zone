<script module lang="ts">
	export const title = 'Browser';
	export const icon = 'icons/safari.png';
</script>

<script lang="ts">
	import { dragging, resizing } from '$lib/components/Window.svelte';
	import type RunningApp from '$lib/types/RunningApp';
	import { focusApp } from '$lib/windowServer.svelte';

	let { _app, src = 'https://example.com' }: { _app?: RunningApp; src?: string } = $props();
</script>

<iframe {src} title={_app?.metadata.title}></iframe>
<div
	class={[
		'cover',
		{
			solid: dragging.el || resizing.el || !_app?.window?.isFocused(),
			visible: !_app?.window?.isFocused()
		}
	]}
	onclick={() => focusApp(_app!)}
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
