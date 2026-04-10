<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AriaRole } from 'svelte/elements';
	const {
		role = 'alertDialog',
		ariaLabel,
		padding,
		icon,
		title,
		body,
		buttonsLeft,
		buttonsRight
	}: {
		role?: AriaRole;
		ariaLabel?: string;
		padding?: boolean;
		icon?: string;
		title: string;
		body: string;
		buttonsLeft?: Snippet;
		buttonsRight?: Snippet;
	} = $props();
</script>

<div class={['prompt', { padding }]} {role} aria-label={ariaLabel}>
	{#if icon}
		<img
			class="promptIcon"
			src={icon}
			alt=""
			width="85"
			height="85"
			draggable="false"
			aria-hidden="true"
		/>
	{/if}
	<h2 class="promptTitle">{title}</h2>
	<p class="promptBody">{body}</p>
	{#if buttonsLeft || buttonsRight}
		<div class="promptButtons">
			{@render buttonsLeft?.()}
			<div class="promptSpacer"></div>
			{@render buttonsRight?.()}
		</div>
	{/if}
</div>

<style>
	.prompt {
		display: grid;
		grid-template:
			'icon title' auto
			'icon body' 1fr
			'icon buttons' auto / auto 1fr;
		align-items: center;
		row-gap: 10px;
		-webkit-user-select: none;
		user-select: none;

		&.padding {
			padding: 22.5px 25px;
		}
	}

	.promptIcon {
		align-self: start;
		grid-area: icon;
		min-width: 85px;
		margin-right: 25px;
	}

	.promptTitle,
	.promptBody {
		line-height: 1.4;
		text-wrap: pretty;
		-webkit-user-select: none;
		user-select: none;
	}

	.promptTitle {
		grid-area: title;
		font-size: 16px;
	}

	.promptBody {
		grid-area: body;
		font-size: 14px;
		white-space: pre-line;
	}

	.promptButtons {
		grid-area: buttons;
		margin-top: 15px;
		display: flex;
		justify-content: space-between;
		gap: 20px;
	}

	.promptSpacer {
		flex-grow: 1;
	}
</style>
