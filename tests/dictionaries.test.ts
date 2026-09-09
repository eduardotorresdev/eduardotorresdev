import { describe, expect, it } from 'vitest';
import { en } from '../src/lib/i18n/en';
import { ptBR } from '../src/lib/i18n/pt-br';

function keys(obj: unknown, prefix = ''): string[] {
	if (typeof obj !== 'object' || obj === null) return [prefix];
	return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe('dicionários', () => {
	it('en tem exatamente as mesmas chaves que pt-BR', () => {
		expect(keys(en).toSorted()).toEqual(keys(ptBR).toSorted());
	});
});
