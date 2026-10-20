# 🗺️ Project Roadmap

Este documento define o planejamento estratégico e a ordem de execução para o desenvolvimento e evolução do **`institutional-website-template`**. O objetivo é manter o foco na entrega contínua, priorizando a estabilidade do MVP (Minimum Viable Product) antes de avançar para funcionalidades avançadas.

---

## 🎯 Fases de Desenvolvimento

### 🟢 Fase 1: Fundação, Setup e Governança (Concluído)
* [x] Definição de requisitos e arquitetura de alto nível (`01-architecture-overview.md`)
* [x] Criação de Registros de Decisão Arquitetural — ADRs 0001 a 0005 (`docs/adr/`)
* [x] Estruturação da documentação técnica e guias de setup (`02-environment-setup.md`)
* [x] Configuração inicial do repositório, licença MIT e README profissional

### 🟡 Fase 2: Implementação do Core & MVP (Em Andamento)
Esta fase representa a entrega principal do template, garantindo um site institucional totalmente funcional, com formulário e CMS integrado.

* **2.1. Bootstrapping Técnico:**
  * [ ] Inicialização do Next.js (App Router + TypeScript + Tailwind)
  * [ ] Instalação e configuração do Shadcn/ui & Radix UI
  * [ ] Configuração de alias (`@/*`) e padrões de linting
* **2.2. Arquitetura de Dados Globais:**
  * [ ] Criação da abstração de dados do cliente (`src/config/site.ts`)
  * [ ] Configuração de variáveis de tema no Tailwind (`globals.css`)
* **2.3. Layout Base e Componentes Shared:**
  * [ ] Implementação do layout raiz (`src/app/layout.tsx`) com metadados dinâmicos
  * [ ] Construção do componente `Header / Navbar` (responsivo e acessível)
  * [ ] Construção do componente `Footer`
  * [ ] Construção do componente `Hero Section`
* **2.4. Engenharia de Formulários:**
  * [ ] Configuração do schema de validação com Zod
  * [ ] Implementação do formulário no frontend com React Hook Form
  * [ ] Criação da Route Handler (`/api/contact`) integrada com a API do Resend
* **2.5. Integração com Headless CMS:**
  * [ ] Configuração inicial do Keystatic CMS (`@keystatic/next`)
  * [ ] Definição dos Schemas de Conteúdo (Páginas, Seções e Posts de Blog)
  * [ ] Leitura dos dados estáticos via arquivos Markdown/JSON em tempo de build (SSG/ISR)

### 🔵 Fase 3: Evolução e Recursos Avançados (Pós-MVP / Sob Demanda)
Funcionalidades opcionais que podem ser ativadas em projetos específicos de clientes, conforme a necessidade do negócio:

* [ ] Suporte a múltiplos idiomas (Internacionalização / i18n)
* [ ] Implementação de Dark Mode nativo com troca de variáveis no Tailwind
* [ ] Área logada / Autenticação de usuários (se exigido pelo projeto do cliente)
* [ ] Otimizações avançadas de SEO técnico (Sitemap dinâmico, Schema.org estruturado)
* [ ] Integração com ferramentas de análise de tráfego (Google Analytics / Plausible)

---

## 📌 Critérios de Sucesso do MVP
O template será considerado pronto para uso em produção comercial quando:
1. Um novo cliente puder ser configurado apenas alterando o arquivo `siteConfig` e os dados do Keystatic.
2. O site atingir pontuação superior a 90 em Performance, Acessibilidade e SEO no Google Lighthouse.
3. O formulário de contato enviar e-mails transacionais com sucesso via Resend em ambiente de produção na Vercel.

---
