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
	readonly Page?: Component<any>;
	/** Used for icons, and menubar/titlebar if `menuTitle` or `windowTitle` aren't set */
	readonly title: string;
	/** Defaults to `title` */
	readonly menuTitle?: string;
	/** Defaults to `title` */
	readonly windowTitle?: string;
	readonly brushed?: boolean;
	readonly icon: string;
	readonly route?: string;
	/** Apps will be grouped by their parent icon in the Dock */
	readonly parent?: AppName;
	/** If JavaScript is disabled, the close button will go to this route instead of home */
	readonly backTo?: string;
	/** Used by Browser apps */
	readonly url?: string;
	readonly defaultSize?: {
		/** @default 500 */
		width?: number;
		/** @default 500 */
		height?: number;
	};
	instance?: {
		position: Position;
		preZoomPosition?: Position;
		launchOrder: number;
		modified?: boolean;
		animating?: boolean;
	};
}

export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };

const defaultProfileSize = {
	width: 1000,
	height: 600
};

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
		menuTitle: 'TextEdit',
		icon: '/icons/txt.webp',
		route: '/readme',
		defaultSize: {
			width: 520
		}
	},
	characters: {
		Page: Characters,
		title: 'Characters',
		menuTitle: 'Address Book',
		brushed: true,
		icon: '/icons/characters.webp',
		/* TODO titlebar icon */
		route: '/characters',
		defaultSize: {
			width: 1400,
			height: 1000
		}
	},
	fenny: {
		Page: Fenny,
		title: 'Fenny',
		menuTitle: 'Address Book',
		windowTitle: 'Fenny Flametail',
		brushed: true,
		icon: '/icons/fenny.webp',
		/* FIXME make character routes open Characters page with character pre-selected, instead of new window (but still support opening in separate windows) */
		route: '/characters/fenny',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	aren: {
		Page: Aren,
		title: 'Aren',
		menuTitle: 'Address Book',
		windowTitle: 'Aren Flametail',
		brushed: true,
		icon: '/icons/aren.webp',
		route: '/characters/aren',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	ceph: {
		Page: Ceph,
		title: 'Ceph',
		menuTitle: 'Address Book',
		windowTitle: 'Ceph Azulux',
		brushed: true,
		icon: '/icons/ceph.webp',
		route: '/characters/ceph',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	rigel: {
		Page: Rigel,
		title: 'Rigel',
		menuTitle: 'Address Book',
		windowTitle: 'Rigel Azulux',
		brushed: true,
		icon: '/icons/rigel.webp',
		route: '/characters/rigel',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	nocturne: {
		Page: Nocturne,
		title: 'Nocturne',
		menuTitle: 'Address Book',
		windowTitle: 'Nocturne Blackmoon',
		brushed: true,
		icon: '/icons/nocturne.webp',
		route: '/characters/nocturne',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
		menuTitle: 'Finder',
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
