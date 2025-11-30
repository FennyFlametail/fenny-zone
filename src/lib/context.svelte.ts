import type { AppName, RunningApp } from '$lib/apps.svelte';
import type WindowServer from '$lib/windowServer.svelte';
import { createContext, type Snippet } from 'svelte';

export const [getWindowServerContext, setWindowServerContext] = createContext<WindowServer>();

export const [getAppContext, setAppContext] = createContext<{
	appName: AppName;
	app: RunningApp;
}>();

export const [getToolbarContext, setToolbarContext] = createContext<{
	toolbar?: Snippet;
}>();

export const [getFileIconContext, setFileIconContext] = createContext<{
	getSelectedIcon: () => symbol | undefined;
	setSelectedIcon: (identifier: symbol) => void;
	isDesktop: boolean;
}>();

export const [getMenubarContext, setMenubarContext] = createContext<{
	dismissMenu: () => void;
}>();
