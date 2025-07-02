import type { Component } from 'svelte';
import Window, { type Position } from '$lib/components/Window.svelte';
import Finder from '$lib/components/apps/Finder.svelte';
import TextEdit from '$lib/components/apps/TextEdit.svelte';
import BrowserPage from '../routes/[browser=browser]/+page.svelte';
import CharactersPage from '../routes/characters/+page.svelte';
import ProjectsPage from '../routes/projects/+page.svelte';
import ReadmePage from '../routes/readme/+page.svelte';

export interface AppEntry {
	/** Apps will be grouped by their parent icon in the Dock */
	// TODO implement grouping
	parent?: AppEntry;
	Page: Component<any>;
	/** The browser page will redirect to this URL if you visit the route directly */
	url?: string;
	title: string;
	icon: string;
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

const baseApps = {
	Finder: {
		Page: Finder,
		title: 'Finder',
		icon: 'icons/finder.png'
	},
	TextEdit: {
		Page: TextEdit,
		title: 'TextEdit',
		icon: 'icons/textedit.pnng'
	}
} as const;

const apps = $state({
	readme: {
		Page: ReadmePage,
		title: 'Readme',
		icon: 'icons/textedit.png'
	},
	characters: {
		parent: baseApps.Finder,
		Page: CharactersPage,
		title: 'Characters',
		icon: 'icons/folder-characters.png'
	},
	// TODO character pages here
	projects: {
		parent: baseApps.Finder,
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
}) satisfies Record<string, AppEntry>;

export type AppName = keyof typeof apps;
export default apps as Record<AppName, AppEntry>;
