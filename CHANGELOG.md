# Registro de Alterações (Changelog)

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)  
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### 📊 Status das Features (Fase 2 - Core & MVP)
* [x] **Feature 001: Project Bootstrap & Quality Gates** (Concluída — Commit [`277a96a`](https://github.com/heviane/institutional-website-template/commit/277a96a) / Spec: [`specs/001-project-bootstrap/`](specs/001-project-bootstrap/))
* [ ] **Feature 002: Design System, Layout Base & Componentes Essenciais** (Próxima / Em Especificação)
* [ ] **Feature 003: Validação de Ambiente & Formulário Transacional** (Pendente)
* [ ] **Feature 004: Gestão de Conteúdo (Keystatic CMS)** (Pendente)
* [ ] **Feature 005: SEO Técnico Avançado & Homologação MVP** (Pendente)

### Adicionado
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
* Componentes de interface baseados em Shadcn/ui e Radix UI (WCAG 2.1 AA).
* Gestão de conteúdo via Keystatic CMS (Markdown/JSON Git-based).
* Server Action de contato com envio via Resend e tripla barreira anti-spam.

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

