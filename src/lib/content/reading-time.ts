const WORDS_PER_MINUTE = 200;

/** Conta palavras do markdown ignorando frontmatter, código e tags. */
export function countWords(markdown: string): number {
	const body = stripFrontmatter(markdown)
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#*_>`~\-|[\]()!]/g, ' ');
	return body.split(/\s+/).filter(Boolean).length;
}

export function stripFrontmatter(markdown: string): string {
	return markdown.replace(/^---[\s\S]*?---\s*/, '');
}

export function readingTime(words: number): number {
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
