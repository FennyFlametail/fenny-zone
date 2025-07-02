import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import * as apps from '$lib/apps';
import { getInitialPosition, type Position } from '$lib/components/Window.svelte';
import type { AppMetadata, default as RunningApp } from '$lib/types/RunningApp';
import { nanoid } from 'nanoid';
import { type ComponentProps } from 'svelte';

export const runningApps: RunningApp[] = $state([]);

export async function openApp<T extends (typeof apps)[keyof typeof apps]>(
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

	return runningApps.at(-1)!;
}

export function focusApp(app: RunningApp) {
	runningApps.push(...runningApps.splice(runningApps.indexOf(app), 1));
}

export function closeApp(app: RunningApp) {
	runningApps.splice(runningApps.indexOf(app), 1);
}

export function resetApps() {
	runningApps.forEach((app) => app.window?.resetPosition());
}

export async function loadAppsFromQueryString() {
	const url = new URL(page.url);
	const promises = [...url.searchParams.entries()].map(async ([name, optionString]) => {
		const app = apps[name as keyof typeof apps];
		if (!app) return;
		const options = optionString ? JSON.parse(optionString) : {};
		await openApp(app, options);
	});
	await Promise.all(promises);
}

export function updateQueryString() {
	const params = new URLSearchParams();
	runningApps.forEach((app) => {
		const name = Object.entries(apps).find(([, module]) => module.default === app.Component)![0];
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
