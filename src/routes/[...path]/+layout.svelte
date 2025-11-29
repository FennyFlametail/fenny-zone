<script lang="ts">
	import { setWindowServerContext } from '$lib/context';
	import '$lib/styles/app.css';
	import '$lib/styles/Aqua.css';
	import WindowServer from '$lib/windowServer.svelte';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();

	const windowServer = new WindowServer();
	windowServer.initialAppName = data.initialAppName;
	setWindowServerContext(windowServer);
</script>

{@render children()}
