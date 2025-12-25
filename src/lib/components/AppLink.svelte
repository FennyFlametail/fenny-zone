<script lang="ts">
	import type { AppName } from '$lib/apps.svelte';
	import { getWindowServerContext } from '$lib/context.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, MouseEventHandler } from 'svelte/elements';

	interface AppLinkProps extends HTMLAnchorAttributes {
		appName: AppName;
		children?: Snippet;
	}

	const { appName, onclick, children, ...rest }: AppLinkProps = $props();

	const windowServer = getWindowServerContext();
	const app = windowServer.apps[appName];

	const defaultonclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();
		windowServer.openApp(appName);
	};
</script>

<a href={app.route} onclick={onclick ?? defaultonclick} {...rest}>
	{@render children?.()}
</a>
