import { browser } from '$app/environment';
import getApps, {
	type AppEntry,
	type AppName,
	type AppParent,
	type AppProps,
	type RunningApp
} from '$lib/apps.svelte';
import { type desktopPictures } from '$lib/data/desktopPictures';
import { prefersReducedMotion } from 'svelte/motion';

const STATE_KEY = 'windowState';
const PREFERENCES_KEY = 'preferences';

const defaultPreferences = {
	desktopPicture: null as keyof typeof desktopPictures | null
};
export type Preferences = typeof defaultPreferences;

export interface Position {
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number;
}

type AppState = {
	[Name in AppName]?: {
		position: Position;
		props?: AppProps<Name>;
	};
};

/** Returns the parent if the app uses `launchParentWithProps`, and the app otherwise */
type OpenAppResult<Name extends AppName, Parent = AppParent<Name>> = Parent extends AppName
	? AppEntry<Name>['launchParentWithProps'] extends never
		? RunningApp<Name>
		: RunningApp<Parent>
	: RunningApp<Name>;

function getProperty(name: string, defaultValue: number) {
	return browser
		? parseInt(getComputedStyle(document.documentElement).getPropertyValue(name))
		: defaultValue;
}

export default class WindowServer {
	// #region Static
	static menubarHeight = getProperty('--menubar-height', 29);
	static dockHeight = getProperty('--dock-height', 79);
	static titlebarHeight = getProperty('--titlebar-height', 29);
	/** Space between the menubar and Dock */
	static get safeHeight() {
		return getProperty('--desktop-safe-height', Infinity);
	}

	static get windowMaxWidth() {
		return getProperty('--window-content-max-width', Infinity);
	}
	static get windowMaxHeight() {
		return getProperty('--window-content-max-height', Infinity);
	}
	static get windowMaxWidthBrushed() {
		return getProperty('--window-content-max-width-brushed', Infinity);
	}
	static get windowMaxHeightBrushed() {
		return getProperty('--window-content-max-height-brushed', Infinity);
	}
	static get windowMaxHeightCustom() {
		return getProperty('--window-content-max-height-custom', Infinity);
	}

	static defaultWindowWidth = 500;
	static defaultWindowHeight = 500 - this.titlebarHeight;
	static sheetDuration = 300;

	static getInitialPosition = (
		initialPosition?: Partial<Position>,
		app?: Pick<AppEntry, 'windowStyle' | 'lockAspectRatio'>
	): Position => {
		const defaultWidth = initialPosition?.width ?? this.defaultWindowWidth;
		const defaultHeight = initialPosition?.height ?? this.defaultWindowHeight;

		// apps are only SSRed if JavaScript is disabled
		// in this case, position and max width/height are set through CSS
		// (because the server can't access browser height/width)
		if (!browser) {
			return {
				x: 0,
				y: 0,
				width: defaultWidth,
				height: defaultHeight,
				zIndex: 0
			};
		}

		const { maxWidth, maxHeight } = this.getMaxDimensions(app?.windowStyle);

		let width = Math.min(defaultWidth, maxWidth);
		let height = Math.min(defaultHeight, maxHeight);

		if (app?.lockAspectRatio) {
			({ width, height } = this.scaleToAspectRatio(width, height, defaultWidth, defaultHeight));
		}

		const x = Math.max(initialPosition?.x ?? maxWidth / 2 - width / 2, 0);
		const y = Math.max(initialPosition?.y ?? (maxHeight / 2 - height / 2) * (2 / 3), 0);

		return { x, y, width, height, zIndex: initialPosition?.zIndex ?? 0 };
	};

	static getMaxDimensions(windowStyle?: AppEntry['windowStyle']) {
		let maxWidth = this.windowMaxWidth;
		let maxHeight = this.windowMaxHeight;

		if (windowStyle === 'brushed') {
			maxWidth = this.windowMaxWidthBrushed;
			maxHeight = this.windowMaxHeightBrushed;
		} else if (windowStyle === 'custom') {
			maxHeight = this.windowMaxHeightCustom;
		}

		return { maxWidth, maxHeight };
	}

	static scaleToAspectRatio = (
		inputWidth: number,
		inputHeight: number,
		ratioWidth: number,
		ratioHeight: number
	) => {
		let width = inputWidth,
			height = inputHeight;

		if (inputWidth >= inputHeight) {
			height = (inputWidth * ratioHeight) / ratioWidth;
		} else {
			width = (inputHeight * ratioWidth) / ratioHeight;
		}
		return { width, height };
	};
	// #endregion

