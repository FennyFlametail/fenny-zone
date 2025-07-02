<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Desktop from '$lib/components/Desktop.svelte';
	import type AppInstance from '$lib/types/AppInstance';
	import type AppMetadata from '$lib/types/AppMetadata';
	import { untrack, type Component } from 'svelte';

	import * as App1 from './app-1/+page.svelte';
	import * as App2 from './app-2/+page.svelte';
	const allApps = [App1, App2];

	let apps: AppInstance[] = $state([]);

	function openApp({ default: Component, ...metadata }: { default: Component } & AppMetadata) {
		apps.push({
			Component,
			metadata
		});
	}

	// FIXME closing windows makes the other windows move
	function closeApp(app: AppInstance) {
		apps.splice(apps.indexOf(app), 1);
	}

	let initComplete = $state(false);
	$effect(() => {
		const url = new URL(untrack(() => page.url));
		const paramsApps = url.searchParams.get('apps');
		if (!initComplete && paramsApps && !apps.length) {
			// open apps from query string on page load
			const appsToOpen = paramsApps
				.split(',')
				.map((name) => allApps.find((app) => app.name === name));
			appsToOpen.forEach((app) => app && openApp(app));
		} else {
			// update query string when apps are opened and closed
			url.searchParams.set('apps', apps.map((app) => app.metadata.name).join(','));
			replaceState(url, {});
		}
		initComplete = true;
	});

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
