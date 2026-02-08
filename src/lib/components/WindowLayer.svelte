<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { AppName } from '$lib/apps.svelte';
	import Window from '$lib/components/Window.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { onMount } from 'svelte';

	const windowServer = getWindowServerContext();

	onMount(() => {
		windowServer.loadState();
		if (windowServer.initialAppName) {
			windowServer.openApp(windowServer.initialAppName);
			// FIXME re-enable
			// goto('/');
		}
		setTimeout(() => document.body.classList.remove('loading'), 500);
	});

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') windowServer.closeCurrent();
	}

	function onpointerup() {
		setTimeout(() => windowServer.saveState(), 100);
	}
</script>

<main class={['windowLayer', (windowServer.draggingEl || windowServer.resizingEl) && 'noSelect']}>
	{#each Object.keys(windowServer.runningApps) as AppName[] as appName, i (appName)}
		<Window {appName} />
	{/each}
	{#if !browser && windowServer.initialAppName}
		<Window appName={windowServer.initialAppName} />
	{/if}
</main>

<svelte:body {onkeydown} {onpointerup} />

<style>
	.windowLayer {
		grid-area: desktop;
		position: relative;
		display: grid;
		pointer-events: none; /* allow clicks to fall through to the desktop */

		> :global(*) {
			pointer-events: auto;
		}
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}

	noscript {
		display: none;

		@media (scripting: none) {
			display: contents;
		}
	}
</style>
