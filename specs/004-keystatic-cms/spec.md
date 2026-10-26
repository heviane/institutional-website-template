# Feature 004: Gestão de Conteúdo Baseada em Git (Keystatic CMS) — Especificação

- **Data de Criação:** 2026-10-26
- **Status:** Aprovada (Pronta para Execução)
- **ADRs Relacionadas:** [ADR 0002](../../docs/adr/0002-escolha-do-cms-keystatic.md), [ADR 0006](../../docs/adr/0006-autenticacao-cms-e-gestao-de-midia.md), [ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)
- **Documento Canônico de Domínio:** [`docs/05-keystatic-content-model.md`](../../docs/05-keystatic-content-model.md)

---

## 🎯 1. Problema & Visão Geral (O quê e Por quê)

### 1.1. O Problema

Websites institucionais desenvolvidos para clientes corporativos demandam atualização frequente de conteúdos (serviços prestados, artigos de blog, depoimentos de clientes e perguntas frequentes). No entanto:

1. **Fricção de Manutenção Técnica:** Clientes não técnicos não podem depender do desenvolvedor para alterar textos simples ou publicar artigos no blog.
2. **Custo de Infraestrutura Evitável:** Adotar CMSs tradicionais baseados em banco de dados relacional (ex.: Strapi com PostgreSQL) impõe custos recorrentes de hospedagem desnecessários para a escala de um site institucional.
3. **Complexidade de Autenticação para Leigos:** Obrigar o cliente final a criar contas no GitHub ou autorizar aplicativos OAuth gera atrito operacional severo e risco de governança no repositório de código.

### 1.2. A Solução

Implementar a camada de gestão de conteúdo com **Keystatic CMS**, gravando os dados diretamente no repositório Git em arquivos Markdown (Markdoc) e JSON:

- **Desenvolvimento Local:** Modo local (`kind: 'local'`) gravando diretamente no sistema de arquivos em `/content`.
- **Produção Gerenciada:** Modo Keystatic Cloud (`kind: 'cloud'`) com convite e login simples por e-mail para até 3 editores sem custo (conforme [ADR 0006](../../docs/adr/0006-autenticacao-cms-e-gestao-de-midia.md)).
- **Compilação Estática Ultrarrápida (SSG/ISR):** Consumo dos arquivos locais em tempo de compilação através da **Reader API** (`@keystatic/core/reader`), sem requisições de rede externas no carregamento de páginas.
- **Repositório Auto-suficiente (_Seed Data_):** O template deve nascer 100% populado e navegável logo após o clone inicial.

---

## 👥 2. Personas & Casos de Uso

| Persona                          | Necessidade                                                                         | Benefício Esperado                                                                   |
| :------------------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Cliente / Editor de Conteúdo** | Criar postagens no blog, atualizar serviços e FAQs sem conhecimento de programação. | Painel visual amigável em `/keystatic` com login por e-mail e editor rico WYSIWYG.   |
| **Desenvolvedor / Agência**      | Customizar schemas no TypeScript e manter controle de versão absoluto.              | Toda alteração gera um commit Git rastreável, com tipagem estrita de coleções.       |
| **Visitante do Site**            | Acessar informações institucionais com carregamento instantâneo.                    | Páginas pré-renderizadas estaticamente (SSG) sem chamadas lentas de APIs em runtime. |

---

## 📋 3. Escopo Funcional & Requisitos

### 3.1. Requisitos Funcionais (RF)

- **RF01 - Dual Mode de Armazenamento:**

  - Em desenvolvimento (`NODE_ENV === "development"`): `storage: { kind: 'local' }`.
  - Em produção (`NODE_ENV === "production"`): `storage: { kind: 'cloud' }` consumindo `NEXT_PUBLIC_KEYSTATIC_PROJECT`.

