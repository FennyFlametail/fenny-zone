import type { RunningApp } from '$lib/apps.svelte';
import type { Attachment } from 'svelte/attachments';

/* This is an attachment instead of a component
because passing content to a <pre> element with a snippet
messes up the spacing */

export default function setModified(app: RunningApp): Attachment {
	return (element) => {
		const handler = () => (app.instance.modified = true);
		element.addEventListener('input', handler);
		return () => element.removeEventListener('input', handler);
	};
}
