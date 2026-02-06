<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import NocturneMainPhoto from '$lib/images/characters/nocturne-main.webp';
	import NocturnePhoto from '$lib/images/characters/nocturne.webp';
	import type { Snippet } from 'svelte';

	const options = [
		{
			name: 'Space AU',
			snippet: bioSpace
		},
		{
			name: 'Main Setting',
			snippet: bioMain
		}
	] as const;

	let tabId = $props.id();
	let selectedIndex = $state(0);
	let tabContent = $state<Snippet>();

	const main = $derived(options[selectedIndex].name === 'Main Setting');
</script>

<Profile
	character="nocturne"
	species="Goat"
	iconAlt="Icon of a goat giving you a disgruntled look. They have a nose ring and ear piercings, and a constellation pattern marked on their horns."
	photo={main ? NocturneMainPhoto : NocturnePhoto}
	photoAlt={main
		? 'A goat sitting and slurping noodles from a bowl of ramen.'
		: 'A goat wearing a futuristic black jacket, giving you a disgruntled look. They have a robotic right arm, and a long, thin tail with a tuft on the end.'}
	relationships={main ? ['rigel', 'aren', 'fenny', 'ceph'] : []}
>
	{#snippet bio()}
		{@render tabContent?.()}
	{/snippet}

	{#snippet tabs()}
		<TabBar id={tabId} {options} bind:selectedIndex bind:tabContent />
	{/snippet}

	{#snippet links()}
		<dl>
			<dt>Ref sheet</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/54687719/">FurAffinity</a></dd>
			<dt>Ref (NSFW)</dt>
			<dd><a target="_blank" href="https://www.furaffinity.net/view/54687740/">FurAffinity</a></dd>
			<dt>Gallery</dt>
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
		</dl>
	{/snippet}
</Profile>

{#snippet bioSpace()}
	<dl>
		<dt>Age</dt>
		<dd>22</dd>

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
		<dd>
			former thief, current outlaw
			<ul>
				<li>
					stole something important from the megacorp controlling local space, on the run for the
					last two years
				</li>
			</ul>
		</dd>

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
						<li>
							<span class="chozoFont">solstice</span> (Solstice, the name of their home planet) on left
							sleeve
						</li>
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
				<li>has had a prosthetic right arm for their whole life</li>
				<li>dislikes heat, swimming, processed food</li>
				<li>uses guns, but doesn’t fetishize them</li>
				<li>doesn’t enjoy killing, but is willing to use violence to protect the vulnerable</li>
			</ul>
		</dd>
	</dl>
{/snippet}

{#snippet bioMain()}
	<dl>
		<dt>Age</dt>
		<dd>28</dd>

		<dt>Height</dt>
		<dd>5 ft 10 in (1.78 m) (minus horns)</dd>

		<dt>Pronouns</dt>
		<dd>they/them (agender)</dd>

		<dt>Orientation</dt>
		<dd>pansexual, masculine preference</dd>

		<dt>Personality</dt>
		<dd>
			thoughtful, no-nonsense, direct but not harsh
			<ul>
				<li>gets annoyed easily, but rarely shows anger</li>
				<li>likes niche things, but not pretentious about them</li>
				<li>
					a lot more rebellious when they were deeper in the punk scene, mellowed out as they got
					older
				</li>
			</ul>
		</dd>

		<dt>Voice</dt>
		<dd>
			soft, medium pitch, a bit raspy
			<ul>
				<li>very deliberate speech, no filler words</li>
			</ul>
		</dd>

		<dt>Job</dt>
		<dd>owns a small record store next to the café Aren works at</dd>

		<dt>Interests</dt>
		<dd>
			music, analog technology, books, gardening
			<ul>
				<li>used to sing in a local punk band, sings to Aren’s guitar for fun sometimes</li>
			</ul>
		</dd>

		<dt>Fav. color</dt>
		<dd><span class="profileColor">purple</span></dd>

		<dt>Fav. food</dt>
		<dd>vegetable summer rolls</dd>

		<dt>Fav. drink</dt>
		<dd>oat milk latte</dd>

		<dt>Fav. ice cream flavor</dt>
		<dd>vanilla bean gelato</dd>

		<dt>Fav. music genres</dt>
		<dd>indie rock, punk, lo-fi</dd>

		<dt>Clothing style</dt>
		<dd>
			modern casual, basic but stylish
			<ul>
				<li>no short sleeves</li>
			</ul>
		</dd>

		<dt>Typical outfit</dt>
		<dd>
			<ul>
				<li>gray denim jacket with nonbinary flag pin</li>
				<li>plain shirt</li>
				<li>black denim jeans</li>
				<li>comfortable shoes</li>
			</ul>
		</dd>

		<dt>Vehicle</dt>
		<dd>
			<a
				href="https://www.electrive.com/2020/01/08/niu-presents-new-electric-motorbike-3-wheeler/"
				target="_blank">NIU RQi-GT</a
			>
		</dd>

		<dt>Notes</dt>
		<dd>
			<ul>
				<li>left-handed</li>
				<li>has had a prosthetic right arm for their whole life</li>
			</ul>
		</dd>
	</dl>
{/snippet}

<style>
	.profileColor {
		background-color: #3c165a;
		color: white;
	}

	.chozoFont {
		padding: 0.2em;
		border-radius: 0.2em;
		font-family: 'Chozo';
		background-color: black;
		color: #2afd93;
	}
</style>
