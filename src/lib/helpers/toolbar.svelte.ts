import { getToolbarItemsContext } from '$lib/context.svelte';
import { tick, type Snippet } from 'svelte';

export default function addToolbarItems(items: Snippet) {
	const toolbarItemsWrapper = getToolbarItemsContext();

	// remove items when component is destroyed
	$effect(
		() => () => toolbarItemsWrapper.items.splice(toolbarItemsWrapper.items.indexOf(items), 1)
	);

	// tick ensures that when switching components, old items are removed before new items are added
	tick().then(() => toolbarItemsWrapper.items.push(items));
}
