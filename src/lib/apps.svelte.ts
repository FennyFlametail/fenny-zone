import { browser } from '$app/environment';
import type { Pathname } from '$app/types';
import type { BlueskyImage } from '$lib/helpers/fetchBlueskyData.server';
import type { Position } from '$lib/windowServer.svelte';
import WindowServer from '$lib/windowServer.svelte';
import type { Component, Snippet } from 'svelte';

import AdblockWarning from '$lib/components/apps/AdblockWarning.svelte';
import CrashDialog from '$lib/components/apps/CrashDialog.svelte';
import Finder from '$lib/components/apps/Finder.svelte';
import SystemPreferences from '$lib/components/apps/SystemPreferences.svelte';
import BlueskyMedia from '$lib/components/bluesky/BlueskyMedia.svelte';
import DesktopPrefs from '$lib/components/prefpanes/DesktopPrefs.svelte';
import Applications from '../routes/applications/+page.svelte';
import Bluesky from '../routes/bluesky/+page.svelte';
import Changelog from '../routes/changelog/+page.svelte';
import Characters from '../routes/characters/+page.svelte';
import Aren from '../routes/characters/aren/+page.svelte';
import Ceph from '../routes/characters/ceph/+page.svelte';
import Fenny from '../routes/characters/fenny/+page.svelte';
import Nocturne from '../routes/characters/nocturne/+page.svelte';
import Rigel from '../routes/characters/rigel/+page.svelte';
import Goat from '../routes/goat/+page.svelte';
import Home from '../routes/home/+page.svelte';
import Keyboards from '../routes/keyboards/+page.svelte';
import KeyboardsInfo from '../routes/keyboards/info/+page.svelte';
import MK47 from '../routes/keyboards/mk47/+page.svelte';
import TextEdit from '../routes/textedit/+page.svelte';
import Neon75 from '../routes/keyboards/neon75/+page.svelte';
import OK35 from '../routes/keyboards/ok35/+page.svelte';
import Projects from '../routes/projects/+page.svelte';
import Readme from '../routes/readme/+page.svelte';
import Sauce from '../routes/sauce/+page.svelte';
import Toddspin from '../routes/toddspin/+page.svelte';
import Trash from '../routes/trash/+page.svelte';

import AddressBookIcon from '$lib/images/icons/addressbook.webp';
import ArenIcon from '$lib/images/icons/aren.webp';
import CephIcon from '$lib/images/icons/ceph.webp';
import DesktopPrefsIcon from '$lib/images/icons/desktop.webp';
import FennyIcon from '$lib/images/icons/fenny.webp';
import FinderIcon from '$lib/images/icons/finder.webp';
import ApplicationsIcon from '$lib/images/icons/folder-applications.webp';
import KeyboardsIcon from '$lib/images/icons/folder-keyboards.webp';
import ProjectsIcon from '$lib/images/icons/folder-projects.webp';
import GoatIcon from '$lib/images/icons/goat.png';
import HomeIcon from '$lib/images/icons/home.webp';
import ImageIcon from '$lib/images/icons/image.webp';
import NocturneIcon from '$lib/images/icons/nocturne.webp';
import PreviewIcon from '$lib/images/icons/preview.webp';
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
import MK47Icon from '$lib/images/keyboards/mk47-icon.webp';
import Neon75Icon from '$lib/images/keyboards/neon75-icon.webp';
import OK35Icon from '$lib/images/keyboards/ok35-icon.webp';

interface AppOptionType<Options extends { parent?: AppName; props?: Record<string, any> } = {}> {
	parent: Options extends { parent: infer Parent } ? Parent : undefined;
	props: Options extends { props: infer Props } ? Props : never;
}

