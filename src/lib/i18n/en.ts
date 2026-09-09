import type { Dictionary } from './pt-br';

export const en: Dictionary = {
	meta: {
		siteName: 'Eduardo Torres',
		description: 'Software engineer at Globo. I build front-ends that millions of people use every day.',
		locale: 'en_US'
	},
	nav: {
		cases: 'Cases',
		projects: 'Projects',
		blog: 'Blog',
		about: 'About',
		contact: 'Contact',
		menu: 'Menu',
		close: 'Close',
		home: 'Home',
		mainNav: 'Main',
		adjacentPosts: 'Other posts',
		skip: 'Skip to content',
		switchLocale: 'Ler em português',
		location: 'São Luís, MA, Brazil'
	},
	popover: {
		cases: 'Work with context, challenge and outcome.',
		projects: 'Open source, articles and experiments.',
		blog: 'Latest posts',
		about: 'Based in São Luís, Brazil. Front-end at Globo since 2022.',
		contact: 'I reply in under an hour.'
	},
	hero: {
		tagline: 'I build what millions of people use every day.',
		body: "Software engineer, from product to the architecture of large-scale systems. Working on Globo's technology team and a master's student in Software Architecture at the Federal University of Maranhão.",
		cta: 'See cases',
		photoAlt: 'Photo of Eduardo Torres'
	},
	sections: {
		cases: {
			title: 'Cases',
			lead: 'Work with context, challenge, solution and outcome.',
			all: 'See all cases'
		},
		projects: { title: 'Projects', lead: 'What I do after hours: open source, articles, tools.' },
		blog: { title: 'Blog', lead: 'I write about what I learn: stories, new tech and software engineering.' },
		contact: {
			title: "Let's talk?",
			name: 'Your name',
			email: 'Your e-mail',
			message: 'Message',
			send: 'Send',
			sending: 'Sending…',
			sent: "Got it. I'll get back to you shortly.",
			error: "Didn't go through. E-mail me directly.",
			replyTime: 'I reply in under 8 minutes'
		}
	},
	caseMeta: {
		client: 'Client',
		year: 'Year',
		role: 'Role',
		stack: 'Stack',
		link: 'See project',
		readCase: 'Read the case'
	},
	projectMeta: {
		type: { 'open-source': 'Open source', article: 'Article', tool: 'Tool', experiment: 'Experiment' },
		open: 'Open'
	},
	blogMeta: {
		readingTime: (minutes: number) => `${minutes} min read`,
		tags: 'Tags',
		taggedWith: (tag: string) => `Posts tagged “${tag}”`,
		previous: 'Previous',
		next: 'Next',
		allPosts: 'All posts',
		empty: 'Nothing here yet. Soon.'
	},
	about: {
		title: 'About',
		lead: 'I build software at Globo, research architecture at UFMA and write about the way there.',
		experience: 'Experience',
		education: 'Education',
		stack: 'Stack and tools',
		now: 'now',
		resume: 'Download résumé'
	},
	footer: {
		based: 'São Luís, MA, Brazil',
		builtWith: 'Built with SvelteKit, CSS and stubbornness.'
	},
	social: {
		linkedin: 'LinkedIn',
		github: 'GitHub',
		instagram: 'Instagram',
		email: 'E-mail',
		copy: 'Copy e-mail',
		copied: 'Copied'
	},
	dates: { locale: 'en-US' },
	notFound: { title: 'Page not found', body: 'This link leads nowhere.', back: 'Back home' }
};
