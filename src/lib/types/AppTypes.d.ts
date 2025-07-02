import type apps from '$lib/apps.svelte';
import type { Position, default as Window } from '$lib/components/Window.svelte';
import type { Component } from 'svelte';

export interface AppEntry {
	Page: Component<any>;
	/** the browser page will redirect to this URL if you visit the route directly */
	url?: string;
	title: string;
	icon: string;
	hideInRunningApps?: boolean;
	defaultSize?: {
		/** @default 500 */
		width?: number;
		/** @default 500 */
		height?: number;
	};
	instance?: {
		window?: Window;
		position: Position;
		modified?: boolean;
	};
}

export type AppName = keyof typeof apps;

export type RunningApp = AppEntry & { instance: Required<AppEntry>['instance'] };
