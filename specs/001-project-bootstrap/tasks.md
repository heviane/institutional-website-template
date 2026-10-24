# Feature 001: Project Bootstrap & Quality Gates (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Pronto para Execução

---

## 📋 Checklist de Tarefas Executáveis

* [ ] **1. Inicialização do Projeto:**
  * [ ] Executar o setup base do Next.js 16 com TypeScript e Tailwind CSS v4 na raiz sem sobrescrever a documentação existente.
  * [ ] Garantir que o diretório `src/` seja utilizado para o código da aplicação.

* [ ] **2. Configuração de Scripts e Dependências:**
  * [ ] Atualizar `package.json` com os scripts canônicos:
    * `"lint": "next lint"`
    * `"typecheck": "tsc --noEmit"`
    * `"test": "vitest run"`
    * `"build": "next build"`
  * [ ] Instalar as dependências de teste: `vitest`, `@testing-library/react`, `jsdom` e `vitest-axe`.
  * [ ] Instalar utilitários de classe do Shadcn/ui: `clsx` e `tailwind-merge`.

* [ ] **3. Estruturação Base de Código:**
  * [ ] Criar função utilitária `src/lib/utils.ts` com a função `cn()`.
  * [ ] Configurar `src/app/globals.css` com a sintaxe `@theme` do Tailwind v4.
  * [ ] Configurar layout base mínimo em `src/app/layout.tsx` e página em `src/app/page.tsx`.

* [ ] **4. Suíte de Testes (Smoke Test):**
  * [ ] Criar `vitest.config.ts` com ambiente `jsdom` e resolução de alias `@/*`.
  * [ ] Criar teste de sanidade em `tests/sanity.test.ts` para verificar o funcionamento do runner.

* [ ] **5. Promoção do Pipeline de CI:**
  * [ ] Atualizar `.github/workflows/ci.yml` removendo a etapa provisória `check-bootstrap`.
  * [ ] Configurar a execução incondicional de `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.

* [ ] **6. Execução e Validação dos Quality Gates:**
  * [ ] Executar `npm run lint` localmente (validar 0 erros).
  * [ ] Executar `npm run typecheck` localmente (validar 0 erros).
  * [ ] Executar `npm test` localmente (validar suíte verde).
  * [ ] Executar `npm run build` localmente (validar compilação de produção).

* [ ] **7. Entrega e Verificação no GitHub Actions:**
  * [ ] Gerar e versionar o `package-lock.json`.
  * [ ] Realizar commit e push do bootstrap funcional.
  * [ ] Verificar a execução verde de ponta a ponta na esteira do GitHub Actions.
