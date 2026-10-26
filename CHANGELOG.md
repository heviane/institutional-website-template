# Registro de Alterações (Changelog)

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)  
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### 📊 Status das Features (Fase 2 - Core & MVP)

- [x] **Feature 001: Project Bootstrap & Quality Gates** (Concluída — Commit [`277a96a`](https://github.com/heviane/institutional-website-template/commit/277a96a) / Spec: [`specs/001-project-bootstrap/`](specs/001-project-bootstrap/))
- [x] **Feature 002: Design System, Layout Base & Componentes Essenciais** (Concluída — Spec: [`specs/002-design-system-and-layout/`](specs/002-design-system-and-layout/))
- [x] **Feature 003: Validação de Ambiente & Formulário Transacional** (Concluída — Spec: [`specs/003-environment-and-contact-form/`](specs/003-environment-and-contact-form/))
- [x] **Feature 004: Gestão de Conteúdo (Keystatic CMS)** (Concluída — Spec: [`specs/004-keystatic-cms/`](specs/004-keystatic-cms/))
- [ ] **Feature 005: SEO Técnico Avançado & Homologação MVP** (Próxima / Em Especificação)

### Adicionado (Unreleased)

- **Feature 004 (Gestão de Conteúdo Baseada em Git via Keystatic CMS):**
  - Configuração centralizada e tipada do Keystatic CMS (`keystatic.config.ts`) com suporte a Dual Mode (`local` no desenvolvimento/testes e `cloud` em produção).
  - Modelagem e registro de coleções estruturadas: `posts` (com Markdoc, `coverImage` e status `draft`/`published`), `services` (com ícones Lucide e diferenciais), `testimonials` e `faqs` (com ordenação).
  - Modelagem de singletons institucionais para páginas fixas: `homePage` e `aboutPage`.
  - Seeding de conteúdo inicial completo no repositório (`content/`): singletons (`home.json`, `about.json`), serviços (`consultoria-estrategica.json`, `seguranca-e-conformidade.json`, `transformacao-e-escala.json`), perguntas frequentes (`faqs/*.json`), artigos de blog (`posts/bem-vindo-ao-novo-site/` publicado e `governanca-e-seguranca-digital/` rascunho) e depoimento de cliente (`testimonials/mariana-silva.json`).
  - Camada desacoplada e assíncrona de consumo via Reader API (`src/lib/keystatic.ts`) com ordenação de FAQs por prioridade e filtro inteligente de rascunhos para posts (`getPublishedPosts()`).
  - Rotas administrativas do Next.js 16 App Router: endpoint de API (`src/app/api/keystatic/[...params]/route.ts`) e interface de administração (`src/app/keystatic/[[...params]]/page.tsx`) com layout isolado (`src/app/keystatic/layout.tsx`) ocultando o Header, Footer e botão flutuante de WhatsApp.
  - Consumo dinâmico de serviços na Home Page (`src/app/page.tsx`) com mapeamento de ícones Lucide e lista de diferenciais, com fallback resiliente.
  - Suíte completa de testes automatizados com Vitest (`tests/keystatic-reader.test.ts` e `tests/keystatic-routes.test.tsx`), mantendo 100% de aprovação e zero violações no `vitest-axe`.

- **Sincronização Rigorosa Documentação × Scripts (`package.json`) × CI:**
  - Alinhamento em `.github/PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docs/02-environment-setup.md` e `docs/07-client-onboarding-checklist.md` consolidando a execução de `npm run verify` e documentando explicitamente os 6 Quality Gates (incluindo `npm run format:check` e `npm run format`).
  - Criação da tabela consolidada de scripts no `README.md` (Seção 4) detalhando a finalidade e status de bloqueio de cada comando para novos desenvolvedores e agentes.

- **Refatoração de Arquitetura, Tipagem de Marca & Tooling de Qualidade:**
  - Segregação de Tipos da Marca: Criação de `src/types/site.ts` isolando interfaces (`SiteConfig`, `NavItem`, etc.) na Zona do Template Engine e preservando `src/config/site.ts` com `as const satisfies SiteConfig` na Zona Imune do Cliente (ADR 0010), evitando conflitos de merge em atualizações upstream.
  - Imutabilidade e Single Source of Truth para URL: Centralização canônica da URL em `siteConfig.url`; flexibilização de `NEXT_PUBLIC_SITE_URL` como opcional em `src/env/client.ts` sem mascaramento de localhost padrão em produção.
  - Testabilidade Pura do Ambiente: Exportação de funções puras `parseClientEnv(raw)` e `parseServerEnv(raw)` desacoplando asserções de testes da mutação de `process.env`.
  - Rigor no TypeScript: Ativação de `"allowJs": false` e `"forceConsistentCasingInFileNames": true` no `tsconfig.json`.
  - Formatação e Tooling: Adição dos scripts `npm run format:check` e `npm run format` com Prettier integrado ao Quality Gate `npm run verify` e ao CI (`.github/workflows/ci.yml`), além de `timeout-minutes: 15` e pinning de actions estáveis `@v4`.

- **Refinamento de Qualidade, Acessibilidade WCAG 2.2 AA & Polimento de Segurança:**
  - Conformidade com WCAG 2.2 AA: Adição de Skip Link acessível ("Pular para o conteúdo principal" para `#main-content`) no `RootLayout`, suporte a Focus Not Obscured com `scroll-mt-20` nas seções com âncora (`#servicos`, `#sobre`, `#contato`), e inclusão de `DialogDescription` no `<MobileNav />` para eliminar advertências do Radix UI.
  - Tokens semânticos e Contraste: Criação dos tokens semânticos `--whatsapp` e `--whatsapp-foreground` eliminando hex bruto inline e assegurando contraste $\ge 3:1$ no FAB flutuante; calibração do botão WhatsApp para `bg-emerald-700` (razão de contraste de 4,77:1 atendendo ao WCAG AA para texto).
  - Navegação SPA e Rotas: Hrefs canônicos globais (`/`, `/#servicos`, `/#sobre`, `/#contato`) em `siteConfig.nav` viabilizando retorno a partir de páginas legais e subrotas; adoção de `<Link>` do Next.js no cabeçalho, navegação móvel e rodapé, e padding de segurança mobile (`pb-20 sm:pb-0`) para prevenir sobreposição do botão flutuante.
  - Headers de Segurança no `next.config.ts`: Supressão de cabeçalho com `poweredByHeader: false` e fortalecimento do CSP com diretivas defensivas (`base-uri 'self'`, `object-src 'none'`, `form-action 'self'`, `frame-ancestors 'self'` e restrição de conexões autorizadas).
  - Tipagem estrita: Substituição de `any` por `unknown` em `src/types/index.d.ts`, satisfazendo integralmente a Regra 12 do [AGENTS.md](AGENTS.md).
  - Animações no Tailwind CSS v4: Instalação e integração do pacote oficial `tw-animate-css` para suporte pleno a transições de diálogo do Radix/Shadcn.

- **Feature 003 (Validação de Ambiente, Formulário Transacional & Conformidade Legal):**
  - Validação segregada de variáveis de ambiente no build via Zod (`src/env/client.ts` e `src/env/server.ts` blindado com `import "server-only"`).
  - Proteção no build do Next.js com `experimental.serverActions.bodySizeLimit = "64kb"` e guarda de payload de 5.000 caracteres contra ataques de DoS.
  - Schema canônico de formulário (`src/lib/schemas/contact.ts`) com encadeamento estrito no Zod 3 (`.trim()` prévio) e consentimento explícito sob LGPD Art. 5º, XII.
  - Rate limiting resiliente com pseudonimização técnica de IP via hash HMAC-SHA256 (`src/lib/rate-limit.ts`) utilizando script Lua atômico no Upstash Redis e fallback in-memory com semântica Fail-Closed.
  - Server Action transacional com defesa em 3 camadas (`src/app/actions/contact.ts`): Honeypot silencioso, Rate Limit por IP, validação Cloudflare Turnstile e despacho via Resend API com mascaramento e sanitização absoluta de erros internos.
  - Componente reativo e acessível `<ContactForm />` com React Hook Form, Shadcn/ui e integração condicional do Cloudflare Turnstile.
  - Componente global acessível `<FloatingWhatsApp />` (alvo de toque de 56x56px) integrado ao layout raiz (`src/app/layout.tsx`).
  - Páginas legais fidedignas (`src/app/(legal)/politica-de-privacidade/page.tsx` e `termos-de-uso/page.tsx`) com cláusula de Transferência Internacional de Dados (Art. 33 da LGPD) e declaração condicional de serviços ativos (ADR 0007).
  - Integração completa na Home Page (`src/app/page.tsx`) e suíte de testes unitários, funcionais e de acessibilidade WCAG 2.1 AA (`vitest-axe`).

- **Governança, Anti-Doc Rot & Automação de Quality Gates (Docs 02, 04, ESLint & Audit):**
  - Limpeza de Doc Rot em [docs/02-environment-setup.md](docs/02-environment-setup.md): Remoção de mais de 250 linhas de código TypeScript duplicado (schemas Zod e Server Action), substituindo-os por referências canônicas a `src/lib/schemas/contact.ts` e `src/app/actions/contact.ts` em estrita observância ao Princípio 9 do [AGENTS.md](AGENTS.md).
  - Extensão do Quality Gate [scripts/audit-docs.mjs](scripts/audit-docs.mjs): Detecção dinâmica de blocos de código implementados em `docs/` (Anti-Doc Rot por máquina), validação de paridade de status de specs (`Draft` ➔ `Aprovada` ➔ `Em Execução` ➔ `Concluída`), validação de zero cores hexadecimais brutas em `src/components/`, e eliminação de componentes fantasma na árvore de [docs/04-folder-structure.md](docs/04-folder-structure.md) (remoção de `toast.tsx` e alinhamento com `robots.ts`).
  - Automação de Guardrails no ESLint ([eslint.config.mjs](eslint.config.mjs)): Ativação das regras `@typescript-eslint/no-explicit-any` e `@typescript-eslint/consistent-type-imports` para aplicação automática das Regras 12 e 5.3 do [AGENTS.md](AGENTS.md).
  - Rastreabilidade de Requisitos: Padronização dos identificadores `FR-xxx` e `AC-xxx` e formalização do ciclo de status de especificações no [AGENTS.md](AGENTS.md).
- **Governança, Decisões Arquiteturais & Guias Operacionais (ADRs 0012 a 0014 & Docs 09 a 12):**
  - Formalização do [ADR 0014](docs/adr/0014-rejeicao-de-estado-global-em-favor-de-rsc.md) estabelecendo a rejeição de gerenciadores de estado global (Redux, Zustand, React Contexts em cascata) em favor do fluxo Server-First via React Server Components e estado colocalizado na folha.
  - Criação do [Guia de Resolução de Problemas e Runbook de Incidentes](docs/09-troubleshooting-and-runbook.md) detalhando procedimentos de emergência para formulários, rate limit, Cloudflare Turnstile, validação de ambiente e CMS.
  - Criação do [Blueprint de Fluxo de Dados e Conformidade LGPD](docs/10-data-flow-and-privacy-map.md) com diagrama de sequência ponta a ponta, inventário de dados, fundamentação técnica da pseudonimização de IP e modelo de declaração para DPOs.
  - Criação do [Playbook de Manutenção e Sincronização de Forks](docs/11-template-fork-maintenance.md) estabelecendo fluxos com `git cherry-pick`, isolamento da Zona Imune do Cliente e checklist pós-sincronização.
  - Criação do [Guia de Performance, Core Web Vitals e Scripts de Terceiros](docs/12-performance-and-third-parties.md) estipulando o Performance Budget, estratégias do `next/script` e diretrizes de mídia.
  - Formalização do [ADR 0013](docs/adr/0013-arquitetura-unificada-fullstack-vs-separacao-fisica.md) estabelecendo a adoção da Arquitetura Unificada Full-Stack (Next.js App Router) e a rejeição de separação física em diretórios `frontend/` e `backend/` em favor de segregação lógica estrita de fronteiras (`server-only`, `'use server'`, schemas Zod compartilhados e RSC).
  - Atualização de [docs/04-folder-structure.md](docs/04-folder-structure.md) com seção didática detalhando as fronteiras lógicas no código e catálogo no índice [docs/adr/README.md](docs/adr/README.md).
  - Formalização do [ADR 0012](docs/adr/0012-deploy-progressivo-modo-lite-e-rate-limiting-serverless.md) estabelecendo a estratégia de Deploy Progressivo (Modo Lite vs. Modo Robusto) e documentando o Rate Limiting em memória serverless como de melhor esforço.
  - Emenda controlada aos [ADR 0009](docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md) e [ADR 0011](docs/adr/0011-defesa-antispam-e-protecao-de-formularios.md).
  - Criação do portão mandatório de alinhamento bidirecional de especificações (_Spec-to-Docs Parity Gate_) no [AGENTS.md](AGENTS.md).
- **Feature 002 (Design System, Layout Base & Componentes Essenciais):**
  - Configuração manual e declarativa do Shadcn/ui (`components.json`) compatível com Tailwind CSS v4.
  - Instalação de dependências acessíveis de UI (`lucide-react`, `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-dialog`) e de teste de acessibilidade (`axe-core`).
  - Setup global de testes com `vitest-axe` em `tests/setup.ts` integrado ao `vitest.config.ts`.
  - Centralização de dados da marca em `src/config/site.ts` com tipagem estrita TypeScript (`SiteConfig`).
  - Implementação de utilitários resilientes em `src/lib/utils.ts` (`formatWhatsAppUrl`, `formatTelUrl`, `formatPhoneDisplay`).
  - Implementação dos primitivos atômicos de UI em `src/components/ui/` (`button.tsx` com toque mínimo de 44x44px e variantes `cta`/`whatsapp`, `card.tsx` modular, `dialog.tsx` acessível com ciclo de foco e Escape, `input.tsx`, `textarea.tsx`).
  - Implementação dos componentes estruturais de layout Server-First em `src/components/shared/` (`header.tsx` RSC, `mobile-nav.tsx` 'use client' com Radix Dialog e auto-close em âncoras, `hero.tsx` RSC universal com `HeroProps`, `footer.tsx` RSC com compliance legal e copyright dinâmico).
  - Composição do "Layout Shell Demo" integrado na Home Page (`src/app/page.tsx` RSC) e carregamento da fonte `Inter` com metadados dinâmicos em `src/app/layout.tsx`.
  - Bateria de testes funcionais (Matriz de 6 Casos) e asserções automatizadas de acessibilidade WCAG 2.1 AA (`vitest-axe`) cobrindo 100% dos componentes e telas.
- **Feature 001 (Project Bootstrap & Quality Gates):**
  - Bootstrap declarativo do Next.js 16 (App Router) com React 19, TypeScript e Tailwind CSS v4 na raiz.
  - Configuração do design system com tokens `@theme` inline em `oklch()` e utilitário canônico `cn()`.
  - Configuração do Vitest com ambiente `jsdom` e suíte de testes de sanidade.
  - Promoção incondicional dos Quality Gates no CI (`.github/workflows/ci.yml`): `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
- **Automação de Qualidade Documental (Anti-Doc Rot):**
  - Criação do script `scripts/audit-docs.mjs` (`npm run audit:docs`) para validação estrita de links internos, sincronização da árvore de arquivos e conformidade com o Princípio 9.
  - Integração do Quality Gate de documentação no pipeline do GitHub Actions (`.github/workflows/ci.yml`).
  - Atualização de `AGENTS.md`, `CONTRIBUTING.md` e `PULL_REQUEST_TEMPLATE.md` instituindo o portão documental obrigatório pós-feature.
- **Experiência do Desenvolvedor (DX) & Automação de Verificação:**
  - Criação do script unificado `npm run verify` no `package.json` para encadeamento de todos os Quality Gates locais.
  - Inclusão do badge dinâmico do GitHub Actions CI (`CI Quality Gates`) no `README.md`.

### Planejado para a Fase 2 (Core & MVP)

- Validação de Ambiente, Formulário Transacional (Resend + Turnstile + Rate Limiting) & Conformidade Legal (Feature 003).
- Gestão de conteúdo via Keystatic CMS em modo Git (Feature 004).
- SEO Técnico Avançado, Sitemaps e Homologação do MVP (Feature 005).

---

## [0.1.0] - 2026-10-24

### Fase 1: Arquitetura, Governança e Spec-Driven Development (Concluída)

#### Adicionado

- **Governança Canônica:** Criação do `AGENTS.md` contendo a Constituição de Engenharia, 9 princípios inegociáveis, restrições negativas, ciclo TDD e dicionário canônico.
- **Instruções para Agentes de IA:** Configuração de ponteiros universais em `AGENTS.md`, `.cursor/rules/sdd.mdc`, `CLAUDE.md` e `.github/copilot-instructions.md`.
- **Decisões de Arquitetura (ADRs):** Formalização de 11 Architectural Decision Records (`0001` a `0011`) cobrindo Next.js 16, Keystatic CMS, Server Actions, Tailwind v4, hospedagem na Vercel, mídia e CMS Cloud, conformidade LGPD, Vitest + axe-core, headers de segurança HTTP com CSP Report-Only, estratégia de release e tripla camada anti-spam.
- **Documentação Técnica Canônica (`docs/`):**
  - `01-architecture-overview.md` (visão geral de arquitetura e pilares).
  - `02-environment-setup.md` (guia de setup e padrões de código).
  - `03-project-roadmap.md` (roadmap, marcos e critérios de aceitação).
  - `04-folder-structure.md` (mapa de diretórios e zonas de manutenção).
  - `05-keystatic-content-model.md` (modelagem de coleções do CMS e controle de rascunhos).
  - `06-brand-theming-guide.md` (guia de personalização de marca e cores com OKLCH).
  - `07-client-onboarding-checklist.md` (checklist de onboarding, DNS e matriz financeira).
  - `08-architecture-review-phase1.md` (encerramento e homologação da Fase 1).
- **Automação de CI & Qualidade:**
  - Workflow de integração contínua (`.github/workflows/ci.yml`) configurado com Node.js 24 LTS, `permissions: contents: read` e validação estrita de lockfile.
  - Monitoramento de dependências automatizado via Dependabot agrupado (`.github/dependabot.yml`).
  - Modelos de Issues padronizados (`.github/ISSUE_TEMPLATE/`) e Pull Request template (`.github/PULL_REQUEST_TEMPLATE.md`).
  - Governança de segurança (`SECURITY.md`) com suporte a GitHub Private Vulnerability Reporting.
  - Padronização de ambiente e quebras de linha (`.editorconfig`, `.gitattributes`, `.prettierrc`, `.nvmrc`).
  - Especificação formal da Feature 001 em `specs/001-project-bootstrap/` (`spec.md`, `plan.md`, `tasks.md`).
