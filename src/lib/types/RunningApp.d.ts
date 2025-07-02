import type * as apps from '$lib/apps';
import type { default as Window, Position } from '$lib/components/Window.svelte';
import type { Component, ComponentProps } from 'svelte';

export interface AppMetadata {
	title: string;
}

export default interface RunningApp<T extends (typeof apps)[keyof typeof apps] = Component> {
	id: string;
	Component: T['default'];
	metadata: AppMetadata;
	/** convenience function to avoid optional unwrapping */
	setTitle: (title: string) => void;
	window?: Window;
	position: Position;
	instance?: Record<string, unknown>;
	props?: ComponentProps<T>;
}
