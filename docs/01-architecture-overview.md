# 01 - Architecture Overview

**Projeto:** Website Institucional (Template - Boilerplate)
Este é o documento de Especificação e Planejamento da Arquitetura para a construção de um template genérico de website institucional, projetado como ponto de partida reutilizável para projetos freelance e comerciais.

> **Planejamento Estratégico e Ciclo de Vida do Projeto:**
> O projeto é estruturado em três fases bem delimitadas:
> * **Fase 1: Fundação Documental e de Governança (Concluída)** — Decisões arquiteturais (ADRs 0001 a 0011), governança de código, automação de CI/CD e documentação operacional completa.
> * **Fase 2: Core & MVP do Template (Aguardando Início da Implementação)** — Implementação do site institucional completo, acessível, seguro e com gestão de conteúdo (Keystatic) e formulários transacionais (Resend + Turnstile).
> * **Fase 3: Expansões Pós-MVP / Sob Demanda** — Módulos opcionais ativados conforme as necessidades específicas de cada cliente (i18n, dark mode dinâmico, área logada, sitemaps indexados).

---

## 🎯 Objetivos e Pilares Arquiteturais

Criar um template modular, de fácil personalização e pronto para reaproveitamento comercial, priorizando quatro pilares inegociáveis:

1. **Alta performance (SEO e Core Web Vitals):** LCP < 2,5 s, INP < 200 ms e CLS < 0,1 em conexões móveis.
2. **Rapidez no desenvolvimento e reaproveitamento de código:** Onboarding de novo cliente em menos de 2 horas.
3. **Infraestrutura de baixo custo e sustentável:** Priorizar serviços gratuitos ou de baixo custo quando compatíveis com os requisitos técnicos, operacionais e comerciais de cada cliente, sem assumir promessas irrealistas de gratuidade perpétua.
4. **Autonomia do cliente para gerenciar conteúdos:** Painel visual amigável via Keystatic CMS sem atrito de Git.

---

## 🏗️ Requisitos e Camadas do Sistema

### 1. Framework e Rendering (Espinha Dorsal)

* **Next.js 16 (React 19 / App Router - Active LTS):**
  * **Fase 2 (Core & MVP do Template):** Foco em renderização estática ultra performática (SSG/ISR) para páginas institucionais com Server Actions nativas (`'use server'`).
  * **Fase 3 (Expansões Pós-MVP / Sob Demanda):** Preparado para rotas autenticadas, catálogos dinâmicos e integrações de APIs externas complexas.

### 2. Estilização, Design System e Acessibilidade

* **Tailwind CSS v4:** Motor de estilização moderno configurado via diretiva `@theme` em CSS nativo (`src/app/globals.css`), dispensando arquivos de configuração JavaScript intermediários.
* **Shadcn/ui & Radix UI:** Componentes de interface acessíveis (WCAG 2.1 AA), headless e desacoplados, cujos fontes ficam diretamente na base do código do projeto para fácil customização.

### 3. SEO Técnico, Metadados e Performance

* **Mínimo Essencial do MVP (Fase 2):**
  * **Next.js Metadata API:** Configuração centralizada de metadados dinâmicos e estáticos (`title`, `description`, `canonical`, `keywords`) sincronizados com `src/config/site.ts`.
  * **Open Graph e Twitter Cards:** Imagens sociais (`/public/og-image.jpg`) pré-configuradas para compartilhamento rico.
  * **Sitemap XML (`src/app/sitemap.ts`):** Geração automática de `/sitemap.xml` cobrindo todas as rotas estáticas e os artigos publicados via Keystatic.
  * **Robots TXT (`src/app/robots.ts`):** Regras de indexação para robôs de busca e apontamento do sitemap.
  * **Schema.org JSON-LD (Essencial):** Injeção estruturada dos tipos `Organization` e `WebSite` no `<head>` do layout raiz para enriquecer snippets de busca do Google.
  * **Next/Image:** Conversão automática para WebP/AVIF, dimensões explícitas para evitar CLS e lazy loading inteligente.
* **Recursos Avançados Pós-MVP (Fase 3):**
  * Schemas JSON-LD avançados (`LocalBusiness` multi-endereço, `Product`, `Event`, `Article` completo).
  * Sitemaps segmentados e indexados (`sitemap-index.xml`) para catálogos com milhares de URLs.
  * Suporte a SEO internacional (`hreflang` e i18n).

### 4. Gestão de Conteúdo (Headless CMS)

* **Keystatic (Git-Based CMS):**
  * Armazena artigos de blog, serviços e dados institucionais em arquivos Markdown/JSON diretamente no repositório GitHub.
  * Elimina custos recorrentes de banco de dados e oferece um painel de edição visual amigável (`/keystatic`) integrado ao Keystatic Cloud para editores do cliente final.

### 5. Formulários, Validação e Comunicação Transacional

