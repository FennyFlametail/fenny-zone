import type { LoadEvent } from '@sveltejs/kit';

export function load({ url, route, params }: LoadEvent) {
	return { url, route, params };
}
