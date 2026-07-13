<script lang="ts">
	import { browser } from '$app/environment';
	import TextEdit from '$lib/components/apps/TextEdit.svelte';

	const baseUrl = browser ? location.origin : '';
</script>

<TextEdit monospace>
	<pre>
Hi, I'm Fenny! I make silly web toys, like the one you're looking at now :3

<img src="{baseUrl}/fenny-wave.webp" alt="My fox Fenny, waving at you!" width="256" height="256" />

Check out the icons at the bottom of the screen, or find me elsewhere on the right!

Scroll down for credits ⬇️

Design and most icons © Apple
Bluesky icon and app design from <a
			href="https://tapbots.com/tweetbot/"
			target="_blank"
			contenteditable="false">Tweetbot</a
		> (RIP)
RSS icon from <a href="https://netnewswire.com/" target="_blank" contenteditable="false"
			>NetNewsWire</a
		>
HowLongToBeat icon from <a
			href="https://en.wikipedia.org/wiki/Delicious_Library"
			target="_blank"
			contenteditable="false">Delicious Library</a
		>
Waving sticker by <a
			href="https://www.furaffinity.net/user/ponacho"
			target="_blank"
			contenteditable="false">Ponacho</a
		>
Default desktop picture by <a
			href="https://www.furaffinity.net/user/WickedForster/"
			target="_blank"
			contenteditable="false">WickedForster</a
		>
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
Chozo font by <a
			href="https://old.reddit.com/r/Metroid/comments/qm2v3c/i_have_made_a_fully_functional_automated/"
			target="_blank"
			contenteditable="false">Wolfeur</a
		>
No AI badge by <a href="https://samvieten.itch.io/no-ai" target="_blank" contenteditable="false"
			>Sam Vieten</a
		>
Reference images used from <a
			href="https://512pixels.net/projects/aqua-screenshot-library/"
			target="_blank"
			contenteditable="false">macOS Screenshot Library</a
		> by Stephen Hackett

<div class="badges">
	<img src="{baseUrl}/no_ai.png" alt="NO AI - Handmade" />
	<img src="{baseUrl}/mwmac.png" alt="Made on a Mac" />
</div>
</pre>
</TextEdit>

<style>
	.badges {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}
</style>
