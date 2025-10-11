<script lang="ts">
	import { getMenubarContext } from '$lib/context';

	const {
		title,
		onclick,
		href,
		disabled
	}: {
		title: string;
		disabled?: boolean;
	} & (
		| {
				onclick: () => void;
				href?: never;
		  }
		| {
				onclick?: never;
				href: string;
		  }
	) = $props();

	const { dismissMenu } = getMenubarContext();

	let opening = $state(false);
	const openAnimDuration = 200;

	function setSelected(e: MouseEvent) {
		e.preventDefault();
		opening = true;
		window.setTimeout(() => {
			opening = false;
			href ? open(href, '_blank') : onclick?.();
			dismissMenu();
		}, openAnimDuration);
	}
</script>

<li class={['menuItem', { opening, disabled }]} style:--openAnimDuration={`${openAnimDuration}ms`}>
	{#if href}
		{#if !disabled}
			<a class="menuItemLink" {href} target="_blank" onclick={setSelected}>{title}</a>
		{:else}
			<span class="menuItemLink">{title}</span>
		{/if}
	{:else}
		<button onclick={setSelected} {disabled}>{title}</button>
	{/if}
</li>

<style>
	.menuItem {
		position: relative;
		white-space: nowrap;
		display: flex;
		flex-flow: column;
		align-items: stretch;

		&.disabled {
			opacity: 0.5;
		}

		&:not(.disabled) {
			&:hover,
			&:focus-within {
				outline: none;
				background-color: var(--accent-color);
				color: white;

				@media (forced-colors: active) {
					background-color: CanvasText;
					color: Canvas;
				}
			}
		}

		@media not (prefers-reduced-motion: reduce) {
			&.opening {
				animation: var(--openAnimDuration) steps(2, jump-none) selectItem;
			}
		}

		> * {
			all: unset;
			padding-inline: 22px;
		}

		@media (scripting: none) {
			/* hide items with onclick handlers */
			&:not(:has(> .menuItemLink)) {
				display: none;
			}
		}
	}

	@media (scripting: none) {
		.menuItem:not(.disabled) > .menuItemLink {
			cursor: pointer;
		}
	}

	@keyframes selectItem {
		from {
			background-color: transparent;
			color: black;
		}
		to {
			background-color: var(--accent-color);
		}
	}
</style>
