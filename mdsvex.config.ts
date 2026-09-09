import { escapeSvelte, type MdsvexOptions } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import { createHighlighter } from 'shiki';

// Highlighter único, criado sob demanda e reutilizado em todo o build.
const highlighterPromise = createHighlighter({
	themes: ['github-light'],
	langs: ['ts', 'js', 'svelte', 'html', 'css', 'json', 'bash', 'yaml', 'md', 'sql', 'go', 'python']
});

/**
 * Componentes que qualquer .md pode usar sem import. Precisam ser exportados
 * no `<script module>` de ContentLayout.svelte, que o mdsvex importa como `Components`.
 */
const contentComponents = ['Gallery', 'Placeholder'];

interface Node {
	type: string;
	value?: string;
	children?: Node[];
}

/**
 * O remark trata `<Gallery />` como HTML cru, então o mdsvex não consegue
 * reescrever a tag. Este plugin faz a troca por `Components.Gallery` no texto cru.
 */
function rewriteContentComponents() {
	const pattern = new RegExp(`<(/?)(${contentComponents.join('|')})\\b`, 'g');
	const walk = (node: Node) => {
		if (node.type === 'raw' && node.value) node.value = node.value.replace(pattern, '<$1Components.$2');
		node.children?.forEach(walk);
	};
	return (tree: Node) => walk(tree);
}

export const mdsvexConfig: MdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: fileURLToPath(new URL('./src/lib/components/content/ContentLayout.svelte', import.meta.url))
	},
	rehypePlugins: [rewriteContentComponents],
	highlight: {
		highlighter: async (code, lang) => {
			const highlighter = await highlighterPromise;
			const loaded = highlighter.getLoadedLanguages();
			const language = lang && loaded.includes(lang) ? lang : 'text';
			const html = highlighter.codeToHtml(code, { lang: language, theme: 'github-light' });
			return `{@html \`${escapeSvelte(html)}\`}`;
		}
	}
};
