<script lang="ts">
	import { getMenubarContext } from '$lib/context';

	const {
		title,
		onclick,
		href
	}: {
		title: string;
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

	let selected = $state(false);

	function setSelected(e: MouseEvent) {
		e.preventDefault();
		selected = true;
	}

	function triggerItem() {
		if (selected) {
			selected = false;
			href ? open(href, '_blank') : onclick?.();
			dismissMenu();
		}
	}
</script>

<li class={['menuItem', { selected }]} onanimationend={triggerItem}>
	{#if href}
		<a {href} target="_blank" onclick={setSelected}>{title}</a>
	{:else}
		<button onclick={setSelected}>{title}</button>
	{/if}
</li>

<style>
	.menuItem {
		position: relative;
		white-space: nowrap;

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

		&.selected {
			animation: 0.1s steps(2, jump-none) selectItem;
			@media (prefers-reduced-motion: reduce) {
				animation-duration: 0s;
			}
		}

		> * {
			all: unset;
			padding-inline: 22px;
		}

		@media (scripting: none) {
			/* hide items with onclick handlers */
			&:not(:has(> a)) {
				display: none;
			}

			> a {
				cursor: pointer;
			}
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
