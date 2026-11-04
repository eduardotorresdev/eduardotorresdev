/*
 * Pages Function: serve propostas privadas para clientes a partir do R2.
 *
 * O material não fica no repo (que é público). Cada proposta é uma pasta no
 * bucket ligado como PROPOSALS:
 *   <slug>/_token       token de acesso, texto puro
 *   <slug>/index.html   entrada; o resto são arquivos relativos a ela
 *
 * O link enviado ao cliente é /propostas/<slug>?token=XXX. Token certo grava
 * um cookie restrito ao caminho da proposta e redireciona pra URL limpa, pra
 * os arquivos relativos (iframes, imagens) passarem sem token na query.
 * Qualquer falha responde o 404 do site: não revela que a proposta existe.
 *
 * Subir/atualizar: scripts/proposal-upload.sh <slug> <pasta> <token>
 */

import { analyticsTags, INGEST_URL, serverEventPayload } from '../_lib/analytics';
import {
	contentType,
	cookieName,
	isLinkPreviewBot,
	PREVIEW_IMAGE,
	previewImageKey,
	previewTags,
	readCookie,
	resolvePath,
	sameToken
} from '../_lib/proposal';

interface Env {
	PROPOSALS: R2Bucket;
	ASSETS: Fetcher;
	// Vazia desliga a medição (local e preview).
	PUBLIC_POSTHOG_KEY?: string;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

const PRIVATE_HEADERS = {
	'cache-control': 'private, no-cache',
	'x-robots-tag': 'noindex, nofollow',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'SAMEORIGIN',
	'referrer-policy': 'no-referrer'
};

// Identidade estável por visitante sem guardar IP: hash de IP + user-agent.
async function visitorId(request: Request, slug: string): Promise<string> {
	const seed = [
		request.headers.get('cf-connecting-ip') ?? '',
		request.headers.get('user-agent') ?? '',
		slug
	].join('|');
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed));
	const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
	return `servidor-${hex.slice(0, 16)}`;
}

// Captura do lado do servidor. Cobre o que o script não cobre: token inválido,
// que devolve 404 sem rodar JS, e visitante que bloqueia script.
function reportFromServer(
	env: Env,
	waitUntil: (promise: Promise<unknown>) => void,
	request: Request,
	event: string,
	slug: string
): void {
	const key = env.PUBLIC_POSTHOG_KEY;
	if (!key) return;
	waitUntil(
		visitorId(request, slug)
			.then((distinctId) =>
				fetch(INGEST_URL, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(
						serverEventPayload({
							key,
							event,
							distinctId,
							properties: { surface: 'proposta', proposta: slug },
							ip: request.headers.get('cf-connecting-ip') ?? undefined
						})
					)
				})
			)
			// Medição nunca derruba a entrega da proposta.
			.catch(() => undefined)
	);
}

// Injeta as tags no fim do <head>, em trânsito: o HTML no bucket não muda.
function injectAnalytics(response: Response, tags: string): Response {
	if (!tags) return response;
	return new HTMLRewriter()
		.on('head', {
			element(element) {
				element.append(tags, { html: true });
			}
		})
		.transform(response);
}

