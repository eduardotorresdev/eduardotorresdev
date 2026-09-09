import { error } from '@sveltejs/kit';
import { loadBody } from '$lib/content/body';
import { localeFromParam } from '$lib/i18n';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, params }) => {
	const body = await loadBody('cases', params.slug, localeFromParam(params.lang));
	if (!body) error(404);
	return { ...data, body };
};
