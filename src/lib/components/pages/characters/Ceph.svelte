<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
</script>

<Profile name="Ceph" image="/characters/ceph.webp">
	{#snippet bio()}
		<ul>
			<li>Name: Ceph Azulux</li>
			<li>Species: Luxray</li>
			<li>Age: 21</li>
			<li>Height: 5 ft 2 in (1.57 m)</li>
			<li>Pronouns: he/they</li>
			<li>Orientation: gay</li>
			<li>
				Personality: timid, anxious, insecure, usually very reserved but can get excited about
				things he likes
				<ul>
					<li>doesn’t drink alcohol or swear</li>
					<li>usually tired</li>
					<li>gets flustered easily</li>
					<li>likes being around people, but rarely speaks up</li>
					<li>struggles to feel like he belongs, except around Fenny and Aren</li>
				</ul>
			</li>
			<li>
				Voice: soft, slightly raspy, a tiny bit deeper than Fenny’s
				<ul>
					<li>uses lots of filler words (um, ah, etc.)</li>
				</ul>
			</li>
			<li>Job: astrophysics grad student</li>
			<li>Interests: space, video games, anime, swimming</li>
			<li>Favorite color: <span class="color">pink</span></li>
			<li>
				Favorite food: sushi
				<ul>
					<li>doesn't cook much, but learning from Fenny and Aren</li>
				</ul>
			</li>
			<li>
				Favorite drink: matcha latte or Calpico
				<ul>
					<li>prefers tea to coffee</li>
				</ul>
			</li>
			<li>Favorite ice cream flavor: mango</li>
			<li>Favorite music genres: electronic (hardcore, DNB, chiptune), video game soundtracks</li>
			<li>
				Clothing style: streetwear, tight fitting, black with vibrant colors, often with space/star
				designs
				<ul>
					<li>always wears his pendant, sometimes on a collar</li>
				</ul>
			</li>
			<li>
				Typical outfit:
				<ul>
					<li>
						black zip-up hoodie or jacket
						<ul>
							<li>borrows Fenny’s hoodies sometimes, oversized on him</li>
						</ul>
					</li>
					<li>bright colored graphic or patterned tee</li>
					<li>black pants, often with extraneous chains, seams, etc.</li>
					<li>colorful socks and undies (shared with Fenny)</li>
					<li>sneakers or short boots</li>
					<li>
						messenger bag covered in pins
						<ul>
							<li>contents: laptop, Switch Lite (teal), school papers</li>
						</ul>
					</li>
				</ul>
			</li>
			<li>
				Notes:
				<ul>
					<li>left-handed</li>
					<li>bioluminescent parts glow brighter when excited or angry</li>
					<li>paw pads act like Qi chargers</li>
					<li>
						learning to play bass from Aren (mostly as an excuse to be alone with him)
					</li>
				</ul>
			</li>
		</ul>
	{/snippet}

	{#snippet links()}
		<ul>
			<li>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/254907/Ceph"
					>Gallery (18+)</a
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
</Profile>

<style>
	.color {
		background-color: #fe61f6;
	}
</style>
