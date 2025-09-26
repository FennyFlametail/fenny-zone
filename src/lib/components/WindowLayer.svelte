<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { AppName } from '$lib/apps.svelte';
	import Window from '$lib/components/Window.svelte';
	import {
		dragging,
		getRunningApps,
		loadState,
		openApp,
		resizing,
		saveState
	} from '$lib/windowServer.svelte';
	import { onMount } from 'svelte';

	const { initialApp }: { initialApp?: AppName } = $props();

	const runningApps = $derived(getRunningApps());

	onMount(() => {
		if (initialApp) {
			openApp(initialApp);
			saveState();
			if (!dev) {
				goto('/', {
					replaceState: true
				});
			}
		} else {
			loadState();
		}
	});

	function onpointerup() {
		setTimeout(() => saveState(), 100);
	}
</script>

<main class={['windowLayer', (dragging.el || resizing.el) && 'noSelect']}>
	{#each Object.entries(runningApps) as [appName, app], i (appName)}
		<Window bind:this={app.instance.window} appName={appName as AppName} {app} />
	{/each}
	<noscript>
		{#if initialApp}
			<Window appName={initialApp} app={openApp(initialApp)} />
		{/if}
	</noscript>
</main>

<svelte:body {onpointerup} />

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
