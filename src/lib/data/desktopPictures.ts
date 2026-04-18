import AquaBlueThumb from '$lib/images/wallpapers/aqua-blue-thumb.webp';
import AquaBlueImage from '$lib/images/wallpapers/aqua-blue.webp';
import AquaGraphiteThumb from '$lib/images/wallpapers/aqua-graphite-thumb.webp';
import AquaGraphiteImage from '$lib/images/wallpapers/aqua-graphite.webp';
import BandThumb from '$lib/images/wallpapers/band-thumb.webp';
import BandImage from '$lib/images/wallpapers/band.webp';
import BeachShirtlessThumb from '$lib/images/wallpapers/beach-shirtless-thumb.webp';
import BeachShirtlessImage from '$lib/images/wallpapers/beach-shirtless.webp';
import BeachThumb from '$lib/images/wallpapers/beach-thumb.webp';
import BeachImage from '$lib/images/wallpapers/beach.webp';
import BreakfastThumb from '$lib/images/wallpapers/breakfast-thumb.webp';
import BreakfastImage from '$lib/images/wallpapers/breakfast.webp';
import NeonThumb from '$lib/images/wallpapers/neon-thumb.webp';
import NeonImage from '$lib/images/wallpapers/neon.webp';
import RamenThumb from '$lib/images/wallpapers/ramen-thumb.webp';
import RamenImage from '$lib/images/wallpapers/ramen.webp';
import SodaThumb from '$lib/images/wallpapers/soda-thumb.webp';
import SodaImage from '$lib/images/wallpapers/soda.webp';
import SquareatThumb from '$lib/images/wallpapers/squareat-thumb.webp';
import SquareatImage from '$lib/images/wallpapers/squareat.webp';

export interface DesktopPicture {
	title: string;
	src: string;
	thumb?: string;
	alt?: string;
	artist?: string;
	link?: string;
	isVideo?: boolean;
}
export const desktopPictures = {
	aquaBlue: {
		title: 'Aqua Blue',
		src: AquaBlueImage,
		thumb: AquaBlueThumb,
		alt: 'Blue overlapping abstract shapes',
		artist: 'Apple'
	},
	aquaGraphite: {
		title: 'Aqua Graphite',
		src: AquaGraphiteImage,
		thumb: AquaGraphiteThumb,
		alt: 'Gray overlapping abstract shapes',
		artist: 'Apple'
	},
	band: {
		title: 'Band Practice',
		src: BandImage,
		thumb: BandThumb,
		alt: 'Individual portraits of Fenny, Ceph, and Aren playing in a band, with colored notes scrolling down the center similar to Guitar Hero. Fenny is singing, Ceph is nervously playing bass, and Aren is confidently playing guitar.',
		artist: 'WickedForster',
		link: 'https://www.furaffinity.net/view/27805385/'
	},
	beach: {
		title: 'Beach Buds',
		src: BeachImage,
		thumb: BeachThumb,
		alt: "Fenny, Ceph, and Aren standing on a beach boardwalk, smiling for a photo together. Ceph has his arms around Fenny and Aren's shoulders. All three are wearing beach-appropriate attire.",
		artist: 'WickedForster',
		link: 'https://www.furaffinity.net/view/24207704/'
	},
	beachShirtless: {
		title: 'Beach Buds',
		src: BeachShirtlessImage,
		thumb: BeachShirtlessThumb,
		alt: "Fenny, Ceph, and Aren standing on a beach boardwalk, smiling for a photo together. Ceph has his arms around Fenny and Aren's shoulders. All three are shirtless.",
		artist: 'WickedForster',
		link: 'https://www.furaffinity.net/view/24207736/'
	},
	breakfast: {
		title: 'Morning Routine',
		src: BreakfastImage,
		thumb: BreakfastThumb,
		artist: 'Vallhound',
		alt: 'Fenny, Aren, and Ceph in the kitchen. Fenny is flipping pancakes at the stove. Aren is pouring a mug of coffee. Ceph is sitting at the counter holding a mug of tea.',
		link: 'https://www.furaffinity.net/view/64206839/'
	},
	neon: {
		title: '「 NEON CITY RUSH 」',
		src: NeonImage,
		thumb: NeonThumb,
		alt: 'Nocturne swiping their prosthetic arm toward the viewer, its glowing accents leaving neon electric trails in the air. Behind them is a crowded neon-lit city.',
		artist: 'godbird',
		link: 'https://bsky.app/profile/godbirdart.bsky.social/post/3lpaedsoqvs2x'
	},
	ramen: {
		title: 'Ramen Break',
		src: RamenImage,
		thumb: RamenThumb,
		alt: "Nocturne sitting at a warmly-lit ramen stand. They're holding chopsticks in their robotic hand and slurping noodles from a large bowl.",
		artist: 'CorgiNamedBruno',
		link: 'https://www.furaffinity.net/view/59343753/'
	},
	soda: {
		title: 'Chill Summer',
		src: SodaImage,
		thumb: SodaThumb,
		alt: "Fenny standing against a vending machine on a bright day, holding a can of soda. He's surrounded by greenery.",
		artist: 'CorgiNamedBruno',
		link: 'https://www.furaffinity.net/view/58188938/'
	},
	squareat: {
		title: 'A Square Meal',
		src: SquareatImage,
		thumb: SquareatThumb,
		alt: "Nocturne standing next to a vending machine in a rainy cyberpunk city. They're holding a tray of square food blocks, and examining one cautiously.",
		artist: 'eLCyDog',
		link: 'https://www.furaffinity.net/view/55769487/'
	},
	_custom: {
		title: '',
		src: '',
		thumb: '',
		alt: '',
		artist: ''
	}
} satisfies Record<string, DesktopPicture>;
