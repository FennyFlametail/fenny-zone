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
	getSelectedIcon: () => string | undefined,
	setSelectedIcon: (name: string) => void,
	isDesktop: boolean
) {
	setContext(fileIconContextKey, { getSelectedIcon, setSelectedIcon, isDesktop });
}
export function getFileIconContext() {
	return getContext(fileIconContextKey) as {
		getSelectedIcon: () => string | undefined;
		setSelectedIcon: (name: string) => void;
		isDesktop: boolean;
	};
}
