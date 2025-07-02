<script lang="ts">
	import Browser from '$lib/components/apps/Browser.svelte';
	import { getAppContext } from '$lib/context';

	const { app } = getAppContext();
</script>

<Browser src={app.url!} />
