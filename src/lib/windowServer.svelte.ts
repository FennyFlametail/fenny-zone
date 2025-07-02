import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import apps from '$lib/apps.svelte';
import { getInitialPosition, type Position } from '$lib/components/Window.svelte';
import type { AppName, RunningApp } from '$lib/types/AppTypes';

const runningApps = $derived.by(() => {
	if (!apps) return {};
	return Object.fromEntries(Object.entries(apps).filter(([, app]) => app.instance));
}) as Readonly<Record<AppName, RunningApp>>;
export const getRunningApps = () => runningApps;

export function openApp(appName: AppName, position?: Partial<Position>) {
	const app = apps[appName];
	if (app.instance) {
		console.warn(`(openApp) ${appName} is already running!`);
	} else {
		app.instance = {
			position: {
				...getInitialPosition(Object.keys(runningApps).length),
				...app.defaultSize,
				...position
			}
		};
	}
	return app.instance;
}

export function focusApp(appName: AppName) {
	const app = apps[appName];
	if (!app.instance) {
		console.warn(`(focusApp) ${appName} isn't running!`);
		return;
	}
	const oldZIndex = app.instance.position.zIndex;
	// find all apps with a higher z-index and lower it
	Object.values(runningApps).forEach((ra) => {
		if (ra.instance.position.zIndex > oldZIndex) {
			ra.instance.position.zIndex--;
		}
	});
	app.instance.position.zIndex = Object.keys(runningApps).length - 1;
}

export function closeApp(appName: AppName) {
	const app = apps[appName];
	if (!app.instance) {
		console.warn(`(closeApp) ${appName} isn't running!`);
		return;
	}
	const oldZIndex = app.instance.position.zIndex;
	app.instance = undefined;

	// find all apps with a higher z-index and lower it
	Object.values(runningApps).forEach((ra) => {
		if (ra.instance.position.zIndex > oldZIndex) {
			ra.instance.position.zIndex--;
		}
	});
}

export function closeAll() {
	Object.keys(runningApps).forEach((appName) => closeApp(appName as AppName));
}

export function resetApps() {
	console.debug(runningApps)
	Object.values(runningApps).forEach((app) => app.instance.window?.resetPosition());
}

export async function loadAppsFromQueryString() {
	const url = new URL(page.url);
	const promises = [...url.searchParams.entries()].map(async ([appName, positionString]) => {
		const app = apps[appName as AppName];
		if (!app) {
			console.warn(`(loadAppsFromQueryString) couldn't find app ${appName}`);
			return;
		}
		const position = positionString ? JSON.parse(positionString) : {};
		openApp(appName as AppName, position);
	});
	await Promise.all(promises);
}

export function updateQueryString() {
	const params = new URLSearchParams();
	Object.entries(runningApps).forEach(([appName, app]) => {
		params.append(appName, JSON.stringify(app.instance.position));
	});
	const url = new URL(page.url);
	url.search = params.toString();
	replaceState(url, {});
}
