import type { Locale } from '../i18n/locales';
import { site } from '../site';

/*
 * Dados estruturados (schema.org) em JSON-LD. Só monta objetos; quem serializa
 * e injeta no <head> é o Seo.svelte. Tudo puro pra dar pra testar.
 */

export type JsonLd = Record<string, unknown>;

const absolute = (path: string) => new URL(path, site.url).href;

export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;

const languageTag: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en' };

export function personSchema(jobTitle: string): JsonLd {
	return {
		'@type': 'Person',
		'@id': personId,
		name: site.name,
		alternateName: site.fullName,
		url: site.url,
		email: `mailto:${site.email}`,
		image: absolute('/img/eduardo-torres.webp'),
		jobTitle,
		worksFor: { '@type': 'Organization', name: 'Grupo Globo' },
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'São Luís',
			addressRegion: 'MA',
			addressCountry: 'BR'
		},
		sameAs: Object.values(site.social)
	};
}

export function websiteSchema(locale: Locale, description: string): JsonLd {
	return {
		'@type': 'WebSite',
		'@id': websiteId,
		url: site.url,
		name: site.name,
		description,
		inLanguage: languageTag[locale],
		publisher: { '@id': personId }
	};
}

export interface ArticleInput {
	locale: Locale;
	/** Caminho absoluto no site, ex.: /blog/slug */
	path: string;
	title: string;
	description: string;
	image: string;
	publishedAt?: string;
	tags?: string[];
	/** `BlogPosting` pra post; `CreativeWork` pra case e projeto. */
	kind: 'BlogPosting' | 'CreativeWork';
}

export function articleSchema(input: ArticleInput): JsonLd {
	const url = absolute(input.path);
	return {
		'@type': input.kind,
		'@id': `${url}#${input.kind === 'BlogPosting' ? 'article' : 'work'}`,
		mainEntityOfPage: url,
		url,
		headline: input.title,
		description: input.description,
		image: absolute(input.image),
		inLanguage: languageTag[input.locale],
		author: { '@id': personId },
		...(input.kind === 'BlogPosting' ? { publisher: { '@id': personId } } : {}),
		...(input.publishedAt ? { datePublished: input.publishedAt, dateModified: input.publishedAt } : {}),
		...(input.tags?.length ? { keywords: input.tags.join(', ') } : {})
	};
}

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: absolute(crumb.path)
		}))
	};
}

/** Embrulha tudo num único `@graph`, que é como o Google prefere ler vários nós. */
export function graph(nodes: JsonLd[]): string {
	return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}

/** JSON dentro de <script> não pode fechar a tag nem abrir comentário HTML. */
export function safeJsonLd(json: string): string {
	return json.replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e');
}
