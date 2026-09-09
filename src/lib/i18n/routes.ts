import { defaultLocale, localeFromPrefix, localePrefix, locales, type Locale } from './locales';

/**
 * Slug público de cada rota interna, por idioma.
 * A rota interna (pasta em src/routes) é sempre em português.
 */
export const routeSlugs = {
	sobre: { 'pt-BR': 'sobre', en: 'about' },
	cases: { 'pt-BR': 'cases', en: 'cases' },
	projetos: { 'pt-BR': 'projetos', en: 'projects' },
	blog: { 'pt-BR': 'blog', en: 'blog' },
	tag: { 'pt-BR': 'tag', en: 'tag' },
	contato: { 'pt-BR': 'contato', en: 'contact' }
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSlugs;

function splitPath(pathname: string): { locale: Locale; segments: string[] } {
	const segments = pathname.split('/').filter(Boolean);
	const [first] = segments;
	const secondary = locales.find((locale) => locale !== defaultLocale && localePrefix[locale] === first);
	if (secondary) return { locale: secondary, segments: segments.slice(1) };
	return { locale: defaultLocale, segments };
}

export function localeFromPath(pathname: string): Locale {
	return splitPath(pathname).locale;
}

/** /en/about → /en/sobre. Só o primeiro segmento é traduzido. */
export function publicToInternalPath(pathname: string): string {
	const { locale, segments } = splitPath(pathname);
	if (locale === defaultLocale || segments.length === 0) return pathname;
	const [head, ...rest] = segments;
	const key = (Object.keys(routeSlugs) as RouteKey[]).find((route) => routeSlugs[route][locale] === head);
	if (!key) return pathname;
	return '/' + [localePrefix[locale], routeSlugs[key][defaultLocale], ...rest].join('/');
}

/** Monta a URL pública de uma rota: href('sobre', 'en') → /en/about */
export function href(locale: Locale, route?: RouteKey, ...rest: string[]): string {
	const parts = [localePrefix[locale]];
	if (route) parts.push(routeSlugs[route][locale]);
	parts.push(...rest);
	const path = '/' + parts.filter(Boolean).join('/');
	return path === '' ? '/' : path;
}

/** Âncora na home ou na página atual: anchor('cases', 'en') → /en#cases */
export function homeAnchor(locale: Locale, id: string): string {
	return `${href(locale)}#${id}`;
}

/** Troca o idioma mantendo a mesma página. */
export function switchLocalePath(pathname: string, target: Locale): string {
	const { locale, segments } = splitPath(pathname);
	if (locale === target) return pathname;
	if (segments.length === 0) return href(target);
	const [head, ...rest] = segments;
	const key = (Object.keys(routeSlugs) as RouteKey[]).find((route) => routeSlugs[route][locale] === head);
	return key ? href(target, key, ...rest) : href(target, undefined, head, ...rest);
}

export function localeFromParam(param: string | undefined): Locale {
	return localeFromPrefix(param);
}

/**
 * URL da página atual em outro idioma. Páginas que não têm tradução direta
 * (ex.: tag do blog) devolvem `alternates` no load e são respeitadas aqui.
 */
export function alternatePath(
	page: { url: URL; data: { alternates?: Partial<Record<Locale, string>> } },
	target: Locale
): string {
	return page.data.alternates?.[target] ?? switchLocalePath(page.url.pathname, target);
}
