import type { Pathname } from '$app/types';
import type { Position } from '$lib/windowServer.svelte';
import type { Component } from 'svelte';

import AdblockWarning from '$lib/components/apps/AdblockWarning.svelte';
import Browser from '$lib/components/apps/Browser.svelte';
import CrashDialog from '$lib/components/apps/CrashDialog.svelte';
import BlueskyMedia from '$lib/components/bluesky/BlueskyMedia.svelte';
import Bluesky from '../routes/bluesky/+page.svelte';
import Changelog from '../routes/changelog/+page.svelte';
import Characters from '../routes/characters/+page.svelte';
import Aren from '../routes/characters/aren/+page.svelte';
import Ceph from '../routes/characters/ceph/+page.svelte';
import Fenny from '../routes/characters/fenny/+page.svelte';
import Nocturne from '../routes/characters/nocturne/+page.svelte';
import Rigel from '../routes/characters/rigel/+page.svelte';
import Projects from '../routes/projects/+page.svelte';
import Readme from '../routes/readme/+page.svelte';
import Trash from '../routes/trash/+page.svelte';
import SystemPreferences from './components/apps/SystemPreferences.svelte';

import AddressBookIcon from '$lib/images/icons/addressbook.webp';
import ArenProfileIcon from '$lib/images/icons/aren-profile.webp';
import ArenIcon from '$lib/images/icons/aren.webp';
import CephProfileIcon from '$lib/images/icons/ceph-profile.webp';
import CephIcon from '$lib/images/icons/ceph.webp';
import FennyProfileIcon from '$lib/images/icons/fenny-profile.webp';
import FennyIcon from '$lib/images/icons/fenny.webp';
import FinderIcon from '$lib/images/icons/finder.webp';
import ProjectsIcon from '$lib/images/icons/folder-projects.webp';
import GoatIcon from '$lib/images/icons/goat.png';
import NocturneProfileIcon from '$lib/images/icons/nocturne-profile.webp';
import NocturneIcon from '$lib/images/icons/nocturne.webp';
import RigelIcon from '$lib/images/icons/rigel.webp';
import RichTextIcon from '$lib/images/icons/rtf.webp';
import SauceIcon from '$lib/images/icons/sauce.webp';
import SystemPreferencesIcon from '$lib/images/icons/system-preferences.webp';
import TextEditIcon from '$lib/images/icons/textedit.webp';
import ToddspinIcon from '$lib/images/icons/toddspin.webp';
import TrashIcon from '$lib/images/icons/trash.webp';
import TweetbotIcon from '$lib/images/icons/tweetbot.webp';
import TextIcon from '$lib/images/icons/txt.webp';
import VCardIcon from '$lib/images/icons/vcard.webp';

export type AppName =
	| 'Finder'
	| 'TextEdit'
	| 'adblockWarning'
	| 'crashDialog'
	| 'readme'
	| 'changelog'
	| 'bluesky'
	| 'blueskyMedia'
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
	| 'system-preferences'
	| 'trash';

export interface AppEntry {
	/** Apps will be grouped by their parent icon in the Dock */
	readonly parent?: AppName;
	readonly Page?: Component<any>;
	/** Used for icons, and menubar/titlebar if `menuTitle` or `windowTitle` aren't set */
	readonly title: string;
	/** Defaults to `title` */
	readonly menuTitle?: string;
	/** Defaults to `title` */
	readonly dockTitle?: string;
	/** Defaults to `title`, used for titlebar & Window menu */
	readonly windowTitle?: string;
	/** Hides title from titlebar, but will still show in Window menu */
	readonly hideWindowTitle?: boolean;
	readonly windowStyle?: 'normal' | 'brushed' | 'unified' | 'custom';
	readonly hideWindowControls?: boolean;
	readonly icon?: string;
	readonly titleIcon?: string;
	readonly hideTitleIcon?: boolean;
	dockIconOverride?: string;
	readonly hideInDock?: boolean;
	readonly route?: Pathname;
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
	readonly minSize?: number;
	readonly lockAspectRatio?: boolean;
	readonly noResize?: boolean;
	instance?: {
		/** Props must be serializable */
		props?: Record<string, any>;
		position: Position;
		preZoomPosition?: Position;
		launchOrder: number;
		focused: boolean;
		saveData?: Blob;
		showSaveSheet?: boolean;
		animating?: boolean;
		/** overrides `windowTitle` and `title` */
		title?: string;
		ariaLabel?: string;
	};
}

