import { error } from '@sveltejs/kit';
import { adjacentPosts, getPost, slugsOf } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => slugsOf('blog').map((slug) => ({ lang: '', slug }));

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	const post = getPost(locale, params.slug);
	if (!post) error(404);
	return { post, adjacent: adjacentPosts(locale, params.slug) };
};
