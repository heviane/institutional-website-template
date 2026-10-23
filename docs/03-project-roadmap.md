# 🗺️ Project Roadmap

Este documento define o planejamento estratégico e a ordem de execução para o desenvolvimento e evolução do **`institutional-website-template`**. O objetivo é manter o foco na entrega contínua, priorizando a estabilidade do MVP (Minimum Viable Product) antes de avançar para funcionalidades avançadas.

---

## 🎯 Fases de Desenvolvimento

### 🟢 Fase 1: Fundação Documental e de Governança (Concluído)

* [x] Definição de requisitos e arquitetura de alto nível (`01-architecture-overview.md`)
* [x] Criação de Registros de Decisão Arquitetural — ADRs 0001 a 0011 e índice geral (`docs/adr/README.md`)
* [x] Estruturação da documentação técnica e guias de setup (`02-environment-setup.md`)
* [x] Documentação da estrutura de pastas e fronteiras (`04-folder-structure.md`)
* [x] Especificação do modelo de dados e schemas do CMS (`05-keystatic-content-model.md`)
* [x] Guia prático de estilização e temas por marca (`06-brand-theming-guide.md`)
* [x] Checklist operacional de onboarding e go-live de cliente (`07-client-onboarding-checklist.md`)
* [x] Configuração inicial do repositório, licença MIT, política de segurança e CI automatizado

### 🟡 Fase 2: Implementação do Core & MVP (Em Andamento)

Esta fase representa a entrega principal do template, garantindo um site institucional totalmente funcional, com formulário transacional, CMS integrado e SEO essencial de alto nível.

* **2.1. Bootstrapping Técnico:**
  * [ ] Inicialização do Next.js (App Router + TypeScript + Tailwind)
  * [ ] Instalação e configuração do Shadcn/ui & Radix UI
  * [ ] Configuração de alias (`@/*`) e scripts obrigatórios no `package.json` (`lint`, `typecheck`, `test`, `build`) ativando o CI estrito
  * [ ] Validação estrita de variáveis de ambiente com Zod (`src/env.ts`)
  * [ ] Implementação de Security Headers HTTP no `next.config.ts`
* **2.2. Arquitetura de Dados Globais:**
  * [ ] Criação da abstração de dados do cliente (`src/config/site.ts`)
  * [ ] Configuração de variáveis de tema no Tailwind (`globals.css`)
* **2.3. Layout Base e Componentes Shared:**
  * [ ] Implementação do layout raiz (`src/app/layout.tsx`) com metadados dinâmicos
  * [ ] Construção do componente `Header / Navbar` (responsivo e acessível)
  * [ ] Construção do componente `Footer`
  * [ ] Construção do componente `Hero Section`
* **2.4. Formulários & Conformidade LGPD:**
  * [ ] Configuração do schema de validação com Zod (com opt-in de privacidade)
  * [ ] Implementação do formulário com React Hook Form e checkbox de consentimento LGPD
  * [ ] Criação da Server Action (`src/app/actions/contact.ts`) com Honeypot, Turnstile e Resend API
  * [ ] Construção das páginas legais estáticas (`/politica-de-privacidade` e `/termos-de-uso`)
* **2.5. Integração com Headless CMS:**
  * [ ] Configuração inicial do Keystatic CMS (`@keystatic/next`)
  * [ ] Definição dos Schemas de Conteúdo (Páginas, Seções e Posts de Blog)
  * [ ] Leitura dos dados estáticos via arquivos Markdown/JSON em tempo de build (SSG/ISR)
* **2.6. SEO Técnico Essencial do MVP:**
  * [ ] Metadata API com metadados dinâmicos e canônicos (`src/app/layout.tsx`)
  * [ ] Geração dinâmica de sitemap XML cobrindo páginas estáticas e posts (`src/app/sitemap.ts`)
  * [ ] Geração de robots.txt com regras de indexação (`src/app/robots.ts`)
  * [ ] Tags Open Graph e Twitter Cards (`/public/og-image.jpg`)
  * [ ] Schema.org JSON-LD estruturado essencial (`Organization` e `WebSite`)
* **2.7. Qualidade Automatizada, Testes e CI/CD:**
  * [x] Configuração da automação de segurança e dependências (`.github/dependabot.yml`)
  * [x] Criação do pipeline de CI no GitHub Actions (`.github/workflows/ci.yml`)
  * [ ] Configuração do Vitest + Testing Library + `vitest-axe`
  * [ ] Criação dos testes de integridade de schemas Zod e `siteConfig`
  * [ ] Configuração dos orçamentos de performance do Lighthouse CI (`lighthouserc.json`)

### 🔵 Fase 3: Evolução e Recursos Avançados (Pós-MVP / Sob Demanda)

Funcionalidades opcionais que podem ser ativadas em projetos específicos de clientes, conforme a necessidade do negócio:

* [ ] Suporte a múltiplos idiomas (Internacionalização / i18n com tags `hreflang`)
* [ ] Implementação de Dark Mode nativo com troca de variáveis no Tailwind
* [ ] Área logada / Autenticação de usuários (se exigido pelo projeto do cliente)
* [ ] SEO avançado: Schemas JSON-LD especializados (`LocalBusiness` multi-endereço, `Product`, `Event`), índices de sitemap (`sitemap-index.xml`)
* [ ] Integração com ferramentas de análise de tráfego avançadas (Plausible / Google Analytics 4 com Cookie Banner)
* [ ] Módulos de comércio eletrônico ou checkout integrado (Stripe / Mercado Pago)

---

## 📌 Critérios de Sucesso Mensuráveis do MVP

O template será considerado pronto para homologação e uso em produção comercial quando atingir rigorosamente as seguintes metas:

### 1. Métricas de Performance e Core Web Vitals (Medição Mobile / Emulated 4G)

* **LCP (Largest Contentful Paint):** `< 2,5 s`
* **INP (Interaction to Next Paint):** `< 200 ms`
* **CLS (Cumulative Layout Shift):** `< 0,1`
* **FCP (First Contentful Paint):** `< 1,8 s`
* **TTFB (Time to First Byte):** `< 800 ms`

### 2. Google Lighthouse Scores (Mobile)

* **Performance:** `≥ 90`
* **Acessibilidade:** `≥ 95` (e **0 violações críticas ou sérias** no axe-core)
* **Melhores Práticas:** `≥ 95`
* **SEO:** `100`

### 3. Eficiência Operacional & Custo de Infraestrutura

* **Onboarding de Cliente:** Novo site institucional colocado no ar em menos de **2 horas** modificando exclusivamente `src/config/site.ts`, variáveis de `@theme` no `globals.css` e assets de `/public`.
* **Custo de Infraestrutura:** **$0/mês** para o tráfego institucional padrão do cliente utilizando os tiers gratuitos de Git, DNS e Serverless.
* **Comunicação Transacional Confiável:** Formulário de contato enviando e-mails via Resend com SPF, DKIM e DMARC validados (Score no [Mail-Tester](https://www.mail-tester.com/) `≥ 9/10`).

---
