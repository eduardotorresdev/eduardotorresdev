import { listCases, listPosts, listProjects, listTags } from '$lib/content';
import { href, locales, type Locale } from '$lib/i18n';
import { site } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

function urlsFor(locale: Locale): string[] {
	return [
		href(locale),
		href(locale, 'sobre'),
		href(locale, 'cases'),
		href(locale, 'blog'),
		...listPosts(locale).map((p) => href(locale, 'blog', p.slug)),
		...listTags(locale).map(({ tag }) => href(locale, 'blog', 'tag', tag)),
		...listCases(locale).map((c) => href(locale, 'cases', c.slug)),
		...listProjects(locale)
			.filter((p) => p.hasBody)
			.map((p) => href(locale, 'projetos', p.slug))
	];
}

export const GET: RequestHandler = () => {
	const urls = locales.flatMap(urlsFor);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `\t<url><loc>${site.url}${u}</loc></url>`).join('\n')}
</urlset>`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
