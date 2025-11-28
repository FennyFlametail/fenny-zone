<script lang="ts">
	import Character from '$lib/components/apps/Character.svelte';
</script>

<Character name="Fenny" image="/characters/fenny.webp">
	{#snippet profile()}
		<ul>
			<li>Name: Fenny Flametail</li>
			<li>Species: red-fennec fox</li>
			<li>Age: 24</li>
			<li>Height: 6 ft 2 in (1.88 m) (minus ears)</li>
			<li>Pronouns: he/him</li>
			<li>Orientation: gay</li>
			<li>
				Personality: upbeat, caring, affectionate, impulsive, procrastinates a lot
				<ul>
					<li>gets bursts of energy when he’s excited, like a fennec</li>
					<li>disorganized, but knows where to find things</li>
				</ul>
			</li>
			<li>
				Voice: warm and friendly, emotive, a bit loud
				<ul>
					<li>a bit scatterbrained, says "like" a lot</li>
				</ul>
			</li>
			<li>Job: web developer</li>
			<li>Interests/hobbies: food, baking, video games, technology, plants</li>
			<li>Favorite color: <span class="color">purple</span></li>
			<li>
				Favorite food: cinnamon rolls
				<ul>
					<li>loves desserts</li>
				</ul>
			</li>
			<li>Favorite drink: bubble tea</li>
			<li>Favorite ice cream flavor: cotton candy</li>
			<li>Favorite music genres: pop, punk, ska, symphonic &amp; power metal</li>
			<li>
				Clothing style: bright colors, 2000s skater culture-inspired
				<ul>
					<li>likes fox-themed clothing and accessories</li>
				</ul>
			</li>
			<li>
				Typical outfit:
				<ul>
					<li>colorful zip-up hoodie</li>
					<ul>
						<li>borrows Aren’s jackets sometimes</li>
					</ul>
					<li>optional: colorful bandana</li>
					<li>graphic tee</li>
					<li>jeans or cargo pants (doesn't like shorts)</li>
					<li>colorful socks and undies (shared with Ceph)</li>
					<li>colorful sneakers or canvas shoes</li>
				</ul>
			</li>
			<li>
				Notes:
				<ul>
					<li>gets cold easily (because of his large ears)</li>
					<li>holds things in his mouth out of habit</li>
					<li>can’t sleep without hugging something (or someone)</li>
					<li>likes karaoke</li>
				</ul>
			</li>
		</ul>
	{/snippet}

	{#snippet links()}
		<ul>
			<li>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/37713/Fenny"
					>Gallery (18+)</a
				>
			</li>
			<li>
				Background art by <a target="_blank" href="https://bsky.app/profile/azucaster.bsky.social"
					>Azu</a
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
		background-color: #800ed5;
		color: white;
	}
</style>
