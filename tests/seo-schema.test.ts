import { describe, expect, it } from 'vitest';
import {
	articleSchema,
	breadcrumbSchema,
	graph,
	personSchema,
	safeJsonLd,
	websiteSchema
} from '../src/lib/seo/schema';
import { site } from '../src/lib/site';

describe('schema.org', () => {
	it('Person e WebSite se referenciam pelo mesmo @id', () => {
		const person = personSchema('Engenheiro');
		const website = websiteSchema('pt-BR', 'desc');
		expect(website.publisher).toEqual({ '@id': person['@id'] });
		expect(person.sameAs).toEqual(Object.values(site.social));
	});

	it('artigo resolve caminhos relativos pra URL absoluta', () => {
		const a = articleSchema({
			locale: 'en',
			path: '/en/blog/slug',
			title: 'T',
			description: 'D',
			image: '/og/en/blog/slug.png',
			publishedAt: '2026-09-06',
			tags: ['a', 'b'],
			kind: 'BlogPosting'
		});
		expect(a.url).toBe(`${site.url}/en/blog/slug`);
		expect(a.image).toBe(`${site.url}/og/en/blog/slug.png`);
		expect(a.inLanguage).toBe('en');
		expect(a.keywords).toBe('a, b');
		expect(a.datePublished).toBe('2026-09-06');
		expect(a.publisher).toBeDefined();
	});

	it('CreativeWork não leva publisher nem datas quando não há', () => {
		const w = articleSchema({
			locale: 'pt-BR',
			path: '/cases/x',
			title: 'T',
			description: 'D',
			image: '/i.png',
			kind: 'CreativeWork'
		});
		expect(w).not.toHaveProperty('publisher');
		expect(w).not.toHaveProperty('datePublished');
		expect(w).not.toHaveProperty('keywords');
	});

	it('breadcrumbs numeram a posição a partir de 1', () => {
		const b = breadcrumbSchema([
			{ name: 'Início', path: '/' },
			{ name: 'Blog', path: '/blog' }
		]);
		const items = b.itemListElement as { position: number; item: string }[];
		expect(items.map((i) => i.position)).toEqual([1, 2]);
		expect(items[1].item).toBe(`${site.url}/blog`);
	});

	it('graph serializa com @context e escapa o que fecharia o <script>', () => {
		const json = safeJsonLd(graph([{ '@type': 'Thing', name: '</script><!-- -->' }]));
		expect(json.startsWith('{"@context":"https://schema.org","@graph":[')).toBe(true);
		expect(json).not.toContain('</script>');
		expect(json).not.toContain('-->');
		expect(JSON.parse(json)['@graph'][0].name).toBe('</script><!-- -->');
	});
});
