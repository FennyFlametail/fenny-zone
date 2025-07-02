import type apps from '$lib/apps';
import type { default as Window, Position } from '$lib/components/Window.svelte';

export type App = (typeof apps)[number];

export interface AppMetadata {
	key: string;
	title: string;
	icon: string;
	size?: {
		/** @default 500 */
		width?: number;
		/** @default 500 */
		height?: number;
	};
}

export interface RunningApp {
	id: string;
	Component: App['default'];
	metadata: AppMetadata;
	window?: Window;
	position: Position;
	instance?: Record<string, unknown>;
}
