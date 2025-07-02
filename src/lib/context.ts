import type { AppEntry, AppName } from '$lib/types/AppTypes';
import { getContext, setContext } from 'svelte';

const appContextKey = {};
export function setAppContext(appName: AppName, app: AppEntry) {
	setContext(appContextKey, { appName, app });
}
export function getAppContext() {
	return getContext(appContextKey) as { appName: AppName; app: AppEntry };
}

const fileIconContextKey = {};
export function setFileIconContext(
	getSelected: () => string | undefined,
	onselect: (name: string) => void
) {
	setContext(fileIconContextKey, { getSelected, onselect });
}
export function getFileIconContext() {
	return getContext(fileIconContextKey) as {
		getSelected: () => string | undefined;
		onselect: (name: string) => void;
	};
}
