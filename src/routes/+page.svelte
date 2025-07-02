<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowServer, { loadAppsFromQueryString } from '$lib/components/WindowServer.svelte';
	import { onMount } from 'svelte';

	onMount(loadAppsFromQueryString);
</script>

<MenuBar />
<Desktop />
<WindowServer />
<Dock />
