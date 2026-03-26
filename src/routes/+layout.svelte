<script lang="ts">
	import { page } from '$app/state';
	import getApps, { type AppName } from '$lib/apps.svelte';
	import Desktop from '$lib/components/Desktop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import WindowLayer from '$lib/components/WindowLayer.svelte';
	import { setWindowServerContext } from '$lib/context.svelte';
	import '$lib/styles/app.css';
	import '$lib/styles/Aqua.css';
	import WindowServer from '$lib/windowServer.svelte';

	const windowServer = new WindowServer();
	setWindowServerContext(windowServer);

	$effect(windowServer.saveState);

	if (page.route.id !== '/') {
		const apps = getApps();
		const appName = (Object.keys(apps) as AppName[]).find(
			(appName) => apps[appName].route === page.route.id
		)!;
		windowServer.initialAppName = appName;
	}
</script>

<MenuBar />
<Desktop />
<WindowLayer />
<Dock />

<svg class="blueskyGradients">
	<defs>
		<linearGradient id="statIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#BFC3C6" />
			<stop offset="100%" stop-color="#A9AFB3" />
		</linearGradient>
		<linearGradient id="tabIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#CCCED1" />
			<stop offset="100%" stop-color="#7C7E81" />
		</linearGradient>
		<linearGradient id="tabHighlightedIconGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#84C6FF" />
			<stop offset="100%" stop-color="#007BEB" />
		</linearGradient>
		<linearGradient id="tabIconActiveGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#606060" />
			<stop offset="100%" stop-color="#838383" />
		</linearGradient>
		<linearGradient id="tabIconDisabledGradient" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="#8F8F90" />
			<stop offset="100%" stop-color="#7C7C7D" />
		</linearGradient>
	</defs>
</svg>

<!-- adblock detection element -->
<div
	id="ftf-dma-note"
	class="ftf-dma-note ad native-ad native-ad-1 ytd-j yxd-j yxd-jd aff-content-col aff-inner-col aff-item-list ark-ad-message inplayer-ad inplayer_banners in_stream_banner trafficjunky-float-right dbanner preroll-blocker happy-inside-player blocker-notice blocker-overlay exo-horizontal ave-pl bottom-hor-block brs-block advboxemb wgAdBlockMessage glx-watermark-container overlay-advertising-new header-menu-bottom-ads rkads mdp-deblocker-wrapper amp-ad-inner imggif bloc-pub bloc-pub2 hor_banner aan_fake aan_fake__video-units rps_player_ads fints-block__row full-ave-pl full-bns-block vertbars video-brs player-bns-block wps-player__happy-inside gallery-bns-bl stream-item-widget adsbyrunactive happy-under-player adde_modal_detector adde_modal-overlay ninja-recommend-block aoa_overlay message"
></div>

<style>
	.blueskyGradients {
		position: fixed;
		top: 100vh;
		left: 100vw;
	}
</style>
