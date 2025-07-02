<script lang="ts">
	import Window, { dragging, resizing, unfocus } from '$lib/components/Window.svelte';
	import type AppInstance from '$lib/types/AppInstance';

	const {
		apps = $bindable(),
		closeApp
	}: { apps: AppInstance[]; closeApp: (app: AppInstance) => void } = $props();

	function onclick(e: MouseEvent) {
		if (e.target === e.currentTarget) unfocus();
	}
</script>

<!-- this is purely cosmetic for now, so not worried about accessibility -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main class={['desktop', (dragging.el || resizing.el) && 'noSelect']} {onclick}>
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
