# 04 - Estrutura de Pastas e Arquitetura de Código

Este documento detalha a organização de arquivos, diretórios e padrões de nomenclatura do **`institutional-website-template`**, estabelecendo convenções claras para facilitar a manutenção e garantir uma arquitetura escalável e modular.

---

## 🌳 Árvore de Diretórios do Projeto

```text
institutional-website-template/
├── .cursor/                         # Configurações e regras do editor Cursor
│   └── rules/                       # Regras de contexto para IA (.mdc)
│       └── sdd.mdc                  # Instruções de SDD vinculadas ao AGENTS.md
│
├── .github/                         # Automações e governança do GitHub
│   ├── ISSUE_TEMPLATE/              # Modelos para abertura de issues
│   ├── workflows/                   # Pipelines do GitHub Actions
│   │   └── ci.yml                   # Pipeline de CI (Lint, Typecheck, Test, Build)
│   ├── CODEOWNERS                   # Titularidade e revisão de código por diretório
│   ├── copilot-instructions.md      # Instruções de contexto para o GitHub Copilot
│   ├── dependabot.yml               # Monitoramento semanal de dependências
│   └── PULL_REQUEST_TEMPLATE.md     # Modelo padrão para Pull Requests
│
├── .vscode/                         # Configurações do VS Code
│   └── extensions.json              # Recomendações de extensões para a equipe
│
├── content/                         # Armazenamento de dados do Keystatic (Markdown/JSON)
│   ├── posts/                       # Artigos do blog (.mdoc / .json)
│   ├── services/                    # Itens de serviços oferecidos
│   ├── faqs/                        # Perguntas frequentes (FAQ)
│   ├── testimonials/                # Depoimentos de clientes
│   └── singletons/                  # Conteúdos de páginas fixas (Home, Sobre)
│
├── docs/                            # Documentação técnica e governança do projeto
│   ├── adr/                         # Architectural Decision Records (ADRs 0001 a 0014)
│   ├── 01-architecture-overview.md  # Visão geral de requisitos e decisões
│   ├── 02-environment-setup.md      # Guia de setup local e padrões de código
│   ├── 03-project-roadmap.md        # Roadmap e fases de desenvolvimento
│   ├── 04-folder-structure.md       # Este documento (mapa de pastas)
│   ├── 05-keystatic-content-model.md# Modelagem de schemas e coleções do CMS
│   ├── 06-brand-theming-guide.md    # Guia prático de personalização de marcas
│   ├── 07-client-onboarding-checklist.md # Checklist de entrega e Go-Live
│   ├── 08-architecture-review-phase1.md # Revisão arquitetural e encerramento da Fase 1
│   ├── 09-troubleshooting-and-runbook.md # Runbook de incidentes e resolução de problemas
│   ├── 10-data-flow-and-privacy-map.md # Arquitetura de fluxo de dados e conformidade LGPD
│   ├── 11-template-fork-maintenance.md # Playbook de manutenção e atualização de forks
│   └── 12-performance-and-third-parties.md # Guia de performance e scripts de terceiros
│
├── public/                          # Arquivos estáticos servidos diretamente
│   ├── images/                      # Imagens estáticas e mídias institucionais
│   │   ├── content/                 # Uploads de imagens gerenciadas pelo CMS
│   │   └── brand/                   # Logos da empresa e variações
│   ├── favicon.ico                  # Ícone de favoritos padrão
│   ├── icon.png                     # Ícone em alta resolução para navegadores modernos
│   ├── apple-touch-icon.png         # Ícone para dispositivos iOS
│   └── og.jpg                       # Imagem padrão de compartilhamento (Open Graph 1200x630)
│
├── specs/                           # Especificações executáveis de funcionalidades (SDD)
│   ├── 001-project-bootstrap/       # Artefatos da Feature 001 (spec.md, plan.md, tasks.md)
│   ├── 002-design-system-and-layout/# Artefatos da Feature 002 (spec.md, plan.md, tasks.md)
│   ├── 003-environment-and-contact-form/ # Artefatos da Feature 003 (spec.md, plan.md, tasks.md)
│   └── 004-keystatic-cms/           # Artefatos da Feature 004 (spec.md, plan.md, tasks.md)
│
├── scripts/                         # Scripts utilitários de automação e auditoria
│   └── audit-docs.mjs               # Validador de integridade documental e Anti-Doc Rot
│
├── src/                             # Código-fonte principal da aplicação
│   ├── app/                         # Rotas e layouts (Next.js App Router)
│   │   ├── (legal)/                 # Grupo de rotas legais
│   │   │   ├── layout.tsx           # Layout do grupo legal com Header e Footer
│   │   │   ├── politica-de-privacidade/
│   │   │   │   └── page.tsx         # Página estática de Política de Privacidade
│   │   │   └── termos-de-uso/
│   │   │       └── page.tsx         # Página estática de Termos de Uso
│   │   ├── actions/                 # Server Actions nativas do Next.js 16 (App Router)
│   │   │   └── contact.ts           # Server Action de envio do formulário de contato
│   │   ├── api/                     # Rotas de API HTTP (se necessário)
│   │   │   └── keystatic/           # Endpoint interno do Keystatic App Router
│   │   │       └── [...params]/
│   │   │           └── route.ts
│   │   ├── keystatic/               # Painel administrativo do CMS em /keystatic
│   │   │   └── [[...params]]/
│   │   │       └── page.tsx
│   │   ├── globals.css              # Estilos globais e tema Tailwind v4 (@theme)
│   │   ├── layout.tsx               # Layout raiz com fontes, metadados e scripts
│   │   ├── page.tsx                 # Página Inicial (Home Page institucional)
│   │   └── robots.ts                # Regras de indexação para robôs de busca (Metadata API)
│   │
│   ├── components/                  # Componentes React reutilizáveis
│   │   ├── shared/                  # Componentes compostos de layout
│   │   │   ├── header/              # Barra de navegação e menu mobile
│   │   │   │   ├── header.tsx       # RSC: Cabeçalho institucional com links do siteConfig
│   │   │   │   └── mobile-nav.tsx   # 'use client': Menu responsivo via Radix Dialog
│   │   │   ├── footer/              # Rodapé corporativo e links legais
│   │   │   │   └── footer.tsx       # RSC: Rodapé institucional com links legais e contato
│   │   │   ├── hero/                # Seção Hero com CTA principal
│   │   │   │   └── hero.tsx         # RSC: Hero agnóstico de template com HeroProps
│   │   │   ├── contact-form/        # Formulário de contato acessível
│   │   │   │   └── contact-form.tsx # 'use client': Formulário reativo com RHF, Zod e Turnstile
│   │   │   └── floating-whatsapp/   # Botão flutuante de atendimento WhatsApp
│   │   │       └── floating-whatsapp.tsx # Botão FAB flutuante acessível (56x56px)
│   │   └── ui/                      # Primitivos atômicos do Shadcn/ui (Radix UI)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   │
│   ├── config/                      # Configurações globais desacopladas
│   │   └── site.ts                  # Centralização única de dados do cliente
│   │
│   ├── lib/                         # Utilitários, clientes de API e schemas
│   │   ├── schemas/                 # Schemas de validação Zod
│   │   │   └── contact.ts           # Schema do formulário e opt-in LGPD
│   │   ├── keystatic.ts             # Leitor de dados estáticos do Keystatic (Reader API)
│   │   ├── rate-limit.ts            # Rate limiting com hash de IP e TTL (Upstash / Map)
│   │   ├── resend.ts                # Instância inicializada do cliente Resend
│   │   └── utils.ts                 # Função utilitária cn() do Shadcn/ui
│   │
│   ├── types/                       # Declarações de tipos globais do TypeScript
│   │   └── index.d.ts
│   │
│   └── env/                         # Validação segregada de variáveis de ambiente no build via Zod
│       ├── client.ts                # Schema e exportação de clientEnv (NEXT_PUBLIC_*)
│       └── server.ts                # Schema e exportação de serverEnv (com import "server-only")
│
├── tests/                           # Suíte de testes automatizados (Vitest + axe-core)
│   ├── components/                  # Testes unitários de componentes e acessibilidade (WCAG 2.1 AA)
│   │   ├── button.test.tsx          # Teste de variantes do Button, asChild e conformidade WCAG
│   │   ├── card.test.tsx            # Teste de composição do Card e conformidade WCAG
│   │   ├── contact-form.test.tsx    # Teste de validação reativa e acessibilidade do formulário
│   │   ├── dialog.test.tsx          # Teste de ciclo de foco do Dialog (foco, Escape e WCAG)
│   │   ├── floating-whatsapp.test.tsx # Teste do botão flutuante FAB de WhatsApp
│   │   ├── home.test.tsx            # Teste de integração do Layout Shell Demo e acessibilidade WCAG
│   │   └── layout.test.tsx          # Matriz de testes funcionais (Casos 1, 2, 4, 5) e acessibilidade WCAG
│   ├── contact-action.test.ts       # Teste da Server Action em 3 camadas e Fail-Closed
│   ├── contact-schema.test.ts       # Teste de encadeamento do Zod 3 e regras de campos
│   ├── env.test.ts                  # Teste de validação segregada de variáveis de ambiente
│   ├── legal-pages.test.tsx         # Teste de fidelidade e acessibilidade das páginas legais
│   ├── rate-limit.test.ts           # Teste de rate limit atômico por Lua script e hash de IP
│   ├── sanity.test.ts               # Teste de sanidade do ambiente de testes
│   ├── setup.ts                     # Configuração de matchers do vitest-axe
│   ├── site-config.test.ts          # Validação do contrato do objeto de marca siteConfig
│   └── utils.test.ts                # Testes unitários de funções utilitárias (cn, links de contato)
│
├── .editorconfig                    # Padronização de indentação e quebras de linha
├── .env.example                     # Modelo documentado de variáveis de ambiente
├── .gitattributes                   # Normalização canônica de quebras de linha (LF)
├── .gitignore                       # Arquivos e pastas excluídos do Git
├── .nvmrc                           # Versão LTS travada do Node.js (24)
├── .prettierrc                      # Configuração de formatação e ordenação do Tailwind
├── AGENTS.md                        # Hub central de diretrizes canônicas para agentes de IA (SDD)
├── CHANGELOG.md                     # Histórico estruturado de mudanças (Keep a Changelog)
├── CLAUDE.md                        # Diretrizes para Claude Code (@AGENTS.md)
├── components.json                  # Configuração do Shadcn/ui para Tailwind CSS v4
├── CONTRIBUTING.md                  # Guia de contribuição, padrões SDD e Quality Gates
├── eslint.config.mjs                # Configuração do ESLint 9 (Flat Config)
├── keystatic.config.ts              # Definição de schemas e coleções do Keystatic
├── LICENSE                          # Licença do projeto (MIT)
├── lighthouserc.json                # Metas e orçamentos de performance do Lighthouse CI
├── next.config.ts                   # Configurações do Next.js e Security Headers
├── package.json                     # Metadados e dependências do projeto
├── package-lock.json                # Versionamento determinístico de dependências (npm ci)
├── postcss.config.mjs               # Plugin do Tailwind CSS v4 para processamento de estilos
├── README.md                        # Apresentação do projeto e guia de uso
├── SECURITY.md                      # Política de segurança e reporte responsável
├── tsconfig.json                    # Configurações do TypeScript e path aliases (@/*)
└── vitest.config.ts                 # Configuração da suíte de testes Vitest (jsdom e vitest-axe)
```

