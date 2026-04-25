<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteDate } from 'svelte/reactivity';
	import { getWindowServerContext } from '$lib/context.svelte';

	const windowServer = getWindowServerContext();
	const date = new SvelteDate();

	const formatter = new Intl.DateTimeFormat(undefined, {
		weekday: 'short',
		hour: 'numeric',
		minute: 'numeric'
	});

	$effect(() => {
		const interval = setInterval(() => {
			date.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	function onclick(e: MouseEvent) {
		if (e.metaKey && e.shiftKey) {
			windowServer.openApp('crashDialog', {
				props: {
					crashedAppName: windowServer.focusedApp?.name ?? windowServer.apps.finder.title
				}
			});
		} else if (e.altKey && e.shiftKey) {
			windowServer.openApp('adblockWarning');
		}
	}
</script>

{#if browser}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="menuClock" {onclick}>{formatter.format(date)}</div>
{/if}

<style>
	.menuClock {
		display: flex;
		align-items: center;
	}
</style>
