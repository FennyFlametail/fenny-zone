import type { Component } from 'svelte';
import Window, { type Position } from '$lib/components/Window.svelte';
import BrowserPage from '../routes/[browser=browser]/+page.svelte';
import CharactersPage from '../routes/characters/+page.svelte';
import ProjectsPage from '../routes/projects/+page.svelte';
import ReadmePage from '../routes/readme/+page.svelte';

export interface AppEntry {
	/** Page doesn't matter for parent apps */
	Page: Component<any>;
	/** Parent apps can't be launched directlly */
	isParent?: boolean;
	/** Apps will be grouped by their parent icon in the Dock */
	parent?: keyof typeof apps;
	title: string;
	icon: string;
	/** Apps using the browser page will redirect to this URL if you visit the route directly */
	url?: string;
	defaultSize?: {
		/** @default 500 */
		width?: number;
		/** @default 500 */
		height?: number;
	};
	instance?: {
		window?: Window;
		position: Position;
		modified?: boolean;
	};
}
export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };

const apps = $state({
	Finder: {
		Page: ReadmePage,
		isParent: true,
		title: 'Finder',
		icon: 'icons/finder.png'
	},
	TextEdit: {
		Page: ReadmePage,
		isParent: true,
		title: 'TextEdit',
		icon: 'icons/textedit.png'
	},
	Trash: {
		Page: ReadmePage,
		isParent: true,
		title: 'Trash',
		icon: 'icons/trash.png'
	},
	readme: {
		parent: 'TextEdit',
		Page: ReadmePage,
		title: 'Readme',
		icon: 'icons/txt.png'
	},
	characters: {
		parent: 'Finder',
		Page: CharactersPage,
		title: 'Characters',
		icon: 'icons/folder-characters.png'
	},
	// TODO character pages here
	projects: {
		parent: 'Finder',
		Page: ProjectsPage,
		title: 'Projects',
		icon: 'icons/folder-projects.png'
	},
	toddspin: {
		Page: BrowserPage,
		title: 'Toddspin',
		icon: 'icons/toddspin.png',
		defaultSize: {
			height: 800
		},
		url: 'https://toddspin.fenny.zone'
	},
	sauce: {
		Page: BrowserPage,
		title: 'CLICK FOR SAUCE',
		icon: 'icons/sauce.png',
		defaultSize: {
			width: 600
		},
		url: 'https://sauce.fenny.zone'
	},
	goat: {
		Page: BrowserPage,
		title: 'Goat Game',
		icon: 'icons/goat.png',
		defaultSize: {
			height: 800
		},
		url: 'https://monty-hall.fenny.zone'
	}
});

export type AppName = keyof typeof apps;
export default apps as Record<AppName, AppEntry>;
