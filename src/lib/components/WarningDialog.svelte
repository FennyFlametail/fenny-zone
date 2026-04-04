<script lang="ts">
	import WarningTriangle from '$lib/images/icons/warning.webp';
	import type { Snippet } from 'svelte';
	import type { AriaRole } from 'svelte/elements';

	const {
		title,
		body,
		role = 'alert',
		buttonsLeft,
		buttonsRight
	}: {
		title: string;
		body: string;
		role?: AriaRole;
		buttonsLeft: Snippet;
		buttonsRight: Snippet;
	} = $props();
</script>

<div class="dialog" {role} aria-label="Warning dialog">
	<img
		class="dialogIcon"
		src={WarningTriangle}
		alt="Warning triangle"
		draggable="false"
		aria-hidden="true"
	/>
	<h2 class="dialogTitle">{title}</h2>
	<p class="dialogBody">{body}</p>
	<div class="dialogButtons">
		{@render buttonsLeft()}
		<div class="dialogSpacer"></div>
		{@render buttonsRight()}
	</div>
</div>

<style>
	.dialog {
		display: grid;
		grid-template:
			'icon header' auto
			'icon body' auto
			'icon buttons' auto / auto 1fr;
		padding: 22.5px 25px;
		column-gap: 25px;
		row-gap: 20px;
		line-height: 1.3;
		-webkit-user-select: none;
		user-select: none;
	}

	.dialogIcon {
		grid-area: icon;
		height: 88px;
		width: 88px;
	}

	.dialogTitle {
		font-size: 17px;
		text-wrap: pretty;
	}

	.dialogBody {
		font-size: 15px;
		white-space: pre-line;
	}

	.dialogButtons {
		display: flex;
		align-items: flex-end;
		gap: 18px;
	}

	.dialogSpacer {
		flex-grow: 1;
	}
</style>
