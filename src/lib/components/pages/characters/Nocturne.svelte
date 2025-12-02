<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile name="Nocturne" image="/characters/nocturne.webp">
	{#snippet bio()}
		<ul>
			<li>Name: Nocturne Blackmoon</li>
			<li>Species: goat</li>
			<li>Age: 20</li>
			<li>Height: 5 ft 10 in (1.78 m) (excluding horns)</li>
			<li>Pronouns: they/them (agender)</li>
			<li>Orientation: pansexual, masculine preference</li>
			<li>
				Personality: serious, reserved, pragmatic, stubborn
				<ul>
					<li>good-hearted but abrasive, gets irritated easily</li>
					<li>rarely smiles</li>
					<li>acts confident, but is very self-critical</li>
					<li>doesn't like asking for help</li>
					<li>tries not to get attached to people (scared of losing them)</li>
				</ul>
			</li>
			<li>
				Voice: soft, medium pitch, a bit raspy
				<ul>
					<li>very deliberate speech, no filler words</li>
				</ul>
			</li>
			<li>
				Occupation: former thief, currently on the run from the corporation controlling local space
			</li>
			<li>
				Skills:
				<ul>
					<li>quick-thinking</li>
					<li>perceptive</li>
					<ul>
						<li>good night vision</li>
					</ul>
					<li>acrobatic</li>
					<ul>
						<li>excellent balance, skilled at parkour</li>
					</ul>
					<li>expert shooter (prefers pistols)</li>
					<li>capable at hand-to-hand, but prefers to run instead of fight</li>
				</ul>
			</li>
			<li>Favorite color: <span class="profileColor">purple</span></li>
			<li>Favorite food: fresh produce (hard to get)</li>
			<li>Favorite drink: real coffee (also hard to get)</li>
			<li>
				Clothing style: techwear, black and white with small accents of color
				<ul>
					<li>nothing baggy or loose</li>
					<li>not militaristic (no camo)</li>
					<li>prefers not to show bare fur below the neck in public</li>
				</ul>
			</li>
			<li>
				Typical outfit:
				<ul>
					<li>
						long black jacket (gift from their former crew, the only possession they’re attached to)
						<ul>
							<li>nonbinary flag patch</li>
							<li><b>Solstice</b> (their home planet) written in alien script on left arm</li>
							<li>magnetic cutouts on right arm, aligned with their arm markings</li>
						</ul>
					</li>
					<li>pink AR glasses on forehead (optional)</li>
					<li>t-shirt or tank top</li>
					<li>fingerless gloves</li>
					<li>black pants and socks</li>
					<li>black and white sneakers or boots</li>
				</ul>
			</li>
			<li>
				Notes:
				<ul>
					<li>left-handed</li>
					<li>has had a prosthetic right arm since childhood</li>
					<li>dislikes heat, swimming, processed food</li>
					<li>uses guns, but doesn’t fetishize them</li>
					<li>doesn’t enjoy killing, but is willing to use violence to protect the vulnerable</li>
				</ul>
			</li>
		</ul>
	{/snippet}

	{#snippet links()}
		<ul>
			<li>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/1353430/Nocturne"
					>Gallery (18+)</a
				>
			</li>
			<li>
				Background art by <a target="_blank" href="https://www.furaffinity.net/user/candymint/"
					>candymint</a
				>
			</li>
			<li>
				Icon by <a target="_blank" href="https://bsky.app/profile/buyo.bsky.social">Buyo</a>
			</li>
		</ul>
	{/snippet}
</Profile>

<style>
	.profileColor {
		background-color: #3c165a;
		color: white;
	}
</style>
