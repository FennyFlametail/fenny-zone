import type { AppName } from '$lib/apps.svelte';

const FennyAren =
	'Fenny and Aren are as close as two brothers could be. They have a playful rivalry and tease each other often, but they love and trust each other completely. Aren likes to call Fenny his little brother, but Fenny prefers to think of them as twins.';
const FennyCeph =
	'Fenny and Ceph have been best friends almost since the day they met. They’ve grown to love each other deeply, and don’t feel the need to put a label on their relationship. Fenny is very affectionate toward Ceph, and treats him like a little brother. Fenny and Aren are the only people Ceph feels fully comfortable around.';
const FennyRigel =
	'Fenny and Rigel are casual friends. They have similarly energetic personalities, though Rigel can be a bit much even for Fenny.';
const FennyNocturne =
	'Fenny hasn’t talked with Nocturne much, but they’re friendly with each other. They share a love of plants.';
const ArenCeph =
	'Aren loves Ceph like he’s family, and is patient with him in a way he isn’t with most people. Ceph has a huge crush on Aren and gets flustered easily around him, even though they may as well be boyfriends already.';
const ArenRigel =
	'Aren and Rigel have a bro-y rapport. Rigel is into Aren, but doesn’t want to intrude on Ceph’s relationship with him.';
const ArenNocturne =
	'Aren and Nocturne have a very flirty relationship. Nocturne often stops by the café where Aren works, and they like to go biking or hang out and play music together. Nocturne has feelings for Aren, but is happy with things as they are.';
const CephRigel =
	'Though Ceph and Rigel are siblings, they don’t have much in common and aren’t close. They grew up in a rough household, and Rigel left when Ceph was still young. He felt bad for leaving, but was dealing with too many issues of his own to look after Ceph. Years later, circumstances brought him to the same city as Ceph, and he decided to reconnect with his little brother. He’s happy (and maybe a bit envious) that Ceph’s found a place he belongs with Fenny and Aren. Ceph is still unsure about Rigel, but wants to feel like he can trust him.';
const CephNocturne =
	'Ceph hasn’t spent a lot of time around Nocturne - he usually sees them at the café, or when they’re over with Aren. Despite that, something about their vibe helps him feel comfortable around them.';
const RigelNocturne =
	'Rigel and Nocturne are roommates. They have clashing personalities and grate heavily on each other, but beneath that they care about each other. Rigel reminds Nocturne a lot of themself when they were younger.';

export type CharacterName = Extract<
	AppName,
	'fenny' | 'aren' | 'ceph' | 'rigel' | 'nocturne' | 'foo'
>;

// TODO make non-optional and uncomment below when adding Nocturne modern AU info
export const relationships: {
	[self in CharacterName]?: {
		[other in Exclude<CharacterName, self>]?: string;
	};
} = {
	fenny: {
		aren: FennyAren,
		ceph: FennyCeph,
		rigel: FennyRigel
		// nocturne: FennyNocturne
	},
	aren: {
		fenny: FennyAren,
		ceph: ArenCeph,
		rigel: ArenRigel
		// nocturne: ArenNocturne
	},
	ceph: {
		fenny: FennyCeph,
		aren: ArenCeph,
		rigel: CephRigel
		// nocturne: CephNocturne
	},
	rigel: {
		fenny: FennyRigel,
		aren: ArenRigel,
		ceph: CephRigel
		// nocturne: RigelNocturne
	}
	// nocturne: {
	// 		fenny: FennyNocturne,
	// 		aren: ArenNocturne,
	// 		ceph: CephNocturne,
	// 		rigel: RigelNocturne
	// }
};
