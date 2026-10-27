# Feature 005: SEO Técnico Avançado & Homologação MVP — Especificação

- **Data de Criação:** 2026-10-26
- **Status:** Concluída
- **ADRs Relacionadas:** [ADR 0001](../../docs/adr/0001-escolha-do-framework-next.md), [ADR 0005](../../docs/adr/0005-estrategia-de-hospedagem-e-cicd.md), [ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md), [ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)
- **Documentos Canônicos de Domínio:** [`docs/01-architecture-overview.md`](../../docs/01-architecture-overview.md), [`docs/03-project-roadmap.md`](../../docs/03-project-roadmap.md) (Seções 2.1 e 2.2)

---

## 🎯 1. Problema & Visão Geral (O quê e Por quê)

### 1.1. O Problema

Para que um website institucional cumpra seu papel de geração de negócios e autoridade de marca para o cliente, não basta ter design acessível e CMS funcional; ele precisa ser **descoberto e interpretado corretamente pelos mecanismos de busca (Google, Bing)** e gerar **previews atraentes e fidedignos em redes sociais e mensageiros (WhatsApp, LinkedIn, Twitter/X)**:

1. **Risco de Indexação Indevida do CMS:** O painel administrativo do Keystatic (`/keystatic`) e seus endpoints de API (`/api/keystatic/*`) não podem ser indexados por robôs de busca.
2. **Inconsistência de Conteúdo Dinâmico em Sitemaps:** Sitemaps manuais ou estáticos tornam-se rapidamente obsoletos à medida que o cliente publica ou despublica postagens no CMS, gerando links quebrados ou desindexação.
3. **Ausência de Compreensão Semântica por Motores de Busca:** Sem dados estruturados Schema.org (`JSON-LD`), robôs de busca não associam a entidade corporativa (nome, logo, contatos, redes sociais) como uma organização oficial verificada.
4. **Homologação Final do MVP:** A Fase 2 (Core & MVP) estabeleceu 8 critérios objetivos de homologação em [`docs/03-project-roadmap.md`](../../docs/03-project-roadmap.md) que necessitam de conferência e validação documental antes do encerramento oficial do marco de desenvolvimento.

### 1.2. A Solução

Implementar a camada definitiva de **SEO Técnico e Metadados Estruturados** aproveitando as APIs nativas do Next.js 16 App Router (`Metadata API`, `robots.ts` e `sitemap.ts`) alimentadas pelo `siteConfig` e pela Reader API do Keystatic:

- **Robots Dinâmico (`src/app/robots.ts`):** Geração programática de `robots.txt` permitindo indexação de páginas públicas e bloqueando estritamente `/keystatic/` e rotas de API internas, apontando para o sitemap oficial.
- **Sitemap Dinâmico (`src/app/sitemap.ts`):** Geração programática de `sitemap.xml` incluindo páginas estáticas (Home, Políticas de Privacidade, Termos de Uso) e artigos de blog publicados no Keystatic via Reader API (`getPublishedPosts()`), excluindo rascunhos.
- **Metadata API Enriquecida:** Configuração completa de canonical URLs, Open Graph, Twitter Cards, ícones e diretivas de indexação.
- **Dados Estruturados Schema.org (`JSON-LD`):** Injeção de marcação semântica padronizada para `Organization` e `WebSite`.
- **Homologação Final do MVP:** Verificação integral dos critérios da Seção 2.2 do Roadmap e validação dos Quality Gates (`npm run verify`).

---

## 👥 2. Personas & Casos de Uso

| Persona                        | Necessidade                                                                        | Benefício Esperado                                                                 |
| :----------------------------- | :--------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| **Robôs de Busca (Google)**    | Rastrear páginas públicas, identificar o sitemap e ignorar áreas administrativas.  | Indexação eficiente sem desperdício de _crawl budget_ e sem exposição do CMS.      |
| **Visitante / Compartilhador** | Compartilhar links do site no WhatsApp, LinkedIn ou Slack com preview formatado.   | Cards ricos com imagem Open Graph (1200x630px), título, resumo e nome da marca.    |
| **Cliente Corporativo**        | Publicar novos artigos no blog e vê-los indexados automaticamente.                 | Artigos publicados entram no sitemap instantaneamente; rascunhos ficam protegidos. |
| **Equipe de Desenvolvimento**  | Concluir formalmente o MVP da Fase 2 com garantia de zero pendências de qualidade. | Todos os critérios do Roadmap homologados e validados por testes automatizados.    |

---

## 📋 3. Escopo Funcional & Requisitos

### 3.1. Requisitos Funcionais (FR)

- **FR-001 — Configuração Avançada da Metadata API (`src/app/layout.tsx`):**
  - Declarar `metadataBase` utilizando `new URL(siteConfig.url)`.
  - Definir `title` com padrão e template (`%s | ${siteConfig.name}`).
  - Definir `alternates.canonical` apontando para a raiz relativa `./`.
  - Configurar tags Open Graph completas (`type: "website"`, `locale: "pt_BR"`, `url`, `title`, `description`, `siteName`, `images` 1200x630).
  - Configurar Twitter Card com `summary_large_image`.
  - Definir metadados de ícones (`icon`, `apple`, `shortcut`).
  - Configurar diretivas de robôs de busca (`robots: { index: true, follow: true, googleBot: { ... } }`).

