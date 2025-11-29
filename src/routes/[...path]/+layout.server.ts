import getApps, { type AppEntry, type AppName } from '$lib/apps.svelte';
import { redirect, type LoadEvent } from '@sveltejs/kit';

export function load({ params }: LoadEvent) {
	if (params.path) {
		const apps = getApps();
		const initialAppName = (Object.keys(apps) as AppName[]).find((appName) => {
			const app: AppEntry | undefined = apps[appName];
			return app?.route === '/'.concat(params.path!);
		});
		if (!initialAppName) redirect(307, '/');
		return { initialAppName };
	}
}
