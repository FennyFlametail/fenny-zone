import type Window from '$lib/components/Window.svelte';
import type AppMetadata from '$lib/types/AppMetadata';
import type { Component } from 'svelte';

export default interface AppInstance {
	id: string;
	Component: Component;
	metadata: AppMetadata;
	window?: Window;
}
