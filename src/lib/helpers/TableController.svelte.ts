import type { Snippet } from 'svelte';

export type SortDirection = 'asc' | 'desc';

export type ColumnOptions<Item> = {
	[key in keyof Item]?: {
		header: string;
		cell?: Snippet<[Item, keyof Item]>;
		defaultSort?: SortDirection;
	};
};

export default class TableController<Item> {
	originalData: Item[];
	data = $state<Item[]>([]);
	columns: ColumnOptions<Item>;
	selected = $state<Item | null>(null);
	sortKey = $state<keyof Item | null>(null);
	sortDir = $state<SortDirection>('asc');

	constructor({
		data,
		columns: columnOptions,
		initialSortKey = null
	}: {
		data: Item[];
		columns: ColumnOptions<Item>;
		initialSortKey?: keyof Item | null;
	}) {
		this.originalData = $state(data);
		this.columns = $state(columnOptions);
		this.sort(initialSortKey);
	}

	sort = (key: keyof Item | null) => {
		if (this.sortKey === key) {
			this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortDir = this.columns[key]?.defaultSort ?? 'asc';
		}
		this.sortKey = key;

		if (key === null) {
			this.data = this.originalData;
			return;
		}

		this.data = this.originalData.toSorted((a, b) => {
			const valueA = a[key];
			const valueB = b[key];
			if (typeof valueA === 'number' && typeof valueB === 'number') {
				return this.sortDir === 'asc' ? valueA - valueB : valueB - valueA;
			}
			return this.sortDir === 'asc'
				? String(valueA).localeCompare(String(valueB))
				: String(valueB).localeCompare(String(valueA));
		});
	};
}