---

## 🎯 Divisão de Responsabilidades e Zonas de Manutenção

Conforme formalizado na **ADR 0010**, os arquivos do repositório são estrategicamente categorizados em duas zonas para permitir sincronização de melhorias do template sem gerar conflitos de código com personalizações de clientes:

### 1. Zona Imune do Cliente (Preservada em Atualizações)
São os arquivos que contêm informações de marca, textos de negócio e imagens específicas do cliente atendido. **Nunca devem ser sobrescritos por atualizações do template**:
* `src/config/site.ts`: Nome da empresa, telefones, redes sociais, endereço, CNPJ e e-mail do DPO.
* `content/**`: Artigos de blog, serviços cadastrados, depoimentos e textos em Markdown.
* `public/images/content/**`: Fotografias e banners institucionais do cliente.
* `.env.local`: Chaves de API e segredos de produção específicos da conta do cliente.

### 2. Zona de Engenharia do Template (Atualizável via Upstream)
São os arquivos que representam a arquitetura, segurança, performance e esteira de automação do projeto:
* `src/app/actions/**`: Server Actions e lógica de envio de e-mails.
* `src/components/ui/**`: Primitivos do Shadcn/ui e regras de acessibilidade.
* `src/env/**` e `next.config.ts`: Validações de ambiente e cabeçalhos de segurança HTTP.
* `.github/**`: Workflows de CI/CD e configuração do Dependabot.
* `package.json`: Dependências e scripts de automação.

