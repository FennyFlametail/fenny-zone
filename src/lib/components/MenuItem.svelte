<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		title,
		onclick
	}: {
		title: string;
		onclick: MouseEventHandler<HTMLButtonElement>;
	} = $props();
</script>

<li class="menuItem">
	<button {onclick}>{title}</button>
</li>

<style>
	.menuItem {
		position: relative;
		white-space: nowrap;

		&:hover,
		&:focus-within {
			outline: none;
			background: var(--accent-color);
			color: white;

			@media (forced-colors: active) {
				background: CanvasText;
				color: Canvas;
			}
		}

		> * {
			all: unset;
			padding-inline: 22px;
		}
	}
</style>
