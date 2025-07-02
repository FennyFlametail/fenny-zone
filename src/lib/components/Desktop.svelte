<script lang="ts">
	import Window, { dragging, resizing } from '$lib/components/Window.svelte';
	import type AppInstance from '$lib/types/AppInstance';

	const {
		apps = $bindable(),
		closeApp
	}: { apps: AppInstance[]; closeApp: (app: AppInstance) => void } = $props();
</script>

<main class={['desktop', (dragging.el || resizing.el) && 'noSelect']}>
	{#each apps as app, i (app.id)}
		<Window bind:this={app.window} {app} index={i} close={() => closeApp(app)} />
	{/each}
</main>

<style>
	.desktop {
		padding: 25px;
		display: grid;
		flex-grow: 1;
		background-color: lightskyblue;
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
