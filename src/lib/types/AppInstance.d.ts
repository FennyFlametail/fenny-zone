import type Window from '$lib/components/Window.svelte';
import type AppMetadata from '$lib/types/AppMetadata';
import type { Component } from 'svelte';

export default interface AppInstance {
	App: Component;
	appBinding?: AppMetadata;
	window?: Window;
}
