<script module lang="ts">
	import Browser from '$lib/components/Browser.svelte';
	import type { AppMetadata } from '$lib/types/AppTypes';
	export const metadata: AppMetadata = {
		key: 'toddspin',
		title: 'Toddspin',
		icon: 'icons/toddspin.png',
		size: {
			height: 800
		}
	};
</script>

<Browser src="https://toddspin.fenny.zone" />
