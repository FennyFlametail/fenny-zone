import { getRequestEvent, query } from '$app/server';
import { LASTFM_API_KEY } from '$env/static/private';

const USERNAME = 'fennyflametail';
const RECENTS_URL = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${LASTFM_API_KEY}&format=json&extended=1&limit=200`;

const cache = {
	timestamp: 0,
	data: null as LastFmProfile | null
};

export const getLastFmFeed = query(async () => {
	const { fetch } = getRequestEvent();

	const cacheExpired = !cache.data || Date.now() - cache.timestamp > 1000 * 60 * 15;
	if (!cacheExpired) {
		console.debug('Returning last.fm feed from cache');
		return cache.data;
	}

	try {
		const fetchResult = await fetch(RECENTS_URL);
		const feed = await fetchResult.json();

		try {
			const result: LastFmProfile = {
				url: 'https://www.last.fm/user/fennyflametail',
				recents: feed.recenttracks.track.map(
					(track: any): MusicTrack => ({
						name: track.name,
						artist: track.artist.name,
						album: track.album['#text'],
						lastPlayed: parseInt(track.date.uts),
						loved: track.loved === '1',
						link: track.url,
						artistLink: track.artist.url,
						albumLink: `${track.artist.url}/${encodeURIComponent(track.album['#text'])}`,
						image: (track.image.find((img: any) => img.size === 'large') ?? track.image.at(-1))[
							'#text'
						]
					})
				)
			};
			cache.timestamp = Date.now();
			cache.data = result;
			return result;
		} catch (parseErr) {
			console.error('Error parsing last.fm feed', parseErr);
			return null;
		}
	} catch (fetchErr) {
		console.error('Error fetching last.fm feed', fetchErr);
		return null;
	}
});

export interface LastFmProfile {
	url: string;
	recents: MusicTrack[];
}

export interface MusicTrack {
	name: string;
	artist: string;
	album: string;
	lastPlayed: number;
	loved: boolean;
	link: string;
	artistLink: string;
	albumLink: string;
	image: string;
}
