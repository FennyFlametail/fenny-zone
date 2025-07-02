<script module lang="ts">
	import Browser from '$lib/components/Browser.svelte';
	import type { AppMetadata } from '$lib/types/RunningApp';
	export const metadata: AppMetadata = {
		key: 'toddspin',
		title: 'Toddspin',
		icon: 'icons/toddspin.png'
	};
</script>

<Browser src="https://toddspin.fenny.zone" />
