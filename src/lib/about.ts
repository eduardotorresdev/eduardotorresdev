import type { Locale } from '$lib/i18n/locales';

interface Job {
	period: string;
	role: string;
	company: string;
	place: string;
	highlights: string[];
}
interface Education {
	period: string;
	degree: string;
	school: string;
	note?: string;
}
interface StackGroup {
	label: string;
	items: string[];
}
export interface AboutContent {
	story: string[];
	experience: Job[];
	education: Education[];
	stack: StackGroup[];
}

const stack: StackGroup[] = [
	{ label: 'Linguagens', items: ['TypeScript', 'JavaScript', 'PHP', 'SQL', 'Python', 'Go', 'C++'] },
	{
		label: 'Front-end',
		items: ['Svelte', 'React', 'CSS', 'Design Systems', 'Acessibilidade', 'Core Web Vitals', 'Testes A/B']
	},
	{
		label: 'Back-end',
		items: ['Node.js', 'NestJS', 'PostgreSQL', 'MySQL', 'MongoDB', 'REST', 'Serverless', 'Cache']
	},
	{ label: 'Arquitetura', items: ['Micro-frontends', 'Modularização', 'Design Patterns', 'Electron'] },
	{ label: 'Ferramentas', items: ['Git', 'Docker', 'GitLab CI', 'GitHub Actions'] }
];

export const aboutContent: Record<Locale, AboutContent> = {
	'pt-BR': {
		story: [
			'Sou engenheiro de software em São Luís, no Maranhão. Desde 2022 trabalho no Grupo Globo, onde cuido do front-end de produtos como G1, GE, Gshow e Receitas, que milhões de pessoas abrem todo dia.',
			'Na Globo ajudei a evoluir a cobertura ao vivo, com novos padrões de interação que contribuíram para um aumento de 24% na receita publicitária, e co-desenvolvi o Codex, o design system que padroniza componentes entre os produtos da empresa. No dia a dia, facilito discussões técnicas, apoio decisões de arquitetura e faço mentoria de outros devs.',
			'Antes disso, na Maximize, construí sistemas completos e sites para marcas como Guaraná Jesus e Vale, do banco ao deploy. Comecei como estagiário na FIEMA, num sistema institucional de processos seletivos.',
			'Sou bacharel em Ciência da Computação pela UFMA e faço mestrado em Engenharia de Software na mesma universidade, pesquisando arquitetura de software. Escrevo sobre isso aqui no blog.'
		],
		experience: [
			{
				period: '2022 – atual',
				role: 'Desenvolvedor de software (responsabilidades sênior)',
				company: 'Grupo Globo',
				place: 'São Paulo, remoto',
				highlights: [
					'Lidero o desenvolvimento de soluções front-end escaláveis para G1, GE, Gshow e Receitas.',
					'Evoluí a experiência de cobertura ao vivo, contribuindo para +24% de receita publicitária.',
					'Co-desenvolvi o Codex, design system da Globo, ampliando o reuso de componentes entre produtos.',
					'Facilito discussões técnicas, apoio decisões de arquitetura, mentoro devs e participo de contratações.'
				]
			},
			{
				period: '2020 – 2022',
				role: 'Desenvolvedor de software',
				company: 'Maximize',
				place: 'São Luís',
				highlights: [
					'Sistemas completos e sites para clientes como Guaraná Jesus e Vale, com foco em performance e confiabilidade.',
					'Desenvolvimento full-cycle: arquitetura, implementação e deploy.'
				]
			},
			{
				period: '2019 – 2020',
				role: 'Estagiário de desenvolvimento',
				company: 'FIEMA',
				place: 'São Luís',
				highlights: ['Sistema institucional de gerenciamento de processos seletivos, front-end e back-end.']
			}
		],
		education: [
			{
				period: '2024 – atual',
				degree: 'Mestrado em Engenharia de Software',
				school: 'Universidade Federal do Maranhão (UFMA)',
				note: 'Pesquisa em arquitetura de software.'
			},
			{
				period: '2018 – 2023',
				degree: 'Bacharelado em Ciência da Computação',
				school: 'Universidade Federal do Maranhão (UFMA)'
			}
		],
		stack
	},
	en: {
		story: [
			"I'm a software engineer based in São Luís, Brazil. Since 2022 I've been at Grupo Globo, looking after the front-end of products like G1, GE, Gshow and Receitas, which millions of people open every day.",
			"At Globo I helped evolve the live coverage experience, with new interaction patterns that contributed to a 24% increase in ad revenue, and co-built Codex, the design system that standardises components across the company's products. Day to day, I facilitate technical discussions, support architecture decisions and mentor other developers.",
			'Before that, at Maximize, I built full systems and websites for brands like Guaraná Jesus and Vale, from database to deploy. I started as an intern at FIEMA, working on an institutional admissions system.',
			"I hold a BSc in Computer Science from UFMA and I'm doing a master's in Software Engineering at the same university, researching software architecture. I write about it here on the blog."
		],
		experience: [
			{
				period: '2022 – now',
				role: 'Software developer (senior-level responsibilities)',
				company: 'Grupo Globo',
				place: 'São Paulo, remote',
				highlights: [
					'Lead scalable front-end solutions for G1, GE, Gshow and Receitas.',
					'Evolved the live coverage experience, contributing to a 24% increase in ad revenue.',
					"Co-built Codex, Globo's design system, expanding component reuse across products.",
					'Facilitate technical discussions, support architecture decisions, mentor developers and take part in hiring.'
				]
			},
			{
				period: '2020 – 2022',
				role: 'Software developer',
				company: 'Maximize',
				place: 'São Luís',
				highlights: [
					'Full systems and websites for clients like Guaraná Jesus and Vale, focused on performance and reliability.',
					'Full-cycle development: architecture, implementation and deploy.'
				]
			},
			{
				period: '2019 – 2020',
				role: 'Software development intern',
				company: 'FIEMA',
				place: 'São Luís',
				highlights: ['Institutional admissions management system, front-end and back-end.']
			}
		],
		education: [
			{
				period: '2024 – now',
				degree: "Master's in Software Engineering",
				school: 'Federal University of Maranhão (UFMA)',
				note: 'Research on software architecture.'
			},
			{
				period: '2018 – 2023',
				degree: 'BSc in Computer Science',
				school: 'Federal University of Maranhão (UFMA)'
			}
		],
		stack: stack.map((g) => ({
			...g,
			label:
				{
					Linguagens: 'Languages',
					'Front-end': 'Front-end',
					'Back-end': 'Back-end',
					Arquitetura: 'Architecture',
					Ferramentas: 'Tools'
				}[g.label] ?? g.label,
			items: g.items.map((i) =>
				i === 'Acessibilidade'
					? 'Accessibility'
					: i === 'Modularização'
						? 'Modularisation'
						: i === 'Testes A/B'
							? 'A/B testing'
							: i
			)
		}))
	}
};
