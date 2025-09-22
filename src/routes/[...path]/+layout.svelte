<script lang="ts">
	import '$lib/styles/app.css';
	import '$lib/styles/Aqua.css';
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

{@render children()}
