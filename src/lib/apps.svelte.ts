import type { AppEntry } from '$lib/types/AppTypes';
import BrowserPage from '../routes/[browser=browser]/+page.svelte';
import CharactersPage from '../routes/characters/+page.svelte';
import ProjectsPage from '../routes/projects/+page.svelte';
import ReadmePage from '../routes/readme/+page.svelte';

const apps = $state({
	readme: {
		Page: ReadmePage,
		title: 'Readme',
		icon: 'icons/textedit.png'
	},
	characters: {
		Page: CharactersPage,
		title: 'Characters',
		icon: 'icons/folder-characters.png',
		hideInRunningApps: true
	},
	/* character pages go here */
	projects: {
		Page: ProjectsPage,
		title: 'Projects',
		icon: 'icons/folder-projects.png',
		hideInRunningApps: true
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

export default apps as Record<keyof typeof apps, AppEntry>;
