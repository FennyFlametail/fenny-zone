import type { Position } from '$lib/windowServer.svelte';
import type { Component } from 'svelte';

import Readme from '$lib/components/pages/Readme.svelte';
import Changelog from '$lib/components/pages/Changelog.svelte';
import Bluesky from '../routes/bluesky/+page.svelte';
import Characters from '$lib/components/pages/Characters.svelte';
import Fenny from '$lib/components/pages/profiles/Fenny.svelte';
import Aren from '$lib/components/pages/profiles/Aren.svelte';
import Ceph from '$lib/components/pages/profiles/Ceph.svelte';
import Rigel from '$lib/components/pages/profiles/Rigel.svelte';
import Nocturne from '$lib/components/pages/profiles/Nocturne.svelte';
import Projects from '$lib/components/pages/Projects.svelte';
import Browser from '$lib/components/apps/Browser.svelte';
import Trash from '$lib/components/Trash.svelte';

import FinderIcon from '$lib/images/icons/finder.webp';
import TextEditIcon from '$lib/images/icons/textedit.webp';
import TextIcon from '$lib/images/icons/txt.webp';
import RichTextIcon from '$lib/images/icons/rtf.webp';
import TweetbotIcon from '$lib/images/icons/tweetbot.webp';
import CharactersIcon from '$lib/images/icons/characters.webp';
import FennyIcon from '$lib/images/icons/fenny.webp';
import ArenIcon from '$lib/images/icons/aren.webp';
import CephIcon from '$lib/images/icons/ceph.webp';
import RigelIcon from '$lib/images/icons/rigel.webp';
import NocturneIcon from '$lib/images/icons/nocturne.webp';
import ProjectsIcon from '$lib/images/icons/folder-projects.webp';
import ToddspinIcon from '$lib/images/icons/toddspin.webp';
import SauceIcon from '$lib/images/icons/sauce.webp';
import GoatIcon from '$lib/images/icons/goat.png';
import TrashIcon from '$lib/images/icons/trash.webp';

export type AppName =
	| 'Finder'
	| 'TextEdit'
	| 'readme'
	| 'changelog'
	| 'bluesky'
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
	readonly windowStyle?: 'normal' | 'brushed' | 'custom';
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
	width: 1250,
	height: 800
};

const getApps = (): Record<AppName, AppEntry> => ({
	Finder: {
		title: 'Finder',
		icon: FinderIcon
	},
	TextEdit: {
		title: 'TextEdit',
		icon: TextEditIcon
	},
	readme: {
		parent: 'TextEdit',
		Page: Readme,
		title: 'Readme',
		menuTitle: 'TextEdit',
		icon: RichTextIcon,
		route: '/readme',
		defaultSize: {
			width: 520,
			height: 530
		}
	},
	changelog: {
		parent: 'TextEdit',
		Page: Changelog,
		title: 'Changelog',
		menuTitle: 'TextEdit',
		icon: TextIcon,
		route: '/changelog'
	},
	bluesky: {
		Page: Bluesky,
		title: 'Bluesky',
		windowStyle: 'custom',
		icon: TweetbotIcon,
		// FIXME need to make single app layout
		route: '/bluesky',
		defaultSize: {
			width: 450,
			height: 1000
		}
	},
	characters: {
		Page: Characters,
		title: 'Characters',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: CharactersIcon,
		/* TODO titlebar icon */
		route: '/characters',
		defaultSize: {
			width: 1650,
			height: 1000
		}
	},
	fenny: {
		Page: Fenny,
		title: 'Fenny',
		windowTitle: 'Fenny Flametail',
		windowStyle: 'brushed',
		icon: FennyIcon,
		/* FIXME make character routes open Characters page with character pre-selected, instead of new window (but still support opening in separate windows) */
		route: '/characters/fenny',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	aren: {
		Page: Aren,
		title: 'Aren',
		windowTitle: 'Aren Flametail',
		windowStyle: 'brushed',
		icon: ArenIcon,
		route: '/characters/aren',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	ceph: {
		Page: Ceph,
		title: 'Ceph',
		windowTitle: 'Ceph Azulux',
		windowStyle: 'brushed',
		icon: CephIcon,
		route: '/characters/ceph',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	rigel: {
		Page: Rigel,
		title: 'Rigel',
		windowTitle: 'Rigel Azulux',
		windowStyle: 'brushed',
		icon: RigelIcon,
		route: '/characters/rigel',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	nocturne: {
		Page: Nocturne,
		title: 'Nocturne',
		windowTitle: 'Nocturne Blackmoon',
		windowStyle: 'brushed',
		icon: NocturneIcon,
		route: '/characters/nocturne',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
		menuTitle: 'Finder',
		icon: ProjectsIcon,
		route: '/projects'
	},
	toddspin: {
		Page: Browser,
		title: 'Toddspin',
		icon: ToddspinIcon,
		route: '/toddspin',
		url: 'https://toddspin.fenny.zone',
		defaultSize: {
			height: 800
		}
	},
	sauce: {
		Page: Browser,
		title: 'CLICK FOR SAUCE',
		icon: SauceIcon,
		route: '/sauce',
		url: 'https://sauce.fenny.zone',
		defaultSize: {
			width: 600
		}
	},
	goat: {
		Page: Browser,
		title: 'Goat Game',
		icon: GoatIcon,
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
		icon: TrashIcon,
		route: '/trash'
	}
});
export default getApps;