	// #region Instance
	#launchCount = $state(0);

	initialAppName = $state<AppName>();
	desktopFocused = $state(true);
	draggingEl = $state<HTMLElement>();
	resizingEl = $state<HTMLElement>();

	apps = $state(getApps());
	preferences = $state(defaultPreferences);

	runningApps = $derived(
		Object.fromEntries(
			Object.entries(this.apps)
				.filter(([, app]) => app.instance)
				.sort(([, appA], [, appB]) => appA.instance!.launchOrder - appB.instance!.launchOrder)
		) as {
			readonly [Name in AppName]?: RunningApp<AppName>;
		}
	);

	runningAppsByParent = $derived(
		Map.groupBy(Object.entries(this.runningApps), ([, app]) => app.parent || null) as ReadonlyMap<
			AppName | null,
			[AppName, RunningApp][]
		>
	);

	focusedApp = $derived.by<{
		name: AppName;
		app: RunningApp;
	} | null>(() => {
		if (!browser && this.initialAppName)
			return {
				name: this.initialAppName,
				app: this.apps[this.initialAppName]
			} as {
				name: AppName;
				app: RunningApp;
			};
		if (this.desktopFocused) return null;

		const [name, app] =
			Object.entries(this.runningApps).find(
				([, app]) => app.instance.position.zIndex === Object.keys(this.runningApps).length - 1
			) ?? [];
		if (!app) return null;
		return {
			name,
			app
		} as {
			name: AppName;
			app: RunningApp;
		};
	});

	openApp = <Name extends AppName>(
		appName: Name,
		options: {
			position?: Partial<Position>;
			props?: AppProps<Name>;
		} = {}
	): OpenAppResult<Name> => {
		options.props = $state.snapshot(options.props);
		const openNewInstance = () => {
			const self = this;
			app.instance = {
				position: WindowServer.getInitialPosition(
					{
						...app.defaultPosition,
						zIndex: Object.keys(this.runningApps).length,
						...options.position
					},
					app
				),
				launchOrder: this.#launchCount++,
				get focused() {
					return self.focusedApp?.app === app;
				},
				props: {
					...options.props
				}
			};
			this.desktopFocused = false;
		};

		const app = this.apps[appName] as AppEntry<Name>;
		const childApps = this.runningAppsByParent.get(appName) ?? [];
		if (childApps.length) {
			// focus all this app's children, plus the app itself if it's running
			const appSpread = app.instance ? ([[appName, app]] as [string, RunningApp][]) : [];
			const sortedApps = [...childApps, ...appSpread].sort(
				([, appA], [, appB]) => appA.instance.position.zIndex - appB.instance.position.zIndex
			);
			sortedApps.forEach(([name]) => this.focusApp(name as AppName));

			// open the parent app (main window) if it isn't open
			if (app.Page && !app.instance) {
				openNewInstance();
			} else if (app.instance && options.props) {
				app.instance.props = options.props;
			}
		} else if (app.instance) {
			this.focusApp(appName);
			if (options.props) {
				app.instance.props = options.props;
			}
		} else if (app.parent && app.launchParentWithProps) {
			const parentApp = this.openApp(app.parent, {
				position: app.defaultPosition,
				props: app.launchParentWithProps
			});
			if (app.replaceParentTitle) {
				parentApp.instance.windowTitle = app.windowTitle ?? app.title;
				parentApp.instance.titleIcon = app.titleIcon ?? app.icon;
			}
			return parentApp as OpenAppResult<Name>;
		} else {
			openNewInstance();
		}

		return app as OpenAppResult<Name>;
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
		const app = this.apps[appName] as RunningApp;
		if (!app.instance) {
			console.warn(`(zoomApp) ${appName} isn't running!`);
			return;
		}
		if (app.noResize) return;

		let { maxWidth: width, maxHeight: height } = WindowServer.getMaxDimensions(app.windowStyle);

		if (app?.lockAspectRatio) {
			({ width, height } = WindowServer.scaleToAspectRatio(
				width,
				height,
				app.instance.position.width,
				app.instance.position.height
			));
		}

		this.setAnimating(appName);
		if (app.instance.preZoomPosition) {
			app.instance.position = app.instance.preZoomPosition;
			delete app.instance.preZoomPosition;
		} else {
			app.instance.preZoomPosition = app.instance.position;
			app.instance.position = {
				...app.instance.position,
				x: 0,
				y: 0,
				width,
				height
			};
		}

		/* zoom windows to their ideal (default) size - more Mac-like, but possibly confusing */
		// const initialPosition = WindowServer.getInitialPosition(app.defaultPosition);
		// if (
		// 	app.instance.position.width === initialPosition.width &&
		// 	app.instance.position.height === initialPosition.height
		// ) {
		// 	return;
		// }
		// this.setAnimating(app);
		// app.instance.position.width = initialPosition.width;
		// app.instance.position.height = initialPosition.height;
	};

