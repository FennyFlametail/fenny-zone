import { getRequestEvent, query } from '$app/server';
import getHandleRegex from '$lib/helpers/blueskyHandleRegex';
import fetchBlueskyData from '$lib/helpers/fetchBlueskyData.server';
import { optional, pipe, regex, string, transform } from 'valibot';

export const getBlueskyData = query(
	optional(
		pipe(
			string(),
			transform((str) => str.replace('@', '')),
			/* this is the same regex the valibot domain() validator will use when it's released */
			regex(getHandleRegex())
		)
	),
	async (userHandle?: string) => {
		const { fetch } = getRequestEvent();
		return await fetchBlueskyData(fetch, userHandle);
	}
);
