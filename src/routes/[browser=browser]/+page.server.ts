import getApps, { type AppName } from '$lib/apps.svelte';
import { error, redirect, type LoadEvent } from '@sveltejs/kit';

export function load({ route, params }: LoadEvent) {
	const metadata = getApps()[params.browser as AppName];
	if (!metadata) return error(500);
	if (route.id !== '/') redirect(308, metadata.url!);
}
