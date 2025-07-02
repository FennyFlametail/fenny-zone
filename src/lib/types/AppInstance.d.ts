import type * as apps from '$lib/apps';
import type Window from '$lib/components/Window.svelte';
import type AppMetadata from '$lib/types/AppMetadata';
import type { Component, ComponentProps } from 'svelte';

export default interface AppInstance<T extends (typeof apps)[keyof typeof apps] = Component> {
	id: string;
	Component: T['default'];
	metadata: AppMetadata;
	window?: Window;
	instance?: {
		_windowTitle?: string;
	};
	props?: ComponentProps<T>;
}
