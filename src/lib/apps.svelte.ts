import type { Component } from 'svelte';
import Window, { type Position } from '$lib/components/Window.svelte';
import Browser from '$lib/components/apps/Browser.svelte';
import Characters from '$lib/components/pages/Characters.svelte';
import Fenny from '$lib/components/pages/characters/Fenny.svelte';
import Aren from '$lib/components/pages/characters/Aren.svelte';
import Ceph from '$lib/components/pages/characters/Ceph.svelte';
import Nocturne from '$lib/components/pages/characters/Nocturne.svelte';
import Projects from '$lib/components/pages/Projects.svelte';
import Readme from '$lib/components/pages/Readme.svelte';

export interface AppEntry {
	/** Page doesn't matter for parent apps */
	Page: Component<any>;
	/** Parent apps can't be launched directlly */
	isParent?: boolean;
	/** Apps will be grouped by their parent icon in the Dock */
	parent?: keyof typeof apps;
	title: string;
	icon: string;
	/** Route doesn't matter for parent apps */
	route: string;
	/** Used for the Browser component */
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
		// FIXME remove unnecessary Page from parents
		Page: Readme,
		isParent: true,
		title: 'Finder',
		icon: '/icons/finder.png',
		route: ''
	},
	TextEdit: {
		Page: Readme,
		isParent: true,
		title: 'TextEdit',
		icon: '/icons/textedit.png',
		route: ''
	},
	Trash: {
		Page: Readme,
		isParent: true,
		title: 'Trash',
		icon: '/icons/trash.png',
		route: ''
	},
	readme: {
		parent: 'TextEdit',
		Page: Readme,
		title: 'Readme',
		icon: '/icons/txt.png',
		route: 'readme'
	},
	characters: {
		parent: 'Finder',
		Page: Characters,
		title: 'Characters',
		icon: '/icons/folder-characters.png',
		route: 'characters'
	},
	fenny: {
		Page: Fenny,
		title: 'Fenny',
		icon: '/icons/fenny.png',
		route: 'characters/fenny'
	},
	aren: {
		Page: Aren,
		title: 'Aren',
		icon: '/icons/aren.png',
		route: 'characters/aren'
	},
	ceph: {
		Page: Ceph,
		title: 'Ceph',
		icon: '/icons/ceph.png',
		route: 'characters/ceph'
	},
	nocturne: {
		Page: Nocturne,
		title: 'Nocturne',
		icon: '/icons/nocturne.png',
		route: 'characters/nocturne'
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
		icon: '/icons/folder-projects.png',
		route: 'projects'
	},
	toddspin: {
		Page: Browser,
		title: 'Toddspin',
		icon: '/icons/toddspin.png',
		route: 'toddspin',
		defaultSize: {
			height: 800
		},
		url: 'https://toddspin.fenny.zone'
	},
	sauce: {
		Page: Browser,
		title: 'CLICK FOR SAUCE',
		icon: '/icons/sauce.png',
		route: 'sauce',
		defaultSize: {
			width: 600
		},
		url: 'https://sauce.fenny.zone'
	},
	goat: {
		Page: Browser,
		title: 'Goat Game',
		icon: '/icons/goat.png',
		route: 'goat',
		defaultSize: {
			height: 800
		},
		url: 'https://monty-hall.fenny.zone'
	}
});

export type AppName = keyof typeof apps;
export default apps as Record<AppName, AppEntry>;
