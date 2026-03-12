import { FilterXSS } from 'xss';

const DEFAULT_HANDLE = 'fenny.zone';
const defaultDataCache = {
	timestamp: 0,
	data: {
		profile: null,
		posts: null
	} as FetchDataResult
};

export default async function fetchBlueskyData(
	fetchFn: typeof globalThis.fetch,
	userHandle = DEFAULT_HANDLE
): Promise<FetchDataResult> {
	const defaultUser = userHandle === DEFAULT_HANDLE;
	const cacheExpired = Date.now() - defaultDataCache.timestamp > 1000 * 60 * 15;

	if (defaultUser && !cacheExpired) {
		return defaultDataCache.data;
	}

	const fetchResult = await fetchData(fetchFn, userHandle);

	if (fetchResult.profile && fetchResult.posts) {
		if (defaultUser) {
			defaultDataCache.timestamp = Date.now();
			defaultDataCache.data = fetchResult;
		}
		return fetchResult;
	} else if (defaultUser) {
		return defaultDataCache.data;
	} else {
		throw new Error('No data available');
	}
}

// #region Helpers

const enum PostFilter {
	posts_with_replies = 'posts_with_replies',
	posts_no_replies = 'posts_no_replies',
	posts_with_media = 'posts_with_media',
	posts_and_author_threads = 'posts_and_author_threads',
	posts_with_video = 'posts_with_video'
}

async function fetchData(
	fetchFn: typeof globalThis.fetch,
	userHandle = DEFAULT_HANDLE
): Promise<FetchDataResult> {
	console.log('Fetching Bluesky data...', userHandle);
	const profileFetch = fetchFn(
		`https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${userHandle}`
	);
	const feedFetch = fetchFn(
		`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${userHandle}&filter=${PostFilter.posts_and_author_threads}`
	);

	const [profileResponse, feedResponse] = await Promise.all([profileFetch, feedFetch]);

	const result: FetchDataResult = {
		profile: null,
		posts: null
	};

	if (profileResponse.ok) {
		const profile = await profileResponse.json();
		result.profile = {
			handle: profile.handle,
			displayName: profile.displayName,
			avatar: profile.avatar,
			banner: profile.banner,
			createdAt: profile.createdAt,
			description: parseLinks(profile.description),
			followersCount: profile.followersCount,
			followsCount: profile.followsCount,
			postsCount: profile.postsCount,
			listsCount: profile.associated.lists,
			link: `https://bsky.app/profile/${profile.handle}`
		};
	} else {
		console.error(
			`Error fetching Bluesky profile: ${profileResponse.status} ${profileResponse.statusText}`
		);
	}

	if (feedResponse.ok) {
		const feed = await feedResponse.json();
		result.posts = feed.feed.map((item: any) => parsePost(item.post, userHandle)).filter(Boolean);
	} else {
		console.error(
			`Error fetching Bluesky profile: ${profileResponse.status} ${profileResponse.statusText}`
		);
	}

	return result;
}

const xssFilter = new FilterXSS({
	whiteList: {
		a: ['class', 'href', 'target']
	}
});

function parseLinks(text: string) {
	return xssFilter.process(
		text
			.replaceAll(/https?:\/\/[^\s]+/g, '<a class="blueskyLink" href="$&" target="_blank">$&</a>')
			.replaceAll(
				/@([\w.]+)/g,
				'<a class="blueskyMention" href="https://bsky.app/profile/$1" target="_blank">$&</a>'
			)
	);
}

function parsePost(post: any, userHandle: string): BlueskyPost | undefined {
	try {
		if (post.author.labels.some((label: any) => label.val === '!no-unauthenticated')) {
			return undefined;
		}

		const record = post.record ?? post.value;
		const [, , rkey] = (post.uri as string).match(
			/at:\/\/(did:plc:\w+)\/app\.bsky\.feed\.post\/(\w+)/
		)!;

		return {
			handle: post.author.handle,
			displayName: post.author.displayName,
			avatar: post.author.avatar,
			createdAt: record.createdAt,
			text: parseLinks(record.text),
			link: `https://bsky.app/profile/${post.author.handle}/post/${rkey}`,
			profileLink: `https://bsky.app/profile/${post.author.handle}`,
			isRepost: post.author.handle !== userHandle,
			isLabeled: post.labels.some((label: any) => (label.src = 'did:plc:ar7c4by46qjdydhdevvrndac')),
			...parseEmbed(
				post.embed ?? post.embeds?.[0] ?? post.value?.embed,
				userHandle,
				post.author.did
			)
		};
	} catch (e) {
		console.error('Error parsing post', e, post);
		return undefined;
	}
}

function parseEmbed(embed: any, userHandle: string, authorDid: string): Partial<BlueskyPost> {
	try {
		switch (embed?.$type) {
			case 'app.bsky.embed.images':
				return {
					images: embed.images.map(
						(img: any): BlueskyImage => ({
							src: `https://cdn.bsky.app/img/feed_thumbnail/plain/${authorDid}/${img.image.ref.$link}@jpeg`,
							alt: img.alt,
							width: img.aspectRatio?.width,
							height: img.aspectRatio?.height
						})
					)
				};
			case 'app.bsky.embed.images#view':
				return {
					images: embed.images.map(
						(img: any): BlueskyImage => ({
							src: img.thumb,
							alt: img.alt,
							width: img.aspectRatio?.width,
							height: img.aspectRatio?.height
						})
					)
				};
			case 'app.bsky.embed.video#view':
				return {
					images: [
						{
							src: embed.thumbnail,
							// TODO see if it's possible to get video alt text
							alt: '',
							width: embed.aspectRatio?.width,
							height: embed.aspectRatio?.height,
							isVideo: true
						}
					]
				};
			case 'app.bsky.embed.external#view':
				return {
					linkPreview: {
						link: embed.external.uri,
						title: embed.external.title,
						description: embed.external.description,
						thumb: embed.external.thumb
					}
				};
			case 'app.bsky.embed.record#view':
				return {
					quotePost: parsePost(embed.record, userHandle)
				};
			case 'app.bsky.embed.recordWithMedia#view': {
				return {
					...parseEmbed(embed.media, userHandle, authorDid),
					quotePost: parsePost(embed.record.record, userHandle)
				};
			}
			default:
				return {};
		}
	} catch (e) {
		console.error('Error parsing embed', e, embed);
		return {};
	}
}

// #region Types

interface FetchDataResult {
	profile: BlueskyProfile | null;
	posts: BlueskyPost[] | null;
}

export interface BlueskyProfile {
	handle: string;
	displayName: string;
	avatar: string;
	banner: string;
	createdAt: string;
	description: string;
	followersCount: number;
	followsCount: number;
	postsCount: number;
	listsCount: number;
	link: string;
}

export interface BlueskyImage {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	isVideo?: boolean;
}

export interface BlueskyLinkPreview {
	link: string;
	title: string;
	description: string;
	thumb: string;
}

export interface BlueskyPost {
	handle: string;
	displayName: string;
	avatar: string;
	createdAt: string;
	text: string;
	images?: BlueskyImage[];
	linkPreview?: BlueskyLinkPreview;
	quotePost?: BlueskyPost;
	link: string;
	profileLink: string;
	isRepost: boolean;
	isLabeled: boolean;
}
