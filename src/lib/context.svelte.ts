import type { AppName, RunningApp } from '$lib/apps.svelte';
import type WindowServer from '$lib/windowServer.svelte';
import { createContext } from 'svelte';

export const [getWindowServerContext, setWindowServerContext] = createContext<WindowServer>();

const [getAppContextUntyped, setAppContext] = createContext<{
	appName: AppName;
	app: RunningApp;
}>();

const getAppContext = <Name extends AppName>() =>
	getAppContextUntyped() as {
		appName: Name;
		app: RunningApp<Name>;
	};
export { getAppContext, getAppContextUntyped, setAppContext };
