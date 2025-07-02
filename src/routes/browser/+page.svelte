<script module lang="ts">
	export const title = 'Browser';
</script>

<script lang="ts">
	import { dragging, resizing } from '$lib/components/Window.svelte';
	import type RunningApp from '$lib/types/RunningApp';

	let { src, title, _app }: { src: string; title: string; _app?: RunningApp } = $props();

	let iframe: HTMLIFrameElement;

	$effect(() => _app?.setTitle(title));

	function stopMoveAndDrag() {
		if (_app?.window?.isFocused()) {
			dragging.el = undefined;
			resizing.el = undefined;
		}
	}

	function iframeClickFocus() {
		window.requestAnimationFrame(() => {
			if (document.activeElement === iframe) {
				_app?.window?.focus();
			}
		});
	}
</script>

<iframe bind:this={iframe} onpointerover={stopMoveAndDrag} {src} {title}></iframe>

<svelte:window onblur={iframeClickFocus} />

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
