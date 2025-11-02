import Browser from '$lib/components/apps/Browser.svelte';
import Characters from '$lib/components/pages/Characters.svelte';
import Aren from '$lib/components/pages/characters/Aren.svelte';
import Ceph from '$lib/components/pages/characters/Ceph.svelte';
import Fenny from '$lib/components/pages/characters/Fenny.svelte';
import Nocturne from '$lib/components/pages/characters/Nocturne.svelte';
import Rigel from '$lib/components/pages/characters/Rigel.svelte';
import Projects from '$lib/components/pages/Projects.svelte';
import Readme from '$lib/components/pages/Readme.svelte';
import Trash from '$lib/components/Trash.svelte';
import Window from '$lib/components/Window.svelte';
import type { Position } from '$lib/windowServer.svelte';
import type { Component } from 'svelte';

export type AppName =
	| 'Finder'
	| 'TextEdit'
	| 'readme'
	| 'characters'
	| 'fenny'
	| 'aren'
	| 'ceph'
	| 'rigel'
	| 'nocturne'
	| 'projects'
	| 'toddspin'
	| 'sauce'
	| 'goat'
	| 'trash';

export interface AppEntry {
	Page?: Component<any>;
	title: string;
	icon: string;
	route?: string;
	/** Apps will be grouped by their parent icon in the Dock */
	parent?: AppName;
	/** If JavaScript is disabled, the close button will go to this route instead of home */
	backTo?: string;
	/** Used by Browser apps */
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
		launchOrder: number;
		modified?: boolean;
	};
}

export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };

const getApps = (): Record<AppName, AppEntry> => ({
	Finder: {
		title: 'Finder',
		icon: '/icons/finder.webp'
	},
	TextEdit: {
		title: 'TextEdit',
		icon: '/icons/textedit.webp'
	},
	readme: {
		parent: 'TextEdit',
		Page: Readme,
		title: 'Readme',
		icon: '/icons/txt.webp',
		route: '/readme'
	},
	characters: {
		parent: 'Finder',
		Page: Characters,
		title: 'Characters',
		icon: '/icons/folder-characters.webp',
		route: '/characters'
	},
	fenny: {
		Page: Fenny,
		title: 'Fenny',
		icon: '/icons/fenny.webp',
		route: '/characters/fenny',
		backTo: '/characters',
		defaultSize: {
			width: 800,
			height: 1000
		}
	},
	aren: {
		Page: Aren,
		title: 'Aren',
		icon: '/icons/aren.webp',
		route: '/characters/aren',
		backTo: '/characters',
		defaultSize: {
			width: 800,
			height: 1000
		}
	},
	ceph: {
		Page: Ceph,
		title: 'Ceph',
		icon: '/icons/ceph.webp',
		route: '/characters/ceph',
		backTo: '/characters',
		defaultSize: {
			width: 800,
			height: 1000
		}
	},
	rigel: {
		Page: Rigel,
		title: 'Rigel',
		icon: '/icons/rigel.webp',
		route: '/characters/rigel',
		backTo: '/characters',
		defaultSize: {
			width: 800,
			height: 1000
		}
	},
	nocturne: {
		Page: Nocturne,
		title: 'Nocturne',
		icon: '/icons/nocturne.webp',
		route: '/characters/nocturne',
		backTo: '/characters',
		defaultSize: {
			width: 800,
			height: 1000
		}
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
		icon: '/icons/folder-projects.webp',
		route: '/projects'
	},
	toddspin: {
		Page: Browser,
		title: 'Toddspin',
		icon: '/icons/toddspin.webp',
		route: '/toddspin',
		url: 'https://toddspin.fenny.zone',
		defaultSize: {
			height: 800
		}
	},
	sauce: {
		Page: Browser,
		title: 'CLICK FOR SAUCE',
		icon: '/icons/sauce.webp',
		route: '/sauce',
		url: 'https://sauce.fenny.zone',
		defaultSize: {
			width: 600
		}
	},
	goat: {
		Page: Browser,
		title: 'Goat Game',
		icon: '/icons/goat.png',
		route: '/goat',
		url: 'https://monty-hall.fenny.zone',
		defaultSize: {
			width: 600,
			height: 800
		}
	},
	trash: {
		parent: 'Finder',
		Page: Trash,
		title: 'Trash',
		icon: '/icons/trash.webp',
		route: '/trash'
	}
});
export default getApps;
