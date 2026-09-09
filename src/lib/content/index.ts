import { localeFile, locales, type Locale } from '$lib/i18n/locales';
import { countWords, stripFrontmatter } from './reading-time';
import type { Case, CaseMeta, ContentType, Entry, Post, PostMeta, Project, ProjectMeta } from './types';

/*
 * Todo o conteúdo vive em /content/<tipo>/<slug>/<idioma>.md.
 * Aqui só lemos frontmatter e texto cru; o componente Svelte compilado
 * pelo mdsvex é carregado sob demanda em `body.ts`.
 */

const metadata = import.meta.glob('/content/*/*/*.md', { eager: true, import: 'metadata' }) as Record<
	string,
	Record<string, unknown>
>;

const raw = import.meta.glob('/content/*/*/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const PATH = /^\/content\/([^/]+)\/([^/]+)\/([^/]+)\.md$/;

function parsePath(path: string): { type: ContentType; slug: string; locale: Locale } | null {
	const match = PATH.exec(path);
	if (!match) return null;
	const [, type, slug, file] = match;
	const locale = locales.find((l) => localeFile[l] === file);
	if (!locale) return null;
	return { type: type as ContentType, slug, locale };
}

function buildEntry<M>(path: string): Entry<M> | null {
	const parsed = parsePath(path);
	if (!parsed) return null;
	const meta = metadata[path] as M;
	const text = raw[path] ?? '';
	const body = stripFrontmatter(text).trim();
	return {
		slug: parsed.slug,
		locale: parsed.locale,
		meta,
		words: countWords(text),
		hasBody: body.length > 0
	};
}

function entries<M extends { draft?: boolean }>(type: ContentType, locale: Locale): Entry<M>[] {
	return Object.keys(metadata)
		.filter((path) => path.startsWith(`/content/${type}/`))
		.map((path) => buildEntry<M>(path))
		.filter((entry): entry is Entry<M> => entry !== null && entry.locale === locale)
		.filter((entry) => !entry.meta.draft || import.meta.env.DEV);
}

/* Blog */

export function listPosts(locale: Locale): Post[] {
	return entries<PostMeta>('blog', locale).toSorted((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export function getPost(locale: Locale, slug: string): Post | null {
	return listPosts(locale).find((post) => post.slug === slug) ?? null;
}

export function listTags(locale: Locale): { tag: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const post of listPosts(locale)) {
		for (const tag of post.meta.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.toSorted((a, b) => a.tag.localeCompare(b.tag));
}

export function postsByTag(locale: Locale, tag: string): Post[] {
	return listPosts(locale).filter((post) => post.meta.tags.includes(tag));
}

export function adjacentPosts(locale: Locale, slug: string): { previous: Post | null; next: Post | null } {
	const posts = listPosts(locale);
	const index = posts.findIndex((post) => post.slug === slug);
	if (index === -1) return { previous: null, next: null };
	// Lista é decrescente por data: "anterior" é o mais antigo (index + 1).
	return { previous: posts[index + 1] ?? null, next: posts[index - 1] ?? null };
}

/* Cases */

export function listCases(locale: Locale): Case[] {
	return entries<CaseMeta>('cases', locale).toSorted(
		(a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99) || b.meta.year - a.meta.year
	);
}

export function featuredCases(locale: Locale): Case[] {
	return listCases(locale).filter((c) => c.meta.featured);
}

export function getCase(locale: Locale, slug: string): Case | null {
	return listCases(locale).find((c) => c.slug === slug) ?? null;
}

/* Projetos */

export function listProjects(locale: Locale): Project[] {
	return entries<ProjectMeta>('projetos', locale).toSorted(
		(a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99) || b.meta.year - a.meta.year
	);
}

export function getProject(locale: Locale, slug: string): Project | null {
	return listProjects(locale).find((p) => p.slug === slug) ?? null;
}

/** Slugs existentes de um tipo, para o prerender enumerar as rotas. */
export function slugsOf(type: ContentType): string[] {
	const slugs = new Set<string>();
	for (const path of Object.keys(metadata)) {
		const parsed = parsePath(path);
		if (parsed && parsed.type === type) slugs.add(parsed.slug);
	}
	return [...slugs];
}
