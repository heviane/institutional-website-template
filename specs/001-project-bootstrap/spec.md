# Feature 001: Project Bootstrap & Quality Gates (Spec)

- **Status:** Concluída (Fase 2 Iniciada)
- **Data:** 2026-10-23
- **Fase do Roadmap:** [Fase 2 (Core & MVP)](../../docs/03-project-roadmap.md)
- **ADRs Vinculados:** [ADR 0001](../../docs/adr/0001-escolha-do-framework-next.md), [ADR 0004](../../docs/adr/0004-design-system-e-estilizacao.md), [ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md)

---

## 🎯 1. Objetivo e Contexto

Transicionar o repositório da **Fase 1 (Fundação Documental e Governança)** para a **Fase 2 (Materialização em Código)**, estabelecendo a base executável mínima da aplicação com reprodutibilidade estrita a partir de um clone limpo e proteção incondicional por Quality Gates automatizados no CI.

---

## 📦 2. Escopo Funcional

### O que ESTÁ no escopo (In-Scope)

1. **Inicialização do Framework:** Inicializar Next.js 16 (App Router), React 19, TypeScript e Tailwind CSS v4 na raiz do projeto, compatível com Node.js 24 LTS.
2. **Scripts Mandatórios de Qualidade:** Configurar no `package.json` os scripts:
   - `lint` (ESLint 9 com regras do Next.js).
   - `typecheck` (`tsc --noEmit`).
   - `test` (Vitest com suporte a DOM e `vitest-axe`).
   - `build` (`next build`).
   - `audit:docs` (Auditoria de integridade documental e Anti-Doc Rot).
   - `verify` (Quality gate unificado).
3. **Estilização Base & Utilitários:** Configurar Tailwind CSS v4 via `@theme` no `src/app/globals.css` com paleta em `oklch()` e a função canônica `cn()` (`clsx` + `tailwind-merge`) em `src/lib/utils.ts`. (A instalação dos componentes e primitivos Shadcn/ui é expressamente diferida para a Feature 002).
4. **Headers de Segurança (ADR 0009):** Configurar em `next.config.ts` os cabeçalhos HTTP mandatados pelo [ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md) (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`, `Content-Security-Policy-Report-Only` e `Strict-Transport-Security`).
5. **Infraestrutura de Testes:** Configurar o Vitest (`vitest.config.ts`) e criar testes de sanidade e utilitários comprovando que o runner executa com sucesso.
6. **Lockfile Determinístico:** Gerar e versionar o `package-lock.json`.
7. **Promoção do CI:** Atualizar `.github/workflows/ci.yml`, removendo a lógica provisória de guarda da Fase 1 (`check-bootstrap`) para que os gates executem de forma 100% incondicional e bloqueante via `npm ci`, incluindo a auditoria documental (`audit:docs`).

### O que NÃO está no escopo (Out-of-Scope)

- Instalação de componentes e primitivos do Shadcn/ui (Button, Card, Dialog, Input, Textarea) e componentes estruturais (Header, Hero, Footer) — _Tratados na Feature 002_.
- Server Action de formulário e integrações (Resend, Turnstile, Rate Limit) — _Tratados na Feature 003_.
- Configuração do Keystatic CMS e coleções — _Tratados na Feature 004_.
- Auditorias de produção do Lighthouse e DNS de domínio — _Tratados na Feature 005_.

---

## 🚦 3. Critérios Objetivos de Aceitação (Acceptance Criteria)

1. **Reprodutibilidade em Clone Limpo:**
   - Um ambiente limpo com Node.js 24 executa `npm ci` sem conflitos de _peer dependencies_ e sem avisos de pacotes ausentes no lockfile.
2. **Zero Erros nos Quality Gates Locais:**
   - `npm run lint` executa sem nenhum erro ou aviso bloqueante.
   - `npm run typecheck` compila os tipos TypeScript com zero erros.
   - `npm test` executa a suíte de testes com pelo menos 1 teste de sanidade verde.
   - `npm run build` compila a aplicação de produção com sucesso.
3. **CI Automatizado e Incondicional:**
   - O pipeline do GitHub Actions roda todos os 5 steps (`npm ci`, `lint`, `typecheck`, `test`, `build`) e reporta status verde baseado na execução real dos comandos.
