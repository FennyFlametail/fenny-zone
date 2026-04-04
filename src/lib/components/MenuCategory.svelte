<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	const {
		menubar,
		title,
		isLogo,
		isAppMenu,
		noScript,
		children
	}: {
		menubar: HTMLElement;
		title: string;
		isLogo?: boolean;
		isAppMenu?: boolean;
		/** Show even if JavaScript is unavailable */
		noScript?: boolean;
		children?: Snippet;
	} = $props();

	const nameTag = $derived(isAppMenu ? 'h1' : 'span');
	const label = $derived(isLogo ? 'System' : title);

	let details = $state<HTMLDetailsElement>();
	let summary = $state<HTMLElement>();

	function menuHover(e: PointerEvent) {
		let anyMenuOpen = menubar.querySelector('details[open]');
		if (!anyMenuOpen || !details) return;
		if (!details.open) {
			// open this menu, which will close the currently open one
			details.open = true;
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			details!.open = false;
			summary?.blur();
		}
	}
</script>

{#if browser || noScript}
	<details bind:this={details} class="menuCategory" name="menubar" onpointerenter={menuHover}>
		<summary bind:this={summary} class="menuName" aria-label="{label} Menu">
			<svelte:element this={nameTag} class={{ menuLogo: isLogo, menuApp: isAppMenu }}
				>{title}</svelte:element
			>
		</summary>
		<menu class="menu" aria-label="Menu Items">
			{@render children?.()}
		</menu>
	</details>
{/if}

<svelte:window {onkeydown} />

<style>
	.menuCategory {
		&:not([open])::details-content {
			content-visibility: visible;
			transition-property: opacity, display;
			transition-duration: 0.1s;
			transition-behavior: allow-discrete;
			opacity: 0;
			display: none;
			pointer-events: none;

			@media (prefers-reduced-motion: reduce) {
				transition-duration: 0s;
			}
		}

		&:is([open] ~ &, :global(:has(~ [open])))::details-content {
			transition: none;
		}
	}

	.menuName {
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1;
		padding-inline: var(--menu-category-padding);
		list-style-type: none;

		&:active,
		&:focus-visible,
		[open] & {
			outline: none;
			background: var(--menu-item-active-bg-image);
			color: white;
		}

		&::-webkit-details-marker {
			display: none;
		}
	}

	.menu {
		position: absolute;
		padding: 4px 0;
		list-style-type: none;
		box-shadow: var(--panel-box-shadow);
	}

	.menuLogo {
		background: linear-gradient(135deg, #3dadff, #1666ee);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;

		.menuName:active &,
		.menuName:focus-visible &,
		[open] & {
			background: none;
			-webkit-background-clip: text;
			background-clip: text;
			background-color: white;
		}
	}

	.menuApp {
		font-size: inherit;
		font-weight: bold;
	}
</style>
