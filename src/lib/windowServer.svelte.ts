import { browser } from '$app/environment';
import getApps, { type AppName, type RunningApp } from '$lib/apps.svelte';

const STORAGE_KEY = 'windowState';

export interface Position {
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number;
}

/** Padding when opening and arranging windows */
export const WINDOW_PADDING = 25;

export default class WindowServer {
	static getInitialPosition = (initialPosition?: Partial<Position>): Position => {
		// apps are only SSRed if JavaScript is disabled
		// in this case, position and max width/height are set through CSS
		// (because the server can't access innerHeight/innerWidth)
		if (!browser) {
			return {
				x: 0,
				y: 0,
				width: initialPosition?.width ?? 500,
				height: initialPosition?.height ?? 500,
				zIndex: 0
			};
		}

		const root = getComputedStyle(document.documentElement);
		const menubarHeight = parseInt(root.getPropertyValue('--menubar-height'));
		const dockHeight = parseInt(root.getPropertyValue('--dock-height'));

		/** Space between the menubar and Dock */
		const safeHeight = innerHeight - menubarHeight - dockHeight;

		const width = initialPosition?.width ?? 500;
		const height = initialPosition?.height ?? 500;
		const x = initialPosition?.x ?? innerWidth / 2 - width / 2;
		const y = initialPosition?.y ?? (safeHeight / 2 - height / 2) * (2 / 3);

		return {
			x: Math.max(WINDOW_PADDING, Math.min(x, innerWidth)),
			y: Math.max(WINDOW_PADDING, Math.min(y, innerHeight)),
			width: Math.min(width, innerWidth - WINDOW_PADDING * 2),
			height: Math.min(height, innerHeight - menubarHeight - dockHeight - WINDOW_PADDING * 2),
			zIndex: initialPosition?.zIndex ?? 0
		};
	};

	apps = $state(getApps());

	runningApps = $derived(
		Object.fromEntries(
			Object.entries(this.apps)
				.filter(([, app]) => app.instance)
				.sort(([, appA], [, appB]) => appA.instance!.launchOrder - appB.instance!.launchOrder)
		) as Readonly<Record<AppName, RunningApp>>
	);

	appsByParent = $derived(
		Map.groupBy(
			Object.entries(this.runningApps),
			([appName, app]) => app.parent ?? (appName as AppName)
		)
	);

	desktopFocused = $state(false);
	focusDesktop = () => {
		this.desktopFocused = true;
	};

	getFocusedApp = (): {
		name: AppName | undefined;
		app: RunningApp | undefined;
	} => {
		if (this.desktopFocused)
			return {
				name: undefined,
				app: undefined
			};

		const [name, app] =
			Object.entries(this.runningApps).find(
				([, app]) => app.instance.position.zIndex === Object.keys(this.runningApps).length - 1
			) ?? [];
		return {
			name: name as AppName,
			app
		};
	};

	launchCount = $state(0);

	openApp = (appName: AppName, position?: Partial<Position>) => {
		const app = this.apps[appName];
		const childApps = Object.entries(this.runningApps)
			.filter(([, runningApp]) => runningApp.parent === appName)
			.sort(([, appA], [, appB]) => appA.instance.position.zIndex - appB.instance.position.zIndex);
		if (childApps.length) {
			// focus all the apps that have this app as their parent
			childApps.forEach(([name]) => this.focusApp(name as AppName));
		} else if (appName === 'Finder' && !childApps.length) {
			// special case for Finder: if there aren't any windows open, open the Characters folder
			this.openApp('characters');
		} else if (app.instance) {
			this.focusApp(appName);
		} else {
			app.instance = {
				position: WindowServer.getInitialPosition({
					...app.defaultSize,
					zIndex: Object.keys(this.runningApps).length,
					...position
				}),
				launchOrder: this.launchCount++
			};
			this.desktopFocused = false;
		}
		return app as RunningApp;
	};

	focusApp = (appName: AppName) => {
		const app = this.apps[appName];
		if (!app.instance) {
			console.warn(`(focusApp) ${appName} isn't running!`);
			return;
		}
		const oldZIndex = app.instance.position.zIndex;
		// find all apps with a higher z-index and lower it
		Object.values(this.runningApps).forEach((ra) => {
			if (ra.instance.position.zIndex > oldZIndex) {
				ra.instance.position.zIndex--;
			}
		});
		app.instance.position.zIndex = Object.keys(this.runningApps).length - 1;
		this.desktopFocused = false;
	};

	closeApp = (appName: AppName) => {
		const app = this.apps[appName];
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
		Object.values(this.runningApps).forEach((ra) => {
			if (ra.instance.position.zIndex > oldZIndex) {
				ra.instance.position.zIndex--;
			}
		});
	};

	closeAll = () => {
		Object.keys(this.runningApps).forEach((appName) => this.closeApp(appName as AppName));
	};

	arrangeWindows = () => {
		Object.values(this.runningApps)
			.sort((a, b) => a.instance.position.zIndex - b.instance.position.zIndex)
			.forEach((app, index) => {
				app.instance.position = WindowServer.getInitialPosition({
					...app.defaultSize,
					x: WINDOW_PADDING * (index + 1),
					y: WINDOW_PADDING * (index + 1),
					zIndex: app.instance.position.zIndex
				});
			});
	};

	loadState = () => {
		const stateString = localStorage.getItem(STORAGE_KEY);
		if (stateString) {
			try {
				const state = JSON.parse(stateString);
				Object.entries(state).forEach(([appName, position]) => {
					const app = this.apps[appName as AppName];
					if (!app) {
						console.warn(`(loadAppsFromQueryString) couldn't find app ${appName}`);
						return;
					}
					this.openApp(appName as AppName, position as Position);
				});
			} catch (err) {
				console.warn('(loadState) error', err);
			}
		} else {
			// open the readme on first load
			this.openApp('readme');
		}
	};

	saveState = () => {
		const state = Object.fromEntries(
			Object.entries(this.runningApps).map(([appName, app]) => [appName, app.instance.position])
		);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	};

	dragging: { el?: HTMLElement } = $state({});
	resizing: { el?: HTMLElement } = $state({});
}
