# Feature 001: Project Bootstrap & Quality Gates (Spec)

* **Status:** Pronto para Aprovação
* **Data:** 2026-10-23
* **Fase do Roadmap:** [Fase 2 (Core & MVP)](../../docs/03-project-roadmap.md)
* **ADRs Vinculados:** [ADR 0001](../../docs/adr/0001-escolha-do-framework-next.md), [ADR 0004](../../docs/adr/0004-design-system-e-estilizacao.md), [ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md)

---

## 🎯 1. Objetivo e Contexto

Transicionar o repositório da **Fase 1 (Fundação Documental e Governança)** para a **Fase 2 (Materialização em Código)**, estabelecendo a base executável mínima da aplicação com reprodutibilidade estrita a partir de um clone limpo e proteção incondicional por Quality Gates automatizados no CI.

---

## 📦 2. Escopo Funcional

### O que ESTÁ no escopo (In-Scope):

1. **Inicialização do Framework:** Inicializar Next.js 16 (App Router), React 19, TypeScript e Tailwind CSS v4 na raiz do projeto, compatível com Node.js 24 LTS.
2. **Scripts Mandatórios de Qualidade:** Configurar no `package.json` os scripts:
   * `lint` (ESLint 9 com regras do Next.js).
   * `typecheck` (`tsc --noEmit`).
   * `test` (Vitest com suporte a DOM e `vitest-axe`).
   * `build` (`next build`).
3. **Design System & Primitivos:** Instalação e configuração inicial do Shadcn/ui com suporte ao Radix UI e Tailwind CSS v4 via `@theme` no `src/app/globals.css`.
4. **Infraestrutura de Testes:** Configurar o Vitest (`vitest.config.ts`) e criar um teste básico de sanidade comprovando que o runner executa com sucesso.
5. **Lockfile Determinístico:** Gerar e versionar o `package-lock.json`.
6. **Promoção do CI:** Atualizar `.github/workflows/ci.yml`, removendo a lógica provisória de guarda da Fase 1 (`check-bootstrap`) para que os gates executem de forma 100% incondicional e bloqueante via `npm ci`.

### O que NÃO está no escopo (Out-of-Scope):

* Componentes de layout institucional complexos (Header, Hero, Footer, Sobre, Serviços) — *Tratados na Feature 002*.
* Server Action de formulário e integrações (Resend, Turnstile, Rate Limit) — *Tratados na Feature 003*.
* Configuração do Keystatic CMS e coleções — *Tratados na Feature 004*.
* Auditorias de produção do Lighthouse e DNS de domínio — *Tratados na Feature 005*.

---

## 🚦 3. Critérios Objetivos de Aceitação (Acceptance Criteria)

1. **Reprodutibilidade em Clone Limpo:**
   * Um ambiente limpo com Node.js 24 executa `npm ci` sem conflitos de *peer dependencies* e sem avisos de pacotes ausentes no lockfile.
2. **Zero Erros nos Quality Gates Locais:**
   * `npm run lint` executa sem nenhum erro ou aviso bloqueante.
   * `npm run typecheck` compila os tipos TypeScript com zero erros.
   * `npm test` executa a suíte de testes com pelo menos 1 teste de sanidade verde.
   * `npm run build` compila a aplicação de produção com sucesso.
3. **CI Automatizado e Incondicional:**
   * O pipeline do GitHub Actions roda todos os 5 steps (`npm ci`, `lint`, `typecheck`, `test`, `build`) e reporta status verde baseado na execução real dos comandos.
