<script module lang="ts">
	export const desktopPadding = 25;
</script>

<script lang="ts">
	import Window, { dragging, resizing } from '$lib/components/Window.svelte';
	import type { AppName } from '$lib/types/AppTypes';
	import { getRunningApps, updateQueryString } from '$lib/windowServer.svelte';

	const runningApps = $derived(getRunningApps());

	// TODO this fixes windowServer.resetApps, find out why
	$inspect(runningApps).with(() => {});

	function onpointerup() {
		setTimeout(() => updateQueryString(), 100);
	}
</script>

<main
	class={['desktop', (dragging.el || resizing.el) && 'noSelect']}
	style:padding={desktopPadding + 'px'}
>
	{#each Object.entries(runningApps) as [appName, app], i (appName)}
		<Window bind:this={app.instance.window} appName={appName as AppName} {app} />
	{/each}
</main>

<svelte:body {onpointerup} />

<style>
	.desktop {
		flex: 1 1 auto;
		min-height: 0;
		display: grid;
		background: gray;
		background-size: cover;
		background-position: top center;
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
