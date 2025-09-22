import { browser } from '$app/environment';
import apps, { type AppName, type RunningApp } from '$lib/apps.svelte';

// FIXME fixes a build error - see FileIcon.svelte
export { default as apps } from '$lib/apps.svelte';

const runningApps = $derived.by(() => {
	if (!apps) return {};
	return Object.fromEntries(Object.entries(apps).filter(([, app]) => app.instance));
}) as Readonly<Record<AppName, RunningApp>>;
export const getRunningApps = () => runningApps;

let desktopFocused = $state(false);
export const isDesktopFocused = () => desktopFocused;
export function focusDesktop() {
	desktopFocused = true;
}

export function getFocusedApp(): {
	name: AppName | undefined;
	app: RunningApp | undefined;
} {
	if (desktopFocused)
		return {
			name: undefined,
			app: undefined
		};

	const [name, app] =
		Object.entries(runningApps).find(
			([, app]) => app.instance.position.zIndex === Object.keys(runningApps).length - 1
		) ?? [];
	return {
		name: name as AppName,
		app
	};
}

export function openApp(appName: AppName, position?: Partial<Position>) {
	const app = apps[appName];
	if (app.isParent) {
		// focus all the apps that have this app as their parent
		const childApps = Object.entries(runningApps)
			.filter(([, runningApp]) => runningApp.parent === appName)
			.sort(([, appA], [, appB]) => appA.instance.position.zIndex - appB.instance.position.zIndex);
		childApps.forEach(([name]) => focusApp(name as AppName));

		if (appName === 'Finder' && !childApps.length) {
			// special case for Finder: if there aren't any windows open, open the Characters folder
			openApp('characters');
		}
	} else if (app.instance) {
		focusApp(appName);
	} else {
		app.instance = {
			position: {
				...getInitialPosition(app.defaultSize, Object.keys(runningApps).length),
				...position
			}
		};
		desktopFocused = false;
	}
	return app;
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
	desktopFocused = false;
}

export function closeApp(appName: AppName) {
	const app = apps[appName];
	if (!app.instance) {
		console.warn(`(closeApp) ${appName} isn't running!`);
		return;
	}

	// placeholder
	// if (app.instance?.modified && !confirm('Discard unsaved changes?')) {
	// 	return;
	// }

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

export function arrangeWindows() {
	Object.values(runningApps)
		.sort((a, b) => a.instance.position.zIndex - b.instance.position.zIndex)
		.forEach((app, index) => {
			app.instance.position = {
				...getInitialPosition(app.defaultSize, app.instance.position.zIndex),
				x: 25 * (index + 1),
				y: 25 * (index + 1)
			};
		});
}

const STORAGE_KEY = 'windowState';

export async function loadState() {
	const stateString = localStorage.getItem(STORAGE_KEY);
	if (stateString) {
		try {
			const state = JSON.parse(stateString);
			Object.entries(state).forEach(([appName, position]) => {
				const app = apps[appName as AppName];
				if (!app) {
					console.warn(`(loadAppsFromQueryString) couldn't find app ${appName}`);
					return;
				}
				openApp(appName as AppName, position as Position);
			});
		} catch (err) {
			console.warn('(loadState) error', err);
		}
	} else {
		// open the readme on first load
		openApp('readme');
	}
}

export function saveState() {
	const state = Object.fromEntries(
		Object.entries(runningApps).map(([appName, app]) => [appName, app.instance.position])
	);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface Size {
	width?: number;
	height?: number;
}

export const getInitialPosition = (initialSize: Size | undefined, zIndex: number) => {
	const width = initialSize?.width ?? 500;
	const height = initialSize?.height ?? 500;

	const innerWidth = browser ? window.innerWidth : 0;
	const innerHeight = browser ? window.innerHeight : 0;

	return {
		x: Math.max(innerWidth / 2 - width / 2, 0),
		y: Math.max(innerHeight / 2 - height * 0.75, 0),
		width,
		height,
		zIndex
	};
};

export type Position = ReturnType<typeof getInitialPosition>;

export const dragging: { el?: HTMLElement } = $state({});
export const resizing: { el?: HTMLElement } = $state({});
