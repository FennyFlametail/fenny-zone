<script lang="ts">
	import { page } from '$app/state';
	import getApps, { type AppName } from '$lib/apps.svelte';
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowLayer from '$lib/components/WindowLayer.svelte';
	import { setWindowServerContext } from '$lib/context.svelte';
	import '$lib/styles/app.css';
	import '$lib/styles/Aqua.css';
	import WindowServer from '$lib/windowServer.svelte';

	const { children } = $props();

	const windowServer = new WindowServer();
	setWindowServerContext(windowServer);

	if (page.route.id !== '/') {
		const apps = getApps();
		const appName = (Object.keys(apps) as AppName[]).find(
			(appName) => apps[appName].route === page.route.id
		)!;
		windowServer.initialAppName = appName;
	}
</script>

<MenuBar />
<Desktop />
<WindowLayer />
<Dock />
{@render children()}
