import { getRequestEvent, query } from '$app/server';
import fetchBlueskyData from '$lib/helpers/fetchBlueskyData.server';

export const getBlueskyData = query(async () => {
	const { fetch } = getRequestEvent();
	return await fetchBlueskyData(fetch);
});
