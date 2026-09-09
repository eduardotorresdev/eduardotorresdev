import { error } from '@sveltejs/kit';
import { getCase, slugsOf } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => slugsOf('cases').map((slug) => ({ lang: '', slug }));

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	const entry = getCase(locale, params.slug);
	if (!entry) error(404);
	return { entry };
};
