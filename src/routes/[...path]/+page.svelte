<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowLayer from '$lib/components/WindowLayer.svelte';
	import { apps } from '$lib/windowServer.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let initialApp: AppName | undefined = $state();
	if (data.params.path) {
		initialApp = (Object.keys(apps) as AppName[]).find((appName) => {
			const app = apps[appName];
			return app.route === '/'.concat(data.params.path!);
		});
	}
</script>

<MenuBar />
<Desktop />
<WindowLayer {initialApp} />
<Dock />
