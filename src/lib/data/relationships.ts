import type { AppName } from '$lib/apps.svelte';

const FennyAren =
	'Fenny and Aren are brothers, and are as close as siblings could be. They have a playful rivalry and tease each other often, but they love and trust each other completely. Aren likes to call Fenny his little brother, but Fenny prefers to think of them as twins.';
const FennyCeph =
	'Fenny and Ceph are best friends. They also love each other deeply, and don’t feel the need to put a label on their relationship. Fenny is very affectionate toward Ceph, and treats him like a little brother. Ceph takes a lot of comfort in being around Fenny and Aren.';
const FennyRigel =
	'Fenny and Rigel get along well. They have similarly upbeat personalities, though Rigel can be a bit much even for Fenny.';
const FennyNocturne =
	'Fenny and Nocturne don’t spend a lot of time together, but they’re friendly toward each other. They share a love of plants.';
const ArenCeph =
	'Aren is patient and comforting with Ceph in a way he isn’t with most people. Ceph has a huge crush on Aren and gets flustered easily around him, even though they’re practically partners already.';
const ArenRigel =
	'Aren and Rigel have a bro-y dynamic. Rigel is into Aren, but doesn’t want to intrude on Ceph’s relationship with him.';
const ArenNocturne =
	'Aren and Nocturne have a very flirty relationship. Nocturne often drops by the café where Aren works, and the two of them go motorbiking or make music together on occasion. Nocturne has feelings for Aren, but is happy with things as they are.';
const CephRigel =
	'Ceph and Rigel are brothers, but they weren’t very close growing up because of their age gap and near-opposite personalities. They grew up in a rough household, and Rigel left when Ceph was still young. Now that he’s older, Rigel feels bad for leaving Ceph on his own, and wants to reconnect with him. He’s happy (and maybe a bit envious) that Ceph’s found a place he belongs with Fenny and Aren.';
const CephNocturne =
	'Ceph and Nocturne bump into each other occasionally at the café, or when Nocturne hangs out with Aren. The two don’t talk much, but Ceph is comfortable around them.';
const RigelNocturne =
	'Rigel and Nocturne are roommates. They have clashing personalities and grate on each other, but deep down they care about each other. Nocturne was a lot like Rigel when they were younger, and feels a bit protective of him.';

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
