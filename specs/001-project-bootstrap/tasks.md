# Feature 001: Project Bootstrap & Quality Gates (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Concluída (Quality Gates Locais e CI 100% Verdes)

---

## 📋 Checklist de Tarefas Executáveis

* [x] **1. Inicialização Declarativa do Projeto:**
  * [x] Criar `package.json` na raiz declarando dependências estritas do Next.js 16, React 19, Tailwind CSS v4, Zod e scripts canônicos de qualidade (`lint`, `typecheck`, `test`, `build`, `audit:docs`, `verify`).
  * [x] Configurar os arquivos base do ecossistema: `tsconfig.json`, `next.config.ts` e `eslint.config.mjs`.
  * [x] Configurar headers de segurança HTTP em `next.config.ts` conforme especificado no [ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md).
  * [x] Executar `npm install` na raiz para gerar o `package-lock.json` determinístico sem utilizar assistentes interativos ou sobrescrever a documentação.

* [x] **2. Estruturação Base de Código em `src/`:**
  * [x] Criar função utilitária `src/lib/utils.ts` com a função `cn()`.
  * [x] Configurar `src/app/globals.css` com a diretiva `@theme` e variáveis de cor em `oklch()` do Tailwind v4.
  * [x] Configurar layout base mínimo em `src/app/layout.tsx` e página inicial placeholder em `src/app/page.tsx`.

* [x] **3. Suíte de Testes (Smoke Test):**
  * [x] Criar `vitest.config.ts` com ambiente `jsdom` e resolução de alias `@/*`.
  * [x] Criar teste de sanidade em `tests/sanity.test.ts` para verificar o funcionamento do runner.

* [x] **4. Promoção do Pipeline de CI:**
  * [x] Atualizar `.github/workflows/ci.yml` removendo a etapa provisória `check-bootstrap`.
  * [x] Configurar a execução incondicional de `npm ci`, `npm run audit:docs`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` utilizando `actions/checkout@v7` e `actions/setup-node@v7`.

* [x] **5. Execução e Validação dos Quality Gates:**
  * [x] Executar `npm run audit:docs` localmente (validar 0 erros).
  * [x] Executar `npm run lint` localmente (validar 0 erros).
  * [x] Executar `npm run typecheck` localmente (validar 0 erros).
  * [x] Executar `npm test` localmente (validar suíte verde).
  * [x] Executar `npm run build` localmente (validar compilação de produção).

* [x] **6. Entrega e Verificação no GitHub Actions:**
  * [x] Gerar e versionar o `package-lock.json`.
  * [x] Realizar commit e push do bootstrap funcional.
  * [x] Verificar a execução verde de ponta a ponta na esteira do GitHub Actions.

* [x] **7. Sincronização Documental & Anti-Doc Rot (Mandatória):**
  * [x] Atualização de status da Feature 001 como Concluída no `README.md` e em `docs/03-project-roadmap.md`.
  * [x] Inclusão de todos os novos arquivos criados (`src/`, `tests/`, `next.config.ts`, etc.) na árvore canônica de `docs/04-folder-structure.md`.
  * [x] Aplicação do Princípio 9 (Anti-Doc Rot): substituir blocos de código implementados em `docs/` por referências diretas via links.
  * [x] Registro da entrega da Feature 001 no `CHANGELOG.md` sob `[Unreleased]`.
  * [x] Execução e validação obrigatória do script: `npm run audit:docs` (0 erros).
