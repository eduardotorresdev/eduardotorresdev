import { describe, expect, it } from 'vitest';
import {
	contentType,
	cookieName,
	isLinkPreviewBot,
	previewImageKey,
	previewTags,
	readCookie,
	resolvePath,
	sameToken
} from '../functions/_lib/proposal';

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

describe('prévia de link', () => {
	it('reconhece os robôs de prévia e deixa navegador passar', () => {
		expect(isLinkPreviewBot('WhatsApp/2.23.20.0 A')).toBe(true);
		expect(
			isLinkPreviewBot('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')
		).toBe(true);
		expect(isLinkPreviewBot('TelegramBot (like TwitterBot)')).toBe(true);
		expect(
			isLinkPreviewBot(
				'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1'
			)
		).toBe(false);
		expect(isLinkPreviewBot(null)).toBe(false);
	});
	it('tags com imagem grande quando existe', () => {
		const tags = previewTags({
			title: 'Proposta "Abee"',
			url: 'https://x/propostas/abee/',
			image: 'https://x/propostas/abee/og.jpg?token=T'
		});
		expect(tags).toContain('<meta property="og:title" content="Proposta &quot;Abee&quot;">');
		expect(tags).toContain('<meta property="og:image" content="https://x/propostas/abee/og.jpg?token=T">');
		expect(tags).toContain('summary_large_image');
	});
	it('sem imagem, sem og:image', () => {
		const tags = previewTags({ title: 'Abee', url: 'https://x/propostas/abee/' });
		expect(tags).not.toContain('og:image');
		expect(tags).toContain('content="summary"');
	});
	it('a imagem no bucket fica fora do caminho público', () => {
		expect(previewImageKey('abee')).toBe('abee/_og.jpg');
		expect(resolvePath(['abee', '_og.jpg'], false)).toBeNull();
	});
});
