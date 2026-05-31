<script lang="ts" generics="Item">
	import type TableController from '$lib/helpers/TableController.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const {
		controller,
		rowHeight,
		class: className,
		...rest
	}: {
		controller: TableController<Item>;
		/** Used for performance optimization and background if table doesn't fill height */
		rowHeight?: number;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={['tableWrapper', 'brushedInset', { withBackground: rowHeight }, className]}
	style:--row-height="{rowHeight}px"
	data-row-count={controller.data.length % 2 === 0 ? 'even' : 'odd'}
	{...rest}
>
	<table class="table">
		<thead class="tableHeader">
			<tr>
				{#each Object.keys(controller.columns) as (keyof Item)[] as key}
					{@const options = controller.columns[key]!}
					<th
						class={['tableHeaderCell', { sorted: controller.sortKey === key }]}
						onclick={() => controller.sort(key)}
					>
						<div class="tableHeaderContent">
							<span>{options.header}</span>
							<span class="tableHeaderSortArrow">{controller.sortDir === 'asc' ? '▲' : '▼'}</span>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each controller.data as item}
				<tr
					class={['tableRow', { selected: controller.selected === item }]}
					onclick={() => (controller.selected = item)}
				>
					{#each Object.keys(controller.columns) as (keyof Item)[] as key}
						{@const options = controller.columns[key]!}
						{#if options.cell}
							{@render options.cell?.(item, key)}
						{:else}
							<td>{item[key]}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.tableWrapper {
		display: flex;
		flex-direction: column;
		background-color: white;
		overflow: auto;
		contain: strict;

		&.withBackground {
			&::after {
				content: '';
				flex-grow: 1;
				background: repeating-linear-gradient(
					to bottom,
					var(--table-alternate-row-color),
					var(--table-alternate-row-color) var(--row-height),
					white var(--row-height),
					white calc(var(--row-height) * 2)
				);
				background-attachment: local;
			}

			&[data-row-count='odd']::after {
				margin-top: var(--row-height);
			}
		}
	}

	.table {
		border-collapse: collapse;

		tr {
			content-visibility: auto;
			contain-intrinsic-height: auto var(--row-height);
		}
	}

	.tableHeader {
		position: sticky;
		top: 0;
		left: 0;
		outline: 1px solid #666666;

		:global(.window.inactive) & {
			color: rgb(0 0 0 / 50%);
		}
	}

	.tableHeaderCell {
		font-weight: normal;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		background-image: linear-gradient(to bottom, var(--button-square-gradient));

		&.sorted:not(:global(.window.inactive) &) {
			background-image: linear-gradient(to bottom, var(--button-square-active-gradient));
		}
		@media (scripting: enabled) {
			&:active {
				background-image: linear-gradient(to bottom, var(--button-square-active-gradient));
			}
		}

		&.tableHeaderCell:not(:last-child) {
			border-right-color: #bababa;
		}
	}

	.tableHeaderContent {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
	}

	.tableHeaderSortArrow {
		font-size: 11px;
		visibility: hidden;

		.tableHeaderCell.sorted & {
			visibility: visible;
		}
	}

	.tableRow {
		&:nth-child(odd) {
			background-color: var(--table-alternate-row-color);
		}
		&.selected {
			background-color: var(--table-selected-row-color);
			color: white;

			:global(td):not(:last-child) {
				border-right-color: #346dbe;
			}

			:global(.window.inactive) & {
				background-color: var(--table-selected-row-color-inactive);
			}
		}
	}

	th,
	.tableRow :global(td) {
		max-width: 250px;
		padding: 0 7.5px;
		-webkit-user-select: none;
		user-select: none;

		&:not(:last-child) {
			border-right: 1px solid #d9d9d9;
		}
	}
</style>
