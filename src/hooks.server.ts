import type { Handle } from '@sveltejs/kit';
import { localeFromPath } from '$lib/i18n/routes';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = localeFromPath(event.url.pathname);
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
};
