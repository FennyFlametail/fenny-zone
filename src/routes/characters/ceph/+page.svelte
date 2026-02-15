<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
	import CephIcon from '$lib/images/icons/ceph-profile.webp';
	import CephPhoto from '$lib/images/characters/ceph.webp';
</script>

<Profile
	character="ceph"
	species="Luxray"
	icon={CephIcon}
	iconAlt="Icon of a cute Luxray, smiling at you shyly. He has a nose ring and lip piercings."
	photo={CephPhoto}
	photoAlt="A Luxray in a light jacket, sweating a bit as he nervously plays bass."
	relationships={['fenny', 'aren', 'rigel', 'nocturne']}
>
	{#snippet bio()}
		<dl>
			<dt>Age</dt>
			<dd>21</dd>

			<dt>Height</dt>
			<dd>5 ft 2 in (1.57 m)</dd>

			<dt>Pronouns</dt>
			<dd>he/they</dd>

			<dt>Orientation</dt>
			<dd>gay</dd>

			<dt>Personality</dt>
			<dd>
				timid, socially anxious, self-doubting, curious
				<ul>
					<li>usually very reserved, but gets excited about things he's interested in</li>
					<li>
						likes being around people, but nervous about speaking up, hates being the center of
						attention
					</li>
					<li>disorganized, but remembers where things are</li>
					<li>bad at time management</li>
					<li>often sleepy</li>
					<li>doesn’t drink alcohol or swear</li>
				</ul>
			</dd>

			<dt>Voice</dt>
			<dd>
				Voice: soft, slightly raspy, a tiny bit deeper than Fenny’s
				<ul>
					<li>uses lots of filler words (um, ah, etc.)</li>
				</ul>
			</dd>

			<dt>Job</dt>
			<dd>astrophysics grad student</dd>

			<dt>Interests</dt>
			<dd>space, video games, anime, swimming</dd>

			<dt>Fav. color</dt>
			<dd><span class="profileColor">pink</span></dd>

			<dt>Fav. food</dt>
			<dd>
				sushi
				<ul>
					<li>doesn't cook much, trying to learn from Fenny and Aren</li>
				</ul>
			</dd>

			<dt>Fav. drink</dt>
			<dd>
				matcha latte or Calpico
				<ul>
					<li>prefers tea to coffee</li>
				</ul>
			</dd>

			<dt>Fav. ice cream flavor</dt>
			<dd>mango</dd>

			<dt>Fav. music genres</dt>
			<dd>electronic (hardcore, DNB, chiptune), video game soundtracks</dd>

			<dt>Clothing style</dt>
			<dd>
				streetwear, tight fitting, black with vibrant colors, often with space/star designs
				<ul>
					<li>always wears his pendant, sometimes on a collar</li>
				</ul>
			</dd>

			<dt>Typical outfit</dt>
			<dd>
				<ul>
					<li>
						black zip-up hoodie or jacket
						<ul>
							<li>borrows Fenny’s hoodies sometimes, oversized on him</li>
						</ul>
					</li>
					<li>bright colored graphic or patterned tee</li>
					<li>black pants, often with decorative chains, seams, etc.</li>
					<li>colorful socks and undies (shared with Fenny)</li>
					<li>sneakers or short boots</li>
					<li>
						messenger bag covered in pins
						<ul>
							<li>contents: laptop, Switch Lite (teal), school papers</li>
						</ul>
					</li>
				</ul>
			</dd>

			<dt>Notes</dt>
			<dd>
				<ul>
					<li>left-handed</li>
					<li>bioluminescent parts glow brighter when excited or angry</li>
					<li>paw pads work as wireless chargers</li>
					<li>learning to play bass from Aren (mostly as an excuse to be alone with him)</li>
				</ul>
			</dd>
		</dl>
	{/snippet}

	{#snippet links()}
		<dl>
			<dt>Ref sheet</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/22575355/">FurAffinity</a></dd>
			<dt>Ref (NSFW)</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/22575339/">FurAffinity</a></dd>
			<dt>Gallery</dt>
			<dd>
				<a
					target="_blank"
					href="https://www.furaffinity.net/gallery/fuzzyfennekin/folder/254907/Ceph">FurAffinity</a
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
		background-color: #fe61f6;
	}
</style>
