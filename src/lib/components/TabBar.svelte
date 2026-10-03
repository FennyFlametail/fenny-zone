<script module lang="ts">
	export interface Option<Key extends string> {
		name: string;
		content: Partial<Record<Key, Snippet>>;
	}
</script>

<script lang="ts" generics="Key extends string">
	import { type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		id,
		options,
		selectedIndex = $bindable(),
		tabContent = $bindable(),
		class: className
	}: {
		/** Must be unique - can use $props.id() */
		// $props.id() inside this component is inconsistent when JS is disabled
		id: string;
		options: readonly Option<Key>[];
		tabContent: Snippet<[Key]> | undefined;
		selectedIndex: number;
		class?: ClassValue;
	} = $props();

	tabContent = content;

	const optionStyles = $derived(`<style>
	${options
		.map((_option, index) => {
			const tabId = `TabBar-${id}-${index}`;
			return `body:has(#${tabId}:checked) #${tabId} {display:contents}`;
		})
		.join('\n')}</style>`);
</script>

<fieldset class={['tabBar', className]}>
	{#each options as option, index}
		<label class="aqua-tab">
			<input
				id="TabBar-{id}-{index}"
				type="radio"
				role="tab"
				name={id}
				value={index}
				checked={index === selectedIndex}
				onchange={() => (selectedIndex = index)}
			/>
			<span>{option.name}</span>
		</label>
	{/each}
</fieldset>

{#snippet content(key: Key)}
	{#each options as option, index}
		<div class="tabBarContentSnippet" id="TabBar-{id}-{index}">
			{@render option.content[key]?.()}
		</div>
	{/each}
	{@html optionStyles}
{/snippet}

<style>
	.tabBar {
		display: flex;
		border: none;
		padding: 0;
		box-shadow: var(--widget-box-shadow);
		border-radius: 5px;

		input {
			width: 0;
			height: 0;
			opacity: 0;
		}
	}

	.tabBarContentSnippet {
		display: none;
	}
</style>
