<script module lang="ts">
	export const desktopPadding = 25;
</script>

<script lang="ts">
	import Window, { dragging, resizing, unfocus } from '$lib/components/Window.svelte';
	import { runningApps } from '$lib/windowServer.svelte';

	function onclick(e: MouseEvent) {
		if (e.target === e.currentTarget) unfocus();
	}
</script>

<!-- this is purely cosmetic for now, so not worried about accessibility -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class={['desktop', (dragging.el || resizing.el) && 'noSelect']}
	style:padding={desktopPadding + 'px'}
	{onclick}
>
	{#each runningApps as app, i (app.id)}
		<Window bind:this={app.window} {app} index={i} />
	{/each}
</main>

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
