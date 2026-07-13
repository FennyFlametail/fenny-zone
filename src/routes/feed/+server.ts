import type { RequestHandler } from '@sveltejs/kit';
import { formatRFC7231, parse } from 'date-fns';
import { encode } from 'html-entities';
import { getChangelog } from '../changelog/changelog.remote';

export const GET: RequestHandler = async () => {
	const changelog = await getChangelog();

	const pubDate = formatRFC7231(parse(Object.keys(changelog)[0], 'yyyy-MM-dd', new Date()));
	const buildDate = formatRFC7231(new Date());

	const items = Object.entries(changelog).map(([date, lines]) => {
		const postDate = formatRFC7231(parse(date, 'yyyy-MM-dd', new Date()));
		return `<item>
			<title>${date}</title>
			<link>https://fenny.zone/changelog</link>
			<description>${encode(`<ul>${lines.map((line) => `<li>${line}</li>`)}</ul>`)}</description>
			<pubDate>${postDate}</pubDate>
			<guid isPermaLink="false">${date}</guid>
		</item>`;
	});

	const feed = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
		<channel>
			<title>fenny.zone</title>
			<link>https://fenny.zone/</link>
			<description>Fenny's internet home page</description>
			<language>en-us</language>
			<pubDate>${pubDate}</pubDate>
			<lastBuildDate>${buildDate}</lastBuildDate>
			<docs>https://www.rssboard.org/rss-specification</docs>
			<managingEditor>fennyflametail@icloud.com (Fenny Flametail)</managingEditor>
			<webMaster>fennyflametail@icloud.com (Fenny Flametail)</webMaster>
			<atom:link href="https://fenny.zone/feed" rel="self" type="application/rss+xml"/>
			${items.join('\n')}
		</channel>
	</rss>`;

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/rss+xml'
		}
	});
};
