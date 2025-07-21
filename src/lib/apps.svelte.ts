import type { Component } from 'svelte';
import Window, { type Position } from '$lib/components/Window.svelte';
import BrowserPage from '../routes/[browser=browser]/+page.svelte';
import CharactersPage from '../routes/characters/+page.svelte';
import FennyPage from '../routes/characters/fenny/+page.svelte';
import ArenPage from '../routes/characters/aren/+page.svelte';
import CephPage from '../routes/characters/ceph/+page.svelte';
import NocturnePage from '../routes/characters/nocturne/+page.svelte';
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
	/** Route doesn't matter for parent apps or browser pages */
	route: string;
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
		icon: 'icons/finder.png',
		route: ''
	},
	TextEdit: {
		Page: ReadmePage,
		isParent: true,
		title: 'TextEdit',
		icon: 'icons/textedit.png',
		route: ''
	},
	Trash: {
		Page: ReadmePage,
		isParent: true,
		title: 'Trash',
		icon: 'icons/trash.png',
		route: ''
	},
	readme: {
		parent: 'TextEdit',
		Page: ReadmePage,
		title: 'Readme',
		icon: 'icons/txt.png',
		route: 'readme'
	},
	characters: {
		parent: 'Finder',
		Page: CharactersPage,
		title: 'Characters',
		icon: 'icons/folder-characters.png',
		route: 'characters'
	},
	fenny: {
		Page: FennyPage,
		title: 'Fenny',
		icon: 'icons/fenny.png',
		route: 'characters/fenny'
	},
	aren: {
		Page: ArenPage,
		title: 'Aren',
		icon: 'icons/aren.png',
		route: 'characters/aren'
	},
	ceph: {
		Page: CephPage,
		title: 'Ceph',
		icon: 'icons/ceph.png',
		route: 'characters/ceph'
	},
	nocturne: {
		Page: NocturnePage,
		title: 'Nocturne',
		icon: 'icons/nocturne.png',
		route: 'characters/nocturne'
	},
	projects: {
		parent: 'Finder',
		Page: ProjectsPage,
		title: 'Projects',
		icon: 'icons/folder-projects.png',
		route: 'projects'
	},
	toddspin: {
		Page: BrowserPage,
		title: 'Toddspin',
		icon: 'icons/toddspin.png',
		route: 'toddspin',
		defaultSize: {
			height: 800
		},
		url: 'https://toddspin.fenny.zone'
	},
	sauce: {
		Page: BrowserPage,
		title: 'CLICK FOR SAUCE',
		icon: 'icons/sauce.png',
		route: 'sauce',
		defaultSize: {
			width: 600
		},
		url: 'https://sauce.fenny.zone'
	},
	goat: {
		Page: BrowserPage,
		title: 'Goat Game',
		icon: 'icons/goat.png',
		route: 'goat',
		defaultSize: {
			height: 800
		},
		url: 'https://monty-hall.fenny.zone'
	}
});

export type AppName = keyof typeof apps;
export default apps as Record<AppName, AppEntry>;
