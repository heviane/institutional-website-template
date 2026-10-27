# Feature 005: SEO Técnico Avançado & Homologação MVP — Tasks

- **Spec:** [`spec.md`](spec.md)
- **Plan:** [`plan.md`](plan.md)
- **Status:** Concluída

---

## 📋 Checklist de Tarefas Executáveis

- [x] **1. Criação dos Testes Automatizados de SEO (TDD 🔴 Red):**
  - [x] Criar `tests/seo-metadata.test.tsx` cobrindo regras de `robots()`, `sitemap()`, injeção de JSON-LD e `metadata`.
  - [x] Executar `npm test` para certificar que os testes falham antes da implementação dos arquivos.

- [x] **2. Implementação do `robots.txt` Dinâmico (`src/app/robots.ts`):**
  - [x] Criar `src/app/robots.ts` com regras de allow para `/` e disallow para `/keystatic/` e `/api/keystatic/`.
  - [x] Apontar para o sitemap canônico e host em `siteConfig.url`.

- [x] **3. Implementação do `sitemap.xml` Dinâmico (`src/app/sitemap.ts`):**
  - [x] Criar `src/app/sitemap.ts` integrando rotas estáticas institucionais.
  - [x] Consumir `getPublishedPosts()` do Keystatic garantindo inclusão de posts publicados e exclusão de rascunhos (`draft`).

- [x] **4. Componente de Dados Estruturados Schema.org JSON-LD (`src/components/shared/seo/`):**
  - [x] Criar `src/components/shared/seo/json-ld.tsx` gerando schemas válidos de `Organization` e `WebSite`.
  - [x] Integrar `<JsonLd />` e atualizar `metadata` (canonical, robots, icons) em `src/app/layout.tsx`.

- [x] **5. Execução e Homologação da Suíte de Testes (🟢 Green & 🔵 Refactor):**
  - [x] Executar `npx vitest run tests/seo-metadata.test.tsx` e validar 100% dos testes passando.
  - [x] Garantir zero violações de acessibilidade (`vitest-axe`).

- [x] **6. Homologação Técnica do MVP (Seção 2.2 do Roadmap):**
  - [x] Validar e marcar os 8 critérios objetivos de homologação em `docs/03-project-roadmap.md`:
    - [x] 1. Validação de Ambientes e Segregação de Envs.
    - [x] 2. Compatibilidade Prática de Dependências & Lockfile.
    - [x] 3. Bateria de Testes do Formulário & Server Actions.
    - [x] 4. Autonomia Real de Conteúdo e CMS.
    - [x] 5. Acessibilidade e Performance com Evidências Registradas.
    - [x] 6. Governança de Privacidade e Fidelidade das Páginas Legais.
    - [x] 7. Validação Prática de Atualizações do Template & Automação de Patches.
    - [x] 8. Homologação Piloto Ponta a Ponta.

- [x] **7. Execução e Homologação dos Quality Gates Locais:**
  - [x] Executar `npm run verify` e certificar que todos os 6 passos (`audit:docs`, `format:check`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.

- [x] **8. Sincronização Documental Obrigatória, Anti-Doc Rot & Auditoria de PRs (Tarefa Final do MVP):**
  - [x] Atualizar status da feature e conclusão da Fase 2 na tríade de governança:
    - `CHANGELOG.md`: marcar Feature 005 como concluída `[x]`, declarar conclusão da Fase 2 e registrar notas da entrega sob `[Unreleased]`.
    - `README.md`: atualizar bloco de alerta de status para "Features 001, 002, 003, 004 e 005 Concluídas".
    - `docs/03-project-roadmap.md`: atualizar cabeçalho da Fase 2 para concluída.
  - [x] Atualizar a árvore canônica em `docs/04-folder-structure.md` com os novos arquivos (`src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/shared/seo/json-ld.tsx`, `tests/seo-metadata.test.tsx`).
  - [x] Aplicar o Princípio 9 (Anti-Doc Rot) na documentação.
  - [x] Executar e validar `npm run audit:docs` (0 erros e 0 warnings).
  - [x] Auditar Pull Requests abertos no GitHub (`gh pr list`).
  - [x] Realizar commit semântico e enviar push para `main`.