---

## 🏛️ Por que não há separação física em pastas `frontend/` e `backend/`?

Uma dúvida recorrente de engenheiros e novos colaboradores com experiência em arquiteturas desacopladas clássicas (ex.: Single Page Applications comunicando-se com APIs REST em servidores dedicados) é por que este projeto não organiza seu código-fonte em duas pastas separadas:

```text
# ❌ Abordagem Tradicional em Duas Pastas (Rejeitada no Template)
meu-projeto/
├── frontend/   # SPA em React/Vite
└── backend/    # Servidor Express/NestJS com API REST
```

A resposta técnica e os trade-offs estão deliberados formalmente no [**ADR 0013**](adr/0013-arquitetura-unificada-fullstack-vs-separacao-fisica.md). Em resumo:

1. **Paradigma do Next.js 16 App Router (React Server Components):** Em Next.js App Router, componentes de servidor renderizam estaticamente no servidor Node.js e componentes interativos rodam no navegador com `'use client'`. Ambos compõem o mesmo fluxo unificado de renderização em `src/app/` e `src/components/`. Criar pastas físicas quebraria o modelo mental de co-locação.
2. **Arquitetura Zero-Database (Sem Servidor Contínuo):** O template não possui um servidor backend residente ou banco de dados relacional tradicional (PostgreSQL/MySQL). A lógica transacional existe sob demanda em Server Actions milissegúndicas com encaminhamento via Resend API ([ADR 0003](adr/0003-estrategia-de-formularios.md) e [ADR 0007](adr/0007-conformidade-lgpd-e-privacidade.md)).
3. **Simplicidade Operacional e Zero Overengineering (Princípio 1 do AGENTS.md):** Uma divisão física exigiria monorepo (Turborepo/Nx), múltiplos `package.json`, pipelines duplicados no CI e duplicação ou sincronização artificial de schemas Zod e tipos TypeScript.

