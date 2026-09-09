import { error } from '@sveltejs/kit';
import { getProject, listProjects } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

// Só projetos com corpo ganham página própria. As versões em inglês são
// descobertas pelo crawler a partir dos links da home.
export const entries: EntryGenerator = () =>
	listProjects('pt-BR')
		.filter((p) => p.hasBody)
		.map((p) => ({ lang: '', slug: p.slug }));

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	const entry = getProject(locale, params.slug);
	if (!entry || !entry.hasBody) error(404);
	return { entry };
};
