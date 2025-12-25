<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile
	character="nocturne"
	species="Goat"
	iconAlt="Icon of a goat giving you an annoyed look. They have a nose ring and ear piercings, and a constellation pattern marked on their horns."
	photo="/characters/nocturne.webp"
	photoAlt="A goat facing away from you, wearing a long jacket with a stylized goat head symbol on the back. They have a robotic right arm, and a long, thin tail with a tuft on the end."
>
	{#snippet bio()}
		<dt>Age</dt>
		<dd>20</dd>

		<dt>Height</dt>
		<dd>5 ft 10 in (1.78 m) (minus horns)</dd>

		<dt>Pronouns</dt>
		<dd>they/them (agender)</dd>

		<dt>Orientation</dt>
		<dd>pansexual, masculine preference</dd>

		<dt>Personality</dt>
		<dd>
			serious, reserved, pragmatic, stubborn
			<ul>
				<li>good-hearted but abrasive, gets irritated easily</li>
				<li>rarely smiles</li>
				<li>acts confident, but very self-critical</li>
				<li>doesn't like asking for help</li>
				<li>tries not to get attached to people, scared of losing them</li>
			</ul>
		</dd>

		<dt>Voice</dt>
		<dd>
			soft, medium pitch, a bit raspy
			<ul>
				<li>very deliberate speech, no filler words</li>
			</ul>
		</dd>

		<dt>Occupation</dt>
		<dd>former thief, currently on the run from the corporation controlling local space</dd>

		<dt>Skills</dt>
		<dd>
			<ul>
				<li>quick-thinking</li>
				<li>perceptive (good night vision)</li>
				<li>acrobatic (excellent balance and climbing ability)</li>
				<li>expert shooter (prefers pistols)</li>
				<li>capable at hand-to-hand, but prefers to run instead of fight</li>
			</ul>
		</dd>

		<dt>Fav. color</dt>
		<dd><span class="profileColor">purple</span></dd>

		<dt>Fav. food</dt>
		<dd>fresh produce (hard to get)</dd>

		<dt>Fav. drink</dt>
		<dd>real coffee (also hard to get)</dd>

		<dt>Clothing style</dt>
		<dd>
			techwear, black and white with small accents of color
			<ul>
				<li>nothing baggy or loose</li>
				<li>nothing militaristic (no camo)</li>
				<li>no bare fur below the neck in public</li>
			</ul>
		</dd>

		<dt>Typical outfit</dt>
		<dd>
			<ul>
				<li>
					long black jacket
					<ul>
						<li>gift from their former crew, the only possession they're attached to</li>
						<li>nonbinary flag patch on left breast</li>
						<li><b>Solstice</b> (their home planet) written in alien script on left sleeve</li>
						<li>cutouts on right sleeve that align with their arm markings</li>
					</ul>
				</li>
				<li>winter coat over jacket if it's very cold</li>
				<li>pink AR glasses on forehead (optional)</li>
				<li>monochrome t-shirt or tank top</li>
				<li>fingerless gloves</li>
				<li>black pants and socks</li>
				<li>black and white sneakers or boots</li>
			</ul>
		</dd>

		<dt>Notes</dt>
		<dd>
			<ul>
				<li>left-handed</li>
				<li>has had a prosthetic right arm since childhood</li>
				<li>dislikes heat, swimming, processed food</li>
				<li>uses guns, but doesn’t fetishize them</li>
				<li>doesn’t enjoy killing, but is willing to use violence to protect the vulnerable</li>
			</ul>
		</dd>
	{/snippet}

	{#snippet links()}
		<dt>Gallery (18+)</dt>
		<dd>
			<a
				target="_blank"
				href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/1353430/Nocturne"
				>FurAffinity</a
			>
		</dd>
		<dt>Icon</dt>
		<dd><a target="_blank" href="https://bsky.app/profile/buyo.bsky.social">Buyo</a></dd>
		<dt>Artwork</dt>
		<dd><a target="_blank" href="https://www.furaffinity.net/user/candymint/">candymint</a></dd>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #3c165a;
		color: white;
	}
</style>
