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
				fallback: undefined,
				precompress: false,
				strict: true
			}),
			prerender: {
				handleHttpError: 'fail',
				handleMissingId: 'warn'
			}
		})
	],
	server: {
		fs: { allow: ['content'] }
	}
});
