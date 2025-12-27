<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Option {
		name: string;
		snippet: Snippet;
	}

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
		options: readonly Option[];
		tabContent: Snippet | undefined;
		selectedIndex: number;
		class?: ClassValue;
	} = $props();

	tabContent = content;

	const optionStyles = `<style>
	${options
		.map((_option, index) => {
			const tabId = `TabBar-${id}-${index}`;
			return `body:has(#${tabId}:checked) #${tabId} {display:contents}`;
		})
		.join('\n')}</style>`;
</script>

<fieldset class={['tabBar', className]}>
	{#each options as option, index}
		<label class="aqua-tab square">
			<input
				id={`TabBar-${id}-${index}`}
				type="radio"
				name={id}
				value={index}
				checked={index === selectedIndex}
				onchange={() => (selectedIndex = index)}
			/>
			<span>{option.name}</span>
		</label>
	{/each}
</fieldset>

{#snippet content()}
	{#each options as option, index}
		<div class="tabBarContentSnippet" id={`TabBar-${id}-${index}`}>
			{@render option.snippet()}
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
