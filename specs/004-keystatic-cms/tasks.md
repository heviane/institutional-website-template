# Feature 004: Gestão de Conteúdo Baseada em Git (Keystatic CMS) — Tasks

- **Spec:** [`spec.md`](spec.md)
- **Plan:** [`plan.md`](plan.md)
- **Status:** Pendente de Execução (Aguardando Aprovação do Desenvolvedor)

---

## 📋 Checklist de Tarefas Executáveis

- [ ] **1. Instalação e Integração de Dependências do Keystatic:**
  - [ ] Instalar `@keystatic/core` e `@keystatic/next`.
  - [ ] Validar resolução determinística de dependências e execução de `npm run typecheck`.

- [ ] **2. Configuração Centralizada de Schemas (`keystatic.config.ts`):**
  - [ ] Criar `keystatic.config.ts` na raiz do projeto com suporte a Dual Mode (`local` em dev e `cloud` em produção).
  - [ ] Configurar coleções: `posts` (com Markdoc, `coverImage` e status `draft`/`published`), `services` (com ícones Lucide e diferenciais), `testimonials` e `faqs` (com ordenação).
  - [ ] Configurar singletons: `homePage` e `aboutPage`.

- [ ] **3. Criação de Dados Iniciais Semeados no Git (_Seed Data_):**
  - [ ] Criar diretórios e arquivos em `content/`:
    - `content/singletons/home.json`
    - `content/singletons/about.json`
    - `content/services/consultoria-estrategica.json`
    - `content/services/seguranca-e-conformidade.json`
    - `content/services/transformacao-e-escala.json`
    - `content/faqs/quais-servicos-oferecem.json`
    - `content/faqs/como-funciona-o-atendimento.json`
    - `content/faqs/quais-sao-os-prazos.json`
    - `content/posts/bem-vindo-ao-novo-site/index.mdoc` (publicado)
    - `content/posts/governanca-e-seguranca-digital/index.mdoc` (rascunho)

- [ ] **4. Camada de Consumo de Dados via Reader API (`src/lib/keystatic.ts`) — TDD:**
  - [ ] 🔴 **Red:** Criar testes em `tests/keystatic-reader.test.ts` validando:
    - Leitura correta do singleton `homePage`.
    - Leitura dos serviços semeados.
    - Ordenação de FAQs por campo `order`.
    - Função `getPublishedPosts()` filtrando rascunhos (`status: 'draft'`) e ordenando por data decrescente.
  - [ ] 🟢 **Green:** Implementar `src/lib/keystatic.ts` exportando `reader`, `getPublishedPosts`, `getServices` e `getFaqs`.
  - [ ] 🔵 **Refactor:** Garantir tipagem estrita e resiliência contra arquivos inexistentes.

- [ ] **5. Rotas do App Router para o Painel Administrativo:**
  - [ ] Criar `src/app/api/keystatic/[...params]/route.ts` com `makeRouteHandler`.
  - [ ] Criar `src/app/keystatic/[[...params]]/page.tsx` com `makePage`.
  - [ ] Criar `src/app/keystatic/layout.tsx` isolando o CMS do Header e Footer institucionais.
  - [ ] Criar testes em `tests/keystatic-routes.test.ts` validando exportações das rotas.

- [ ] **6. Integração do Conteúdo Dinâmico na Home Page (`src/app/page.tsx`):**
  - [ ] Atualizar `src/app/page.tsx` para consumir serviços do Keystatic via Reader API (`getServices()`), mantendo fallback gracioso.
  - [ ] Atualizar os testes em `tests/components/home.test.tsx` garantindo renderização e acessibilidade WCAG 2.1 AA (`axe`).

- [ ] **7. Execução e Homologação dos Quality Gates Locais:**
  - [ ] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.

- [ ] **8. Sincronização Documental Obrigatória, Anti-Doc Rot & Auditoria de PRs (Tarefa Final):**
  - [ ] Atualizar status da feature na tríade de governança:
    - `CHANGELOG.md`: marcar Feature 004 como concluída `[x]` sob `### 📊 Status das Features` e registrar notas da entrega sob `[Unreleased]`.
    - `README.md`: atualizar bloco de alerta de status para "Features 001 a 004 Concluídas" e indicar a Feature 005 como próxima.
    - `docs/03-project-roadmap.md`: atualizar cabeçalho da Fase 2, marcar checkboxes da Feature 004 e indicar a Feature 005.
  - [ ] Atualizar a árvore canônica em `docs/04-folder-structure.md` com os novos arquivos do CMS (`content/`, `keystatic.config.ts`, rotas e testes).
  - [ ] Aplicar o Princípio 9 (Anti-Doc Rot): substituir blocos de código implementados em `docs/` por referências diretas via links.
  - [ ] Executar e validar `npm run audit:docs` (0 erros e 0 warnings).
  - [ ] Auditar Pull Requests abertos no GitHub (`gh pr list`).
  - [ ] Realizar commit semântico e enviar push para `main`.