### 🛡️ Segregação Lógica de Fronteiras no Código (`src/`)

Em vez de separação física de pastas, o isolamento e a segurança são garantidos por **fronteiras lógicas estritas** asseguradas pelo compilador do Next.js e TypeScript:

| Fronteira Lógica | Papel Arquitetural | Onde Fica no Código | Garantia de Isolamento |
| :--- | :--- | :--- | :--- |
| **Backend (Segredos)** | Chaves de API privadas e segredos de ambiente | [`src/env/server.ts`](../src/env/server.ts) | Blindado com `import "server-only"`; quebra o build se importado no bundle do cliente ([ADR 0009](adr/0009-seguranca-headers-e-validacao-de-ambiente.md)). |
| **Backend (Transacional)** | Processamento de formulários e envio de e-mails | [`src/app/actions/contact.ts`](../src/app/actions/contact.ts) | Diretiva `'use server'`; executado puramente no servidor Next.js sem expor credenciais ([ADR 0003](adr/0003-estrategia-de-formularios.md)). |
| **Backend (Defesa & Cache)** | Rate Limiting e cálculo de hash HMAC de IP | [`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts) | Execução serverless no runtime de borda/servidor sem persistência relacional. |
| **Backend (CMS Reader)** | Leitura de Markdown e dados estáticos no build | [`src/lib/keystatic.ts`](../src/lib/keystatic.ts) | Keystatic Reader API acessando o sistema de arquivos apenas durante o build estático (SSG/ISR). |
| **Contrato Compartilhado** | Validação de tipos e schemas de entrada | [`src/lib/schemas/`](../src/lib/schemas/) | Tipos Zod consumidos simultaneamente pelo formulário reativo (UI) e pela Server Action (Server). |
| **Frontend (UI & Layout)** | Componentes visuais, páginas e acessibilidade | [`src/components/`](../src/components/) e `src/app/` | React Server Components por padrão; `'use client'` isolado exclusivamente nos componentes com interatividade. |
| **Frontend (Público)** | Variáveis e chaves públicas de widgets | [`src/env/client.ts`](../src/env/client.ts) | Prefixadas obrigatoriamente com `NEXT_PUBLIC_*`. |

Para detalhes aprofundados sobre exceções (ex.: quando criar uma pasta separada caso surja um app móvel nativo ou microserviços persistentes), consulte o [**ADR 0013**](adr/0013-arquitetura-unificada-fullstack-vs-separacao-fisica.md).

---

## 🏷️ Convenções de Nomenclatura do Projeto

* **Rotas e Pastas do App Router (`src/app/`):** Nomes em `kebab-case` minúsculo (ex.: `politica-de-privacidade/page.tsx`).
* **Componentes React (`src/components/`):** Arquivos em `kebab-case` e componentes internos nomeados em `PascalCase` (ex.: arquivo `contact-form.tsx` exportando `export function ContactForm()`).
* **Funções Utilitárias e Hooks:** Nomes em `camelCase` (ex.: `cn()`, `useReducedMotion()`).
* **Schemas do Zod:** Sufixados com `Schema` em `camelCase` (ex.: `contactFormSchema`).
* **Path Aliases:** Sempre utilizar o prefixo `@/` mapeado para a pasta `src/` (ex.: `@/components/ui/button`, `@/config/site`), evitando caminhos relativos profundos (`../../`).

