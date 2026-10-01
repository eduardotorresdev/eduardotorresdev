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

import { contentType, cookieName, readCookie, resolvePath, sameToken } from '../_lib/proposal';

interface Env {
	PROPOSALS: R2Bucket;
	ASSETS: Fetcher;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

const PRIVATE_HEADERS = {
	'cache-control': 'private, no-cache',
	'x-robots-tag': 'noindex, nofollow',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'SAMEORIGIN',
	'referrer-policy': 'no-referrer'
};

async function notFound(env: Env, url: URL): Promise<Response> {
	const page = await env.ASSETS.fetch(new URL('/404.html', url));
	return new Response(page.body, {
		status: 404,
		headers: { 'content-type': 'text/html; charset=utf-8', ...PRIVATE_HEADERS }
	});
}

export const onRequest: PagesFunction<Env, 'path'> = async ({ request, env, params }) => {
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
		if (!sameToken(given, expected)) return notFound(env, url);
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

	const object = await env.PROPOSALS.get(path.key, { onlyIf: request.headers });
	if (!object) return notFound(env, url);

	const headers = new Headers(PRIVATE_HEADERS);
	headers.set('content-type', contentType(path.key));
	headers.set('etag', object.httpEtag);
	// onlyIf casou com If-None-Match: o R2 devolve o objeto sem corpo.
	if (!('body' in object)) return new Response(null, { status: 304, headers });
	return new Response(request.method === 'HEAD' ? null : object.body, { headers });
};
