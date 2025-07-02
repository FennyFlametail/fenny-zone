<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import type { Component } from 'svelte';
	import App1 from './app-1/+page.svelte';
	import App2 from './app-2/+page.svelte';

	const apps: Component[] = $state([]);
	let desktopRef: Desktop;
</script>

<header class="menubar">
	<button onclick={() => apps.push(App1)}>Open App1</button>
	<button onclick={() => apps.push(App2)}>Open App2</button>
	<button onclick={() => desktopRef.resetApps()}>Reset App Positions</button>
</header>
<Desktop bind:this={desktopRef} {apps} />
<footer class="dock">Dock goes here</footer>

<style>
	.menubar,
	.dock {
		background-color: lightgreen;
	}
</style>
