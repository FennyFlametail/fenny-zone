import { desktopPictures, type DesktopPicture } from '$lib/data/desktopPictures';
import preferences from '$lib/preferences.svelte';
import type WindowServer from '$lib/windowServer.svelte';

export async function getDesktopPicture(windowServer: WindowServer): Promise<DesktopPicture> {
	let pic: DesktopPicture | null = null;
	const name = preferences.desktopPicture;

	if (name === '_custom') {
		pic = await loadCustomPic();
	} else if (name) {
		pic = desktopPictures[name];
	}

	if (!pic) pic = desktopPictures.beach;

	return pic;
}

async function loadCustomPic() {
	try {
		const root = await navigator.storage.getDirectory();
		const folder = await root.getDirectoryHandle('wallpaper');
		const fileEntry = (await folder.entries().next()).value;
		if (!(fileEntry?.[1] instanceof FileSystemFileHandle)) return null;

		const [name, handle] = fileEntry;
		const file = await handle.getFile();

		return {
			title: name,
			src: URL.createObjectURL(file),
			isVideo: file.type.startsWith('video/')
		} satisfies DesktopPicture;
	} catch {
		return null;
	}
}
