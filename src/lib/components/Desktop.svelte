<script lang="ts">
	import '$lib/app.scss';
	import Window, { dragging } from '$lib/components/Window.svelte';
	import type { Component } from 'svelte';

	const { apps }: { apps: Component[] } = $props();
	const windowRefs: Window[] = [];

	export function resetApps() {
		windowRefs.forEach((ref) => ref.resetPosition());
	}
</script>

<main class={['desktop', dragging.el && 'noSelect']}>
	{#each apps as App, i}
		<Window bind:this={windowRefs[i]} {App} />
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
