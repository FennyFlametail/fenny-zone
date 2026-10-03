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
			const seenTrackUrls = new Set<string>();
			const tracks = (
				feed.recenttracks.track
					.map((track: any) => {
						if (seenTrackUrls.has(track.url) || !track.date?.uts) return;
						seenTrackUrls.add(track.url);
						return {
							name: track.name,
							link: track.url,
							loved: track.loved === '1',
							lastPlayed: parseInt(track.date.uts),
							_id: track.mbid,
							_artist: track.artist.name,
							_artistId: track.artist.mbid,
							_artistLink: track.artist.url,
							_album: track.album['#text'],
							_albumId: track.album.mbid,
							_albumLink: `${track.artist.url}/${encodeURIComponent(track.album['#text'])}`,
							_image: (track.image.find((img: any) => img.size === 'large') ?? track.image.at(-1))[
								'#text'
							]
						};
					})
					.filter(Boolean) as MusicTrackWithMetadata[]
			)
				// sort so most recently played albums appear first
				.toSorted((a, b) => b.lastPlayed - a.lastPlayed);

			const grouped = Object.groupBy(tracks, (track) => track._albumId || track._album);

			const byAlbum = Object.entries(grouped).map(([album, tracks]): MusicAlbum => {
				tracks = tracks?.toReversed() ?? [];

				// use the most common artist & image
				const artistCounts: Record<string, number> = {};
				const imageCounts: Record<string, number> = {};
				tracks.forEach((track) => {
					artistCounts[track._artist] ??= 0;
					artistCounts[track._artist]++;
					imageCounts[track._image] ??= 0;
					imageCounts[track._image]++;
				});

				const artist =
					Object.entries(artistCounts).sort(([, countA], [, countB]) => countB - countA)[0]?.[0] ??
					'';
				const image =
					Object.entries(imageCounts).sort(([, countA], [, countB]) => countB - countA)[0]?.[0] ??
					'';

				return {
					name: tracks[0]._album,
					link: tracks[0]._albumLink,
					artist,
					artistLink: tracks.find((t) => t._artist === artist)?._artistLink ?? '',
					image,
					tracks: tracks.map((track) => ({
						name: track.name,
						link: track.link,
						loved: track.loved,
						lastPlayed: track.lastPlayed
					}))
				};
			});

			const result: LastFmProfile = {
				url: 'https://www.last.fm/user/fennyflametail',
				recents: byAlbum
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
	recents: MusicAlbum[];
}

export interface MusicAlbum {
	name: string;
	link: string;
	artist: string;
	artistLink: string;
	image: string;
	tracks: MusicTrack[];
}

export interface MusicTrack {
	name: string;
	link: string;
	loved: boolean;
	lastPlayed: number;
}

interface MusicTrackWithMetadata extends MusicTrack {
	_id: string;
	_artist: string;
	_artistId: string;
	_artistLink: string;
	_album: string;
	_albumId: string;
	_albumLink: string;
	_image: string;
}
