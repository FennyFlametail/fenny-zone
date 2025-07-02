import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import * as apps from '$lib/apps';
import { getInitialPosition } from '$lib/components/Window.svelte';
import type RunningApp from '$lib/types/RunningApp';
import { nanoid } from 'nanoid';
import { tick, type ComponentProps } from 'svelte';

export const runningApps: RunningApp[] = $state([]);

export function openApp<T extends (typeof apps)[keyof typeof apps]>(
	{ default: Component, ...metadata }: T,
	props?: ComponentProps<T['default']>
) {
	runningApps.push({
		id: nanoid(),
		Component,
		metadata,
		setTitle(title) {
			this.metadata.title = title;
		},
		position: getInitialPosition(),
		// TODO way to pass props to pages in URL when directly navigating
		props: props
	});

	tick().then(() => {
		updateQueryString();
		runningApps.at(-1)?.window?.focus();
	});
}

export function closeApp(app: RunningApp) {
	runningApps.splice(runningApps.indexOf(app), 1);
	updateQueryString();
}

export function resetApps() {
	runningApps.forEach((app) => app.window?.resetPosition());
}

export function loadAppsFromQueryString() {
	// open apps from query string on page load
	const url = new URL(page.url);
	[...url.searchParams.entries()].forEach(([name, propString]) => {
		const app = apps[name as keyof typeof apps];
		if (!app) return;
		const props = propString ? JSON.parse(propString) : {};
		openApp(app, props);
	});
	tick().then(() => {
		resetApps();
		runningApps.at(-1)?.window?.focus();
	});
}

function updateQueryString() {
	const params = new URLSearchParams();
	runningApps.forEach((app) => {
		const index = Object.values(apps).findIndex((module) => module.default === app.Component);
		const name = Object.keys(apps)[index];
		params.append(name, JSON.stringify(app.props) ?? '');
	});
	const url = new URL(page.url);
	url.search = params.toString();
	replaceState(url, {});
}
