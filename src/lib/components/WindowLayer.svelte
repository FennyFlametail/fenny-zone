<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { AppName } from '$lib/apps.svelte';
	import Window from '$lib/components/Window.svelte';
	import { getWindowServerContext } from '$lib/context';
	import { onMount } from 'svelte';

	const { initialApp }: { initialApp?: AppName } = $props();

	const windowServer = getWindowServerContext();

	onMount(() => {
		if (initialApp) {
			windowServer.openApp(initialApp);
			windowServer.saveState();
			if (!dev) {
				goto('/', {
					replaceState: true
				});
			}
		} else {
			windowServer.loadState();
		}
	});

	function onpointerup() {
		setTimeout(() => windowServer.saveState(), 100);
	}
</script>

<main class={['windowLayer', (windowServer.dragging.el || windowServer.resizing.el) && 'noSelect']}>
	{#each Object.entries(windowServer.runningApps) as [appName, app], i (appName)}
		<Window bind:this={app.instance.window} appName={appName as AppName} {app} />
	{/each}
	<noscript>
		{#if initialApp}
			<Window appName={initialApp} app={windowServer.openApp(initialApp)} />
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
