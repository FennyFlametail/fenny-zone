import { type desktopPictures } from '$lib/data/desktopPictures';

const preferences = $state<{
	adblockWarningSeen: boolean;
	desktopPicture: keyof typeof desktopPictures | null;
	desktopColor: string;
	duoLayout: boolean;
}>({
	adblockWarningSeen: false,
	desktopPicture: 'beach',
	desktopColor: '#beac87',
	duoLayout: false
});

export default preferences;

export function loadPreferences() {
	Object.keys(preferences).forEach(<Key extends keyof typeof preferences>(key: string) => {
		try {
			const value = localStorage.getItem(key);
			if (!value) return;
			preferences[key as Key] = JSON.parse(value);
		} catch (e) {
			console.error(`Error loading preference ${key}`, e);
		}
	});
}

export function savePreferences() {
	Object.entries(preferences).forEach(([key, value]) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error(`Error saving preference ${key}:`, e);
		}
	});
}
