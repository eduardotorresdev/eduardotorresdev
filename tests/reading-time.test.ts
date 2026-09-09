import { describe, expect, it } from 'vitest';
import { countWords, readingTime, stripFrontmatter } from '../src/lib/content/reading-time';

describe('stripFrontmatter', () => {
	it('remove o bloco --- do início', () => {
		expect(stripFrontmatter('---\ntitle: x\n---\n\nOlá mundo')).toBe('Olá mundo');
	});
	it('mantém texto sem frontmatter', () => {
		expect(stripFrontmatter('Olá')).toBe('Olá');
	});
});

describe('countWords', () => {
	it('ignora frontmatter, blocos de código e tags', () => {
		const md =
			'---\ntitle: x\n---\n\nUm dois três\n\n```ts\nconst a = 1\n```\n\n<Gallery images={[]} />\n\nquatro';
		expect(countWords(md)).toBe(4);
	});
});

describe('readingTime', () => {
	it('arredonda para o minuto e nunca dá zero', () => {
		expect(readingTime(0)).toBe(1);
		expect(readingTime(200)).toBe(1);
		expect(readingTime(500)).toBe(3);
	});
});
