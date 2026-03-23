import { getRequestEvent, query } from '$app/server';
import getHandleRegex from '$lib/helpers/blueskyHandleRegex';
import fetchBlueskyData from '$lib/helpers/fetchBlueskyData.server';
import * as v from 'valibot';

export const getBlueskyData = query(
	v.optional(
		v.pipe(
			v.string(),
			v.transform((str) => str.replace('@', '')),
			/* this is the same regex the valibot domain() validator will use when it's released */
			v.regex(getHandleRegex())
		)
	),
	async (handle) => {
		const { fetch } = getRequestEvent();

		const startTime = Date.now();
		const result = await fetchBlueskyData(fetch, handle);
		const elapsedTime = Date.now() - startTime;

		if (elapsedTime < 500) {
			await new Promise((resolve) => setTimeout(resolve, 500 - elapsedTime));
		}
		return result;
	}
);
