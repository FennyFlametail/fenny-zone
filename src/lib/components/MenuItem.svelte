<script lang="ts">
	import { browser } from '$app/environment';
	import { getMenubarContext } from '$lib/context.svelte';

	const {
		title,
		onclick,
		href,
		newTab,
		disabled,
		noScript
	}: {
		title: string;
		disabled?: boolean;
		onclick?: () => void;
		/** Show even if JavaScript is unavailable */
		noScript?: boolean;
	} & (
		| {
				href: string;
				/** Open in new tab (only if `href` is provided) */
				newTab?: boolean;
		  }
		| {
				href?: never;
				newTab?: never;
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
			href ? open(href, newTab ? '_blank' : '_self') : onclick?.();
			dismissMenu();
		}, openAnimDuration);
	}
</script>

{#if browser || noScript}
	<li
		class={['menuItem', { opening, disabled }]}
		style:--openAnimDuration={`${openAnimDuration}ms`}
	>
		{#if href}
			{#if !disabled}
				<a class="menuItemLink" {href} target={newTab ? '_blank' : '_self'} onclick={setSelected}
					>{title}</a
				>
			{:else}
				<span class="menuItemLink">{title}</span>
			{/if}
		{:else}
			<button onclick={setSelected} {disabled}>{title}</button>
		{/if}
	</li>
{/if}

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
