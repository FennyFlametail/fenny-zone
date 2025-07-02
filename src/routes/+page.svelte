<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import type AppInstance from '$lib/types/AppInstance';
	import type { Component } from 'svelte';
	import App1 from './app-1/+page.svelte';
	import App2 from './app-2/+page.svelte';

	let apps: AppInstance[] = $state([]);

	function openApp(component: Component) {
		apps.push({
			App: component
		});
	}

	// FIXME closing windows makes the other windows move
	function closeApp(app: AppInstance) {
		apps.splice(apps.indexOf(app), 1);
	}

	function resetApps() {
		apps.forEach((app) => app.window?.resetPosition());
	}
</script>

<header class="menubar">
	<button onclick={() => openApp(App1)}>Open App1</button>
	<button onclick={() => openApp(App2)}>Open App2</button>
	<button onclick={() => resetApps()}>Reset App Positions</button>
</header>
<Desktop bind:apps {closeApp} />
<footer class="dock">Dock goes here</footer>

<style>
	.menubar,
	.dock {
		background-color: lightgreen;
	}
</style>
