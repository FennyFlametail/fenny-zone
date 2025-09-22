import Browser from '$lib/components/apps/Browser.svelte';
import Characters from '$lib/components/pages/Characters.svelte';
import Aren from '$lib/components/pages/characters/Aren.svelte';
import Ceph from '$lib/components/pages/characters/Ceph.svelte';
import Fenny from '$lib/components/pages/characters/Fenny.svelte';
import Nocturne from '$lib/components/pages/characters/Nocturne.svelte';
import Projects from '$lib/components/pages/Projects.svelte';
import Readme from '$lib/components/pages/Readme.svelte';
import Window from '$lib/components/Window.svelte';
import type { Position } from '$lib/windowServer.svelte';
import type { Component } from 'svelte';

export type AppName =
	| 'Finder'
	| 'TextEdit'
	| 'Trash'
	| 'readme'
	| 'characters'
	| 'fenny'
	| 'aren'
	| 'ceph'
	| 'nocturne'
	| 'projects'
	| 'toddspin'
	| 'sauce'
	| 'goat';

const apps = $state<Record<AppName, AppEntry>>({
	Finder: {
		isParent: true,
		title: 'Finder',
		icon: '/icons/finder.png'
	},
	TextEdit: {
		isParent: true,
		title: 'TextEdit',
		icon: '/icons/textedit.png'
	},
	Trash: {
		isParent: true,
		title: 'Trash',
		icon: '/icons/trash.png'
	},
	readme: {
		parent: 'TextEdit',
		Page: Readme,
		title: 'Readme',
		icon: '/icons/txt.png',
		route: '/readme'
	},
	characters: {
		parent: 'Finder',
		Page: Characters,
		title: 'Characters',
		icon: '/icons/folder-characters.png',
		route: '/characters'
	},
	fenny: {
		Page: Fenny,
		title: 'Fenny',
		icon: '/icons/fenny.png',
		route: '/characters/fenny'
	},
	aren: {
		Page: Aren,
		title: 'Aren',
		icon: '/icons/aren.png',
		route: '/characters/aren'
	},
	ceph: {
		Page: Ceph,
		title: 'Ceph',
		icon: '/icons/ceph.png',
		route: '/characters/ceph'
	},
	nocturne: {
		Page: Nocturne,
		title: 'Nocturne',
		icon: '/icons/nocturne.png',
		route: '/characters/nocturne'
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
		icon: '/icons/folder-projects.png',
		route: '/projects'
	},
	toddspin: {
		Page: Browser,
		title: 'Toddspin',
		icon: '/icons/toddspin.png',
		route: '/toddspin',
		defaultSize: {
			height: 800
		},
		url: 'https://toddspin.fenny.zone'
	},
	sauce: {
		Page: Browser,
		title: 'CLICK FOR SAUCE',
		icon: '/icons/sauce.png',
		route: '/sauce',
		defaultSize: {
			width: 600
		},
		url: 'https://sauce.fenny.zone'
	},
	goat: {
		Page: Browser,
		title: 'Goat Game',
		icon: '/icons/goat.png',
		route: '/goat',
		defaultSize: {
			height: 800
		},
		url: 'https://monty-hall.fenny.zone'
	}
});
export default apps;

export type AppEntry = {
	/** Parent apps can't be launched directly */
	isParent?: boolean;
	/** Apps will be grouped by their parent icon in the Dock */
	parent?: AppName;
	title: string;
	icon: string;
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
} & (
	| {
			isParent: true;
			Page?: never;
			route?: never;
	  }
	| {
			isParent?: false;
			Page: Component<any>;
			route: string;
	  }
);

export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };
