# Feature 001: Project Bootstrap & Quality Gates (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Pronto para Execução

---

## 📋 Checklist de Tarefas Executáveis

* [ ] **1. Inicialização Declarativa do Projeto:**
  * [ ] Criar `package.json` na raiz declarando dependências estritas do Next.js 16, React 19, Tailwind CSS v4, Zod e scripts canônicos de qualidade.
  * [ ] Configurar os arquivos base do ecossistema: `tsconfig.json`, `next.config.ts` e `eslint.config.mjs`.
  * [ ] Executar `npm install` na raiz para gerar o `package-lock.json` determinístico sem utilizar assistentes interativos ou sobrescrever a documentação.

* [ ] **2. Estruturação Base de Código em `src/`:**
  * [ ] Criar função utilitária `src/lib/utils.ts` com a função `cn()`.
  * [ ] Configurar `src/app/globals.css` com a diretiva `@theme` e variáveis de cor em `oklch()` do Tailwind v4.
  * [ ] Configurar layout base mínimo em `src/app/layout.tsx` e página inicial placeholder em `src/app/page.tsx`.

* [ ] **3. Suíte de Testes (Smoke Test):**
  * [ ] Criar `vitest.config.ts` com ambiente `jsdom` e resolução de alias `@/*`.
  * [ ] Criar teste de sanidade em `tests/sanity.test.ts` para verificar o funcionamento do runner.

* [ ] **4. Promoção do Pipeline de CI:**
  * [ ] Atualizar `.github/workflows/ci.yml` removendo a etapa provisória `check-bootstrap`.
  * [ ] Configurar a execução incondicional de `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

* [ ] **5. Execução e Validação dos Quality Gates:**
  * [ ] Executar `npm run lint` localmente (validar 0 erros).
  * [ ] Executar `npm run typecheck` localmente (validar 0 erros).
  * [ ] Executar `npm test` localmente (validar suíte verde).
  * [ ] Executar `npm run build` localmente (validar compilação de produção).

* [ ] **6. Entrega e Verificação no GitHub Actions:**
  * [ ] Gerar e versionar o `package-lock.json`.
  * [ ] Realizar commit e push do bootstrap funcional.
  * [ ] Verificar a execução verde de ponta a ponta na esteira do GitHub Actions.
