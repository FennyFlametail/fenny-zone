<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Desktop from '$lib/components/Desktop.svelte';
	import type AppInstance from '$lib/types/AppInstance';
	import type AppMetadata from '$lib/types/AppMetadata';
	import { nanoid } from 'nanoid';
	import { tick, untrack, type Component } from 'svelte';

	import * as App1 from './app-1/+page.svelte';
	import * as App2 from './app-2/+page.svelte';
	const allApps = [App1, App2];

	let apps: AppInstance[] = $state([]);

	function openApp({ default: Component, ...metadata }: { default: Component } & AppMetadata) {
		apps.push({
			id: nanoid(),
			Component,
			metadata
		});
	}

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
			tick().then(() => {
				resetApps();
				apps.at(-1)?.window?.focus();
			});
		} else {
			// update query string when apps are opened and closed
			url.searchParams.set('apps', apps.map((app) => app.metadata.name).join(','));
			try {
				replaceState(url, {});
			} catch {}
		}
		initComplete = true;
	});

	function resetApps() {
		apps.forEach((app) => app.window?.resetPosition());
	}
</script>

<!-- TODO move to own component -->
<header class="menubar">
	<details class="menuWrapper" name="menubar">
		<summary class="menuName">Menu 1</summary>
		<menu class="menu">
			<li class="menuItem">
				<button>Menu Item Button</button>
			</li>
			<li class="menuItem">
				<a class="menuItem" href="/">Menu Item Link</a>
			</li>
		</menu>
	</details>
	<details class="menuWrapper" name="menubar">
		<summary class="menuName">Menu 2</summary>
		<menu class="menu">
			<li class="menuItem">
				<button>Menu Item Button</button>
			</li>
			<li class="menuItem">
				<a class="menuItem" href="/">Menu Item Link</a>
			</li>
		</menu>
	</details>
</header>
<Desktop bind:apps {closeApp} />
<!-- TODO move to own component -->
<footer class="dock">
	<button class="ui" onclick={() => openApp(App1)}>Open App1</button>
	<button class="ui" onclick={() => openApp(App2)}>Open App2</button>
	<button class="ui primary" onclick={resetApps}>Reset App Positions</button>
</footer>
