<script lang="ts">
	import Character from '$lib/components/apps/Character.svelte';
</script>

<Character name="Aren" image="/characters/aren.webp">
	{#snippet profile()}
		<ul>
			<li>Name: Aren Flametail</li>
			<li>Species: Ethiopian wolf</li>
			<li>Age: 24 (two months older than Fenny)</li>
			<li>Height: 6 ft (1.83 m)</li>
			<li>Pronouns: he/him</li>
			<li>Orientation: pansexual, aromantic</li>
			<li>
				Personality: outgoing, charismatic, confident, assertive
				<ul>
					<li>likes taking care of people</li>
					<li>aromantic, but has deep bonds with his friends</li>
				</ul>
			</li>
			<li>Voice: strong, deep but not booming</li>
			<li>
				Job: barista
				<ul>
					<li>wants to open his own cocktail bar</li>
				</ul>
			</li>
			<li>
				Interests/hobbies: coffee, cocktails, cooking, fitness, music
				<ul>
					<li>plays guitar</li>
				</ul>
			</li>
			<li>Favorite color: <span class="color">forest green</span></li>
			<li>Favorite food: Korean BBQ</li>
			<li>Favorite drink: iced black coffee</li>
			<li>Favorite ice cream flavor: dark chocolate gelato</li>
			<li>Favorite music genres: punk, ska, hip-hop & rap, indie rock</li>
			<li>Clothing style: casual, comfortable, understated</li>
			<li>
				Typical outfit:
				<ul>
					<li>green or brown bomber jacket with simple tee underneath</li>
					<ul>
						<li>leather jacket when riding his motorcycle</li>
					</ul>
					<li>blue denim jeans, or cargo pants or shorts</li>
					<li>sneakers</li>
				</ul>
			</li>
			<li>Vehicle: yellow Honda CBR600F4i</li>
		</ul>
	{/snippet}

	{#snippet links()}
		<ul>
			<li>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/37715/Aren"
					>Gallery (contains NSFW)</a
				>
			</li>
			<li>
				Background art by <a target="_blank" href="https://www.furaffinity.net/user/WickedForster/"
					>WickedForster</a
				>
			</li>
			<li>
				Icon by <a target="_blank" href="https://bsky.app/profile/buyo.bsky.social">Buyo</a>
			</li>
		</ul>
	{/snippet}
</Character>

<style>
	.color {
		background-color: #3b702a;
		color: white;
	}
</style>
