<script module lang="ts">
	import Browser from '$lib/components/Browser.svelte';
	import type { AppMetadata } from '$lib/types/AppTypes';
	export const metadata: AppMetadata = {
		key: 'goat',
		title: 'Monty Hall Problem',
		icon: 'icons/goat.png',
		size: {
			height: 800
		}
	};
</script>

<Browser src="https://monty-hall.fenny.zone" />
