<script lang="ts">
	import Browser from '$lib/components/Browser.svelte';
	import { getAppContext } from '$lib/context';

	const { app } = getAppContext();
</script>

<Browser src={app.url!} />