interface AppOptions {
	adblockWarning: AppOptionType;
	applications: AppOptionType<{ parent: 'finder' }>;
	aren: AppOptionType<{ parent: 'characters' }>;
	bluesky: AppOptionType<{}>;
	blueskyMedia: AppOptionType<{
		parent: 'bluesky';
		props: {
			image: BlueskyImage;
			postLink: string;
			handle: string;
		};
	}>;
	ceph: AppOptionType<{ parent: 'characters' }>;
	changelog: AppOptionType<{ parent: 'textEdit' }>;
	characters: AppOptionType<{ props: { character?: AppName } }>;
	crashDialog: AppOptionType<{ props: { crashedAppName: AppName } }>;
	fenny: AppOptionType<{ parent: 'characters' }>;
	finder: AppOptionType<{ props: { folder?: AppName } }>;
	goat: AppOptionType<{ props: { url: string } }>;
	home: AppOptionType<{ parent: 'finder' }>;
	keyboards: AppOptionType<{ parent: 'finder' }>;
	keyboardsInfo: AppOptionType<{ parent: 'textEdit' }>;
	mk47: AppOptionType<{ parent: 'preview' }>;
	neon75: AppOptionType<{ parent: 'preview' }>;
	nocturne: AppOptionType<{ parent: 'characters' }>;
	ok35: AppOptionType<{ parent: 'preview' }>;
	prefsDesktop: AppOptionType<{ parent: 'systemPreferences' }>;
	preview: AppOptionType<{ props: { src: string } }>;
	projects: AppOptionType<{ parent: 'finder' }>;
	readme: AppOptionType<{ parent: 'textEdit' }>;
	rigel: AppOptionType<{ parent: 'characters' }>;
	sauce: AppOptionType<{ props: { url: string } }>;
	systemPreferences: AppOptionType<{ props: { pane?: AppName } }>;
	textEdit: AppOptionType;
	toddspin: AppOptionType<{ props: { url: string } }>;
	trash: AppOptionType<{ parent: 'finder' }>;
}
export type AppName = keyof AppOptions;
export type AppParent<Name extends AppName> = AppOptions[Name]['parent'];
export type AppProps<Name extends AppName> = AppOptions[Name]['props'];

export interface AppEntry<Name extends AppName = AppName, Parent = AppParent<Name>> {
	/** Apps will be grouped by their parent icon in the Dock */
	readonly parent: Parent;
	/** Ignored if `launchParentWithProps` is set */
	readonly Page?: Component<any>;
	/** Used for icons, and menubar/titlebar if `menuTitle` or `windowTitle` aren't set */
	readonly title: string;
	/** Defaults to `title` */
	readonly menuTitle?: string;
	/** Defaults to `title` */
	readonly dockTitle?: string;
	/** Defaults to `title`, used for titlebar & Window menu, will override parent if using `launchParentWithProps` */
	readonly windowTitle?: string;
	/** Hides title from titlebar, but will still show in Window menu */
	readonly hideWindowTitle?: boolean;
	readonly windowStyle?: 'normal' | 'brushed' | 'unified' | 'custom';
	readonly hideWindowControls?: boolean;
	readonly icon?: string;
	/** Will override parent if using `launchParentWithProps` */
	readonly titleIcon?: string;
	readonly hideTitleIcon?: boolean;
	/** Writable for the Trash easter egg */
	dockIcon?: string;
	readonly hideInDock?: boolean;
	/** Instead of launching the app's Page, launch its parent with the provided props\
	 * Use `windowTitle` and `titleIcon` to override the parent's title and icon
	 */
	readonly launchParentWithProps?: Parent extends AppName ? AppProps<Parent> : never;
	/** if true, the child app's title & icon will replace the parents' in the titlebar */
	readonly replaceParentTitle?: boolean;
	readonly route?: Pathname;
	/** If JavaScript is disabled, the close button will go to this route instead of home */
	readonly backTo?: Pathname;
	/** For browser apps */
	readonly url?: string;
	readonly defaultPosition?: Partial<Omit<Position, 'zIndex'>>;
	readonly minSize?: number;
	readonly lockAspectRatio?: boolean;
	readonly noResize?: boolean;
	instance?: {
		/** Props must be serializable */
		props: AppProps<Name>;
		menuItems?: Record<string, Snippet>;
		position: Position;
		preZoomPosition?: Position;
		launchOrder: number;
		focused: boolean;
		saveData?: Blob;
		showSaveSheet?: boolean;
		animating?: boolean;
		windowTitle?: string;
		titleIcon?: string;
		ariaLabel?: string;
	};
}

