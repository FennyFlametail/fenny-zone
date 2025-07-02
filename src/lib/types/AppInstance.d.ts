import type Window from '$lib/components/Window.svelte';
import type { AppComponent } from '$lib/types/AppComponent';

export default interface AppInstance {
	App: AppComponent;
	window?: Window;
	x: number;
	y: number;
	zIndex: number;
}
