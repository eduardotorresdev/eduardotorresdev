export const ptBR = {
	meta: {
		siteName: 'Eduardo Torres',
		description: 'Engenheiro de software na Globo. Construo front-ends que milhões de pessoas usam todo dia.',
		locale: 'pt_BR',
		jobTitle: 'Engenheiro de software',
		imageAlt: 'Eduardo Torres, engenheiro de software na Globo, em São Luís'
	},
	nav: {
		cases: 'Cases',
		projects: 'Projetos',
		blog: 'Blog',
		about: 'Sobre',
		contact: 'Contato',
		menu: 'Menu',
		close: 'Fechar',
		home: 'Início',
		mainNav: 'Principal',
		adjacentPosts: 'Outros posts',
		skip: 'Pular para o conteúdo',
		switchLocale: 'Read in English',
		location: 'São Luís, MA, Brasil'
	},
	popover: {
		cases: 'Trabalhos com contexto, desafio e resultado.',
		projects: 'Open source, artigos e experimentos.',
		blog: 'Últimos posts',
		about: 'Baseado em São Luís, MA. Front-end na Globo desde 2022.',
		contact: 'Respondo em menos de 1 hora.'
	},
	hero: {
		tagline: 'Construo o que milhões de pessoas usam diariamente.',
		body: 'Engenheiro de software, do produto à arquitetura de sistemas de larga escala. Atuando no time de tecnologia da Globo e mestrando em Arquitetura de Software na Universidade Federal do Maranhão.',
		cta: 'Ver cases',
		photoAlt: 'Foto de Eduardo Torres'
	},
	sections: {
		cases: {
			title: 'Cases',
			lead: 'Trabalhos com contexto, desafio, solução e resultado.',
			all: 'Ver todos os cases'
		},
		projects: {
			title: 'Projetos',
			lead: 'O que faço fora do expediente: open source, artigos, ferramentas.'
		},
		blog: {
			title: 'Blog',
			lead: 'Escrevo sobre o que aprendo: relatos, tecnologias novas e engenharia de software.'
		},
		contact: {
			title: 'Vamos conversar?',
			name: 'Seu nome',
			email: 'Seu e-mail',
			message: 'Mensagem',
			send: 'Enviar',
			sending: 'Enviando…',
			sent: 'Recebi. Já te respondo.',
			error: 'Não foi. Me manda direto no e-mail.',
			replyTime: 'Respondo em menos de 8 minutos'
		}
	},
	caseMeta: {
		client: 'Cliente',
		year: 'Ano',
		role: 'Papel',
		stack: 'Stack',
		link: 'Ver projeto',
		readCase: 'Ler o case'
	},
	projectMeta: {
		type: { 'open-source': 'Open source', article: 'Artigo', tool: 'Ferramenta', experiment: 'Experimento' },
		open: 'Abrir'
	},
	blogMeta: {
		readingTime: (minutes: number) => `${minutes} min de leitura`,
		tags: 'Tags',
		taggedWith: (tag: string) => `Posts com a tag “${tag}”`,
		tagDescription: (tag: string, count: number) =>
			`${count} ${count === 1 ? 'post' : 'posts'} sobre ${tag} no blog de Eduardo Torres.`,
		previous: 'Anterior',
		next: 'Próximo',
		allPosts: 'Todos os posts',
		empty: 'Ainda não escrevi nada aqui. Em breve.'
	},
	about: {
		title: 'Sobre',
		lead: 'Faço software na Globo, pesquiso arquitetura na UFMA e escrevo sobre o caminho.',
		experience: 'Experiência',
		education: 'Formação',
		stack: 'Stack e ferramentas',
		now: 'atualmente',
		resume: 'Baixar currículo'
	},
	footer: {
		based: 'São Luís, MA, Brasil',
		builtWith: 'Feito com SvelteKit, CSS e teimosia.'
	},
	social: {
		linkedin: 'LinkedIn',
		github: 'GitHub',
		instagram: 'Instagram',
		email: 'E-mail',
		copy: 'Copiar e-mail',
		copied: 'Copiado'
	},
	dates: { locale: 'pt-BR' },
	notFound: {
		title: 'Página não encontrada',
		body: 'Esse link não leva a lugar nenhum.',
		back: 'Voltar pro início'
	}
};

export type Dictionary = typeof ptBR;
