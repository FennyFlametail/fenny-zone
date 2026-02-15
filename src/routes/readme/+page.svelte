<script lang="ts">
	import { getAppContext } from '$lib/context.svelte';
	import setModified from '$lib/helpers/setModifiedAttachment.svelte';
	import FennyWave from '$lib/images/fenny-wave.webp';
	import NoAi from '$lib/images/no_ai.png';
	import MwMac from '$lib/images/mwmac.png';

	const { app } = getAppContext();
</script>

<pre class="textEdit plaintext" contenteditable="true" {@attach setModified(app)}>
Hi, I'm Fenny! Welcome to my silly corner of the internet 🦊❤️

<img src={FennyWave} alt="My fox Fenny, waving at you!" width="256" height="256" />
This site is a work-in-progress, but feel free to poke around! Check out the icons at the bottom, or find me elsewhere at the links on the right!

(Fun fact: almost everything on this site works with JavaScript disabled!)

Scroll down for credits ⬇️

Waving sticker by <a
		href="https://www.furaffinity.net/user/ponacho"
		target="_blank"
		contenteditable="false">Ponacho</a
	>
Desktop image by <a
		href="https://www.furaffinity.net/user/WickedForster/"
		target="_blank"
		contenteditable="false">WickedForster</a
	>
Chozo font by <a
		href="https://old.reddit.com/r/Metroid/comments/qm2v3c/i_have_made_a_fully_functional_automated/"
		target="_blank"
		contenteditable="false">Wolfeur</a
	> (no longer available)
Googly eyes inspired by <a
		href="https://sindresorhus.com/googly-eyes"
		target="_blank"
		contenteditable="false">Sindre Sorhus</a
	>
Adblock warning based on code by <a
		href="https://stefanbohacek.com/project/detect-missing-adblocker-wordpress-plugin/"
		target="_blank"
		contenteditable="false">Stefan Bohacek</a
	>
No AI badge by <a href="https://samvieten.itch.io/no-ai" target="_blank" contenteditable="false"
		>Sam Vieten</a
	>

<div class="badges">
	<img src={NoAi} alt="NO AI - Handmade" />
	<img src={MwMac} alt="Made on a Mac" />
</div>
</pre>

<style>
	.badges {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}
</style>
