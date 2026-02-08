import { FilterXSS } from 'xss';
const FENNY_DID = 'did:plc:53ee63azgdyf2mdzop4nor7r';

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
	link: string;
}

export interface BlueskyImage {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export interface BlueskyPost {
	handle: string;
	displayName: string;
	avatar: string;
	createdAt: string;
	text: string;
	images?: BlueskyImage[];
	quotePost?: BlueskyPost;
	link: string;
	profileLink: string;
	isRepost: boolean;
}

const enum PostFilter {
	posts_with_replies = 'posts_with_replies',
	posts_no_replies = 'posts_no_replies',
	posts_with_media = 'posts_with_media',
	posts_and_author_threads = 'posts_and_author_threads',
	posts_with_video = 'posts_with_video'
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

function parsePost(post: any): BlueskyPost {
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
		isRepost: post.author.did !== FENNY_DID,
		...parseEmbed(post.embed)
	};
}

function parseEmbed(embed?: any): Partial<BlueskyPost> {
	switch (embed?.$type) {
		case 'app.bsky.embed.images#view':
			return {
				images: embed.images.map(
					(img: any): BlueskyImage => ({
						src: img.thumb,
						alt: img.alt,
						width: img.aspectRatio.width,
						height: img.aspectRatio.height
					})
				)
			};
		case 'app.bsky.embed.record#view':
			return {
				quotePost: parsePost(embed.record)
			};
		default:
			return {};
	}
}

const cachedData = {
	timestamp: 0,
	data: {
		profile: null,
		posts: null
	} as {
		profile: BlueskyProfile | null;
		posts: BlueskyPost[] | null;
	}
};

export default async function fetchBlueskyData(fetchFn: typeof globalThis.fetch) {
	if (Date.now() - cachedData.timestamp > 1000 * 60 * 15) {
		console.debug('Fetching Bluesky data...');
		const profileFetch = fetchFn(
			`https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${FENNY_DID}`
		);
		const feedFetch = fetchFn(
			`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${FENNY_DID}&filter=${PostFilter.posts_and_author_threads}`
		);

		const [profileResponse, feedResponse] = await Promise.all([profileFetch, feedFetch]);

		if (profileResponse.ok) {
			const profile = await profileResponse.json();
			cachedData.data.profile = {
				handle: profile.handle,
				displayName: profile.displayName,
				avatar: profile.avatar,
				banner: profile.banner,
				createdAt: profile.createdAt,
				description: parseLinks(profile.description),
				followersCount: profile.followersCount,
				followsCount: profile.followsCount,
				postsCount: profile.postsCount,
				link: `https://bsky.app/profile/${profile.handle}`
			};
			cachedData.timestamp = Date.now();
		} else {
			console.error(
				`Error fetching Bluesky profile: ${profileResponse.status} ${profileResponse.statusText}`
			);
		}

		if (feedResponse.ok) {
			const feed = await feedResponse.json();
			cachedData.data.posts = feed.feed.map((item: any) => parsePost(item.post));
			cachedData.timestamp = Date.now();
		} else {
			console.error(
				`Error fetching Bluesky profile: ${profileResponse.status} ${profileResponse.statusText}`
			);
		}
	}
	if (cachedData.data.profile && cachedData.data.posts) {
		// await new Promise((resolve) => setTimeout(resolve, 2000));
		return cachedData.data;
	} else {
		throw new Error('Initial Bluesky fetch failed');
	}
}
