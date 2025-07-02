<script module lang="ts">
	export const title = 'Browser';
</script>

<script lang="ts">
	import { dragging, resizing } from '$lib/components/Window.svelte';
	import type RunningApp from '$lib/types/RunningApp';
	import { focusApp } from '$lib/windowServer.svelte';

	let { _app, src }: { _app?: RunningApp; src: string } = $props();

	let iframe: HTMLIFrameElement;

	function stopMoveAndDrag() {
		if (_app?.window?.isFocused()) {
			dragging.el = undefined;
			resizing.el = undefined;
		}
	}

	function iframeClickFocus() {
		window.requestAnimationFrame(() => {
			if (document.activeElement === iframe) {
				focusApp(_app!);
			}
		});
	}
</script>

<iframe bind:this={iframe} onpointerover={stopMoveAndDrag} {src} title={_app?.metadata.title}
></iframe>

<svelte:window onblur={iframeClickFocus} />

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
