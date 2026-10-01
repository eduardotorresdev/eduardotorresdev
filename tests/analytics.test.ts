import { describe, expect, it } from 'vitest';
import { analyticsTags } from '../functions/_lib/analytics';

describe('analyticsTags', () => {
	it('não emite nada sem key, pra dev e preview ficarem limpos', () => {
		expect(analyticsTags({ key: undefined, properties: { surface: 'site' } })).toBe('');
		expect(analyticsTags({ key: '', properties: { surface: 'site' } })).toBe('');
	});

	it('carrega o array.js pelo proxy e o ph.js com as propriedades', () => {
		const tags = analyticsTags({
			key: 'phc_abc',
			properties: { surface: 'proposta', proposta: 'abee' }
		});
		expect(tags).toContain('src="/ph/static/array.js"');
		expect(tags).toContain('data-key="phc_abc"');
		expect(tags).toContain('&quot;proposta&quot;:&quot;abee&quot;');
		// Sem host do PostHog no HTML: tudo passa pelo domínio do site.
		expect(tags).not.toContain('posthog.com');
	});

	it('escapa o que fecharia a tag', () => {
		const tags = analyticsTags({
			key: 'phc_abc',
			properties: { proposta: '</script><img src=x onerror=alert(1)>' }
		});
		expect(tags).not.toContain('</script><img');
		expect(tags).toContain('&lt;/script&gt;');
	});
});
