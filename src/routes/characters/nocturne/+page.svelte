<script lang="ts">
	import Profile from '$lib/components/apps/Profile.svelte';
	import ProfilePhoto from '$lib/components/apps/ProfilePhoto.svelte';
	import ProfileRelationships from '$lib/components/apps/ProfileRelationships.svelte';
	import TabBar, { type Option } from '$lib/components/TabBar.svelte';
	import NocturneMainPhoto from '$lib/images/characters/nocturne-main.webp';
	import NocturnePhoto from '$lib/images/characters/nocturne.webp';
	import NocturneIcon from '$lib/images/icons/nocturne-profile.webp';
	import type { Snippet } from 'svelte';

	type Key = 'photo' | 'bio' | 'relationships';

	const options: Option<Key>[] = [
		{
			name: 'Space AU',
			content: {
				photo: photoSpace,
				bio: bioSpace
			}
		},
		{
			name: 'Main Setting',
			content: {
				photo: photoMain,
				bio: bioMain,
				relationships: relationshipsMain
			}
		}
	] as const;

	let tabId = $props.id();
	let selectedIndex = $state(0);
	let tabContent = $state<Snippet<[Key]>>();

	const main = $derived(options[selectedIndex].name === 'Main Setting');
</script>

<Profile
	character="nocturne"
	fullName="Nocturne Blackmoon"
	species="Goat"
	icon={NocturneIcon}
	iconAlt="Icon of a goat giving you a disgruntled look. They have a mohawk, nose and ear piercings, and a constellation pattern on their horns."
>
	{#snippet photo()}
		{@render tabContent?.('photo')}
	{/snippet}

	{#snippet bio()}
		{@render tabContent?.('bio')}
	{/snippet}

	{#snippet tabs()}
		<TabBar id={tabId} {options} bind:selectedIndex bind:tabContent />
	{/snippet}

	{#snippet relationships()}
		{@render tabContent?.('relationships')}
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
			{#if selectedIndex === 0}
				<dt>Artwork</dt>
				<dd><a target="_blank" href="https://www.furaffinity.net/user/elcydog">eLCyDog</a></dd>
			{:else}
				<dt>Artwork</dt>
				<dd>
					<a target="_blank" href="https://bsky.app/profile/corginamedbruno.bsky.social">Bruno</a>
				</dd>
			{/if}
		</dl>
	{/snippet}
</Profile>

{#snippet photoSpace()}
	<ProfilePhoto
		photo={NocturnePhoto}
		alt="A goat standing and holding a tray of food squares. They’re holding one up with their robotic hand and inspecting it with some aversion."
	/>
{/snippet}

{#snippet photoMain()}
	<ProfilePhoto
		photo={NocturneMainPhoto}
		alt="A goat sitting and slurping noodles from a bowl of ramen, holding chopsticks in their robotic hand."
	/>
{/snippet}

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
					stole something important two years ago from the megacorp controlling their region of
					space, on the run ever since
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
		<dd>30</dd>

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
				<li>a lot more rebellious when they were younger, somewhat mellowed out</li>
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
				<li>used to sing in a local punk band, sings to Aren’s guitar playing for fun sometimes</li>
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

{#snippet relationshipsMain()}
	<ProfileRelationships character="nocturne" relationships={['rigel', 'aren', 'fenny']} />
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
