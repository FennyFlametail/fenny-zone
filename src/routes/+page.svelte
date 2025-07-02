<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import { loadAppsFromQueryString } from '$lib/windowServer.svelte';
	import { onMount } from 'svelte';

	onMount(loadAppsFromQueryString);
</script>

<MenuBar />
<Desktop />
<Dock />
