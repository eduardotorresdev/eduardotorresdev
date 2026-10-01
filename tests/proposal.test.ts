import { describe, expect, it } from 'vitest';
import { contentType, cookieName, readCookie, resolvePath, sameToken } from '../functions/_lib/proposal';

describe('resolvePath', () => {
	it('raiz da proposta vira index.html', () => {
		expect(resolvePath(['abee'], false)).toEqual({ slug: 'abee', key: 'abee/index.html' });
		expect(resolvePath(['abee'], true)).toEqual({ slug: 'abee', key: 'abee/index.html' });
	});
	it('arquivo e subpasta com barra final', () => {
		expect(resolvePath(['abee', 'assets', 'logo.png'], false)?.key).toBe('abee/assets/logo.png');
		expect(resolvePath(['abee', 'prototipo'], true)?.key).toBe('abee/prototipo/index.html');
	});
	it('recusa token, dotfiles, travessia e slug inválido', () => {
		expect(resolvePath(['abee', '_token'], false)).toBeNull();
		expect(resolvePath(['abee', '.thumbnail'], false)).toBeNull();
		expect(resolvePath(['abee', '..', 'outra', '_token'], false)).toBeNull();
		expect(resolvePath(['ABEE'], false)).toBeNull();
		expect(resolvePath([], false)).toBeNull();
	});
});

describe('cookie', () => {
	it('nome por proposta, sem hífen', () => {
		expect(cookieName('abee-se')).toBe('proposta_abee_se');
	});
	it('lê o cookie certo entre vários', () => {
		expect(readCookie('a=1; proposta_abee=SAD9I8; b=2', 'proposta_abee')).toBe('SAD9I8');
		expect(readCookie('a=1', 'proposta_abee')).toBeNull();
		expect(readCookie(null, 'proposta_abee')).toBeNull();
	});
});

describe('sameToken', () => {
	it('compara exato', () => {
		expect(sameToken('SAD9I8', 'SAD9I8')).toBe(true);
		expect(sameToken('sad9i8', 'SAD9I8')).toBe(false);
		expect(sameToken('SAD9I', 'SAD9I8')).toBe(false);
		expect(sameToken(null, 'SAD9I8')).toBe(false);
	});
});

describe('contentType', () => {
	it('pela extensão', () => {
		expect(contentType('abee/index.html')).toBe('text/html; charset=utf-8');
		expect(contentType('abee/a/B.JPEG')).toBe('image/jpeg');
		expect(contentType('abee/x.bin')).toBe('application/octet-stream');
	});
});
