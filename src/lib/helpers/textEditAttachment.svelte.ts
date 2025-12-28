import type { RunningApp } from '$lib/apps.svelte';
import type { Attachment } from 'svelte/attachments';

/* This is an attachment instead of a component
because passing content to a <pre> element with a snippet
messes up the spacing */

export default function textEditAttachment(
	app: RunningApp,
	options?: {
		plaintext?: boolean;
	}
): Attachment {
	return (element) => {
		if (!(element instanceof HTMLElement)) {
			console.error('textEditAttachment element must be an HTML element:', element);
			return () => {};
		}

		const handler = () => {
			app.instance.modified = true;
		};

		const prevContentEditable = element.contentEditable;
		element.contentEditable = 'true';
		element.classList.add('textEdit');
		if (options?.plaintext) {
			element.classList.add('plaintext');
		}
		element.addEventListener('input', handler);

		return () => {
			element.contentEditable = prevContentEditable;
			element.classList.remove('textEdit', 'plaintext');
			element.removeEventListener('input', handler);
		};
	};
}
