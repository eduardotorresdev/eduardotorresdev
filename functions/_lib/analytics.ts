/*
 * Tags de medição injetadas no HTML servido pela Function (a injeção em si fica
 * na rota, que é onde vive o HTMLRewriter).
 *
 * Mesmo par de scripts que o src/app.html usa no site: o array.js pelo proxy
 * de primeira parte e o /ph.js, que concentra a configuração. Aqui só montamos
 * as tags com a key e as propriedades fixas da página.
 */

export interface Analytics {
	key: string | undefined;
	// Propriedades presentes em todo evento da página (surface, proposta, …).
	properties: Record<string, string>;
}

// Atributo com aspas escapadas já não dá pra fechar, mas escapamos < e > também:
// nenhum pedaço de slug ou propriedade chega ao HTML como marcação.
function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function analyticsTags({ key, properties }: Analytics): string {
	if (!key) return '';
	return (
		'<script defer src="/ph/static/array.js"></script>' +
		`<script defer src="/ph.js" data-key="${escapeHtml(key)}"` +
		` data-props="${escapeHtml(JSON.stringify(properties))}"></script>`
	);
}