- **FR-002 — Arquivo `robots.txt` Dinâmico (`src/app/robots.ts`):**
  - Exportar função default retornando o tipo `MetadataRoute.Robots` do Next.js.
  - Regra de rastreamento (`rules`):
    - `userAgent: "*"`
    - `allow: "/"`
    - `disallow: ["/keystatic/", "/api/keystatic/"]`
  - Referência do Sitemap canônico: `${siteConfig.url}/sitemap.xml`.
  - Host canônico: `siteConfig.url`.

- **FR-003 — Sitemap Dinâmico com Filtro de Rascunhos (`src/app/sitemap.ts`):**
  - Exportar função default assíncrona retornando `Promise<MetadataRoute.Sitemap>`.
  - Incluir rotas estáticas:
    - `/` (Home): prioridade `1.0`, frequência `weekly`.
    - `/politica-de-privacidade`: prioridade `0.3`, frequência `monthly`.
    - `/termos-de-uso`: prioridade `0.3`, frequência `monthly`.
  - Incluir rotas dinâmicas do Keystatic via `getPublishedPosts()`:
    - `/blog/${slug}`: prioridade `0.7`, frequência `weekly`, `lastModified` formatado a partir de `publishedDate`.
    - Exclusão compulsória de posts marcados como `status: 'draft'`.

- **FR-004 — Marcação Semântica Estruturada Schema.org (`JSON-LD`):**
  - Criar componente acessível ou injeção semântica de script `application/ld+json`.
  - Gerar schema de `Organization`:
    - `@context`: `"https://schema.org"`
    - `@type`: `"Organization"`
    - `name`: `siteConfig.name`
    - `url`: `siteConfig.url`
    - `logo`: `${siteConfig.url}${siteConfig.ogImage}`
    - `contactPoint`: telefone e WhatsApp formatados com `contactType: "customer service"`.
    - `sameAs`: URLs de redes sociais ativas em `siteConfig.socialLinks`.
  - Gerar schema de `WebSite`:
    - `@context`: `"https://schema.org"`
    - `@type`: `"WebSite"`
    - `name`: `siteConfig.name`
    - `url`: `siteConfig.url`
    - `description`: `siteConfig.description`
    - `inLanguage`: `"pt-BR"`

- **FR-005 — Suíte de Testes Automatizados de SEO (`tests/seo-metadata.test.ts`):**
  - Validar unitariamente o retorno de `robots()` assegurando regras de disallow para áreas do CMS.
  - Validar unitariamente `sitemap()` assegurando presença de rotas estáticas e exclusão de rascunhos do Keystatic.
  - Validar estrutura e serialização do JSON-LD em `tests/seo-metadata.test.ts`.

- **FR-006 — Homologação Oficial do MVP (Fim da Fase 2):**
  - Verificar e atestar os 8 critérios da Seção 2.2 do [`docs/03-project-roadmap.md`](../../docs/03-project-roadmap.md).
  - Executar a suíte de Quality Gates completa (`npm run verify`) com 100% de sucesso.
  - Atualizar a tríade de governança marcando o encerramento da Fase 2 e o status para Fase 3 (Pós-MVP / Sob Demanda).

---

## 🧪 4. Critérios de Aceitação (AC)

- **AC-001 (Robots Dinâmico):** A rota `/robots.txt` deve ser gerada pelo Next.js com permissão para `/`, bloqueio expresso de `/keystatic/` e `/api/keystatic/`, e apontamento válido para `${siteConfig.url}/sitemap.xml`.
- **AC-002 (Sitemap Dinâmico):** A rota `/sitemap.xml` deve retornar XML válido contendo a raiz, as páginas legais e exclusivamente os artigos de blog publicados semeados em `content/posts/` (excluindo posts `draft`).
- **AC-003 (Metadata e Canonical):** O `<head>` renderizado no `RootLayout` deve conter `<link rel="canonical" href="...">`, tags Open Graph (com dimensões 1200x630 e locale `pt_BR`), Twitter Card e metadados de favicon.
- **AC-004 (Dados Estruturados JSON-LD):** O HTML raiz deve conter tag `<script type="application/ld+json">` com entidades válidas `Organization` e `WebSite`, sem erros de sintaxe JSON.
- **AC-005 (Cobertura de Testes):** O arquivo `tests/seo-metadata.test.ts` deve validar 100% das asserções de SEO técnico.
- **AC-006 (Zero Erros de Build e Quality Gates):** `npm run verify` deve ser aprovado com 0 erros e 0 warnings em `audit:docs`, `format:check`, `lint`, `typecheck`, `test` e `build`.

---

## 🚫 5. Fora de Escopo

- Implementação de índices avançados de sitemap particionados (`sitemap-index.xml` para mais de 50.000 URLs — reservado para Fase 3).
- Schemas complexos de e-commerce (`Product`, `Offer`) ou eventos (`Event`).
- Implementação de tags `hreflang` multi-idioma (escopo de internacionalização na Fase 3).
- Painel de administração de tags de SEO em tempo de execução via banco de dados (o template segue arquitetura estática via `siteConfig` e Keystatic).
