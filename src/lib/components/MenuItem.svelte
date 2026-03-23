<script lang="ts">
	import { browser } from '$app/environment';
	import { getMenubarContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	const {
		disabled,
		checked,
		onclick,
		href,
		newTab,
		noScript,
		children
	}: {
		disabled?: boolean;
		checked?: boolean;
		onclick?: () => void;
		/** Show even if JavaScript is unavailable */
		noScript?: boolean;
		children?: Snippet;
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
	const openAnimDuration = $derived(prefersReducedMotion.current ? 0 : 200);

	function setSelected(e: MouseEvent) {
		e.preventDefault();
		opening = true;
		window.setTimeout(() => {
			opening = false;
			if (href) {
				open(href, newTab ? '_blank' : '_self');
			} else {
				onclick?.();
			}
			dismissMenu();
		}, openAnimDuration);
	}
</script>

{#if browser || noScript}
	<li class={['menuItem', { opening, disabled }]} style:--openAnimDuration="{openAnimDuration}ms">
		{#if checked}
			<span class="menuItemCheckmark">✓</span>
		{/if}
		{#if href}
			{#if !disabled}
				<a class="menuItemLink" {href} target={newTab ? '_blank' : '_self'} onclick={setSelected}
					>{@render children?.()}</a
				>
			{:else}
				<span class="menuItemLink">{@render children?.()}</span>
			{/if}
		{:else}
			<button class="menuItemButton" onclick={setSelected} {disabled}>{@render children?.()}</button
			>
		{/if}
	</li>
{/if}

<style>
	.menuItem {
		--menu-item-padding: 22px;
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
					text-decoration: underline;
				}
			}
		}

		@media not (prefers-reduced-motion: reduce) {
			&.opening {
				animation: var(--openAnimDuration) steps(2, jump-none) selectItem;
			}
		}
	}

	.menuItemCheckmark {
		position: absolute;
		left: 0;
		width: var(--menu-item-padding);
		text-align: center;
	}

	.menuItemLink,
	.menuItemButton {
		all: unset;
		padding-inline: var(--menu-item-padding);
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
