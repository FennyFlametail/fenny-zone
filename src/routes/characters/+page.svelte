<script lang="ts">
	import type { AppName, AppProps } from '$lib/apps.svelte';
	import AppLink from '$lib/components/AppLink.svelte';
	import WindowSidebar from '$lib/components/WindowSidebar.svelte';
	import WindowSidebarItem from '$lib/components/WindowSidebarItem.svelte';
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
	<WindowSidebar
		header="Name"
		class="addressBookList brushedInset"
		aria-label="Character List"
		onclick={deselect}
	>
		{#each characters as appName}
			{@const app = windowServer.apps[appName]}
			<WindowSidebarItem class="addressBookListItem" selected={selectedAppName === appName}>
				<AppLink
					{appName}
					class="addressBookLink noJS-pointer"
					onclick={openHandler(appName)}
					ondblclick={openInNewWindow}
				>
					<img class="addressBookListIcon" src={app.icon} alt="" draggable="false" />
					<span>{windowServer.apps[appName].title}</span>
				</AppLink>
			</WindowSidebarItem>
		{/each}
	</WindowSidebar>
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
			'toolbar toolbar' auto
			'sidebar content' 1fr / auto 1fr;
		column-gap: var(--titlebar-padding);
	}

	:global(.addressBookLink) {
		display: flex;
		align-items: center;
		gap: var(--sidebar-item-padding);
		padding: var(--sidebar-item-padding);
		color: inherit;
		text-decoration: none;
	}

	.addressBookListIcon {
		width: 32px;
		height: 32px;
	}

	.addressBookProfile {
		grid-area: content;
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
