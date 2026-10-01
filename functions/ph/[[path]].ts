/*
 * Pages Function: proxy de primeira parte pro PostHog.
 *
 * A medição aponta pra /ph, não pro domínio do PostHog. Assim ela sai do mesmo
 * host do site e sobrevive a bloqueador de rastreador e a rede corporativa que
 * filtra domínio de analytics — exatamente o caso das propostas, onde o acesso
 * que mais importa vem de dentro da empresa do cliente.
 *
 *   /ph/static/*  → us-assets.i.posthog.com   (array.js, recorder.js)
 *   /ph/*         → us.i.posthog.com          (ingestão: /e, /i/v0/e, /flags)
 *
 * Projeto fica na região US (token phc_… resolvido em us.i.posthog.com).
 */

const ASSET_HOST = 'us-assets.i.posthog.com';
const INGEST_HOST = 'us.i.posthog.com';

export const onRequest: PagesFunction<unknown, 'path'> = async ({ request, params }) => {
	const segments = Array.isArray(params.path) ? params.path : [];
	// Nada de .. ou segmento vazio subindo pro upstream.
	if (segments.some((s) => !s || s === '.' || s === '..')) {
		return new Response(null, { status: 404 });
	}

	const isAsset = segments[0] === 'static';
	const url = new URL(request.url);
	url.protocol = 'https:';
	url.host = isAsset ? ASSET_HOST : INGEST_HOST;
	url.port = '';
	url.pathname = `/${segments.join('/')}`;

	const headers = new Headers(request.headers);
	headers.set('host', url.host);
	// Cookie nosso não interessa à ingestão, e o da proposta é privado.
	headers.delete('cookie');

	const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
	const upstream = await fetch(
		new Request(url, {
			method: request.method,
			headers,
			body: hasBody ? request.body : undefined,
			redirect: 'manual'
		})
	);

	const response = new Response(upstream.body, upstream);
	// O PostHog não deveria mandar cookie por aqui; se mandar, não repassamos.
	response.headers.delete('set-cookie');
	if (isAsset) response.headers.set('cache-control', 'public, max-age=3600');
	return response;
};
