<script lang="ts">
	import TextEdit from '$lib/components/apps/TextEdit.svelte';
	import { getChangelog } from './changelog.remote';

	const changelog = await getChangelog();
</script>

<TextEdit>
	{#each Object.entries(changelog) as [date, lines]}
		<h3>{date}</h3>
		<ul>
			{#each lines as line}
				<li>{line}</li>
			{/each}
		</ul>
	{/each}
</TextEdit>

<style>
	ul {
		margin-bottom: 1em;
	}
</style>
