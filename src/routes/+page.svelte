<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowServer, { loadState } from '$lib/components/WindowServer.svelte';
	import { onMount } from 'svelte';

	onMount(loadState);
</script>

<MenuBar />
<Desktop />
<WindowServer />
<Dock />
