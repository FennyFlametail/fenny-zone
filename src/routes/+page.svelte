<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import * as apps from '$lib/apps';
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import type AppInstance from '$lib/types/AppInstance';
	import type AppMetadata from '$lib/types/AppMetadata';
	import { nanoid } from 'nanoid';
	import { onMount, tick, type Component } from 'svelte';

	// TODO move window management to own file
	let runningApps: AppInstance[] = $state([]);

	function openApp({ default: Component, ...metadata }: { default: Component } & AppMetadata) {
		runningApps.push({
			id: nanoid(),
			Component,
			metadata
		});

		tick().then(() => {
			updateQueryString();
			runningApps.at(-1)?.window?.focus();
		});
	}

	function closeApp(app: AppInstance) {
		runningApps.splice(runningApps.indexOf(app), 1);
		updateQueryString();
	}

	function resetApps() {
		runningApps.forEach((app) => app.window?.resetPosition());
	}

	onMount(() => {
		// open apps from query string on page load
		const url = new URL(page.url);
		const paramsApps = url.searchParams.get('apps') ?? '';

		const appsToOpen = paramsApps.split(',').map((name) => apps[name as keyof typeof apps]);
		appsToOpen.forEach((app) => app && openApp(app));
		tick().then(() => {
			resetApps();
			runningApps.at(-1)?.window?.focus();
		});
	});

	function updateQueryString() {
		const url = new URL(page.url);
		url.searchParams.set(
			'apps',
			runningApps
				.map((app) => {
					const index = Object.values(apps).findIndex((module) => module.default === app.Component);
					return Object.keys(apps)[index];
				})
				.join(',')
		);
		replaceState(url, {});
	}
</script>

<MenuBar />
<Desktop bind:apps={runningApps} {closeApp} />
<Dock {openApp} {resetApps} />
