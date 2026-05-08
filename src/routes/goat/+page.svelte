<script lang="ts">
	import Browser from '$lib/components/apps/Browser.svelte';
	import { getAppContext } from '$lib/context.svelte';

	const { app } = getAppContext();
</script>

<Browser url={app.url!} />
