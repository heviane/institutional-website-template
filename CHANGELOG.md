# Registro de Alterações (Changelog)

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)  
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### 📊 Status das Features (Fase 2 - Core & MVP)

* [x] **Feature 001: Project Bootstrap & Quality Gates** (Concluída — Commit [`277a96a`](https://github.com/heviane/institutional-website-template/commit/277a96a) / Spec: [`specs/001-project-bootstrap/`](specs/001-project-bootstrap/))
* [x] **Feature 002: Design System, Layout Base & Componentes Essenciais** (Concluída — Spec: [`specs/002-design-system-and-layout/`](specs/002-design-system-and-layout/))
* [x] **Feature 003: Validação de Ambiente & Formulário Transacional** (Concluída — Spec: [`specs/003-environment-and-contact-form/`](specs/003-environment-and-contact-form/))
* [ ] **Feature 004: Gestão de Conteúdo (Keystatic CMS)** (Próxima / Em Especificação)
* [ ] **Feature 005: SEO Técnico Avançado & Homologação MVP** (Pendente)

### Adicionado (Unreleased)

* **Feature 003 (Validação de Ambiente, Formulário Transacional & Conformidade Legal):**
  * Validação segregada de variáveis de ambiente no build via Zod (`src/env/client.ts` e `src/env/server.ts` blindado com `import "server-only"`).
  * Proteção no build do Next.js com `experimental.serverActions.bodySizeLimit = "64kb"` e guarda de payload de 5.000 caracteres contra ataques de DoS.
  * Schema canônico de formulário (`src/lib/schemas/contact.ts`) com encadeamento estrito no Zod 3 (`.trim()` prévio) e consentimento explícito sob LGPD Art. 5º, XII.
  * Rate limiting resiliente com pseudonimização técnica de IP via hash HMAC-SHA256 (`src/lib/rate-limit.ts`) utilizando script Lua atômico no Upstash Redis e fallback in-memory com semântica Fail-Closed.
  * Server Action transacional com defesa em 3 camadas (`src/app/actions/contact.ts`): Honeypot silencioso, Rate Limit por IP, validação Cloudflare Turnstile e despacho via Resend API com mascaramento e sanitização absoluta de erros internos.
  * Componente reativo e acessível `<ContactForm />` com React Hook Form, Shadcn/ui e integração condicional do Cloudflare Turnstile.
  * Componente global acessível `<FloatingWhatsApp />` (alvo de toque de 56x56px) integrado ao layout raiz (`src/app/layout.tsx`).
  * Páginas legais fidedignas (`src/app/(legal)/politica-de-privacidade/page.tsx` e `termos-de-uso/page.tsx`) com cláusula de Transferência Internacional de Dados (Art. 33 da LGPD) e declaração condicional de serviços ativos (ADR 0007).
  * Integração completa na Home Page (`src/app/page.tsx`) e suíte de testes unitários, funcionais e de acessibilidade WCAG 2.1 AA (`vitest-axe`).

* **Governança, Decisões Arquiteturais & Guias Operacionais (ADRs 0012 a 0014 & Docs 09 a 12):**
  * Formalização do [ADR 0014](docs/adr/0014-rejeicao-de-estado-global-em-favor-de-rsc.md) estabelecendo a rejeição de gerenciadores de estado global (Redux, Zustand, React Contexts em cascata) em favor do fluxo Server-First via React Server Components e estado colocalizado na folha.
  * Criação do [Guia de Resolução de Problemas e Runbook de Incidentes](docs/09-troubleshooting-and-runbook.md) detalhando procedimentos de emergência para formulários, rate limit, Cloudflare Turnstile, validação de ambiente e CMS.
  * Criação do [Blueprint de Fluxo de Dados e Conformidade LGPD](docs/10-data-flow-and-privacy-map.md) com diagrama de sequência ponta a ponta, inventário de dados, fundamentação técnica da pseudonimização de IP e modelo de declaração para DPOs.
  * Criação do [Playbook de Manutenção e Sincronização de Forks](docs/11-template-fork-maintenance.md) estabelecendo fluxos com `git cherry-pick`, isolamento da Zona Imune do Cliente e checklist pós-sincronização.
  * Criação do [Guia de Performance, Core Web Vitals e Scripts de Terceiros](docs/12-performance-and-third-parties.md) estipulando o Performance Budget, estratégias do `next/script` e diretrizes de mídia.
  * Formalização do [ADR 0013](docs/adr/0013-arquitetura-unificada-fullstack-vs-separacao-fisica.md) estabelecendo a adoção da Arquitetura Unificada Full-Stack (Next.js App Router) e a rejeição de separação física em diretórios `frontend/` e `backend/` em favor de segregação lógica estrita de fronteiras (`server-only`, `'use server'`, schemas Zod compartilhados e RSC).
  * Atualização de [docs/04-folder-structure.md](docs/04-folder-structure.md) com seção didática detalhando as fronteiras lógicas no código e catálogo no índice [docs/adr/README.md](docs/adr/README.md).
  * Formalização do [ADR 0012](docs/adr/0012-deploy-progressivo-modo-lite-e-rate-limiting-serverless.md) estabelecendo a estratégia de Deploy Progressivo (Modo Lite vs. Modo Robusto) e documentando o Rate Limiting em memória serverless como de melhor esforço.
  * Emenda controlada aos [ADR 0009](docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md) e [ADR 0011](docs/adr/0011-defesa-antispam-e-protecao-de-formularios.md).
  * Criação do portão mandatório de alinhamento bidirecional de especificações (*Spec-to-Docs Parity Gate*) no [AGENTS.md](AGENTS.md).
* **Feature 002 (Design System, Layout Base & Componentes Essenciais):**
  * Configuração manual e declarativa do Shadcn/ui (`components.json`) compatível com Tailwind CSS v4.
  * Instalação de dependências acessíveis de UI (`lucide-react`, `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-dialog`) e de teste de acessibilidade (`axe-core`).
  * Setup global de testes com `vitest-axe` em `tests/setup.ts` integrado ao `vitest.config.ts`.
  * Centralização de dados da marca em `src/config/site.ts` com tipagem estrita TypeScript (`SiteConfig`).
  * Implementação de utilitários resilientes em `src/lib/utils.ts` (`formatWhatsAppUrl`, `formatTelUrl`, `formatPhoneDisplay`).
  * Implementação dos primitivos atômicos de UI em `src/components/ui/` (`button.tsx` com toque mínimo de 44x44px e variantes `cta`/`whatsapp`, `card.tsx` modular, `dialog.tsx` acessível com ciclo de foco e Escape, `input.tsx`, `textarea.tsx`).
  * Implementação dos componentes estruturais de layout Server-First em `src/components/shared/` (`header.tsx` RSC, `mobile-nav.tsx` 'use client' com Radix Dialog e auto-close em âncoras, `hero.tsx` RSC universal com `HeroProps`, `footer.tsx` RSC com compliance legal e copyright dinâmico).
  * Composição do "Layout Shell Demo" integrado na Home Page (`src/app/page.tsx` RSC) e carregamento da fonte `Inter` com metadados dinâmicos em `src/app/layout.tsx`.
  * Bateria de testes funcionais (Matriz de 6 Casos) e asserções automatizadas de acessibilidade WCAG 2.1 AA (`vitest-axe`) cobrindo 100% dos componentes e telas.
* **Feature 001 (Project Bootstrap & Quality Gates):**
  * Bootstrap declarativo do Next.js 16 (App Router) com React 19, TypeScript e Tailwind CSS v4 na raiz.
  * Configuração do design system com tokens `@theme` inline em `oklch()` e utilitário canônico `cn()`.
  * Configuração do Vitest com ambiente `jsdom` e suíte de testes de sanidade.
  * Promoção incondicional dos Quality Gates no CI (`.github/workflows/ci.yml`): `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
* **Automação de Qualidade Documental (Anti-Doc Rot):**
  * Criação do script `scripts/audit-docs.mjs` (`npm run audit:docs`) para validação estrita de links internos, sincronização da árvore de arquivos e conformidade com o Princípio 9.
  * Integração do Quality Gate de documentação no pipeline do GitHub Actions (`.github/workflows/ci.yml`).
  * Atualização de `AGENTS.md`, `CONTRIBUTING.md` e `PULL_REQUEST_TEMPLATE.md` instituindo o portão documental obrigatório pós-feature.
* **Experiência do Desenvolvedor (DX) & Automação de Verificação:**
  * Criação do script unificado `npm run verify` no `package.json` para encadeamento de todos os Quality Gates locais.
  * Inclusão do badge dinâmico do GitHub Actions CI (`CI Quality Gates`) no `README.md`.

### Planejado para a Fase 2 (Core & MVP)

* Validação de Ambiente, Formulário Transacional (Resend + Turnstile + Rate Limiting) & Conformidade Legal (Feature 003).
* Gestão de conteúdo via Keystatic CMS em modo Git (Feature 004).
* SEO Técnico Avançado, Sitemaps e Homologação do MVP (Feature 005).

---

## [0.1.0] - 2026-10-24

### Fase 1: Arquitetura, Governança e Spec-Driven Development (Concluída)

#### Adicionado

* **Governança Canônica:** Criação do `AGENTS.md` contendo a Constituição de Engenharia, 9 princípios inegociáveis, restrições negativas, ciclo TDD e dicionário canônico.
* **Instruções para Agentes de IA:** Configuração de ponteiros universais em `AGENTS.md`, `.cursor/rules/sdd.mdc`, `CLAUDE.md` e `.github/copilot-instructions.md`.
* **Decisões de Arquitetura (ADRs):** Formalização de 11 Architectural Decision Records (`0001` a `0011`) cobrindo Next.js 16, Keystatic CMS, Server Actions, Tailwind v4, hospedagem na Vercel, mídia e CMS Cloud, conformidade LGPD, Vitest + axe-core, headers de segurança HTTP com CSP Report-Only, estratégia de release e tripla camada anti-spam.
* **Documentação Técnica Canônica (`docs/`):**
  * `01-architecture-overview.md` (visão geral de arquitetura e pilares).
  * `02-environment-setup.md` (guia de setup e padrões de código).
  * `03-project-roadmap.md` (roadmap, marcos e critérios de aceitação).
  * `04-folder-structure.md` (mapa de diretórios e zonas de manutenção).
  * `05-keystatic-content-model.md` (modelagem de coleções do CMS e controle de rascunhos).
  * `06-brand-theming-guide.md` (guia de personalização de marca e cores com OKLCH).
  * `07-client-onboarding-checklist.md` (checklist de onboarding, DNS e matriz financeira).
  * `08-architecture-review-phase1.md` (encerramento e homologação da Fase 1).
* **Automação de CI & Qualidade:**
  * Workflow de integração contínua (`.github/workflows/ci.yml`) configurado com Node.js 24 LTS, `permissions: contents: read` e validação estrita de lockfile.
  * Monitoramento de dependências automatizado via Dependabot agrupado (`.github/dependabot.yml`).
  * Modelos de Issues padronizados (`.github/ISSUE_TEMPLATE/`) e Pull Request template (`.github/PULL_REQUEST_TEMPLATE.md`).
  * Governança de segurança (`SECURITY.md`) com suporte a GitHub Private Vulnerability Reporting.
  * Padronização de ambiente e quebras de linha (`.editorconfig`, `.gitattributes`, `.prettierrc`, `.nvmrc`).
  * Especificação formal da Feature 001 em `specs/001-project-bootstrap/` (`spec.md`, `plan.md`, `tasks.md`).
