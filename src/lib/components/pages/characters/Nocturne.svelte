<script lang="ts">
	import Character from '$lib/components/apps/Character.svelte';
</script>

<Character name="Nocturne" image="/characters/nocturne.webp">
	{#snippet profile()}
		<ul>
			<li>Name: Nocturne Blackmoon</li>
			<li>Species: goat</li>
			<li>Height: 5 ft 10 in (1.78 m) (excluding horns)</li>
			<li>Pronouns: they/them</li>
			<li>Orientation: pansexual (masculine preference)</li>
			<li>Age: 20</li>
			<li>
				Personality: serious, reserved, pragmatic, rarely smiles
				<ul>
					<li>good-hearted but abrasive, easily irritated</li>
					<li>confident, but very self-critical</li>
					<li>refuses to admit when they need help</li>
					<li>tries not to get attached to people (afraid of losing them)</li>
				</ul>
			</li>
			<li>
				Voice: soft, medium pitch, a bit raspy
				<ul>
					<li>very deliberate speech, doesn’t use filler words</li>
				</ul>
			</li>
			<li>Occupation: renegade/freedom fighter, on the run from a galaxy-spanning corporation</li>
			<li>
				Skills:
				<ul>
					<li>quick-thinking</li>
					<li>perceptive (good night vision)</li>
					<li>acrobatic (excellent balance, skilled at parkour)</li>
					<li>good at blending in</li>
					<li>expert shooter (prefers pistols, but proficient with most weapons)</li>
					<li>can hold their own hand-to-hand, but prefers to run</li>
				</ul>
			</li>
			<li>Favorite color: <span class="color">purple</span></li>
			<li>Favorite food: fresh produce (hard to get)</li>
			<li>Favorite drink: real coffee (also hard to get)</li>
			<li>
				Clothing style: techwear, black and white with small accents of color
				<ul>
					<li>nothing baggy or loose hanging</li>
					<li>not militaristic (no camo)</li>
					<li>doesn’t like showing bare skin in public</li>
				</ul>
			</li>
			<li>
				Typical outfit:
				<ul>
					<li>
						long black jacket (gift from their former crew, the only possession they’re attached to)
						<ul>
							<li>cutouts on right arm aligned with their arm markings</li>
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
					<li>prosthetic right arm</li>
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
					>Gallery (contains NSFW)</a
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
</Character>

<style>
	.color {
		background-color: #3c165a;
		color: white;
	}
</style>
