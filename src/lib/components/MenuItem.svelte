<script lang="ts">
	import { getMenubarContext } from '$lib/context';

	const {
		title,
		onclick
	}: {
		title: string;
		onclick: () => void;
	} = $props();

	const { dismissMenu } = getMenubarContext();

	let selected = $state(false);
	function setSelected() {
		selected = true;
	}
	function triggerItem() {
		if (selected) {
			selected = false;
			onclick();
			dismissMenu();
		}
	}
</script>

<li class={['menuItem', { selected }]} onanimationend={triggerItem}>
	<button onclick={setSelected}>{title}</button>
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
		}

		> * {
			all: unset;
			padding-inline: 22px;
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
