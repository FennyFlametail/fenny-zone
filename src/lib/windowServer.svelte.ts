import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import * as apps from '$lib/apps';
import { getInitialPosition, type Position } from '$lib/components/Window.svelte';
import type { AppMetadata, default as RunningApp } from '$lib/types/RunningApp';
import { nanoid } from 'nanoid';
import { tick, type ComponentProps } from 'svelte';

export const runningApps: RunningApp[] = $state([]);

export function openApp<T extends (typeof apps)[keyof typeof apps]>(
	{ default: Component, ...defaultMetadata }: T,
	{
		props,
		metadata,
		position
	}: {
		props?: ComponentProps<T['default']>;
		metadata?: Partial<AppMetadata>;
		position?: Partial<Position>;
	} = {}
) {
	runningApps.push({
		id: nanoid(),
		Component,
		metadata: {
			...defaultMetadata,
			...metadata
		},
		setTitle(title) {
			if (this.metadata.title) {
				this.metadata.title = title;
			}
		},
		position: {
			...getInitialPosition(),
			...position
		},
		// TODO way to pass props to pages in URL when directly navigating
		props: props
	});

	tick().then(() => {
		runningApps.at(-1)?.window?.focus();
		updateQueryString();
	});
}

export function closeApp(app: RunningApp) {
	runningApps.splice(runningApps.indexOf(app), 1);
	updateQueryString();
}

export function resetApps() {
	runningApps.forEach((app) => app.window?.resetPosition());
	updateQueryString();
}

export function loadAppsFromQueryString() {
	const url = new URL(page.url);
	[...url.searchParams.entries()].forEach(([name, optionString]) => {
		const app = apps[name as keyof typeof apps];
		if (!app) return;
		const options = optionString ? JSON.parse(optionString) : {};
		openApp(app, options);
	});
	tick().then(runningApps.at(-1)?.window?.focus);
}

export function updateQueryString() {
	const params = new URLSearchParams();
	runningApps.forEach((app) => {
		const index = Object.values(apps).findIndex((module) => module.default === app.Component);
		const name = Object.keys(apps)[index];
		// TODO save and restore focus order
		params.append(
			name,
			JSON.stringify({
				props: app.props,
				position: app.position,
				metadata: app.metadata
			})
		);
	});
	const url = new URL(page.url);
	url.search = params.toString();
	replaceState(url, {});
}
