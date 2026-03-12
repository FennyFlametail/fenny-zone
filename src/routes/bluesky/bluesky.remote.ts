import { getRequestEvent, query } from '$app/server';
import fetchBlueskyData from '$lib/helpers/fetchBlueskyData.server';
import { optional, pipe, regex, string, transform } from 'valibot';

export const getBlueskyData = query(
	optional(
		pipe(
			string(),
			transform((str) => str.replace('@', '')),
			/* this is the same regex the valibot domain() validator will use when it's released */
			regex(/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i)
		)
	),
	async (userHandle?: string) => {
		const { fetch } = getRequestEvent();
		return await fetchBlueskyData(fetch, userHandle);
	}
);
