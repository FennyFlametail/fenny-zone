<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import Window from '$lib/components/Window.svelte';
	import { dragging, getRunningApps, resizing, saveState } from '$lib/windowServer.svelte';

	const runningApps = $derived(getRunningApps());

	function onpointerup() {
		setTimeout(() => saveState(), 100);
	}
</script>

<main class={['windowLayer', (dragging.el || resizing.el) && 'noSelect']}>
	{#each Object.entries(runningApps) as [appName, app], i (appName)}
		<Window bind:this={app.instance.window} appName={appName as AppName} {app} />
	{/each}
</main>

<svelte:body {onpointerup} />

<style>
	.windowLayer {
		grid-area: desktop;
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
</style>
