import { setFileIconContext } from '$lib/context';

export default function setupFileIconContainer(isDesktop = false) {
	let selected = $state<string>();
	const getSelectedIcon = () => selected;
	const setSelectedIcon = (name: string) => (selected = name);

	setFileIconContext(getSelectedIcon, setSelectedIcon, isDesktop);

	function onClickIconContainer(e: MouseEvent) {
		if (
			!e.composedPath().some((el) => el instanceof Element && el.classList.contains('fileIcon'))
		) {
			selected = undefined;
		}
	}

	return { getSelectedIcon, setSelectedIcon, onClickIconContainer };
}
