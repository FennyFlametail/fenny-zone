import type { RunningApp } from '$lib/apps.svelte';
import type { Attachment } from 'svelte/attachments';

/* This is an attachment instead of a component
because passing content to a <pre> element with a snippet
messes up the spacing */

export default function textEdit(app: RunningApp): Attachment {
	return (element) => {
		const wrappedHTML = `<pre>
${element.innerHTML}
</pre>`;
		const inputHandler = () => {
			window.addEventListener('beforeunload', beforeunloadHandler);
			app.instance.saveData = new Blob([wrappedHTML], {
				type: 'text/html'
			});
		};
		const beforeunloadHandler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};

		element.role = 'textbox';
		element.addEventListener('input', inputHandler);

		return () => {
			element.role = null;
			element.removeEventListener('input', inputHandler);
			window.removeEventListener('beforeunload', beforeunloadHandler);
		};
	};
}
