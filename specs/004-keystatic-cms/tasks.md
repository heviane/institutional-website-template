# Feature 004: Gestão de Conteúdo Baseada em Git (Keystatic CMS) — Tasks

- **Spec:** [`spec.md`](spec.md)
- **Plan:** [`plan.md`](plan.md)
- **Status:** Concluída

---

## 📋 Checklist de Tarefas Executáveis

- [x] **1. Instalação e Integração de Dependências do Keystatic:**
  - [x] Instalar `@keystatic/core` e `@keystatic/next`.
  - [x] Validar resolução determinística de dependências e execução de `npm run typecheck`.

- [x] **2. Configuração Centralizada de Schemas (`keystatic.config.ts`):**
  - [x] Criar `keystatic.config.ts` na raiz do projeto com suporte a Dual Mode (`local` em dev e `cloud` em produção).
  - [x] Configurar coleções: `posts` (com Markdoc, `coverImage` e status `draft`/`published`), `services` (com ícones Lucide e diferenciais), `testimonials` e `faqs` (com ordenação).
  - [x] Configurar singletons: `homePage` e `aboutPage`.

- [x] **3. Criação de Dados Iniciais Semeados no Git (_Seed Data_):**
  - [x] Criar diretórios e arquivos em `content/`:
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

- [x] **4. Camada de Consumo de Dados via Reader API (`src/lib/keystatic.ts`) — TDD:**
  - [x] 🔴 **Red:** Criar testes em `tests/keystatic-reader.test.ts` validando:
    - Leitura correta do singleton `homePage`.
    - Leitura dos serviços semeados.
    - Ordenação de FAQs por campo `order`.
    - Função `getPublishedPosts()` filtrando rascunhos (`status: 'draft'`) e ordenando por data decrescente.
  - [x] 🟢 **Green:** Implementar `src/lib/keystatic.ts` exportando `reader`, `getPublishedPosts`, `getServices` e `getFaqs`.
  - [x] 🔵 **Refactor:** Garantir tipagem estrita e resiliência contra arquivos inexistentes.

- [x] **5. Rotas do App Router para o Painel Administrativo:**
  - [x] Criar `src/app/api/keystatic/[...params]/route.ts` com `makeRouteHandler`.
  - [x] Criar `src/app/keystatic/[[...params]]/page.tsx` com `makePage`.
  - [x] Criar `src/app/keystatic/layout.tsx` isolando o CMS do Header e Footer institucionais.
  - [x] Criar testes em `tests/keystatic-routes.test.tsx` validando exportações das rotas.

- [x] **6. Integração do Conteúdo Dinâmico na Home Page (`src/app/page.tsx`):**
  - [x] Atualizar `src/app/page.tsx` para consumir serviços do Keystatic via Reader API (`getServices()`), mantendo fallback gracioso.
  - [x] Atualizar os testes em `tests/components/home.test.tsx` garantindo renderização e acessibilidade WCAG 2.1 AA (`axe`).

- [x] **7. Execução e Homologação dos Quality Gates Locais:**
  - [x] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.

- [x] **8. Sincronização Documental Obrigatória, Anti-Doc Rot & Auditoria de PRs (Tarefa Final):**
  - [x] Atualizar status da feature na tríade de governança:
    - `CHANGELOG.md`: marcar Feature 004 como concluída `[x]` sob `### 📊 Status das Features` e registrar notas da entrega sob `[Unreleased]`.
    - `README.md`: atualizar bloco de alerta de status para "Features 001, 002, 003 e 004 Concluídas" e indicar a Feature 005 como próxima.
    - `docs/03-project-roadmap.md`: atualizar cabeçalho da Fase 2, marcar checkboxes da Feature 004 e indicar a Feature 005.
  - [x] Atualizar a árvore canônica em `docs/04-folder-structure.md` com os novos arquivos do CMS (`content/`, `keystatic.config.ts`, rotas e testes).
  - [x] Aplicar o Princípio 9 (Anti-Doc Rot): substituir blocos de código implementados em `docs/` por referências diretas via links.
  - [x] Executar e validar `npm run audit:docs` (0 erros e 0 warnings).
  - [x] Auditar Pull Requests abertos no GitHub (`gh pr list`).
  - [x] Realizar commit semântico e enviar push para `main`.
