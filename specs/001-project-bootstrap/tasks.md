# Feature 001: Project Bootstrap & Quality Gates (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Em Validação de Entrega (Quality Gates Locais 100% Verdes)

---

## 📋 Checklist de Tarefas Executáveis

* [x] **1. Inicialização Declarativa do Projeto:**
  * [x] Criar `package.json` na raiz declarando dependências estritas do Next.js 16, React 19, Tailwind CSS v4, Zod e scripts canônicos de qualidade.
  * [x] Configurar os arquivos base do ecossistema: `tsconfig.json`, `next.config.ts` e `eslint.config.mjs`.
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
  * [x] Configurar a execução incondicional de `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

* [x] **5. Execução e Validação dos Quality Gates:**
  * [x] Executar `npm run lint` localmente (validar 0 erros).
  * [x] Executar `npm run typecheck` localmente (validar 0 erros).
  * [x] Executar `npm test` localmente (validar suíte verde).
  * [x] Executar `npm run build` localmente (validar compilação de produção).

* [ ] **6. Entrega e Verificação no GitHub Actions:**
  * [ ] Gerar e versionar o `package-lock.json`.
  * [ ] Realizar commit e push do bootstrap funcional.
  * [ ] Verificar a execução verde de ponta a ponta na esteira do GitHub Actions.
