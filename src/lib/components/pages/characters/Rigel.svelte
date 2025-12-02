<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile name="Rigel" image="/characters/rigel.webp">
	{#snippet bio()}
		<ul>
			<li>Name: Rigel Azulux</li>
			<li>Species: Luxray</li>
			<li>Age: 27</li>
			<li>Height: 5 ft 8 in (1.73 m)</li>
			<li>Pronouns: he/him</li>
			<li>Orientation: gay</li>
			<li>
				Personality: huge party animal, cocky, reckless, hotheaded
				<ul>
					<li>lives in the moment, struggles to plan long-term</li>
					<li>not very reliable, but has a good heart</li>
					<li>not against relationships, but not seeking one out</li>
					<li>dislikes authority</li>
				</ul>
			</li>
			<li>
				Voice: slightly raspy like Ceph’s, but louder and stronger
				<ul>
					<li>fast talker, often speaks without thinking</li>
				</ul>
			</li>
			<li>Job: delivery person and various other gig jobs</li>
			<li>Interests: partying, punk shows, graffiti</li>
			<li>Favorite color: <span class="profileColor">dark pink</span></li>
			<li>
				Favorite food: pizza
				<ul>
					<li>not an adventurous eater, lives off take-out and frozen food</li>
				</ul>
			</li>
			<li>Favorite drink: energy drinks and hard seltzer</li>
			<li>Favorite ice cream flavor: strawberry shortcake bars</li>
			<li>Favorite music genres: punk, ska, alternative</li>
			<li>Clothing style: punk (or raver when he's partying)</li>
			<li>
				Typical outfit:
				<ul>
					<li>denim or leather vest with lots of pins & patches</li>
					<li>ripped jeans</li>
					<li>worn canvas shoes</li>
					<li>occasional beanie</li>
				</ul>
			</li>
			<li>
				Notes:
				<ul>
					<li>trans</li>
					<li>bioluminescent parts glow brighter when excited or angry</li>
					<li>into astrology</li>
				</ul>
			</li>
		</ul>
	{/snippet}

	{#snippet links()}
		<ul>
			<li>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/1563925/Rigel"
					>Gallery (18+)</a
				>
			</li>
			<li>
				Background art by <a target="_blank" href="https://www.furaffinity.net/user/candymint/"
					>candymint</a
				>
			</li>
			<li>
				Icon by <a target="_blank" href="https://www.furaffinity.net/user/redlynx369">RojoLynx</a>
			</li>
		</ul>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #a92365;
		color: white;
	}
</style>
