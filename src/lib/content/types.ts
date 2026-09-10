import type { Locale } from '$lib/i18n/locales';

export type ContentType = 'blog' | 'cases' | 'projetos';

export interface BaseMeta {
	title: string;
	summary: string;
	cover?: string;
	draft?: boolean;
}

/** Resumo em tópicos exibido antes do corpo. Uma string vira um tópico só. */
export type Tldr = string | string[];

export interface PostMeta extends BaseMeta {
	date: string;
	tags: string[];
	tldr?: Tldr;
}

export interface CaseMeta extends BaseMeta {
	client: string;
	year: number;
	role: string;
	stack: string[];
	link?: string;
	featured?: boolean;
	order?: number;
	tldr?: Tldr;
}

export type ProjectType = 'open-source' | 'article' | 'tool' | 'experiment';

export interface ProjectMeta extends BaseMeta {
	type: ProjectType;
	link?: string;
	stack?: string[];
	year: number;
	order?: number;
}

export interface Entry<M> {
	slug: string;
	locale: Locale;
	meta: M;
	/** Palavras no corpo, para tempo de leitura. */
	words: number;
	/** Se há corpo além do frontmatter. */
	hasBody: boolean;
}

export type Post = Entry<PostMeta>;
export type Case = Entry<CaseMeta>;
export type Project = Entry<ProjectMeta>;
