import { featuredCases, listPosts, listProjects } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	return {
		locale,
		preview: {
			cases: featuredCases(locale).slice(0, 3),
			projects: listProjects(locale).slice(0, 3),
			posts: listPosts(locale).slice(0, 3)
		}
	};
};
