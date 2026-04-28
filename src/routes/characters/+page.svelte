<script lang="ts">
	import type { AppName, AppProps } from '$lib/apps.svelte';
	import AppLink from '$lib/components/AppLink.svelte';
	import WindowToolbar from '$lib/components/WindowToolbar.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import { ExternalLink } from 'lucide-svelte';

	const { character }: AppProps<'characters'> = $props();

	const windowServer = getWindowServerContext();

	const characters: AppName[] = ['fenny', 'aren', 'ceph', 'rigel', 'nocturne'];

	let selectedAppName = $state(character);
	let selectedApp = $derived(selectedAppName ? windowServer.apps[selectedAppName] : undefined);

	function openHandler(appName: AppName) {
		return (e: MouseEvent) => {
			e.preventDefault();
			selectedAppName = appName;
		};
	}

	function openInNewWindow(e: MouseEvent) {
		e.preventDefault();
		selectedAppName && windowServer.openApp(selectedAppName);
	}

	function deselect(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			selectedAppName = undefined;
		}
	}
</script>

<div class="addressBook brushedNoInset">
	<WindowToolbar class="noJS-hide">
		<a
			class={['aqua-button', 'square', { disabled: !selectedAppName }]}
			role="button"
			title="Open in New Window"
			aria-label="Open in New Window"
			aria-disabled={!selectedAppName}
			href={selectedApp?.route}
			onclick={openInNewWindow}
		>
			<ExternalLink size={18} aria-hidden="true" />
		</a>
	</WindowToolbar>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul class="addressBookList brushedInset" aria-label="Character List" onclick={deselect}>
		<h3 class="addressBookListHeader">Name</h3>
		{#each characters as appName}
			{@const app = windowServer.apps[appName]}
			<li class={['addressBookListItem', { selected: selectedAppName === appName }]}>
				<AppLink
					{appName}
					class="addressBookLink noJS-pointer"
					onclick={openHandler(appName)}
					ondblclick={openInNewWindow}
				>
					<img class="addressBookListIcon" src={app.icon} alt="" draggable="false" />
					<span>{windowServer.apps[appName].title}</span>
				</AppLink>
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
		grid-template:
			'toolbar toolbar toolbar' auto
			'list separator profile' 1fr / 150px var(--titlebar-padding) auto;
	}

	.addressBookList {
		grid-area: list;
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
			background: var(--sidebar-item-active-bg-image);
			color: white;

			:global(.window:is(.inactive, .sheetOpen)) & {
				background: var(--sidebar-item-inactive-bg-image);
			}

			@media (forced-colors: active) {
				background-color: SelectedItem;
			}
		}
	}

	:global(.addressBookLink) {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px;
		color: inherit;
		text-decoration: none;
	}

	.addressBookListIcon {
		width: 32px;
		height: 32px;
	}

	.addressBookSeparator {
		grid-area: separator;
	}

	.addressBookProfile {
		grid-area: profile;
		container: window / size;
		background-color: white;
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
