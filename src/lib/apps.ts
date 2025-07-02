import * as toddspin from '../routes/toddspin/+page.svelte';
import * as sauce from '../routes/sauce/+page.svelte';

const apps = [sauce, toddspin];

export default apps;
export type App = (typeof apps)[number];
