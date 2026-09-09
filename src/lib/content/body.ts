import { localeFile, type Locale } from '$lib/i18n/locales';
import type { Component } from 'svelte';
import type { ContentType } from './types';

/*
 * Separado do index para o cliente só carregar o componente markdown da página,
 * sem puxar os globs de metadados e texto cru.
 */
const bodies = import.meta.glob('/content/*/*/*.md') as Record<string, () => Promise<{ default: Component }>>;

export async function loadBody(type: ContentType, slug: string, locale: Locale): Promise<Component | null> {
	const loader = bodies[`/content/${type}/${slug}/${localeFile[locale]}.md`];
	if (!loader) return null;
	return (await loader()).default;
}
