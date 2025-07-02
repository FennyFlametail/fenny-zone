import { nanoid } from 'nanoid';
import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import apps from '$lib/apps';
import { getInitialPosition, type Position } from '$lib/components/Window.svelte';
import type { App, RunningApp } from '$lib/types/AppTypes';

export const runningApps: RunningApp[] = $state([]);

export function openApp<T extends App>(app: T, position?: Partial<Position>) {
	const instance: RunningApp = {
		id: nanoid(),
		Component: app.default,
		metadata: app.metadata,
		position: {
			...getInitialPosition(runningApps.length),
			...app.metadata.size,
			...position
		}
	};

	runningApps.push(instance);
	return runningApps.at(-1);
}

export function focusApp(app: RunningApp) {
	const oldZIndex = app.position.zIndex;
	// find all apps with a higher z-index and lower it
	runningApps.forEach((app) => {
		if (app.position.zIndex > oldZIndex) {
			app.position.zIndex--;
		}
	});
	app.position.zIndex = runningApps.length - 1;
}

export function closeApp(app: RunningApp) {
	const oldZIndex = app.position.zIndex;
	const [closedApp] = runningApps.splice(runningApps.indexOf(app), 1);
	window.dispatchEvent(
		new CustomEvent('AppClose', {
			detail: closedApp
		})
	);
	// find all apps with a higher z-index and lower it
	runningApps.forEach((app) => {
		if (app.position.zIndex > oldZIndex) {
			app.position.zIndex--;
		}
	});
}

export function closeAll() {
	[...runningApps].forEach(closeApp);
}

export function resetApps() {
	runningApps.forEach((app) => app.window?.resetPosition());
}

export async function loadAppsFromQueryString() {
	const url = new URL(page.url);
	const promises = [...url.searchParams.entries()].map(async ([key, positionString]) => {
		const app = apps.find((app) => app.metadata.key === key);
		if (!app) return;
		const position = positionString ? JSON.parse(positionString) : {};
		openApp(app, position);
	});
	await Promise.all(promises);
}

export function updateQueryString() {
	const params = new URLSearchParams();
	runningApps.forEach((app) => {
		params.append(app.metadata.key, JSON.stringify(app.position));
	});
	const url = new URL(page.url);
	url.search = params.toString();
	replaceState(url, {});
}
