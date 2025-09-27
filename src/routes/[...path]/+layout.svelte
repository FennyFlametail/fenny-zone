<script lang="ts">
	import { setWindowServerContext } from '$lib/context';
	import '$lib/styles/app.css';
	import '$lib/styles/Aqua.css';
	import WindowServer from '$lib/windowServer.svelte';
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();

	setWindowServerContext(new WindowServer());
</script>

{@render children()}
