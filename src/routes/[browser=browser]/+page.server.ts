import apps from '$lib/apps.svelte';
import type { AppName } from '$lib/types/AppTypes';
import { error, redirect, type LoadEvent } from '@sveltejs/kit';

export function load({ route, params }: LoadEvent) {
	const metadata = apps[params.browser as AppName];
	if (!metadata) return error(500);
	if (route.id !== '/') redirect(308, metadata.url!);
}
