<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile
	character="fenny"
	species="Red-Fennec Fox"
	iconAlt="Icon of a fox with messy hair, smiling cheerfully at you."
	photo="/characters/fenny.webp"
	photoAlt="A shirtless fox, lifting his sunglasses and giving you a friendly grin. He has ear and nipple piercings."
>
	{#snippet bio()}
		<dt>Age</dt>
		<dd>24</dd>

		<dt>Height</dt>
		<dd>6 ft 2 in (1.88 m) (minus ears)</dd>

		<dt>Pronouns</dt>
		<dd>he/him</dd>

		<dt>Orientation</dt>
		<dd>gay</dd>

		<dt>Personality</dt>
		<dd>
			upbeat, caring, affectionate, impulsive, procrastinates a lot
			<ul>
				<li>gets energetic when he’s excited, like a fennec</li>
				<li>disorganized, but good at finding things</li>
			</ul>
		</dd>

		<dt>Voice</dt>
		<dd>
			warm and friendly, emotive, a bit loud
			<ul>
				<li>a bit scatterbrained, says "like" a lot</li>
			</ul>
		</dd>

		<dt>Job</dt>
		<dd>web developer</dd>

		<dt>Interests</dt>
		<dd>food, baking, video games, technology, plants</dd>

		<dt>Fav. color</dt>
		<dd><span class="profileColor">purple</span></dd>

		<dt>Fav. food</dt>
		<dd>
			cinnamon rolls
			<ul>
				<li>loves desserts</li>
			</ul>
		</dd>

		<dt>Fav. drink</dt>
		<dd>bubble tea</dd>

		<dt>Fav. ice cream flavor</dt>
		<dd>cotton candy</dd>

		<dt>Fav. music genres</dt>
		<dd>pop, punk, ska, symphonic &amp; power metal</dd>

		<dt>Clothing style</dt>
		<dd>bright colors, 2000s skater-inspired</dd>

		<dt>Typical outfit</dt>
		<dd>
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
		</dd>

		<dt>Notes</dt>
		<dd>
			<ul>
				<li>gets cold easily (because of his large ears)</li>
				<li>holds things in his mouth out of habit</li>
				<li>sits in chairs wrong</li>
				<li>likes karaoke</li>
				<li>can’t sleep without hugging something (or someone)</li>
			</ul>
		</dd>
	{/snippet}
	{#snippet links()}
		<dt>Gallery (18+)</dt>
		<dd>
			<a target="_blank" href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/37713/Fenny"
				>FurAffinity</a
			>
		</dd>
		<dt>Icon</dt>
		<dd><a target="_blank" href="https://bsky.app/profile/buyo.bsky.social">Buyo</a></dd>
		<dt>Artwork</dt>
		<dd><a target="_blank" href="https://bsky.app/profile/azucaster.bsky.social">Azu</a></dd>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #800ed5;
		color: white;
	}
</style>
