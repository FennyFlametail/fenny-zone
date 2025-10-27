const FennyAren =
	'Fenny and Aren are brothers. They’ve been extremely close their entire lives. They have a playful sibling rivalry and tease each other often, but they love and trust each other completely. Aren likes to call Fenny his little brother, but Fenny prefers to think of them as twins.';
const FennyCeph =
	'Fenny and Ceph are best friends. They also love each other deeply, and don’t feel the need to put labels on their relationship. Fenny is very affectionate toward Ceph, and treats him like a little brother. Ceph takes a lot of comfort in being around Fenny and Aren.';
const FennyRigel =
	'Fenny and Rigel get along well. They have similarly upbeat personalities, though Rigel can be a bit much even for Fenny.';
const FennyNocturne =
	'Fenny and Nocturne don’t spend a lot of time together, but they’re friendly toward each other. They share a love of plants.';
const ArenCeph =
	'Aren is patient and comforting with Ceph in a way he isn’t with most people. Ceph has a huge crush on Aren and gets flustered easily around him, even though they’re practically partners already.';
const ArenRigel =
	'Aren and Rigel have a bro-y dynamic. Rigel is into Aren, but knows Ceph has feelings for him, and doesn’t pursue anything past a casual relationship.';
const ArenNocturne =
	'Aren and Nocturne have a very flirty relationship. Nocturne often drops by the café where Aren works, and the two of them go motorcycling or play music together often. Nocturne has feelings for Aren, but is happy with things as they are.';
const CephRigel =
	'Ceph and Rigel are brothers, but they weren’t very close growing up because of their age gap and near-opposite personalities. They grew up in a rough household, and Rigel left when Ceph was still young. Now that he’s older, Rigel feels bad for leaving Ceph on his own, and wants to reconnect with him. He’s happy (and maybe a bit envious) that Ceph’s found a place he belongs with Fenny and Aren.';
const CephNocturne =
	'Ceph and Nocturne see each other occasionally at the café, or when Nocturne hangs out with Aren. They haven’t talked much, but Ceph feels comfortable around Nocturne.';
const RigelNocturne =
	'Rigel and Nocturne are roommates. They have clashing personalities, and grate on each other heavily, but deep down they care about each other.';

export type CharacterName = 'Fenny' | 'Aren' | 'Ceph' | 'Rigel' | 'Nocturne';

// TODO make non-optional and uncomment below when adding Nocturne modern AU info
export const relationships: {
	[self in CharacterName]?: {
		[other in Exclude<CharacterName, self>]?: string;
	};
} = {
	Fenny: {
		Aren: FennyAren,
		Ceph: FennyCeph,
		Rigel: FennyRigel
		// Nocturne: FennyNocturne
	},
	Aren: {
		Fenny: FennyAren,
		Ceph: ArenCeph,
		Rigel: ArenRigel
		// Nocturne: ArenNocturne
	},
	Ceph: {
		Fenny: FennyCeph,
		Aren: ArenCeph,
		Rigel: CephRigel
		// Nocturne: CephNocturne
	},
	Rigel: {
		Fenny: FennyRigel,
		Aren: ArenRigel,
		Ceph: CephRigel
		// Nocturne: RigelNocturne
	}
	// Nocturne: {
	// 		Fenny: FennyNocturne,
	// 		Aren: ArenNocturne,
	// 		Ceph: CephNocturne,
	// 		Rigel: RigelNocturne
	// }
};
