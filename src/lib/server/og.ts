import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { site } from '$lib/site';

// Só roda no build (prerender), então o cwd é a raiz do projeto.
const fontsDir = resolve(process.cwd(), 'src/lib/server/fonts');

let fontsPromise: Promise<{ heavy: Buffer; light: Buffer }> | null = null;
function fonts() {
	fontsPromise ??= Promise.all([
		readFile(resolve(fontsDir, 'BricolageGrotesque-ExtraBold.ttf')),
		readFile(resolve(fontsDir, 'BricolageGrotesque-Light.ttf'))
	]).then(([heavy, light]) => ({ heavy, light }));
	return fontsPromise;
}

const BG = '#EDEDEA';
const INK = '#111111';
const SHADOW = '#B5B5B0';
const MUTED = '#6B6B66';

/** Card 1200x630 no estilo do site: off-white, Bricolage 800, hard shadow. */
export async function renderOgImage({ title, kicker }: { title: string; kicker: string }): Promise<Buffer> {
	const { heavy, light } = await fonts();
	const size = title.length > 70 ? 56 : title.length > 40 ? 68 : 84;

	// satori usa uma árvore JSX-like descrita em objetos.
	const tree = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '64px',
				background: BG,
				color: INK,
				fontFamily: 'Bricolage'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontSize: 26,
							fontWeight: 300,
							letterSpacing: '0.12em',
							color: MUTED,
							textTransform: 'uppercase'
						},
						children: kicker
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontSize: size,
							fontWeight: 800,
							lineHeight: 0.95,
							letterSpacing: '-0.03em',
							maxWidth: '1000px'
						},
						children: title
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										padding: '14px 26px',
										border: `3px solid ${INK}`,
										background: '#F6F6F3',
										boxShadow: `8px 8px 0 ${SHADOW}`,
										fontSize: 30,
										fontWeight: 800,
										letterSpacing: '-0.02em'
									},
									children: site.name
								}
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', fontSize: 26, fontWeight: 300, color: MUTED },
									children: site.url.replace('https://', '')
								}
							}
						]
					}
				}
			]
		}
	};

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
