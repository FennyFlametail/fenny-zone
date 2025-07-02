<script module lang="ts">
	import Browser from '$lib/components/Browser.svelte';
	import type { AppMetadata } from '$lib/types/RunningApp';
	export const metadata: AppMetadata = {
		key: 'sauce',
		title: 'CLICK FOR SAUCE',
		icon: 'icons/safari.png'
	};
</script>

<Browser src="https://sauce.fenny.zone" />
