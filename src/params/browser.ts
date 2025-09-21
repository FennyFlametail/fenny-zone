import apps, { type AppName } from '$lib/apps.svelte';
import type { ParamMatcher } from '@sveltejs/kit';

const browserRoutes: string[] = Object.entries(apps)
	.filter(([, metadata]) => metadata.url)
	.map(([route]) => route as AppName);

export const match = ((param: string) => {
	return browserRoutes.includes(param);
}) satisfies ParamMatcher;
