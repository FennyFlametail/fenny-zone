<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteDate } from 'svelte/reactivity';

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
</script>

{#if browser}
	<div class="menuClock">{formatter.format(date)}</div>
{/if}

<style>
	.menuClock {
		display: flex;
		align-items: center;
		cursor: default;
	}
</style>
