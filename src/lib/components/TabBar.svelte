<script lang="ts" generics="Options extends readonly string[]">
	import type { ClassValue } from 'svelte/elements';

	let {
		options,
		selectedOption = $bindable(),
		class: className
	}: {
		options: Options;
		selectedOption?: Options[number];
		class: ClassValue;
	} = $props();

	const name = $props.id();
	if (!selectedOption) selectedOption = options[0];
</script>

<fieldset class={['tabBar', className]}>
	{#each options as option}
		<label
			class={[
				'tabBarTab',
				'aqua-button',
				'square',
				'darken',
				{
					active: option === selectedOption
				}
			]}
		>
			<input
				type="radio"
				{name}
				value={option}
				checked={option === selectedOption}
				onchange={() => (selectedOption = option)}
			/>
			<span>{option}</span>
		</label>
	{/each}
</fieldset>

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

	:global(#root) {
		.tabBarTab {
			box-shadow: none;

			&:has(+ .tabBarTab) {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			.tabBarTab + & {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left-width: 0;
			}
		}
	}
</style>
