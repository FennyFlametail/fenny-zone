import AquaBlueImage from '$lib/images/wallpapers/aqua-blue.webp';
import AquaBlueThumb from '$lib/images/wallpapers/aqua-blue-thumb.webp';
import AquaGraphiteImage from '$lib/images/wallpapers/aqua-graphite.webp';
import AquaGraphiteThumb from '$lib/images/wallpapers/aqua-graphite-thumb.webp';
import BeachImage from '$lib/images/wallpapers/beach.webp';
import BeachThumb from '$lib/images/wallpapers/beach-thumb.webp';
import BreakfastImage from '$lib/images/wallpapers/breakfast.webp';
import BreakfastThumb from '$lib/images/wallpapers/breakfast-thumb.webp';
import CityImage from '$lib/images/wallpapers/city.webp';
import CityThumb from '$lib/images/wallpapers/city-thumb.webp';
import SquareatImage from '$lib/images/wallpapers/squareat.webp';
import SquareatThumb from '$lib/images/wallpapers/squareat-thumb.webp';

export interface DesktopPicture {
	title: string;
	src: string;
	thumb: string;
	fallbackColor: string;
	alt: string;
	artist: string;
	link?: string;
}
export const desktopPictures = {
	aquaBlue: {
		title: 'Aqua Blue',
		src: AquaBlueImage,
		thumb: AquaBlueThumb,
		fallbackColor: '#3d6ea8',
		alt: 'Blue overlapping abstract shapes',
		artist: 'Apple'
	},
	aquaGraphite: {
		title: 'Aqua Graphite',
		src: AquaGraphiteImage,
		thumb: AquaGraphiteThumb,
		fallbackColor: '#607388',
		alt: 'Gray overlapping abstract shapes',
		artist: 'Apple'
	},
	beach: {
		title: 'Beach Buds',
		src: BeachImage,
		thumb: BeachThumb,
		fallbackColor: '#b4a17a',
		alt: "Fenny, Ceph, and Aren standing on a beach boardwalk, smiling for a photo together. Ceph has his arms around Fenny and Aren's shoulders. They're wearing beach-appropriate attire.",
		artist: 'WickedForster',
		link: 'https://www.furaffinity.net/view/24207704/'
	},
	breakfast: {
		title: 'Morning Routine',
		src: BreakfastImage,
		thumb: BreakfastThumb,
		fallbackColor: '#9a9895',
		artist: 'Vallhound',
		alt: 'Fenny, Aren, and Ceph in the kitchen. Fenny is flipping pancakes at the stove. Aren is pouring a mug of coffee. Ceph is sitting at the counter holding a mug of tea.',
		link: 'https://www.furaffinity.net/view/64206839/'
	},
	city: {
		title: '「 NEON CITY RUSH 」',
		src: CityImage,
		thumb: CityThumb,
		fallbackColor: '#382c50',
		alt: 'Nocturne swiping their prosthetic arm toward the viewer, its glowing accents leaving neon electric trails in the air. Behind them is a crowded neon-lit city.',
		artist: 'godbird',
		link: 'https://bsky.app/profile/godbirdart.bsky.social/post/3lpaedsoqvs2x'
	},
	squareat: {
		title: 'A Square Meal',
		src: SquareatImage,
		thumb: SquareatThumb,
		fallbackColor: '#4a415c',
		alt: "Nocturne standing next to a vending machine in a rainy cyberpunk city. They're holding a tray of square food blocks, and examining one cautiously.",
		artist: 'eLCyDog',
		link: 'https://www.furaffinity.net/view/55769487/'
	}
} satisfies Record<string, DesktopPicture>;
