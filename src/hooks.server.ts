import type { Handle } from '@sveltejs/kit';
import { isHomePath, localeFromPath } from '$lib/i18n/routes';

/*
 * O traço do hero é o elemento de LCP da home. Preload dele tem que sair no
 * topo do <head>, antes dos modulepreload do SvelteKit — por isso vive aqui e
 * não num <svelte:head>, que só consegue escrever depois deles.
 */
const HERO_PRELOAD =
	'<link rel="preload" as="image" fetchpriority="high" media="(max-width: 56rem)" ' +
	'href="/img/eduardo-torres-linhas-800.webp">' +
	'<link rel="preload" as="image" fetchpriority="high" media="(min-width: 56.01rem)" ' +
	'href="/img/eduardo-torres-linhas.webp">';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = localeFromPath(event.url.pathname);
	const preload = isHomePath(event.url.pathname) ? HERO_PRELOAD : '';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale).replace('%head.preload%', preload)
	});
};