// Imagem de prévia do link, gerada pelo scripts/proposal-upload.sh.
async function previewImage(env: Env, url: URL, slug: string): Promise<Response> {
	const object = await env.PROPOSALS.get(previewImageKey(slug));
	if (!object) return notFound(env, url);
	return new Response(object.body, {
		headers: { ...PRIVATE_HEADERS, 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=3600' }
	});
}

const decodeEntities = (s: string) =>
	s.replace(
		/&(amp|lt|gt|quot|#39|middot);/g,
		(_, e: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", middot: '·' })[e] ?? _
	);

// Pro robô que monta a prévia do link: o index.html direto, sem redirect, cookie
// nem medição (a prévia não é o cliente abrindo), com as tags Open Graph no fim
// do <head>. O título é o próprio <title> da proposta.
async function linkPreview(env: Env, url: URL, slug: string, token: string): Promise<Response> {
	const object = await env.PROPOSALS.get(`${slug}/index.html`);
	if (!object) return notFound(env, url);
	const hasImage = (await env.PROPOSALS.head(previewImageKey(slug))) !== null;
	const base = `${url.origin}/propostas/${slug}/`;
	let title = '';
	return new HTMLRewriter()
		.on('meta[property^="og:"], meta[name^="twitter:"]', { element: (el) => void el.remove() })
		.on('title', { text: (chunk) => void (title += chunk.text) })
		.on('head', {
			element(el) {
				el.onEndTag((end) => {
					const tags = previewTags({
						title: decodeEntities(title.trim()) || 'Proposta',
						url: base,
						image: hasImage ? `${base}${PREVIEW_IMAGE}?token=${encodeURIComponent(token)}` : undefined
					});
					end.before(tags, { html: true });
				});
			}
		})
		.transform(
			new Response(object.body, {
				headers: { ...PRIVATE_HEADERS, 'content-type': 'text/html; charset=utf-8' }
			})
		);
}

async function notFound(env: Env, url: URL): Promise<Response> {
	const page = await env.ASSETS.fetch(new URL('/404.html', url));
	return new Response(page.body, {
		status: 404,
		headers: { 'content-type': 'text/html; charset=utf-8', ...PRIVATE_HEADERS }
	});
}

export const onRequest: PagesFunction<Env, 'path'> = async ({ request, env, params, waitUntil }) => {
	const url = new URL(request.url);
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } });
	}

	const segments = Array.isArray(params.path) ? params.path : [];
	const path = resolvePath(segments, url.pathname.endsWith('/'));
	if (!path) return notFound(env, url);
	const base = `/propostas/${path.slug}/`;

	const expected = (await (await env.PROPOSALS.get(`${path.slug}/_token`))?.text())?.trim();
	if (!expected) return notFound(env, url);

	const given = url.searchParams.get('token');
	if (given !== null) {
		if (!sameToken(given, expected)) {
			// Link encaminhado truncado ou token trocado: muda o follow-up por
			// completo, então é o único 404 que vale registrar.
			reportFromServer(env, waitUntil, request, 'proposta_token_invalido', path.slug);
			return notFound(env, url);
		}
		// O robô da prévia não guarda o cookie do redirect: resposta direta pra ele.
		if (path.key === `${path.slug}/${PREVIEW_IMAGE}`) return previewImage(env, url, path.slug);
		if (path.key === `${path.slug}/index.html` && isLinkPreviewBot(request.headers.get('user-agent'))) {
			return linkPreview(env, url, path.slug, given);
		}
		url.searchParams.delete('token');
		// /propostas/abee → /propostas/abee/: sem a barra os caminhos relativos quebram.
		const target = url.pathname === base.slice(0, -1) ? base + url.search : url.pathname + url.search;
		const cookie = `${cookieName(path.slug)}=${encodeURIComponent(given)}; Path=${base}; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
		return new Response(null, {
			status: 302,
			headers: { location: target, 'set-cookie': cookie, ...PRIVATE_HEADERS }
		});
	}

	if (url.pathname === base.slice(0, -1)) {
		return new Response(null, { status: 301, headers: { location: base + url.search } });
	}
	if (!sameToken(readCookie(request.headers.get('cookie'), cookieName(path.slug)), expected)) {
		return notFound(env, url);
	}

	if (path.key === `${path.slug}/${PREVIEW_IMAGE}`) return previewImage(env, url, path.slug);

	const type = contentType(path.key);

	// Assets seguem com etag e revalidação condicional, como antes.
	if (!type.startsWith('text/html')) {
		const object = await env.PROPOSALS.get(path.key, { onlyIf: request.headers });
		if (!object) return notFound(env, url);
		const headers = new Headers(PRIVATE_HEADERS);
		headers.set('content-type', type);
		headers.set('etag', object.httpEtag);
		// onlyIf casou com If-None-Match: o R2 devolve o objeto sem corpo.
		if (!('body' in object)) return new Response(null, { status: 304, headers });
		return new Response(request.method === 'HEAD' ? null : object.body, { headers });
	}

	// HTML fica fora da revalidação: o corpo que sai daqui não é o do R2, porque a
	// medição entra em trânsito. Com etag, um navegador que já abriu a proposta
	// reusaria a cópia em cache e nunca receberia as tags.
	const object = await env.PROPOSALS.get(path.key);
	if (!object) return notFound(env, url);

	const headers = new Headers(PRIVATE_HEADERS);
	headers.set('content-type', type);
	if (request.method === 'HEAD') return new Response(null, { headers });

	reportFromServer(env, waitUntil, request, 'proposta_aberta_servidor', path.slug);

	// O material do cliente não é tocado no bucket: a injeção é só na resposta.
	return injectAnalytics(
		new Response(object.body, { headers }),
		analyticsTags({
			key: env.PUBLIC_POSTHOG_KEY,
			properties: { surface: 'proposta', proposta: path.slug }
		})
	);
};
