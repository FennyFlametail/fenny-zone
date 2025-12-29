<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
	import RigelPhoto from '$lib/images/characters/rigel.webp';
</script>

<Profile
	character="rigel"
	species="Luxray"
	iconAlt="Icon of a Luxray facing away from you, sticking his tongue out seductively. He has a single earring on his right ear and a tongue stud."
	photo={RigelPhoto}
	photoAlt="A nude Luxray facing away from you, sticking his tongue out seductively. He has a single earring on his right ear and a tongue stud."
	relationships={['ceph', 'nocturne', 'aren', 'fenny']}
>
	{#snippet bio()}
		<dl>
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
			<dd>punk (or raver at parties)</dd>

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
		</dl>
	{/snippet}

	{#snippet links()}
		<dl>
			<dt>Ref sheet</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/61614671/">FurAffinity</a></dd>
			<dt>Ref (NSFW)</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/61614716/">FurAffinity</a></dd>
			<dt>Gallery</dt>
			<dd>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/1563925/Rigel"
					>FurAffinity</a
				>
			</dd>
			<dt>Icon</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/user/redlynx369">RojoLynx</a></dd>
			<dt>Artwork</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/user/candymint/">candymint</a></dd>
		</dl>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #a92365;
		color: white;
	}
</style>
