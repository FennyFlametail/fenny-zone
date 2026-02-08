import type { PageServerLoad } from './$types';
import fetchBlueskyData from '$lib/helpers/fetchBlueskyData.server';

export const load: PageServerLoad = async ({ fetch }) => {
	return { bluesky: await fetchBlueskyData(fetch) };
};
