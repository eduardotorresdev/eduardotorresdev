import { listCases, listPosts, listProjects, listTags } from '$lib/content';
import { href, locales, type Locale, type RouteKey } from '$lib/i18n';
import { site } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

interface Page {
	/** Caminho por idioma. Página que só existe num idioma entra só nele. */
	paths: Partial<Record<Locale, string>>;
	lastmod?: string;
}

const inEveryLocale = (route?: RouteKey, ...rest: string[]): Page['paths'] =>
	Object.fromEntries(locales.map((locale) => [locale, href(locale, route, ...rest)]));

function pages(): Page[] {
	// Todo conteúdo existe nos dois idiomas com o mesmo slug, então os slugs de pt-BR bastam.
	const base: Locale = 'pt-BR';
	return [
		{ paths: inEveryLocale() },
		{ paths: inEveryLocale('sobre') },
		{ paths: inEveryLocale('cases') },
		{ paths: inEveryLocale('blog'), lastmod: listPosts(base)[0]?.meta.date },
		...listPosts(base).map((p) => ({ paths: inEveryLocale('blog', p.slug), lastmod: p.meta.date })),
		...listCases(base).map((c) => ({ paths: inEveryLocale('cases', c.slug) })),
		...listProjects(base)
			.filter((p) => p.hasBody)
			.map((p) => ({ paths: inEveryLocale('projetos', p.slug) })),
		// Tags não têm tradução 1:1: cada idioma lista as suas, sem alternate.
		...locales.flatMap((locale) =>
			listTags(locale).map(({ tag }) => ({ paths: { [locale]: href(locale, 'blog', 'tag', tag) } }))
		)
	];
}

const hreflang: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en' };

function urlEntry(page: Page, locale: Locale, path: string): string {
	const alternates = (Object.entries(page.paths) as [Locale, string][]).map(
		([alt, altPath]) =>
			`\t\t<xhtml:link rel="alternate" hreflang="${hreflang[alt]}" href="${site.url}${altPath}"/>`
	);
	if (page.paths['pt-BR']) {
		alternates.push(
			`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${site.url}${page.paths['pt-BR']}"/>`
		);
	}
	return [
		'\t<url>',
		`\t\t<loc>${site.url}${path}</loc>`,
		...(page.lastmod ? [`\t\t<lastmod>${page.lastmod}</lastmod>`] : []),
		...(alternates.length > 1 ? alternates : []),
		'\t</url>'
	].join('\n');
}

export const GET: RequestHandler = () => {
	const entries = pages().flatMap((page) =>
		(Object.entries(page.paths) as [Locale, string][]).map(([locale, path]) => urlEntry(page, locale, path))
	);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
