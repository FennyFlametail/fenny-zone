<script lang="ts">
	import '$lib/app.scss';
	import Window, { dragging } from '$lib/components/Window.svelte';
	import type AppInstance from '$lib/types/AppInstance';

	const {
		apps = $bindable(),
		closeApp
	}: { apps: AppInstance[]; closeApp: (app: AppInstance) => void } = $props();
</script>

<main class={['desktop', dragging.el && 'noSelect']}>
	{#each apps as app, i}
		<Window bind:this={app.window} bind:app={apps[i]} close={() => closeApp(app)} />
	{/each}
</main>

<style>
	.desktop {
		padding-inline: var(--pico-block-spacing-horizontal);
		/* TODO placement of newly opened windows could be handled better, probably with JavaScript */
		display: grid;
		grid-template-columns: repeat(auto-fill, 100px);
		grid-auto-rows: 100px;
		flex-grow: 1;
		background-color: lightskyblue;
	}

	.noSelect {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
