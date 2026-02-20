import type { AppName } from '$lib/apps.svelte';

const FennyAren = {
	met: `Fenny and Aren are adoptive brothers, and have been together since before they can remember.`,
	views: `They're as close as two brothers could be. They have a playful rivalry and tease each other often, but they love and trust each other completely.

Aren likes to call Fenny his little brother, but Fenny prefers to think of them as twins.`
};

const FennyCeph = {
	met: `Fenny met Ceph in college, during his junior year and Ceph's freshman year. The Luxray had just moved to town and was struggling to make friends. Fenny's warm demeanor helped ease Ceph's nervousness, and they hit it off quickly.`,
	views: `Fenny and Ceph have been best friends almost since they met. They’ve grown to love each other deeply, but don’t feel the need to put a label on their relationship. Fenny is very affectionate toward Ceph, and treats him like a little brother.

Ceph struggles a lot with feeling like he doesn't belong. Fenny and Aren are the only people he feels he can truly let his guard down around.`
};

const FennyRigel = {
	met: `Ceph introduced Rigel to Fenny and Aren shortly after they reconnected.`,
	views: `Fenny and Rigel are casual friends. They have similarly energetic personalities, though Rigel can be a bit much even for Fenny.`
};

const FennyNocturne = {
	met: `Fenny saw Nocturne sometimes at the café or around town, but didn't really know them until they started hanging out with Aren.`,
	views: `Fenny and Nocturne don't talk a lot, but they're friendly with each other, and hang out when Nocturne's over with Aren. They share a love of plants.`
};

const ArenCeph = {
	met: `Knowing Ceph didn't have any family nearby to spend the holidays with (and wouldn't have wanted to regardless), Fenny invited him home over winter break and introduced him to Aren.`,
	views: `Aren loves Ceph like a brother, and is patient with him in a way he isn’t with most people. Ceph has a huge crush on Aren, and still gets flustered easily around him, even though they're practically boyfriends already.

Ceph struggles a lot with feeling like he doesn't belong. Fenny and Aren are the only people he feels he can truly let his guard down around.`
};

const ArenRigel = {
	met: `Ceph introduced Rigel to Fenny and Aren shortly after they reconnected.`,
	views: `Aren and Rigel have a bro-y rapport and work out together sometimes. Rigel is into Aren, but doesn’t want to intrude on Ceph’s relationship with him.`
};

const ArenNocturne = {
	met: `Nocturne owns a small record shop next to the café Aren works at. They swing by sometimes when things are quiet, and quickly struck a chord with the handsome wolf barista.`,
	views: `They have a very flirty relationship. They often hang out and play music together (Aren plays the guitar and Nocturne sings), or go motorbiking in the mountains outside of town. Nocturne has deeper feelings for Aren, but is happy with things as they are.`
};

const CephRigel = {
	met: `Ceph and Rigel are siblings, but they don’t have much in common and they aren’t close. They grew up in a rough household, and Rigel left when Ceph was young. He felt bad for leaving Ceph behind, but was dealing with too many issues of his own to look after him. Years later, Rigel happened to end up in the same city as Ceph, and decided to reach out to him.`,
	views: `Rigel still has a pretty messy life, but he wants to be there for Ceph, in a way none of their other family members were. He's happy, and maybe a bit envious, that Ceph’s found a place he belongs with Fenny and Aren.

Ceph is still uneasy about Rigel being back in his life. But he remembers Rigel sticking up for him when he was a kid, and wants to feel like he can trust him.`
};

const CephNocturne = {
	met: `Ceph saw Nocturne sometimes at the café or around town, but didn't really know them until they started hanging out with Aren.`,
	views: `Ceph is still a bit nervous around Nocturne (as he is with most people), but they're always friendly to him. Ceph admires Nocturne's confident, stylish vibe.`
};

const RigelNocturne = {
	met: `Rigel half-knew Nocturne though some friends in the punk scene. Nocturne was looking for a roommate, and when Rigel moved to the city he took up the offer.`,
	views: `They have clashing personalities, and grate on each other often, but they care about each other more than either will admit. Rigel reminds Nocturne a lot of themself when they were younger and more rebellious (even though he's almost the same age as them), so they feel a bit protective of him.`
};

export type CharacterName = Extract<AppName, 'fenny' | 'aren' | 'ceph' | 'rigel' | 'nocturne'>;

export const relationships: {
	[self in CharacterName]: {
		[other in Exclude<CharacterName, self>]: {
			met: string;
			views: string;
		};
	};
} = {
	fenny: {
		aren: FennyAren,
		ceph: FennyCeph,
		rigel: FennyRigel,
		nocturne: FennyNocturne
	},
	aren: {
		fenny: FennyAren,
		ceph: ArenCeph,
		rigel: ArenRigel,
		nocturne: ArenNocturne
	},
	ceph: {
		fenny: FennyCeph,
		aren: ArenCeph,
		rigel: CephRigel,
		nocturne: CephNocturne
	},
	rigel: {
		fenny: FennyRigel,
		aren: ArenRigel,
		ceph: CephRigel,
		nocturne: RigelNocturne
	},
	nocturne: {
		fenny: FennyNocturne,
		aren: ArenNocturne,
		ceph: CephNocturne,
		rigel: RigelNocturne
	}
};
