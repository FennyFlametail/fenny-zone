<script lang="ts">
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowLayer from '$lib/components/WindowLayer.svelte';
	import { loadState } from '$lib/windowServer.svelte';
	import { onMount } from 'svelte';

	onMount(loadState);
</script>

<MenuBar />
<Desktop />
<WindowLayer />
<Dock />
