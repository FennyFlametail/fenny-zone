import { getToolbarEntryContext } from '$lib/context.svelte';
import { tick, type Snippet } from 'svelte';

export interface ToolbarEntryType {
	snippet: Snippet;
	/** Styles will be merged, with deeper children taking precedence over higher levels */
	style?: Record<string, string>;
}

export default function addToolbarEntry(entry: ToolbarEntryType) {
	const toolbarEntriesWrapper = getToolbarEntryContext();
	const entryProxy = $state(entry);

	// remove entry when component is destroyed
	$effect(
		() => () =>
			toolbarEntriesWrapper.entries.splice(toolbarEntriesWrapper.entries.indexOf(entryProxy), 1)
	);

	// tick ensures that when switching components, old entry is removed before new entry is added
	tick().then(() => toolbarEntriesWrapper.entries.push(entryProxy));
}
