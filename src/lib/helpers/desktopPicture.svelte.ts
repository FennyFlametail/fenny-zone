import { desktopPictures, type DesktopPicture } from '$lib/data/desktopPictures';
import type WindowServer from '$lib/windowServer.svelte';

export async function getDesktopPicture(windowServer: WindowServer): Promise<DesktopPicture> {
	const pic = desktopPictures[windowServer.preferences.desktopPicture];

	if (pic === desktopPictures._custom) {
		const customPic = await loadCustomPic();
		if (customPic) return customPic;
	} else if (pic) {
		return pic;
	}

	window.queueMicrotask(() => {
		windowServer.preferences.desktopPicture = 'beach';
	});
	return desktopPictures.beach;
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
			src: URL.createObjectURL(file)
		} as DesktopPicture;
	} catch {
		return null;
	}
}