export type RunningApp<Name extends AppName = AppName> = AppEntry<Name> & {
	instance: Required<AppEntry<Name>>['instance'];
};

function profile<Character extends AppName>(
	character: Character,
	Page: Component<any>,
	icon: string
) {
	const title = character[0].toUpperCase() + character.slice(1);
	return {
		parent: 'characters',
		Page,
		title,
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon,
		launchParentWithProps: browser ? undefined : { character },
		route: `/characters/${character}` as any,
		backTo: '/applications',
		defaultPosition: browser
			? {
					width: 600,
					height: 800
				}
			: undefined
	} as AppEntry<Character>;
}

const getApps = (): {
	[Name in AppName]: AppEntry<Name>;
} => ({
	// #region Apps
	bluesky: {
		// TODO avoid having to pass undefined for apps without parent
		parent: undefined,
		Page: Bluesky,
		title: 'Bluesky',
		windowStyle: 'custom',
		icon: TweetbotIcon,
		route: '/bluesky',
		backTo: '/applications',
		defaultPosition: {
			width: 515,
			height: 1000
		}
	},
	blueskyMedia: {
		parent: 'bluesky',
		Page: BlueskyMedia,
		title: 'Bluesky Media',
		windowTitle: 'Media',
		windowStyle: 'custom',
		get defaultPosition() {
			return {
				x: Math.max(
					WindowServer.getInitialPosition(undefined, {
						lockAspectRatio: true
					}).x - 100,
					0
				)
			};
		},
		minSize: 200,
		lockAspectRatio: true
	},
	preview: {
		parent: undefined,
		title: 'Preview',
		icon: PreviewIcon
	},
	// #region Finder
	finder: {
		parent: undefined,
		Page: Finder,
		windowStyle: 'brushed',
		title: 'Finder',
		windowTitle: 'Fenny',
		icon: FinderIcon,
		titleIcon: HomeIcon,
		route: '/home'
	},
	home: {
		parent: 'finder',
		Page: Home,
		title: 'Fenny',
		icon: HomeIcon,
		launchParentWithProps: { folder: 'home' },
		replaceParentTitle: true,
		route: '/home'
	},
	applications: {
		parent: 'finder',
		Page: Applications,
		title: 'Applications',
		icon: ApplicationsIcon,
		launchParentWithProps: { folder: 'applications' },
		replaceParentTitle: true,
		route: '/applications'
	},
	projects: {
		parent: 'finder',
		Page: Projects,
		title: 'Projects',
		icon: ProjectsIcon,
		launchParentWithProps: { folder: 'projects' },
		replaceParentTitle: true,
		route: '/projects'
	},
	keyboards: {
		parent: 'finder',
		Page: Keyboards,
		title: 'Keyboards',
		icon: KeyboardsIcon,
		launchParentWithProps: { folder: 'keyboards' },
		replaceParentTitle: true,
		route: '/keyboards'
	},
	// #region TextEdit
	textEdit: {
		parent: undefined,
		Page: TextEdit,
		title: 'TextEdit',
		icon: TextEditIcon,
		titleIcon: TextIcon,
		route: '/textedit',
		backTo: '/applications'
	},
	readme: {
		parent: 'textEdit',
		Page: Readme,
		title: 'Readme',
		icon: RichTextIcon,
		defaultPosition: {
			height: 450
		},
		route: '/readme'
	},
	changelog: {
		parent: 'textEdit',
		Page: Changelog,
		title: 'Changelog',
		icon: TextIcon,
		route: '/changelog'
	},
	keyboardsInfo: {
		parent: 'textEdit',
		Page: KeyboardsInfo,
		title: 'Info.rtf',
		icon: RichTextIcon,
		route: '/keyboards/info',
		backTo: '/keyboards'
	},
	// #region Characters
	characters: {
		parent: undefined,
		Page: Characters,
		title: 'Characters',
		menuTitle: 'Address Book',
		windowStyle: 'brushed',
		icon: AddressBookIcon,
		titleIcon: VCardIcon,
		route: '/characters',
		backTo: '/applications',
		defaultPosition: {
			width: 1200,
			height: 800
		}
	},
	fenny: profile('fenny', Fenny, FennyIcon),
	aren: profile('aren', Aren, ArenIcon),
	ceph: profile('ceph', Ceph, CephIcon),
	rigel: profile('rigel', Rigel, RigelIcon),
	nocturne: profile('nocturne', Nocturne, NocturneIcon),
	// #region Keyboards
	mk47: {
		parent: 'preview',
		Page: MK47,
		title: 'MK47.webp',
		icon: MK47Icon,
		titleIcon: ImageIcon,
		defaultPosition: {
			width: 2338,
			height: 763
		},
		minSize: 300,
		lockAspectRatio: true,
		route: '/keyboards/mk47',
		backTo: '/keyboards'
	},
	neon75: {
		parent: 'preview',
		Page: Neon75,
		title: 'Neon75.webp',
		icon: Neon75Icon,
		titleIcon: ImageIcon,
		defaultPosition: {
			width: 2725,
			height: 1090
		},
		minSize: 300,
		lockAspectRatio: true,
		route: '/keyboards/neon75',
		backTo: '/keyboards'
	},
	ok35: {
		parent: 'preview',
		Page: OK35,
		title: 'OK35.webp',
		icon: OK35Icon,
		titleIcon: ImageIcon,
		defaultPosition: {
			width: 1951,
			height: 801
		},
		minSize: 300,
		lockAspectRatio: true,
		route: '/keyboards/ok35',
		backTo: '/keyboards'
	},
	// #region Browser
	toddspin: {
		parent: undefined,
		Page: Toddspin,
		title: 'Toddspin',
		icon: ToddspinIcon,
		defaultPosition: {
			height: 800
		},
		route: '/toddspin',
		backTo: '/projects',
		url: 'https://toddspin.fenny.zone'
	},
	sauce: {
		parent: undefined,
		Page: Sauce,
		title: 'CLICK FOR SAUCE',
		icon: SauceIcon,
		replaceParentTitle: true,
		defaultPosition: {
			width: 600
		},
		route: '/sauce',
		backTo: '/projects',
		url: 'https://sauce.fenny.zone'
	},
	goat: {
		parent: undefined,
		Page: Goat,
		title: 'Goat Game',
		icon: GoatIcon,
		replaceParentTitle: true,
		defaultPosition: {
			width: 600,
			height: 800
		},
		route: '/goat',
		backTo: '/projects',
		url: 'https://monty-hall.fenny.zone'
	},
	// #region Preferences
	systemPreferences: {
		parent: undefined,
		Page: SystemPreferences,
		title: 'System Preferences',
		icon: SystemPreferencesIcon,
		hideTitleIcon: true,
		windowStyle: 'unified',
		noResize: true,
		backTo: '/applications',
		get defaultPosition() {
			// position to fit the Desktop prefpane (height 525)
			return {
				y: WindowServer.getInitialPosition({ height: 525 }).y,
				height: 175
			};
		}
	},
	prefsDesktop: {
		parent: 'systemPreferences',
		Page: DesktopPrefs,
		title: 'Desktop',
		windowTitle: 'Desktop',
		icon: DesktopPrefsIcon,
		launchParentWithProps: { pane: 'prefsDesktop' },
		defaultPosition: {
			height: 525
		}
	},
	// #region System
	adblockWarning: {
		parent: undefined,
		Page: AdblockWarning,
		title: 'Adblock Warning',
		hideWindowTitle: true,
		hideWindowControls: true,
		hideInDock: true,
		noResize: true,
		defaultPosition: {
			width: 580,
			height: 180
		}
	},
	crashDialog: {
		parent: undefined,
		Page: CrashDialog,
		title: 'Crash Reporter',
		hideWindowTitle: true,
		hideWindowControls: true,
		hideInDock: true,
		noResize: true,
		defaultPosition: {
			width: 580,
			height: 225
		}
	},

	trash: {
		parent: 'finder',
		Page: Trash,
		title: 'Trash',
		icon: TrashIcon,
		defaultPosition: {
			width: 480,
			height: 480
		},
		route: '/trash'
	}
});
export default getApps;
