<script lang="ts">
	import { getAppContext } from '$lib/context';
	import { dragging, resizing } from '$lib/components/Window.svelte';
	import { focusApp, getFocusedApp } from '$lib/components/WindowServer.svelte';

	const { appName, app } = getAppContext();
	let { src }: { src: string } = $props();

	let isFocused = $derived(getFocusedApp() === app);
</script>

<iframe {src} title={app.title}></iframe>
<div
	class={[
		'cover',
		{
			solid: dragging.el || resizing.el || !isFocused,
			visible: !isFocused
		}
	]}
	onclick={() => focusApp(appName)}
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