export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };

const defaultProfileSize = {
	width: 600,
	height: 800
};

const getApps = (): Record<AppName, AppEntry> => ({
	/* #region Parent stubs */
	Finder: {
		title: 'Finder',
		icon: FinderIcon
	},
	TextEdit: {
		title: 'TextEdit',
		icon: TextEditIcon
	},
	// #region Utility apps
	adblockWarning: {
		Page: AdblockWarning,
		title: 'Adblock Warning',
		hideWindowTitle: true,
		hideWindowControls: true,
		hideInDock: true,
		noResize: true,
		defaultSize: {
			width: 580,
			height: 210
		}
	},
	crashDialog: {
		Page: CrashDialog,
		title: 'Crash Reporter',
		hideWindowTitle: true,
		hideWindowControls: true,
		hideInDock: true,
		noResize: true,
		defaultSize: {
			width: 580,
			height: 250
		}
	},
	blueskyMedia: {
		parent: 'bluesky',
		Page: BlueskyMedia,
		title: 'Bluesky Media',
		windowTitle: 'Media',
		windowStyle: 'custom',
		minSize: 200,
		lockAspectRatio: true
	},
	// #region Primary apps
	readme: {
		parent: 'TextEdit',
		Page: Readme,
		title: 'Readme',
		icon: RichTextIcon,
		route: '/readme'
	},
	changelog: {
		parent: 'TextEdit',
		Page: Changelog,
		title: 'Changelog',
		icon: TextIcon,
		route: '/changelog'
	},
	bluesky: {
		Page: Bluesky,
		title: 'Bluesky',
		windowStyle: 'custom',
		icon: TweetbotIcon,
		route: '/bluesky',
		defaultSize: {
			width: 515,
			height: 1000
		}
	},
	characters: {
		Page: Characters,
		title: 'Address Book',
		dockTitle: 'Characters',
		windowStyle: 'brushed',
		icon: AddressBookIcon,
		titleIcon: VCardIcon,
		route: '/characters',
		defaultSize: {
			width: 1200,
			height: 1000
		}
	},
	fenny: {
		parent: 'characters',
		Page: Fenny,
		title: 'Fenny',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: FennyIcon,
		titleIcon: FennyProfileIcon,
		route: '/characters/fenny',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	aren: {
		parent: 'characters',
		Page: Aren,
		title: 'Aren',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: ArenIcon,
		titleIcon: ArenProfileIcon,
		route: '/characters/aren',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	ceph: {
		parent: 'characters',
		Page: Ceph,
		title: 'Ceph',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: CephIcon,
		titleIcon: CephProfileIcon,
		route: '/characters/ceph',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	rigel: {
		parent: 'characters',
		Page: Rigel,
		title: 'Rigel',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: RigelIcon,
		route: '/characters/rigel',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	nocturne: {
		parent: 'characters',
		Page: Nocturne,
		title: 'Nocturne',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: NocturneIcon,
		titleIcon: NocturneProfileIcon,
		route: '/characters/nocturne',
		backTo: '/characters',
		defaultSize: defaultProfileSize
	},
	projects: {
		parent: 'Finder',
		Page: Projects,
		title: 'Projects',
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
	'system-preferences': {
		Page: SystemPreferences,
		title: 'System Preferences',
		icon: SystemPreferencesIcon,
		hideTitleIcon: true,
		windowStyle: 'unified',
		noResize: true,
		defaultSize: {
			height: 200
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
