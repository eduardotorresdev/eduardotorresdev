import { featuredCases, listProjects } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => [{ lang: '' }, { lang: 'en' }];

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	// A home mostra só os cases em destaque, numa linha; o resto vive em /cases.
	return { cases: featuredCases(locale).slice(0, 3), projects: listProjects(locale) };
};
