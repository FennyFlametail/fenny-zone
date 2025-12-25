<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import addToolbarEntry from '$lib/helpers/toolbar.svelte';
	import { ExternalLink } from 'lucide-svelte';

	let {
		entries
	}: {
		entries: AppName[];
	} = $props();

	const windowServer = getWindowServerContext();

	const gridTemplateColumns = `[list] 150px [separator] var(--titlebar-padding) [profile] auto;`;

	addToolbarEntry({
		snippet: toolbar,
		style: {
			'grid-template-columns': gridTemplateColumns,
			gap: '0'
		}
	});

	let selectedAppName = $state<AppName>();
	let selectedApp = $derived(selectedAppName ? windowServer.apps[selectedAppName] : undefined);

	function openApp(e: MouseEvent) {
		e.preventDefault();
		selectedAppName && windowServer.openApp(selectedAppName);
	}

	function deselect(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			selectedAppName = undefined;
		}
	}
</script>

<!-- TODO make this work without JS -->
{#snippet toolbar()}
	<a
		class={['aqua-button', 'square', 'icon', { disabled: !selectedAppName }]}
		title="Open in New Window"
		href={selectedApp?.route}
		onclick={openApp}
	>
		<ExternalLink size={18} />
	</a>
{/snippet}

<div class="addressBook brushedNoInset" style:grid-template-columns={gridTemplateColumns}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul class="addressBookList brushedInset" onclick={deselect}>
		<h3 class="addressBookListHeader">Name</h3>
		{#each entries as name}
			{@const app = windowServer.apps[name]}
			<li class={['addressBookListItem', { selected: selectedAppName === name }]}>
				<!-- FIXME don't change the URL (AppLink?) -->
				<a
					class="addressBookLink"
					href={app.route}
					onclick={() => (selectedAppName = name)}
					ondblclick={openApp}
				>
					<img class="addressBookListIcon" src={app.icon} alt="" draggable="false" />
					<span>{windowServer.apps[name].title}</span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="addressBookSeparator" data-allow-window-drag></div>
	<div class="addressBookProfile">
		{#if selectedApp}
			<selectedApp.Page />
		{:else}
			<p class="addressBookPlaceholder brushedInset">Select a character on the left</p>
		{/if}
	</div>
</div>

<style>
	.addressBook {
		display: grid;
	}

	.addressBookList {
		overflow-y: auto;
		background-color: white;
		padding: 0;
		-webkit-user-select: none;
		user-select: none;
	}

	.addressBookListHeader {
		border-bottom: 1px solid #b3b3b3;
		background: linear-gradient(to bottom, var(--button-gradient));
		text-align: center;
		font-size: 13px;
		font-weight: normal;
	}

	.addressBookListItem {
		list-style: none;

		&.selected {
			background-color: var(--accent-color);
			color: white;

			:global(.window.inactive) & {
				background-color: var(--accent-color-inactive);
				color: black;
			}
		}
	}

	.addressBookLink {
		display: flex;
		align-items: center;
		gap: 4px;
		padding-inline: 4px;
		color: inherit;
		text-decoration: none;
		@media not (scripting: none) {
			cursor: default;
		}
	}

	.addressBookListIcon {
		width: 16px;
		height: 16px;
	}

	.addressBookProfile {
		container: window / size;
		background-color: white;
		overflow: hidden;
		display: grid;
		grid-template: 100% / 100%;
	}

	.addressBookPlaceholder {
		text-align: center;
		align-content: center;
		color: var(--text-secondary);
		-webkit-user-select: none;
		user-select: none;
	}
</style>
