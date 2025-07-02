import type { App } from '$lib/apps';
import type { default as Window, Position } from '$lib/components/Window.svelte';

export interface AppMetadata {
	key: string;
	title: string;
	icon: string;
}

export default interface RunningApp {
	id: string;
	Component: App['default'];
	metadata: AppMetadata;
	window?: Window;
	position: Position;
	instance?: Record<string, unknown>;
}
