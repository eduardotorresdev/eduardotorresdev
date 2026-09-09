import { error } from '@sveltejs/kit';
import { getCase, getPost, getProject, slugsOf } from '$lib/content';
import { locales, localeFile, t, type Locale } from '$lib/i18n';
import { renderOgImage, type OgInput } from '$lib/server/og';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

const types = ['site', 'blog', 'cases', 'projetos'] as const;
type OgType = (typeof types)[number];

/** Páginas fixas que ganham card próprio, sob o tipo `site`. */
const sitePages = ['index', 'sobre', 'blog', 'cases'] as const;
type SitePage = (typeof sitePages)[number];

function localeFromFile(file: string): Locale | null {
	return locales.find((l) => localeFile[l] === file) ?? null;
}

export const entries: EntryGenerator = () =>
	locales.flatMap((locale) => {
		const lang = localeFile[locale];
		return [
			...sitePages.map((slug) => ({ lang, type: 'site', slug })),
			...slugsOf('blog').map((slug) => ({ lang, type: 'blog', slug })),
			...slugsOf('cases').map((slug) => ({ lang, type: 'cases', slug })),
			...slugsOf('projetos').map((slug) => ({ lang, type: 'projetos', slug }))
		];
	});

function siteCard(locale: Locale, slug: string): OgInput | null {
	const d = t(locale);
	switch (slug as SitePage) {
		case 'index':
			return { kicker: d.meta.siteName, title: d.hero.tagline, subtitle: d.meta.description };
		case 'sobre':
			return { kicker: d.about.title, title: d.about.lead };
		case 'blog':
			return { kicker: d.nav.blog, title: d.sections.blog.lead };
		case 'cases':
			return { kicker: d.nav.cases, title: d.sections.cases.lead };
		default:
			return null;
	}
}

function card(locale: Locale, type: OgType, slug: string): OgInput | null {
	const d = t(locale);
	switch (type) {
		case 'site':
			return siteCard(locale, slug);
		case 'blog': {
			const post = getPost(locale, slug);
			return post && { title: post.meta.title, kicker: d.nav.blog, subtitle: post.meta.summary };
		}
		case 'cases': {
			const c = getCase(locale, slug);
			return (
				c && { title: c.meta.title, kicker: `${d.nav.cases} · ${c.meta.client}`, subtitle: c.meta.summary }
			);
		}
		case 'projetos': {
			const p = getProject(locale, slug);
			return p && { title: p.meta.title, kicker: d.nav.projects, subtitle: p.meta.summary };
		}
	}
}

export const GET: RequestHandler = async ({ params }) => {
	const locale = localeFromFile(params.lang);
	if (!locale || !types.includes(params.type as OgType)) error(404);
	const input = card(locale, params.type as OgType, params.slug);
	if (!input) error(404);

	const png = await renderOgImage(input);
	return new Response(new Uint8Array(png), {
		headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' }
	});
};
