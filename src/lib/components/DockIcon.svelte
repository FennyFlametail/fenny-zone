<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { App, RunningApp } from '$lib/types/App';
	import { focusApp, openApp, runningApps } from '$lib/windowServer.svelte';

	const {
		app
	}: {
		app: App;
	} = $props();

	let instance = $state<RunningApp>();

	onMount(async () => {
		await tick();
		// on page load, check if there is a running instance of the app
		for (const runningApp of runningApps) {
			if (runningApp.Component === app.default) {
				instance = runningApp;
				break;
			}
		}
	});

	function onclick() {
		if (instance) {
			focusApp(instance);
		} else {
			instance = openApp(app);
		}
	}

	function onAppClose(e: CustomEvent<RunningApp>) {
		if (e.detail.id === instance?.id) {
			instance = undefined;
		}
	}
</script>

<button class={['dockIcon', { open: instance }]} {onclick}>
	<span class="dockIconLabel">{app.metadata.title}</span>
	<img src={app.metadata.icon} alt={app.metadata.title} class="dockIconImage" draggable="false" />
</button>

<svelte:window {onAppClose} />

<style>
	/* TODO better focus indicator */
	.dockIcon {
		flex-shrink: 0;
		width: var(--icon-size);
		height: var(--icon-size);
		position: relative;
		box-sizing: content-box;
		padding: 0 calc(var(--padding) / 2);
		background: none;
		border: none;
		transition: 0.25s ease;
		transition-property: width, height, margin-bottom;
		-webkit-user-select: none;
		user-select: none;

		&:active img {
			filter: brightness(0.5);
		}

		&:hover {
			margin-bottom: 10px;
			width: calc(var(--icon-size) * 2);
			height: calc(var(--icon-size) * 2);
		}

		/* icons next to hovered */
		:global(&:has(+ &:hover), &:hover + &) {
			margin-bottom: 10px;
			width: calc(var(--icon-size) * 1.8);
			height: calc(var(--icon-size) * 1.8);
		}

		/* icons two away from hovered */
		:global(&:has(+ & + &:hover), &:hover + & + &) {
			margin-bottom: 5px;
			width: calc(var(--icon-size) * 1.4);
			height: calc(var(--icon-size) * 1.4);
		}

		/* open indicator */
		/* TODO fade in/out? */
		&.open::after {
			position: fixed;
			bottom: 1px;
			translate: -50%;
			content: '';
			border-left: 4px solid transparent;
			border-right: 4px solid transparent;
			border-bottom: 5px solid black;
		}
	}

	/* TODO fade out */
	.dockIconLabel {
		display: none;

		.dockIcon:hover & {
			display: inline;
			position: absolute;
			bottom: calc(100% + 5px);
			translate: -50%;
			white-space: nowrap;
			color: white;
			text-shadow:
				black 0 1px 1px,
				black 0 1px 3px,
				black 0 1px 5px;
		}
	}
</style>
