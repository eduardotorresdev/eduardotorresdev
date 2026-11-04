/*
 * Lógica pura das propostas privadas (/propostas/<slug>/...), separada da
 * Function pra poder ser testada no Vitest. Arquivo sem `onRequest*`: o Pages
 * não gera rota pra ele.
 */

import { escapeHtml } from './analytics';

export const SLUG = /^[a-z0-9][a-z0-9-]*$/;

export interface ProposalPath {
	slug: string;
	/** Chave do objeto no R2, ex.: `abee/index.html`. */
	key: string;
}

/**
 * Converte os segmentos do catch-all em chave do R2. Recusa slug inválido,
 * `..` e segmentos que começam com `.` ou `_` (é onde fica o `_token`).
 */
export function resolvePath(segments: string[], trailingSlash: boolean): ProposalPath | null {
	const [slug, ...rest] = segments;
	if (!slug || !SLUG.test(slug)) return null;
	if (rest.some((s) => !s || s.startsWith('.') || s.startsWith('_'))) return null;
	const file = rest.length === 0 || trailingSlash ? [...rest, 'index.html'] : rest;
	return { slug, key: [slug, ...file].join('/') };
}

export const cookieName = (slug: string) => `proposta_${slug.replaceAll('-', '_')}`;

export function readCookie(header: string | null, name: string): string | null {
	if (!header) return null;
	for (const part of header.split(';')) {
		const [k, ...v] = part.trim().split('=');
		if (k === name) return decodeURIComponent(v.join('='));
	}
	return null;
}

/** Comparação em tempo constante pro tamanho do esperado. */
export function sameToken(given: string | null, expected: string): boolean {
	if (given === null || given.length !== expected.length) return false;
	let diff = 0;
	for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
	return diff === 0;
}

const TYPES: Record<string, string> = {
	html: 'text/html; charset=utf-8',
	css: 'text/css; charset=utf-8',
	js: 'text/javascript; charset=utf-8',
	json: 'application/json',
	svg: 'image/svg+xml',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	avif: 'image/avif',
	gif: 'image/gif',
	pdf: 'application/pdf',
	woff2: 'font/woff2'
};

export function contentType(key: string): string {
	const ext = key.slice(key.lastIndexOf('.') + 1).toLowerCase();
	return TYPES[ext] ?? 'application/octet-stream';
}

/*
 * Prévia de link (WhatsApp, Instagram, iMessage...). O robô que monta a prévia
 * não guarda o cookie do redirect, então com o fluxo normal ele cai no 404 e o
 * link chega sem imagem. Pra ele a Function responde o index.html direto, com
 * as tags Open Graph, e a imagem é servida com o mesmo token da query.
 */

/** Caminho público da imagem de prévia; no bucket ela fica em `<slug>/_og.jpg`. */
export const PREVIEW_IMAGE = 'og.jpg';
export const previewImageKey = (slug: string) => `${slug}/_og.jpg`;

const LINK_PREVIEW_BOT =
	/whatsapp|facebookexternalhit|facebookcatalog|facebot|meta-externalagent|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|skypeuripreview|redditbot|pinterest|embedly|vkshare|applebot/i;

export function isLinkPreviewBot(userAgent: string | null): boolean {
	return !!userAgent && LINK_PREVIEW_BOT.test(userAgent);
}

export interface PreviewMeta {
	title: string;
	/** URL da proposta, sem o token. */
	url: string;
	/** URL absoluta da imagem, já com o token; ausente quando a proposta não tem imagem. */
	image?: string;
}

export function previewTags({ title, url, image }: PreviewMeta): string {
	const tags = [
		['og:type', 'website'],
		['og:site_name', 'Eduardo Torres'],
		['og:title', title],
		['og:description', 'Prévia do site, preparada por Eduardo Torres.'],
		['og:url', url],
		...(image
			? [
					['og:image', image],
					['og:image:type', 'image/jpeg'],
					['og:image:width', '1200'],
					['og:image:height', '630']
				]
			: [])
	].map(([p, c]) => `<meta property="${p}" content="${escapeHtml(c)}">`);
	tags.push(`<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`);
	return tags.join('');
}
