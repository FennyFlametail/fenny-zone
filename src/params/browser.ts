import apps from '$lib/apps.svelte';
import type { AppName } from '$lib/types/AppTypes';
import type { ParamMatcher } from '@sveltejs/kit';

const browserRoutes = Object.entries(apps)
	.filter(([, metadata]) => metadata.url)
	.map(([route]) => route as AppName);

export const match = ((param: string): param is (typeof browserRoutes)[number] => {
	return (browserRoutes as string[]).includes(param);
}) satisfies ParamMatcher;
