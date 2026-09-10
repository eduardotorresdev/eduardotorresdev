---
title: Conteúdo estático e +99 no Core Web Vitals
summary: Site pessoal com Blog servindo conteúdo em markdown com suporte à i18n.
date: 2026-09-06
tags: [relato, sveltekit, performance, ssg, web vitals]
tldr:
  - 'Site pessoal em SvelteKit com SSG: conteúdo em markdown + frontmatter, uma pasta por post com um .md por idioma.'
  - 'Cloudflare Pages serve os estáticos e uma Pages Function cuida do formulário de contato, com Resend e Turnstile.'
  - 'CI/CD com p99 de 55s entre check e deploy, sem servidor pra provisionar.'
  - 'Core Web Vitals +99 no Lighthouse; comentários, busca e CMS ficaram de fora de propósito.'
---

Já se completavam 4 anos que eu não investia... em mim mesmo. Sem o meu próprio site, com domínio parado, seguindo aquela mesma história, casa de ferreiro, espeto de madeira. Isso até agora, mas eu cansei, peguei a bigorna, o martelo, acendi a forja e abri o Claude.

## Por onde começar

Antes de escrever qualquer linha de código, comecei a olhar primeiramente para o objetivo do meu site:

> "O que eu posso entregar com isso?"

De cara, podemos nos limitar ao próprio ego: **por onde passamos**, **nossos números** e **conquistas**. Mas eu queria trazer uma maior conexão mais íntima, expor as vitórias, fracassos, aprendizados, conhecimentos acumulados, me inspirando em pessoas incríveis que temos na computação e software em geral: [Luciano Souza](https://www.linkedin.com/in/lucianodiisouza/), [Bruno Bertolini](https://www.linkedin.com/in/brunobertolini/), [Filipe Deschamps](https://www.linkedin.com/in/filipedeschamps/) e [Karol Attekita](https://www.linkedin.com/in/bullas-attekita/), que contribuem muito para nossa área e sempre trazem projetos e aprendizados incríveis. E mesmo hoje com IA à rodo, essas trocas são e sempre serão essenciais.

> "Trocas de informações e experiências nos movem todo dia"

Depois de matutar tudo isso na minha cabeça, eu decidi. Além de me apresentar, eu preciso entregar conteúdo relevante para outras pessoas, eu não cheguei até aqui sozinho, existe um exército de pessoas que contribuiram de alguma forma por de trás das coisas que eu faço todo dia, e nada mais que justo do retribuir.

Com isso, eu decidi publicar os conteúdos:

- **Cases**: Entregas que eu já realizei, com os desafios, soluções e resultados, dos projetos que eu já trabalhei.
- **Projetos**: Software, ferramentas open-source ou artigos que eu construi ou participei, que contribuem para a indústria e academia.
- **Blog**: Espaço que eu publico aprendizados, fracassos, opiniões, experimentações, protótipos, guias, quase como um diário.
- **Contato**: Ponto de contato comigo, seja pra bater um papo, mentoria, ideias de projetos. Eu respondo em menos de 8 minutos, chega diretamente no meu e-mail
- **Sobre**: Um pouco da minha história, os locais por onde passei, conquistas e o que todos esses 8 anos me ensinaram.

## Projeto feito em menos de 2 dias

Para o desenvolvimento do site, eu utilizeI o Claude Opus, para implementação, e o Fable para me apoiar na criação da experiência. Com isso, sai do esboço para o site rodando em produção em tempo recorde.

Foi um processo muito interessante, ao mesmo tempo que eu ditei diversas decisões, os agentes trouxeram falhas de algumas delas, e me apoiaram na descoberta de trade-offs de certas situações, então além de acelerar a operacionalização dessas ideias, foi uma jornada de aprendizado também.

## Tecnologias

O próximo passo agora é a parte técnica, como viabilizar a entrega do conteúdo.

### SvelteKit

Visando leveza e iteração rápida para desenvolvimento, eu escolhi utilizar o SvelteKit. Ele já entrega, além de **CSR** (Client Side Rendering) e **SSR** (Server Side Rendering), **SSG** (Static Site Generation) nativamente.

Para estilização, eu decidi usar CSS puro mesmo, sem etapa de building, sem o overhead do tailwind para um site tão simples.

### Cloudflare Pages + Functions

Eu já tinha experimentado essa duplinha algumas projetos pequenos e foi um sucesso.

O CF Pages serve os nossos assets estáticos, entregando o site sem precisarmos provisionar um server, e gratuitamente, com os N benefícios que eles oferecem, como analytics nativos e métricas de performance.

Já o CF Pages Functions, é basicamente para executar a function de envio de e-mail para o funcionamento do formulário de contato.

Com isso, o processo CI/CD ficou com o p99 de 55s, incluindo check e deploy.

| Métrica       | `check` | `deploy` | Total (jobs) |
| ------------- | ------: | -------: | -----------: |
| p50 (mediana) |     27s |    21,5s |        48,5s |
| p99 ≈ máx     | **28s** |  **23s** |      **55s** |
| mín           |     24s |      17s |          41s |

Vale lembrar que poderiam ter sido utilizadas outras soluções, como GitHub Pages, Deno Deploy, Supabase, conseguindo resultados semelhantes. O Cloudflare foi pura conveniência, além do meu domínio já estar configurado nele, eu consegui servir o site e também implantar a function no mesmo lugar, usfruindo dos benefícios oferecidos.

### Resend

Aproveitando as degustações, para receber os contatos do site, eu decidi usar o Resend.

Para o volume baixíssimo esperado de e-mail, a cota gratuita é mais que o suficiente, sem contar a velocidade que os e-mails são enviados e a simplicidade absurda de configurá-lo, foi mamão com açúcar.

Com isso, eu consigo viabilizar a resposta de até 5 minutos dos e-mails recebidos.

### Turnstile

Pra fechar a stack, eu já tinha cogitado usar um sistema anti-spam para o formulário, mas não sabia exatamente o sabor que eu queria.

Como todo mundo sabe, ou já deve ter se deparado, o CF também oferece um serviço de recaptcha/anti-spam, o turnstile. Aproveitando que já estava usando o Pages e Functions, a escolha foi óbvia. Também foi tranquilo de configurar, em 5 minutos estava resolvido, além de ser frictionless.

## Conteúdo em markdown

Soa contra intuitivo quando falamos de um blog, por exemplo, e servimos um site estático.

Apesar disso, pensando na frequência de postagens, o custo de deploy e a busca por simplicidade, os posts e cases poderiam ser estruturados em markdown + frontmatter. Dessa forma, teríamos uma estrutura padrão pra esses tipos de conteúdo, com render barato e facilidade de escrever.

O frontmatter de um post carrega só o que a listagem, o SEO e o cabeçalho da página precisam:

```yaml
---
title: Conteúdo estático e +99 no Core Web Vitals
summary: Site pessoal com Blog servindo conteúdo em markdown com suporte à i18n.
date: 2026-09-06
tags: [relato, sveltekit, performance, ssg, web vitals]
tldr:
  - 'Site pessoal em SvelteKit com SSG: conteúdo em markdown + frontmatter.'
  - 'Cloudflare Pages serve os estáticos e uma Pages Function cuida do formulário de contato.'
---
```

O de case troca data e tags pelos fatos do projeto, que viram a ficha técnica no topo da página:

```yaml
---
title: Cobertura ao vivo que rende mais
summary: Novos padrões de interação e consumo de conteúdo na cobertura ao vivo do G1 e GE.
client: Grupo Globo
year: 2024
role: Desenvolvedor front-end, liderança técnica
stack: [TypeScript, React, Micro-frontends, Testes A/B, Core Web Vitals]
featured: true
order: 1
tldr:
  - 'Formato de cobertura ao vivo do G1 e do GE, com milhões de pessoas na mesma página ao mesmo tempo.'
  - '+24% de receita publicitária, com Core Web Vitals no verde.'
---
```

Os dois formatos são tipados em TypeScript, então campo obrigatório faltando ou nome escrito errado quebra no `check`, antes de virar deploy. O `tldr` é opcional e vira aquele bloco de resumo lá no começo deste post.

Por fim, só precisava resolver a i18n. Pra isso, basta ter um .md pra cada lang, no caso só pt-br e en. Cada post e case é uma pasta com um arquivo por idioma:

```
content/
  blog/
    por-que-este-site-e-estatico/
      pt-br.md
      en.md
  cases/
    cobertura-ao-vivo-globo/
      pt-br.md
      en.md
```

O slug é o nome da pasta, igual nos dois idiomas.

Dessa forma, toda vez que eu precisa escrever um post novo ou mesmo um case, eu escrevo o markdown, coloco imagens, preencho o conteúdo, salvo, faço o commit + push e gera uma release. Postando 3 posts por semana, vamos ter gasto no máximo 11 minutos de cota de CI/CD do GitHub Actions, irrelevante.

## Core Web Vitals

Aproveitando a simplicidade do site e o conteúdo estático, realizei diversas iterações, otimizando as imagens utilizadas, os assets, para entregar as melhores métricas de Core Web Vitals possíveis.

> Em um site desse porte, estático, Core Web Vitals +99 é o mínimo

<figure>
  <img
    src="/img/blog/por-que-este-site-e-estatico/webvitals.webp"
    alt="Relatório do Lighthouse com nota 100 em desempenho, acessibilidade, práticas recomendadas e SEO"
    width="970"
    height="372"
    loading="lazy"
  />
  <figcaption>Lighthouse rodando em eduardotorres.dev em produção.</figcaption>
</figure>

E esse foi o resultado que obtive no Lighthouse.

## O que ficou de fora

Comentários, busca, CMS, ainda são irrelevantes para o meu caso de uso. Talvez no futuro implemente uma busca, mas a simplicidade que adotamos com certeza será mantida.

## Repositório

Caso você queria dar uma olhada na codebase, ela é pública e está disponível nesse repo:

- [https://github.com/eduardotorresdev/eduardotorresdev](https://github.com/eduardotorresdev/eduardotorresdev)

**Obrigado pela leitura, espero que tenha contribuído para o seu dia.**
