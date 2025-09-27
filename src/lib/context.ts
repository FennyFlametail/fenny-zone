import type { AppName, RunningApp } from '$lib/apps.svelte';
import type WindowServer from '$lib/windowServer.svelte';
import { getContext, setContext } from 'svelte';

const windowServerContextKey = {};
export function setWindowServerContext(windowServer: WindowServer) {
	setContext(windowServerContextKey, windowServer);
}
export function getWindowServerContext() {
	return getContext(windowServerContextKey) as WindowServer;
}

const appContextKey = {};
export function setAppContext(appName: AppName, app: RunningApp) {
	setContext(appContextKey, { appName, app });
}
export function getAppContext() {
	return getContext(appContextKey) as { appName: AppName; app: RunningApp };
}

const fileIconContextKey = {};
export function setFileIconContext(
	getSelectedIcon: () => symbol | undefined,
	setSelectedIcon: (identifier: symbol) => void,
	isDesktop: boolean
) {
	setContext(fileIconContextKey, { getSelectedIcon, setSelectedIcon, isDesktop });
}
export function getFileIconContext() {
	return getContext(fileIconContextKey) as {
		getSelectedIcon: () => symbol | undefined;
		setSelectedIcon: (identifier: symbol) => void;
		isDesktop: boolean;
	};
}

const menubarContextKey = {};
export function setMenubarContext(dismissMenu: () => void) {
	setContext(menubarContextKey, { dismissMenu });
}
export function getMenubarContext() {
	return getContext(menubarContextKey) as { dismissMenu: () => void };
}