	closeApp = async (
		appName?: AppName,
		options: {
			closeSaveSheet?: boolean;
		} = {}
	) => {
		if (!appName) return;
		const app = this.apps[appName];
		if (!app.instance) {
			console.warn(`(closeApp) ${appName} isn't running!`);
			return;
		}

		if (app.instance.saveData && !app.instance.showSaveSheet) {
			app.instance.showSaveSheet = true;
			return;
		}

		if (options.closeSaveSheet) {
			app.instance.showSaveSheet = false;
			await new Promise((resolve) => setTimeout(resolve, WindowServer.sheetDuration));
		}

		const oldZIndex = app.instance.position.zIndex;
		app.instance = undefined;

		// find all apps with a higher z-index and lower it
		Object.values(this.runningApps).forEach((ra) => {
			if (ra.instance.position.zIndex > oldZIndex) {
				ra.instance.position.zIndex--;
			}
		});

		if (Object.keys(this.runningApps).length === 0) {
			this.desktopFocused = true;
		}
	};

	closeAppWithError = (appName?: AppName, error?: any) => {
		if (!appName) return;
		if (error) console.error(error);
		this.closeApp(appName);
		this.openApp('crashDialog', {
			props: {
				crashedAppName: appName
			}
		});
	};

	setAnimating = (appName?: AppName) => {
		if (!appName) return;
		const app = this.apps[appName];
		if (!app.instance) {
			console.warn(`(setAnimating) ${appName} isn't running!`);
			return;
		}

		if (!prefersReducedMotion.current) {
			app.instance.animating = true;
		}
	};

	closeAppAndChildren = (appName?: AppName) => {
		if (!appName) return;
		const parentName = this.apps[appName].parent ?? appName;

		const childApps = this.runningAppsByParent.get(parentName);
		if (childApps) {
			childApps.forEach(([childName]) => this.closeApp(childName));
		}
		this.closeApp(parentName);
	};

	closeAll = () => {
		Object.keys(this.runningApps).forEach((appName) => this.closeApp(appName as AppName));
	};

	closeOthers = () => {
		Object.keys(this.runningApps).forEach((appName) => {
			if (appName !== this.focusedApp?.name) {
				this.closeApp(appName as AppName);
			}
		});
	};

	arrangeWindows = () => {
		Object.entries(this.runningApps)
			.sort(([, appA], [, appB]) => appA.instance.position.zIndex - appB.instance.position.zIndex)
			.forEach(([appName, app], index) => {
				this.setAnimating(appName as AppName);
				app.instance.position = WindowServer.getInitialPosition(
					{
						...app.defaultPosition,
						x: WindowServer.titlebarHeight * (index + 1),
						y: WindowServer.titlebarHeight * (index + 1),
						zIndex: app.instance.position.zIndex
					},
					app
				);
			});
	};

	loadState = () => {
		if (!browser) return;
		const stateString = localStorage.getItem(STATE_KEY);
		if (stateString) {
			try {
				const state: AppState = JSON.parse(stateString);
				Object.entries(state).forEach(([_appName, { position, props = {} }]) => {
					const appName = _appName as AppName;
					const app = this.apps[appName];
					if (!app) {
						console.warn(`(loadAppsFromQueryString) couldn't find app ${appName}`);
						return;
					}
					this.openApp(appName, {
						position,
						props
					});
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
		const state: AppState = Object.fromEntries(
			Object.entries(this.runningApps).map(([appName, app]) => {
				const entry: AppState[AppName] = {
					position: app.instance.position
				};
				if (Object.keys(app.instance.props).length) {
					entry.props = app.instance.props;
				}
				return [appName, entry];
			})
		);
		localStorage.setItem(STATE_KEY, JSON.stringify(state));
	};

	loadPrefs = () => {
		if (!browser) return;
		const prefsString = localStorage.getItem(PREFERENCES_KEY);
		const userPreferences = prefsString ? JSON.parse(prefsString) : {};
		this.preferences = {
			...defaultPreferences,
			...userPreferences
		};
	};

	savePrefs = () => {
		localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
	};
	// #endregion
}
