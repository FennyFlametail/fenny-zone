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

export const WINDOW_PADDING = 25;

export default class WindowServer {
	// #region Static
	static #menubarHeight = browser
		? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menubar-height'))
		: 30;
	static #dockHeight = browser
		? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-height'))
		: 79;

	static getInitialPosition = (
		initialPosition?: Partial<Position>,
		fromState?: boolean
	): Position => {
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

		/** Space between the menubar and Dock */
		const safeHeight = innerHeight - this.#menubarHeight - this.#dockHeight;

		const width = initialPosition?.width ?? 500;
		const height = initialPosition?.height ?? 500;
		const x = initialPosition?.x ?? innerWidth / 2 - width / 2;
		const y = initialPosition?.y ?? (safeHeight / 2 - height / 2) * (2 / 3);

		/* if a window was maximized when state was saved, leave it maximized */
		const windowPadding = fromState ? 0 : WINDOW_PADDING;

		return {
			x: Math.max(windowPadding, Math.min(x, innerWidth - width - windowPadding)),
			y: Math.max(windowPadding, Math.min(y, innerHeight - height - windowPadding)),
			width: Math.min(width, innerWidth - windowPadding * 2),
			height: Math.min(
				height,
				innerHeight - this.#menubarHeight - this.#dockHeight - windowPadding * 2
			),
			zIndex: initialPosition?.zIndex ?? 0
		};
	};
	// #endregion

	// #region Instance
	#launchCount = $state(0);

	draggingEl = $state<HTMLElement>();
	resizingEl = $state<HTMLElement>();
	desktopFocused = $state(true);

	apps = $state(getApps());

	runningApps = $derived(
		Object.fromEntries(
			Object.entries(this.apps)
				.filter(([, app]) => app.instance)
				.sort(([, appA], [, appB]) => appA.instance!.launchOrder - appB.instance!.launchOrder)
		) as Readonly<Record<AppName, RunningApp>>
	);

	appsByParent = $derived(
		Map.groupBy(Object.entries(this.runningApps), ([, app]) => app.parent || null) as ReadonlyMap<
			AppName | null,
			[AppName, RunningApp][]
		>
	);

	focusedApp = $derived.by(() => {
		if (this.desktopFocused) return null;

		const [name, app] =
			Object.entries(this.runningApps).find(
				([, app]) => app.instance.position.zIndex === Object.keys(this.runningApps).length - 1
			) ?? [];
		if (!app) return null;
		return {
			name: name as AppName,
			app
		};
	});

	openApp = (appName: AppName, position?: Partial<Position>, fromState?: boolean) => {
		const app = this.apps[appName];
		const childApps = Object.entries(this.runningApps)
			.filter(([, runningApp]) => runningApp.parent === appName)
			.sort(([, appA], [, appB]) => appA.instance.position.zIndex - appB.instance.position.zIndex);
		if (childApps.length) {
			// focus all the apps that have this app as their parent
			childApps.forEach(([name]) => this.focusApp(name as AppName));
		} else if (appName === 'Finder' && !childApps.length) {
			// special case for Finder: if there aren't any windows open, open the Projects folder
			this.openApp('projects');
		} else if (app.instance) {
			this.focusApp(appName);
		} else {
			app.instance = {
				position: WindowServer.getInitialPosition(
					{
						...app.defaultSize,
						zIndex: Object.keys(this.runningApps).length,
						...position
					},
					fromState
				),
				launchOrder: this.#launchCount++
			};
			this.desktopFocused = false;
		}
		this.saveState();
		return app as RunningApp;
	};

	focusApp = (appName?: AppName) => {
		if (!appName) return;
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

	zoomApp = (appName?: AppName) => {
		if (!appName) return;
		const app = this.apps[appName];
		if (!app.instance) {
			console.warn(`(zoomApp) ${appName} isn't running!`);
			return;
		}

		app.instance.zooming = true;
		if (app.instance.preZoomPosition) {
			app.instance.position = app.instance.preZoomPosition;
			delete app.instance.preZoomPosition;
		} else {
			app.instance.preZoomPosition = app.instance.position;
			app.instance.position = {
				...app.instance.position,
				x: 0,
				y: 0,
				width: innerWidth,
				height: innerHeight - WindowServer.#menubarHeight - WindowServer.#dockHeight
			};
		}

		/* zoom windows to their ideal (default) size - more Mac-like, but possibly confusing */
		// const initialPosition = WindowServer.getInitialPosition(app.defaultSize);
		// if (
		// 	app.instance.position.width === initialPosition.width &&
		// 	app.instance.position.height === initialPosition.height
		// ) {
		// 	return;
		// }
		// app.instance.zooming = true;
		// app.instance.position.width = initialPosition.width;
		// app.instance.position.height = initialPosition.height;
	};

	closeApp = (appName?: AppName) => {
		if (!appName) return;
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

	closeCurrent = () => {
		if (this.focusedApp) {
			this.closeApp(this.focusedApp.name);
		}
	};

	closeOthers = () => {
		Object.keys(this.runningApps).forEach((appName) => {
			if (appName !== this.focusedApp?.name) {
				this.closeApp(appName as AppName);
			}
		});
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
		if (!browser) return;
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
					this.openApp(appName as AppName, position as Position, true);
				});
			} catch (err) {
				console.warn('(loadState) error', err);
				this.openApp('readme');
			}
		} else {
			// open the readme on first load
			this.openApp('readme');
		}
	};

	saveState = () => {
		if (!browser) return;
		const state = Object.fromEntries(
			Object.entries(this.runningApps).map(([appName, app]) => [appName, app.instance.position])
		);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	};
	// #endregion
}
