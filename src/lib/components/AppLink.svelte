<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, MouseEventHandler } from 'svelte/elements';

	interface AppLinkProps extends HTMLAnchorAttributes {
		appName: AppName;
		children?: Snippet;
	}

	const { appName, children, ...rest }: AppLinkProps = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[appName];

	const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		windowServer.openApp(appName);
	};
</script>

<a href={app.route} {onclick} {...rest}>
	{@render children?.()}
</a>
