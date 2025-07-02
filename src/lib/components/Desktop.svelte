<script module lang="ts">
	export const desktopPadding = 25;
</script>

<script lang="ts">
	import Window, { dragging, resizing } from '$lib/components/Window.svelte';
	import { runningApps, updateQueryString } from '$lib/windowServer.svelte';

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
	{#each runningApps as app, i (app.id)}
		<Window bind:this={app.window} {app} index={i} />
	{/each}
</main>

<svelte:body {onpointerup} />

<style>
	.desktop {
		flex: 1 1 auto;
		min-height: 0;
		display: grid;
		background-color: lightskyblue;
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
