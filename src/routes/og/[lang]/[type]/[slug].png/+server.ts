import { error } from '@sveltejs/kit';
import { getCase, getPost, getProject, slugsOf } from '$lib/content';
import { locales, localeFile, t, type Locale } from '$lib/i18n';
import { renderOgImage } from '$lib/server/og';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

const types = ['site', 'blog', 'cases', 'projetos'] as const;
type OgType = (typeof types)[number];

function localeFromFile(file: string): Locale | null {
	return locales.find((l) => localeFile[l] === file) ?? null;
}

export const entries: EntryGenerator = () =>
	locales.flatMap((locale) => {
		const lang = localeFile[locale];
		return [
			{ lang, type: 'site', slug: 'index' },
			...slugsOf('blog').map((slug) => ({ lang, type: 'blog', slug })),
			...slugsOf('cases').map((slug) => ({ lang, type: 'cases', slug })),
			...slugsOf('projetos').map((slug) => ({ lang, type: 'projetos', slug }))
		];
	});

export const GET: RequestHandler = async ({ params }) => {
	const locale = localeFromFile(params.lang);
	if (!locale || !types.includes(params.type as OgType)) error(404);
	const d = t(locale);

	let title = '';
	let kicker = '';
	switch (params.type as OgType) {
		case 'site':
			title = d.hero.tagline;
			kicker = d.meta.siteName;
			break;
		case 'blog': {
			const post = getPost(locale, params.slug);
			if (!post) error(404);
			title = post.meta.title;
			kicker = d.nav.blog;
			break;
		}
		case 'cases': {
			const c = getCase(locale, params.slug);
			if (!c) error(404);
			title = c.meta.title;
			kicker = `${d.nav.cases} · ${c.meta.client}`;
			break;
		}
		case 'projetos': {
			const p = getProject(locale, params.slug);
			if (!p) error(404);
			title = p.meta.title;
			kicker = d.nav.projects;
			break;
		}
	}

	const png = await renderOgImage({ title, kicker });
	return new Response(new Uint8Array(png), {
		headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' }
	});
};
