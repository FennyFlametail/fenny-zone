<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
	import ArenPhoto from '$lib/images/characters/aren.webp';
</script>

<Profile
	character="aren"
	species="Ethiopian Wolf"
	iconAlt="Icon of a rugged-looking wolf, grinning at you in an alluring way."
	photo={ArenPhoto}
	photoAlt="A wolf with a goatee, wearing a bomber jacket and confidently playing the guitar."
>
	{#snippet bio()}
		<dl>
			<dt>Age</dt>
			<dd>24 (two months older than Fenny)</dd>

			<dt>Height</dt>
			<dd>6 ft 1 in (1.85 m)</dd>

			<dt>Pronouns</dt>
			<dd>he/him</dd>

			<dt>Orientation</dt>
			<dd>pansexual, aromantic</dd>

			<dt>Personality</dt>
			<dd>
				outgoing, charismatic, confident, assertive
				<ul>
					<li>aromantic, but cares for his friends deeply</li>
				</ul>
			</dd>

			<dt>Voice</dt>
			<dd>strong, deep but not booming</dd>

			<dt>Job</dt>
			<dd>
				barista
				<ul>
					<li>wants to open his own cocktail bar</li>
				</ul>
			</dd>

			<dt>Interests</dt>
			<dd>
				coffee, mixology, cooking, fitness, music
				<ul>
					<li>plays guitar, likes to play while Nocturne sings</li>
				</ul>
			</dd>

			<dt>Fav. color</dt>
			<dd><span class="profileColor">forest green</span></dd>

			<dt>Fav. food</dt>
			<dd>Korean BBQ</dd>

			<dt>Fav. drink</dt>
			<dd>iced black coffee</dd>

			<dt>Fav. ice cream flavor</dt>
			<dd>stracciatella</dd>

			<dt>Fav. music genres</dt>
			<dd>punk, ska, hip-hop & rap, indie rock</dd>

			<dt>Clothing style</dt>
			<dd>casual, comfortable, understated</dd>

			<dt>Typical outfit</dt>
			<dd>
				<ul>
					<li>green or brown bomber jacket with plain colored tee</li>
					<li>blue denim jeans, or cargo pants or shorts</li>
					<li>sneakers</li>
				</ul>
			</dd>

			<dt>Vehicle</dt>
			<dd>
				<a href="https://hondanews.com/en-US/photos/2003-honda-cbr600rr-15" target="_blank"
					>yellow Honda CBR600RR</a
				>
			</dd>

			<dt>Notes</dt>
			<dd>
				<ul>
					<li>gets cold easily (because of his large ears)</li>
					<li>holds things in his mouth out of habit</li>
					<li>can’t sleep without hugging something (or someone)</li>
					<li>likes karaoke</li>
				</ul>
			</dd>
		</dl>
	{/snippet}

	{#snippet links()}
		<dl>
			<dt>Ref sheet</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/63462120/">FurAffinity</a></dd>
			<dt>Ref (NSFW)</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/21101322/">FurAffinity</a></dd>
			<dt>Gallery</dt>
			<dd>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/37715/Aren">FurAffinity</a
				>
			</dd>
			<dt>Icon</dt>
			<dd><a target="_blank" href="https://bsky.app/profile/buyo.bsky.social">Buyo</a></dd>
			<dt>Artwork</dt>
			<dd>
				<a target="_blank" href="https://www.furaffinity.net/user/WickedForster/">WickedForster</a>
			</dd>
		</dl>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #3b702a;
		color: white;
	}
</style>
