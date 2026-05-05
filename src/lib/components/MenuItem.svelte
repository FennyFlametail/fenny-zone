<script lang="ts">
	import { browser } from '$app/environment';
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
	const itemId = $props.id();

	let opening = $state(false);
	const openAnimDuration = $derived(prefersReducedMotion.current ? 0 : 200);

	let item = $state<HTMLLIElement>();
	function setSelected(e: MouseEvent) {
		e.preventDefault();
		if (opening) return;
		opening = true;
		window.setTimeout(() => {
			opening = false;
			if (href) {
				open(href, newTab ? '_blank' : '_self');
			} else {
				onclick?.();
			}

			const parent = item!.parentElement as HTMLElement;
			if (parent.popover) parent.hidePopover();
		}, openAnimDuration);
	}
</script>

{#if browser || noScript}
	<li
		bind:this={item}
		class={['menuItem', { opening, disabled, checked }]}
		style:--openAnimDuration="{openAnimDuration}ms"
		role="menuitem"
		aria-labelledby={itemId}
		aria-disabled={disabled}
	>
		{#if checked}
			<span class="menuItemCheckmark">✓</span>
		{/if}
		{#if href}
			{#if !disabled}
				<a
					id={itemId}
					class="menuItemLink"
					{href}
					target={newTab ? '_blank' : '_self'}
					onclick={setSelected}
					onpointerup={setSelected}>{@render children?.()}</a
				>
			{:else}
				<span id={itemId} class="menuItemLink">{@render children?.()}</span>
			{/if}
		{:else}
			<button
				id={itemId}
				class="menuItemButton"
				onclick={setSelected}
				onpointerup={setSelected}
				{disabled}>{@render children?.()}</button
			>
		{/if}
	</li>
{/if}

<style>
	.menuItem {
		position: relative;
		display: flex;
		flex-flow: column;
		align-items: stretch;
		font-size: 16px;
		line-height: 1.5;
		white-space: nowrap;

		&.disabled {
			opacity: 0.5;
		}

		&:not(.disabled):is(:hover, :focus-within) {
			outline: none;
			background-color: var(--menu-option-active-bg-color);
			color: white;

			.menuItemCheckmark {
				color: white;
			}

			@media (forced-colors: active) {
				background-color: CanvasText;
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
		color: #59595a;
		text-align: center;
	}

	.menuItemLink,
	.menuItemButton {
		all: unset;
		padding-inline: var(--menu-item-padding);
		cursor: default;
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
