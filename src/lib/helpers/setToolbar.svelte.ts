import { getToolbarContext } from '$lib/context.svelte';
import { tick, type Snippet } from 'svelte';

export default function setToolbar(toolbar: Snippet) {
	const toolbarWrapper = getToolbarContext();
	// clear old toolbar when component is destroyed
	$effect(() => () => (toolbarWrapper.toolbar = undefined));
	// tick ensures that the old toolbar is cleared before the new toolbar is set
	tick().then(() => (toolbarWrapper.toolbar = toolbar));
}
