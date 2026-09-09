import { error } from '@sveltejs/kit';
import { listTags, postsByTag } from '$lib/content';
import { href, localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => listTags('pt-BR').map(({ tag }) => ({ lang: '', tag }));

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	const posts = postsByTag(locale, params.tag);
	if (posts.length === 0) error(404);
	// Tags não têm tradução 1:1, então a outra língua aponta pra lista do blog.
	return { tag: params.tag, posts, alternates: { 'pt-BR': href('pt-BR', 'blog'), en: href('en', 'blog') } };
};
