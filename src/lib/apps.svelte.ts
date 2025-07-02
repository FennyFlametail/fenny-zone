import type { AppEntry } from '$lib/types/AppTypes';
import BrowserPage from '../routes/[browser=browser]/+page.svelte';
import CharactersPage from '../routes/characters/+page.svelte';
import ReadmePage from '../routes/readme/+page.svelte';

const apps = $state({
	characters: {
		Page: CharactersPage,
		title: 'Characters',
		icon: 'icons/finder.png'
	},
	readme: {
		Page: ReadmePage,
		title: 'README',
		icon: 'icons/textedit.png'
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
		title: 'Monty Hall Problem',
		icon: 'icons/goat.png',
		defaultSize: {
			height: 800
		},
		url: 'https://monty-hall.fenny.zone'
	}
}) satisfies Record<string, AppEntry>;

export default apps as Record<keyof typeof apps, AppEntry>;
