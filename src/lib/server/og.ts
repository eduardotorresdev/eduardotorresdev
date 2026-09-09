import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { site } from '$lib/site';

// Só roda no build (prerender), então o cwd é a raiz do projeto.
const serverDir = resolve(process.cwd(), 'src/lib/server');

interface Assets {
	heavy: Buffer;
	light: Buffer;
	/** Retrato em P&B como data URI, que é como o satori embute imagem. */
	avatar: string;
}

let assetsPromise: Promise<Assets> | null = null;
function assets() {
	assetsPromise ??= Promise.all([
		readFile(resolve(serverDir, 'fonts/BricolageGrotesque-ExtraBold.ttf')),
		readFile(resolve(serverDir, 'fonts/BricolageGrotesque-Light.ttf')),
		readFile(resolve(serverDir, 'avatar.png'))
	]).then(([heavy, light, avatar]) => ({
		heavy,
		light,
		avatar: `data:image/png;base64,${avatar.toString('base64')}`
	}));
	return assetsPromise;
}

const BG = '#EDEDEA';
const SURFACE = '#F6F6F3';
const INK = '#111111';
const SHADOW = '#B5B5B0';
const MUTED = '#6B6B66';

export interface OgInput {
	title: string;
	kicker: string;
	/** Linha de apoio abaixo do título (resumo do post, do case…). */
	subtitle?: string;
}

// satori usa uma árvore JSX-like descrita em objetos.
type Node = { type: string; props: Record<string, unknown> };
const div = (style: Record<string, unknown>, children: Node[] | Node | string): Node => ({
	type: 'div',
	props: { style: { display: 'flex', ...style }, children }
});

/** Card 1200x630 no estilo do site: off-white, Bricolage 800, hard shadow, retrato em P&B. */
export async function renderOgImage({ title, kicker, subtitle }: OgInput): Promise<Buffer> {
	const { heavy, light, avatar } = await assets();
	const size = title.length > 70 ? 52 : title.length > 40 ? 64 : 80;
	const sub = subtitle && subtitle.length > 150 ? `${subtitle.slice(0, 147).trimEnd()}…` : subtitle;

	const kickerNode = div(
		{ fontSize: 24, fontWeight: 300, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' },
		kicker
	);
	const titleNode = div(
		{ fontSize: size, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em' },
		title
	);
	const subtitleNode = sub
		? [div({ fontSize: 28, fontWeight: 300, lineHeight: 1.3, color: MUTED }, sub)]
		: [];
	const brand = div({ alignItems: 'flex-end', gap: '24px' }, [
		div(
			{
				padding: '12px 22px',
				border: `3px solid ${INK}`,
				background: SURFACE,
				boxShadow: `8px 8px 0 ${SHADOW}`,
				fontSize: 28,
				fontWeight: 800,
				letterSpacing: '-0.02em'
			},
			site.name
		),
		div({ fontSize: 24, fontWeight: 300, color: MUTED, paddingBottom: '10px' }, site.domain)
	]);
	const portrait = div(
		{ alignItems: 'center', paddingRight: '64px' },
		{
			type: 'img',
			props: {
				src: avatar,
				width: 220,
				height: 220,
				style: { border: `3px solid ${INK}`, boxShadow: `12px 12px 0 ${SHADOW}`, objectFit: 'cover' }
			}
		}
	);

	const tree = div(
		{ width: '1200px', height: '630px', background: BG, color: INK, fontFamily: 'Bricolage' },
		[
			div(
				{
					flexDirection: 'column',
					justifyContent: 'space-between',
					flexGrow: 1,
					padding: '64px 48px 56px 64px'
				},
				[
					kickerNode,
					div({ flexDirection: 'column', gap: '24px', maxWidth: '820px' }, [titleNode, ...subtitleNode]),
					brand
				]
			),
			portrait
		]
	);

	const svg = await satori(tree as never, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Bricolage', data: heavy, weight: 800, style: 'normal' },
			{ name: 'Bricolage', data: light, weight: 300, style: 'normal' }
		]
	});

	return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