* **React Hook Form:** Gerenciamento performático do estado de formulários via referências não controladas no cliente.
* **Zod:** Validação estrita de schemas e tipos, compartilhado entre o cliente e o servidor.
* **Server Actions (`src/app/actions/contact.ts`):** Processamento tipado nativo no servidor tratado como fronteira pública não confiável, com validação obrigatória via Zod e sanitização de respostas de erro.
* **Defesa Anti-Spam em 3 Camadas (veja [ADR 0011](adr/0011-defesa-antispam-e-protecao-de-formularios.md)):**
  1. *Honeypot:* Campo oculto via CSS para descarte silencioso de bots simples.
  2. *Cloudflare Turnstile:* Desafio técnico de segurança sem cookies de rastreamento publicitário e sem fricção visual.
  3. *Rate Limiting por IP:* Teto configurável (ex: 5 submissões/hora) via Upstash Redis em produção (ou Map em dev) contra envios repetitivos da mesma máquina.

### 6. Interface, Animações e Ícones

* **Lucide Icons:** Biblioteca de ícones vetorizados leve e moderna.
* **Motion (`motion/react`):** Microinterações de scroll performáticas (via `LazyMotion`) e acessíveis (respeito estrito a `prefers-reduced-motion`).

### 7. Hospedagem, Automação (CI/CD) e Ambientes

* **Vercel (Plataforma de Referência do MVP):** Deploy automatizado a cada `git push` no GitHub, SSL gratuito e URLs de preview (staging) para homologação com o cliente. (Cloudflare Pages é mantida como alternativa arquitetural separada via guia técnico dedicado).

### 8. Governança, Privacidade e LGPD (Privacy by Design)

* **Salvaguardas no Formulário:** Suporte nativo a consentimento explícito validado no Zod ou aviso transparente baseado em procedimentos pré-contratuais (Art. 7º, V).
* **Retenção Efêmera:** Arquitetura sem banco de dados; dados trafegam de forma criptografada para a caixa de e-mail corporativa do cliente.
* **Plausible Analytics (Cookieless):** Telemetria agregada sem cookies persistentes de rastreamento, preservando Core Web Vitals sem banners invasivos na configuração padrão, condicionada à discriminação fiel dos serviços ativos na Política de Privacidade.
* **Páginas Legais Estáticas:** Rotas `/politica-de-privacidade` e `/termos-de-uso` sincronizadas com o `siteConfig` e discriminando com exatidão os serviços técnicos ativados.

### 9. Qualidade Contínua e Portões de Segurança (Quality Gates)

* **GitHub Actions CI:** Esteira automatizada que valida Lint, Typecheck, Testes e Build em cada PR antes do merge.
* **Dependabot:** Monitoramento semanal e atualização contínua de segurança para pacotes npm e GitHub Actions.
* **Acessibilidade Profunda (axe-core):** Testes automatizados de conformidade WCAG 2.1 AA via `vitest-axe` nos componentes de interface.
* **Lighthouse CI:** Orçamentos contínuos de performance (score >= 90) e acessibilidade (score >= 95).

---

## 📊 Matriz de Escopo: Core/MVP vs Expansões Pós-MVP

| Camada | Fase 2 (Core & MVP do Template) | Fase 3 (Expansões Pós-MVP / Sob Demanda) |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** (App Router / SSG / Server Actions - Active LTS) | **Next.js** (Rotas Dinâmicas, Autenticação, ISR Avançado) |
| **Estilização** | Tailwind CSS v4 (`@theme`) + Shadcn/ui | Temas customizados por cliente com Dark Mode dinâmico |
| **SEO & Metadados** | Metadata API + Sitemap + Robots + OG + Schema Organization | Sitemaps segmentados, Schema LocalBusiness multi-local, i18n |
| **Formulários & Backend** | React Hook Form + Server Actions + Zod + Anti-Spam | Formulários multi-etapas / Upload de arquivos |
| **E-mails Transacionais** | Resend API (Notificação comercial de contato) | Automação de marketing / E-mails transacionais de boas-vindas |
| **Gestão de Conteúdo** | Keystatic (Markdown/JSON Git-based) | CMS em Nuvem (Sanity.io/Strapi se o cliente exigir) |
| **Hospedagem / CI/CD** | Vercel (Plataforma de referência do MVP, com titularidade do cliente) | Cloudflare Pages (via `@cloudflare/next-on-pages` / OpenNext) / AWS |
| **Privacidade & LGPD** | Privacy by Design (Retenção Efêmera + Salvaguardas Zod + Plausible) | Cookie Banner (caso o cliente exija Google Analytics 4) |
| **Qualidade & Automação** | GitHub Actions CI + Dependabot + Vitest + axe-core | Lighthouse CI automatizado / Testes E2E (Playwright) |
| **Segurança & Defesa** | Zod Env Validation + Security Headers + SECURITY.md | WAF avançado / Rate Limiting distribuído via Upstash Redis |
| **Componentes de UI** | Hero, Sobre, Serviços, FAQ, Depoimentos e Contato | Área de Membros, Catálogo de Produtos, Pagamentos (Stripe) |

---
