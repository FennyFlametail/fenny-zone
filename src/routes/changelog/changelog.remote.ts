import { query, read } from '$app/server';
import changelog from './changelog.md';

export const getChangelog = query(async () => {
	const file = read(changelog);
	const text = await file.text();

	let lastGroup: string;
	const grouped = text.split('\n').reduce(
		(acc, line) => {
			line = line.trim();
			if (!line.length) return acc;
			if (!line.startsWith('-')) {
				lastGroup = line.trim();
				acc[lastGroup] = [];
			} else {
				acc[lastGroup].push(line.replace('-', '').trim());
			}
			return acc;
		},
		{} as Record<string, string[]>
	);
	return grouped;
});
