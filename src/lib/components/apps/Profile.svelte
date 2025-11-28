<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import AppLink from '$lib/components/AppLink.svelte';
	import { type CharacterName, relationships } from '$lib/relationships';
	import type { Snippet } from 'svelte';
	const {
		name,
		image,
		bio,
		links
	}: {
		name: CharacterName;
		image: string;
		bio: Snippet;
		links: Snippet;
	} = $props();
</script>

<div class="profile" style:--image={`url('${image}')`}>
	<div class="container">
		<h3>About</h3>
		{@render bio()}
		{#if relationships[name]}
			<h3>Relationships</h3>
			{#each Object.entries(relationships[name]) as [character, text]}
				<h4>
					<AppLink appName={character.toLowerCase() as AppName}>{character}</AppLink>
				</h4>
				<p>{text}</p>
			{/each}
		{/if}
		<h3>Links</h3>
		{@render links()}
	</div>
</div>

<style>
	.profile {
		position: relative;
		width: 100%;
		height: 100%;
		padding-block-end: 20px;
		overflow-y: auto;
		background-color: white;
		/* images are resized to 512px high and 25% opacity */
		background-image: var(--image);
		background-size: auto 100%;
		background-position: right;
		background-repeat: no-repeat;
	}

	.container {
		max-width: 500px;
		text-wrap: pretty;
	}

	.profile :global(.color) {
		padding: 0.2em;
		border-radius: 0.2em;
	}

	h3,
	:global(h4) {
		padding-block-start: 1em;
		padding-block-end: 1em;
		padding-inline-start: 20px;
	}

	h3 + :global(h4) {
		padding-block-start: 0;
	}

	.profile :global(p) {
		padding-inline-start: 20px;
	}
</style>
