<script lang="ts">
	import { page } from '$app/state';
	import type { AppName } from '$lib/apps.svelte';
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowLayer from '$lib/components/WindowLayer.svelte';
	import { apps } from '$lib/windowServer.svelte';

	let initialApp: AppName | undefined = $state();
	if (page.params.path) {
		initialApp = (Object.keys(apps) as AppName[]).find((appName) => {
			const app = apps[appName];
			return app.route === '/'.concat(page.params.path);
		});
	}
</script>

<MenuBar />
<Desktop />
<WindowLayer {initialApp} />
<Dock />
