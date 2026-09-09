import { listPosts } from '$lib/content';
import { href, localeFile, localeFromParam, t } from '$lib/i18n';
import { site } from '$lib/site';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;
export const entries: EntryGenerator = () => [{ lang: '' }, { lang: 'en' }];

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = ({ params }) => {
	const locale = localeFromParam(params.lang);
	const d = t(locale);
	const items = listPosts(locale)
		.map(
			(post) => `<item>
	<title>${escape(post.meta.title)}</title>
	<link>${site.url}${href(locale, 'blog', post.slug)}</link>
	<guid>${site.url}${href(locale, 'blog', post.slug)}</guid>
	<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
	<description>${escape(post.meta.summary)}</description>
	<enclosure url="${site.url}/og/${localeFile[locale]}/blog/${post.slug}.png" type="image/png" length="0"/>
	${post.meta.tags.map((tag) => `<category>${escape(tag)}</category>`).join('')}
</item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>${escape(site.name)} · ${escape(d.nav.blog)}</title>
	<link>${site.url}${href(locale, 'blog')}</link>
	<description>${escape(d.sections.blog.lead)}</description>
	<language>${locale.toLowerCase()}</language>
	<image>
		<url>${site.url}/icon-512.png</url>
		<title>${escape(site.name)} · ${escape(d.nav.blog)}</title>
		<link>${site.url}${href(locale, 'blog')}</link>
	</image>
	<atom:link href="${site.url}${href(locale, undefined, 'rss.xml')}" rel="self" type="application/rss+xml"/>
	${items}
</channel>
</rss>`;

	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
