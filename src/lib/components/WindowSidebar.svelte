<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const {
		type = 'normal',
		header,
		lowerViewHeader,
		lowerView,
		class: className,
		children,
		...rest
	}: {
		type?: 'normal' | 'iTunes';
		header?: string;
		lowerViewHeader?: string;
		lowerView?: Snippet;
		children?: Snippet;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<nav class={['windowSidebar', { itunes: type === 'iTunes' }, className]} {...rest}>
	{#if header}
		<h3 class="windowSidebarHeader">{header}</h3>
	{/if}

	<ul class="windowSidebarItems">
		{@render children?.()}
	</ul>

	{#if lowerViewHeader}
		<h4 class="windowSidebarHeader">{lowerViewHeader}</h4>
	{/if}
	{@render lowerView?.()}
</nav>

<style>
	.windowSidebar {
		grid-area: sidebar;
		width: var(--sidebar-width);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		background-color: white;
		-webkit-user-select: none;
		user-select: none;
	}

	.windowSidebarHeader {
		border-bottom: 1px solid #b3b3b3;
		background: linear-gradient(to bottom, var(--button-gradient));
		text-align: center;
		font-size: var(--table-font-size);
		font-weight: normal;

		.windowSidebar.itunes & {
			background: linear-gradient(to bottom, #e9e9e9, #8c8b8b);
			text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
			border-bottom-color: #666666;

			:global(.window.inactive) & {
				color: var(--text-secondary);
			}
		}
	}

	.windowSidebarItems {
		flex-grow: 1;
		padding: 0;

		&:not(:last-child) {
			border-bottom: 1px solid #404040;
		}
	}
</style>
