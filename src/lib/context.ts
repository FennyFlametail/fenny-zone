import type { AppEntry, AppName } from '$lib/types/AppTypes';
import { getContext, setContext } from 'svelte';

const key = {};
export function setAppContext(appName: AppName, app: AppEntry) {
	setContext(key, { appName, app });
}

export function getAppContext() {
	return getContext(key) as { appName: AppName; app: AppEntry };
}