- **RF02 - Coleções de Conteúdo (`collections`):**
  1. `posts`: Blog com `title`, `slug`, `status` (`published` ou `draft`), `publishedDate`, `summary`, `coverImage`, `author`, `content` (Markdoc).
  2. `services`: Serviços com `title`, `slug`, `icon` (nome do Lucide Icon), `shortDescription`, `features` (array de strings).
  3. `testimonials`: Depoimentos com `clientName`, `companyOrRole`, `avatar`, `quote`, `rating` (1 a 5).
  4. `faqs`: Perguntas frequentes com `question`, `answer` (Markdoc) e `order` (numérico para ordenação no acordeão).
- **RF03 - Singletons de Páginas Fixas (`singletons`):**
  1. `homePage`: `heroHeadline`, `heroSubheadline`, `primaryCtaLabel`, `primaryCtaLink`, `showTestimonials`.
  2. `aboutPage`: `mission`, `vision`, `values` (array de strings), `story` (Markdoc).
- **RF04 - Controle de Rascunho / Publicação:**
  - Posts marcados como `status: 'draft'` devem ser filtrados e ocultados das listagens públicas e do sitemap.
- **RF05 - Painel Administrativo Isolado:**
  - Rota `/keystatic` acessível via `src/app/keystatic/[[...params]]/page.tsx` com layout próprio isolado (sem renderizar `Header` e `Footer` corporativos do site no painel administrativo).
  - Rota de API handler em `src/app/api/keystatic/[...params]/route.ts`.
- **RF06 - Reader API Helper:**
  - Módulo `src/lib/keystatic.ts` exportando instância unificada `reader` via `@keystatic/core/reader`.
- **RF07 - Seeding de Conteúdo Inicial (_Seed Data_):**
  - Criação dos arquivos Markdown/JSON em `content/` contendo:
    - 1 singleton Home (`content/singletons/home.json`)
    - 1 singleton Sobre (`content/singletons/about.json`)
    - 3 serviços (`content/services/consultoria-estrategica.json`, `seguranca-e-conformidade.json`, `transformacao-e-escala.json`)
    - 3 FAQs (`content/faqs/quais-servicos-oferecem.json`, `como-funciona-o-atendimento.json`, `quais-sao-os-prazos.json`)
    - 2 posts de blog (`content/posts/bem-vindo-ao-novo-site/index.mdoc`, `content/posts/governanca-e-seguranca-digital/index.mdoc`)

---

## 🚫 4. Não-Escopo & Limites Técnicos

1. **Não implementar banco de dados relacional ou NoSQL:** O Keystatic deve operar exclusivamente sobre arquivos Git.
2. **Não implementar controle de papéis complexos (RBAC granular):** O controle de acesso básico do Keystatic Cloud (até 3 editores com permissão de edição) atende integralmente ao escopo do MVP.
3. **Não commitar imagens pesadas (> 1 MB) no repositório:** Conforme [ADR 0006](../../docs/adr/0006-autenticacao-cms-e-gestao-de-midia.md), manter imagens leves em `public/images/content/` para evitar _Git Bloat_.

---

## 🚦 5. Critérios de Aceitação da Feature 004

1. **Instalação e Resolução Determinística:** `@keystatic/core` e `@keystatic/next` instalados sem conflitos de peer dependencies no Node 24 LTS e React 19.
2. **Acesso ao Painel Admin:** Acesso a `/keystatic` renderiza a interface do CMS sem conflito com o layout institucional.
3. **Integridade da Reader API:** Leitura assíncrona local de coleções e singletons testada unitariamente com Vitest.
4. **Filtro de Rascunhos:** Testes comprovando que itens com `status: 'draft'` são omitidos na consulta de posts publicados.
5. **Seeding Completo:** Repositório contém todos os arquivos de seed pré-populados, permitindo compilação estática (`npm run build`) a partir de um clone limpo.
6. **Zero Regressão nos Quality Gates:** `npm run verify` (`audit:docs`, `lint`, `typecheck`, `test`, `build`) 100% verde.
