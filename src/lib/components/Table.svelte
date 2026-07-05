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
	<table class="aqua-table">
		<thead>
			<tr>
				{#each Object.keys(controller.columns) as (keyof Item)[] as key}
					{@const options = controller.columns[key]!}
					<th
						class={{ sorted: controller.sortKey === key }}
						onclick={() => controller.sort(key)}
					>
						<div class="aqua-table-header-content">
							<span>{options.header}</span>
							<span class="aqua-table-header-sort-arrow">{controller.sortDir === 'asc' ? '▲' : '▼'}</span>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each controller.data as item}
				<tr
					class={{ selected: controller.selected === item }}
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
</style>
