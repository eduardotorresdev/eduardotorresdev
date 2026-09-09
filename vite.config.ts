import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { mdsvexConfig } from './mdsvex.config.ts';

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [mdsvex(mdsvexConfig)],
			compilerOptions: {
				// Força runes em todo o projeto, exceto em libs. Pode sair no Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md') ? undefined : true
			},
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				/*
				 * Sem isso, o Pages devolve a home com HTTP 200 pra qualquer caminho
				 * inexistente (soft-404) e o buscador indexa lixo como duplicata da
				 * home. Com o 404.html o Pages responde 404 de verdade.
				 */
				fallback: '404.html',
				precompress: false,
				strict: true
			}),
			prerender: {
				handleHttpError: 'fail',
				handleMissingId: 'warn'
			},
			/*
			 * Tudo é prerenderizado e o CSS por rota é pequeno (o maior, o do
			 * layout, tem ~13 KB). Inline no <head> tira as 5 requisições que
			 * bloqueavam a renderização e adianta o LCP.
			 */
			inlineStyleThreshold: 14000
		})
	],
	server: {
		fs: { allow: ['content'] }
	}
});
