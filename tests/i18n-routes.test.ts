import { describe, expect, it } from 'vitest';
import {
	href,
	homeAnchor,
	localeFromPath,
	publicToInternalPath,
	switchLocalePath
} from '../src/lib/i18n/routes';

describe('href', () => {
	it('deixa a raiz sem prefixo para pt-BR', () => {
		expect(href('pt-BR')).toBe('/');
		expect(href('pt-BR', 'sobre')).toBe('/sobre');
		expect(href('pt-BR', 'blog', 'meu-post')).toBe('/blog/meu-post');
	});
	it('prefixa e traduz o slug para en', () => {
		expect(href('en')).toBe('/en');
		expect(href('en', 'sobre')).toBe('/en/about');
		expect(href('en', 'projetos', 'x')).toBe('/en/projects/x');
	});
	it('monta âncora da home', () => {
		expect(homeAnchor('pt-BR', 'cases')).toBe('/#cases');
		expect(homeAnchor('en', 'cases')).toBe('/en#cases');
	});
});

describe('publicToInternalPath', () => {
	it('traduz o primeiro segmento em inglês para a rota interna', () => {
		expect(publicToInternalPath('/en/about')).toBe('/en/sobre');
		expect(publicToInternalPath('/en/projects/foo')).toBe('/en/projetos/foo');
	});
	it('não mexe em rotas pt-BR nem em slugs iguais', () => {
		expect(publicToInternalPath('/sobre')).toBe('/sobre');
		expect(publicToInternalPath('/en/blog/x')).toBe('/en/blog/x');
		expect(publicToInternalPath('/en')).toBe('/en');
	});
});

describe('switchLocalePath', () => {
	it('troca de idioma preservando a página', () => {
		expect(switchLocalePath('/sobre', 'en')).toBe('/en/about');
		expect(switchLocalePath('/en/about', 'pt-BR')).toBe('/sobre');
		expect(switchLocalePath('/blog/x', 'en')).toBe('/en/blog/x');
		expect(switchLocalePath('/', 'en')).toBe('/en');
		expect(switchLocalePath('/en', 'pt-BR')).toBe('/');
	});
});

describe('localeFromPath', () => {
	it('detecta o idioma pelo prefixo', () => {
		expect(localeFromPath('/')).toBe('pt-BR');
		expect(localeFromPath('/en/blog')).toBe('en');
		expect(localeFromPath('/english')).toBe('pt-BR');
	});
});
