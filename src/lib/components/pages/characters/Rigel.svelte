<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile
	character="rigel"
	species="Luxray"
	iconAlt="Icon of a masculine Luxray with sunglasses. He's licking an ice cream cone provocatively with his pierced tongue."
	photo="/characters/rigel.webp"
	photoAlt="A nude Luxray facing away from you, sticking his tongue out seductively. He has a single earring on his right ear."
>
	{#snippet bio()}
		<dt>Age</dt>
		<dd>27</dd>

		<dt>Height</dt>
		<dd>5 ft 8 in (1.73 m)</dd>

		<dt>Pronouns</dt>
		<dd>he/him</dd>

		<dt>Orientation</dt>
		<dd>gay</dd>

		<dt>Personality</dt>
		<dd>
			cocky, reckless, hotheaded, rebellious
			<ul>
				<li>huge party animal</li>
				<li>lives in the moment, struggles to plan long-term</li>
				<li>not very reliable, but has a good heart</li>
				<li>not against relationships, but not seeking one out</li>
			</ul>
		</dd>

		<dt>Voice</dt>
		<dd>
			slightly raspy like Ceph's, but louder and more boisterous
			<ul>
				<li>fast talker, often speaks without thinking</li>
			</ul>
		</dd>

		<dt>Job</dt>
		<dd>delivery person, and various other gig jobs</dd>

		<dt>Interests</dt>
		<dd>partying, punk shows, graffiti, skateboarding</dd>

		<dt>Fav. color</dt>
		<dd><span class="profileColor">dark pink</span></dd>

		<dt>Fav. food</dt>
		<dd>
			pizza
			<ul>
				<li>not an adventurous eater, lives off take-out and frozen food</li>
			</ul>
		</dd>

		<dt>Fav. drink</dt>
		<dd>energy drinks and hard seltzer</dd>

		<dt>Fav. ice cream flavor</dt>
		<dd>strawberry shortcake bars</dd>

		<dt>Fav. music genres</dt>
		<dd>punk, ska, alternative, EDM</dd>

		<dt>Clothing style</dt>
		<dd>
			punk (or raver when he's partying)
			<ul>
				<li>likes fox-themed clothing and accessories</li>
			</ul>
		</dd>

		<dt>Typical outfit</dt>
		<dd>
			<ul>
				<li>denim or leather vest, with lots of pins & patches</li>
				<li>ripped jeans</li>
				<li>worn canvas shoes</li>
				<li>occasional beanie</li>
			</ul>
		</dd>

		<dt>Notes</dt>
		<dd>
			<ul>
				<li>trans</li>
				<li>bioluminescent parts glow brighter when excited or angry</li>
				<li>likes astrology</li>
			</ul>
		</dd>
	{/snippet}

	{#snippet links()}
		<dt>Gallery (18+)</dt>
		<dd>
			<a
				target="_blank"
				href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/1563925/Rigel">FurAffinity</a
			>
		</dd>
		<dt>Icon</dt>
		<dd><a target="_blank" href="https://www.furaffinity.net/user/redlynx369">RojoLynx</a></dd>
		<dt>Artwork</dt>
		<dd><a target="_blank" href="https://www.furaffinity.net/user/candymint/">candymint</a></dd>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #a92365;
		color: white;
	}
</style>
