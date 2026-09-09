/*
 * Pages Function: recebe o formulário de contato, valida o Turnstile e
 * dispara o e-mail via Resend. Roda só na Cloudflare; o site em si é estático.
 *
 * Variáveis de ambiente (Pages → Settings → Environment variables):
 *   RESEND_API_KEY      chave da Resend
 *   CONTACT_TO          e-mail que recebe as mensagens
 *   CONTACT_FROM        remetente verificado na Resend (ex.: site@eduardotorres.dev)
 *   TURNSTILE_SECRET    segredo do Turnstile (opcional; sem ele, só o honeypot protege)
 */

interface Env {
	RESEND_API_KEY: string;
	CONTACT_TO: string;
	CONTACT_FROM: string;
	TURNSTILE_SECRET?: string;
}

interface Payload {
	name?: string;
	email?: string;
	subject?: string;
	website?: string;
	locale?: string;
	'cf-turnstile-response'?: string;
}

const SUBJECT_MAX = 150;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: unknown) =>
	new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

async function readPayload(request: Request): Promise<Payload> {
	const type = request.headers.get('content-type') ?? '';
	if (type.includes('application/json')) return (await request.json()) as Payload;
	return Object.fromEntries((await request.formData()).entries()) as Payload;
}

async function verifyTurnstile(
	secret: string,
	token: string | undefined,
	ip: string | null
): Promise<boolean> {
	if (!token) return false;
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined })
	});
	const data = (await res.json()) as { success: boolean };
	return data.success;
}

const escape = (s: string) =>
	s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] ?? c);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	const payload = await readPayload(request);

	// Honeypot preenchido: bot. Responde ok pra não dar pista.
	if (payload.website) return json(200, { ok: true });

	const name = payload.name?.trim() ?? '';
	const email = payload.email?.trim() ?? '';
	const subject = payload.subject?.trim() ?? '';

	if (!name || name.length > 120) return json(400, { error: 'name' });
	if (!EMAIL.test(email) || email.length > 200) return json(400, { error: 'email' });
	if (!subject || subject.length > SUBJECT_MAX) return json(400, { error: 'subject' });

	if (env.TURNSTILE_SECRET) {
		const ok = await verifyTurnstile(
			env.TURNSTILE_SECRET,
			payload['cf-turnstile-response'],
			request.headers.get('cf-connecting-ip')
		);
		if (!ok) return json(403, { error: 'turnstile' });
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
		body: JSON.stringify({
			from: env.CONTACT_FROM,
			to: [env.CONTACT_TO],
			reply_to: email,
			subject: `[site] ${subject}`,
			html: `<p><strong>${escape(name)}</strong> &lt;${escape(email)}&gt; (${escape(payload.locale ?? '')})</p><p>${escape(subject)}</p>`,
			text: `${name} <${email}> (${payload.locale ?? ''})\n\n${subject}`
		})
	});

	if (!res.ok) return json(502, { error: 'delivery' });
	return json(200, { ok: true });
};
