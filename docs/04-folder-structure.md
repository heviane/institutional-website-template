# 04 - Estrutura de Pastas e Arquitetura de Código

Este documento detalha a organização de arquivos, diretórios e padrões de nomenclatura do **`institutional-website-template`**, estabelecendo convenções claras para facilitar a manutenção e garantir uma arquitetura escalável e modular.

---

## 🌳 Árvore de Diretórios do Projeto

```text
institutional-website-template/
├── .cursor/                         # Configurações do editor Cursor
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
├── content/                         # Armazenamento de dados do Keystatic (Markdown/JSON)
│   ├── posts/                       # Artigos do blog (.mdoc / .json)
│   ├── services/                    # Itens de serviços oferecidos
│   ├── faqs/                        # Perguntas frequentes (FAQ)
│   ├── testimonials/                # Depoimentos de clientes
│   └── singletons/                  # Conteúdos de páginas fixas (Home, Sobre)
│
├── docs/                            # Documentação técnica e governança do projeto
│   ├── adr/                         # Architectural Decision Records (ADRs 0001 a 0011)
│   ├── 01-architecture-overview.md  # Visão geral de requisitos e decisões
│   ├── 02-environment-setup.md      # Guia de setup local e padrões de código
│   ├── 03-project-roadmap.md        # Roadmap e fases de desenvolvimento
│   ├── 04-folder-structure.md       # Este documento (mapa de pastas)
│   ├── 05-keystatic-content-model.md# Modelagem de schemas e coleções do CMS
│   ├── 06-brand-theming-guide.md    # Guia prático de personalização de marcas
│   ├── 07-client-onboarding-checklist.md # Checklist de entrega e Go-Live
│   └── 08-architecture-review-phase1.md # Revisão arquitetural e encerramento da Fase 1
│
├── public/                          # Arquivos estáticos servidos diretamente
│   ├── images/                      # Imagens estáticas e mídias institucionais
│   │   ├── content/                 # Uploads de imagens gerenciadas pelo CMS
│   │   └── brand/                   # Logos da empresa e variações
│   ├── favicon.ico                  # Ícone de favoritos padrão
│   ├── icon.png                     # Ícone em alta resolução para navegadores modernos
│   ├── apple-touch-icon.png         # Ícone para dispositivos iOS
│   ├── og.jpg                       # Imagem padrão de compartilhamento (Open Graph 1200x630)
│   └── robots.txt                   # Instruções básicas para indexadores
│
├── src/                             # Código-fonte principal da aplicação
│   ├── app/                         # Rotas e layouts (Next.js App Router)
│   │   ├── (legal)/                 # Grupo de rotas legais
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
│   │   └── page.tsx                 # Página Inicial (Home Page institucional)
│   │
│   ├── components/                  # Componentes React reutilizáveis
│   │   ├── shared/                  # Componentes compostos de layout
│   │   │   ├── header/              # Barra de navegação e menu mobile
│   │   │   ├── footer/              # Rodapé corporativo e links legais
│   │   │   ├── hero/                # Seção Hero com CTA principal
│   │   │   ├── contact-form/        # Formulário de contato acessível
│   │   │   └── mode-toggle/         # Alternador de tema Claro / Escuro
│   │   └── ui/                      # Primitivos atômicos do Shadcn/ui (Radix UI)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       └── toast.tsx
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
│   └── env.ts                       # Validação de variáveis de ambiente no build via Zod
│
├── .editorconfig                    # Padronização de indentação e quebras de linha
├── .env.example                     # Modelo documentado de variáveis de ambiente
├── .gitattributes                   # Normalização canônica de quebras de linha (LF)
├── .gitignore                       # Arquivos e pastas excluídos do Git
├── .nvmrc                           # Versão LTS travada do Node.js (24)
├── .prettierrc                      # Configuração de formatação e ordenação do Tailwind
├── AGENTS.md                        # Hub central de diretrizes canônicas para agentes de IA (SDD)
├── AI-RULES.md                      # Ponteiro canônico retrocompatível para AGENTS.md
├── CHANGELOG.md                     # Histórico estruturado de mudanças (Keep a Changelog)
├── CLAUDE.md                        # Diretrizes para Claude Code (@AGENTS.md)
├── CONTRIBUTING.md                  # Guia de contribuição, padrões SDD e Quality Gates
├── eslint.config.mjs                # Configuração do ESLint 9 (Flat Config)
├── keystatic.config.ts              # Definição de schemas e coleções do Keystatic
├── LICENSE                          # Licença do projeto (MIT)
├── lighthouserc.json                # Metas e orçamentos de performance do Lighthouse CI
├── next.config.ts                   # Configurações do Next.js e Security Headers
├── package.json                     # Metadados e dependências do projeto
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
* `src/env.ts` e `next.config.ts`: Validações de ambiente e cabeçalhos de segurança HTTP.
* `.github/**`: Workflows de CI/CD e configuração do Dependabot.
* `package.json`: Dependências e scripts de automação.

---

## 🏷️ Convenções de Nomenclatura do Projeto

* **Rotas e Pastas do App Router (`src/app/`):** Nomes em `kebab-case` minúsculo (ex.: `politica-de-privacidade/page.tsx`).
* **Componentes React (`src/components/`):** Arquivos em `kebab-case` e componentes internos nomeados em `PascalCase` (ex.: arquivo `contact-form.tsx` exportando `export function ContactForm()`).
* **Funções Utilitárias e Hooks:** Nomes em `camelCase` (ex.: `cn()`, `useReducedMotion()`).
* **Schemas do Zod:** Sufixados com `Schema` em `camelCase` (ex.: `contactFormSchema`).
* **Path Aliases:** Sempre utilizar o prefixo `@/` mapeado para a pasta `src/` (ex.: `@/components/ui/button`, `@/config/site`), evitando caminhos relativos profundos (`../../`).

