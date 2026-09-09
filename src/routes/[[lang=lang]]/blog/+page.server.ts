import { listPosts, listTags } from '$lib/content';
import { localeFromParam } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => [{ lang: '' }];

export const load: PageServerLoad = ({ params }) => {
	const locale = localeFromParam(params.lang);
	return { posts: listPosts(locale), tags: listTags(locale) };
};
