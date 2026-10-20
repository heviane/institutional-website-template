# EPR - Especificação de Projeto e Requisitos

**Projeto:** Website Institucional (Template - Boilerplate)
Este é o documento de Especificação/Planejamento Inicial para a construção de um template genérico de website institucional, projetado como ponto de partida reutilizável para projetos freelancer.

> *Etapa de Engenharia de Requisitos e Decisões Arquiteturais!*
> Planejamento e a especificação de requisitos (com os 4 pilares, as decisões de stack e a divisão das etapas estática e dinâmica).

## Objetivos

Criar um template modular, de fácil personalização e pronto para reaproveitamento, priorizando quatro pilares:

1. **Alta performance (SEO e Core Web Vitals)**;
2. **Rapidez no desenvolvimento e reaproveitamento de código**;
3. **Custo zero ou reduzido de hospedagem/infraestrutura**;
4. **Autonomia do cliente para gerenciar conteúdos**.

---

## Requisitos e Arquitetura do Sistema

### 1. Framework e Rendering (Espinha Dorsal)
* **Next.js (React / App Router):**
  * **Fase 1 (Atual):** Foco em renderização estática (SSG/ISR) e páginas institucionais leves.
  * **Fase 2 (Evolutiva):** Pronto para evoluir para áreas logadas, catálogos dinâmicos ou integrações de APIs complexas.

### 2. Estilização, Design System e Acessibilidade
* **Tailwind CSS:** Engine de estilização via classes utilitárias para construir e customizar o layout com facilidade.
* **Shadcn/ui & Radix UI:** Componentes de interface acessíveis (WCAG), flexíveis e desacoplados, cujos códigos ficam diretamente na pasta do projeto para fácil customização.

### 3. SEO, Metadados e Performance
* **Next.js Metadata API:** Gestão de metadados nativa para SEO, Open Graph e Twitter Cards.
* **Geração Automática de Sitemap e Robots.txt:** Arquivos dinâmicos para otimização de indexação nos buscadores.
* **Next/Image:** Otimização automática de formato, tamanho e carregamento preguiçoso (lazy loading) de imagens.

### 4. Gestão de Conteúdo (Headless CMS)
* **Keystatic (Git-Based CMS):**
  * Salva artigos de blog, depoimentos e conteúdos em arquivos Markdown/JSON diretamente no repositório GitHub.
  * Mantém o custo de infraestrutura em $0 e oferece um painel de edição visual amigável para o cliente final.

### 5. Formulários, Validação e Comunicação Transacional
* **React Hook Form:** Gerenciamento performático do estado de formulários no cliente.
* **Zod:** Validação estrita de schemas e tipos (compartilhado entre cliente e servidor).
* **Resend API:** Disparo de e-mails transacionais (notificações de contato e orçamentos) via Serverless/Route Handlers.

### 6. Interface, Animações e Ícones
* **Lucide Icons:** Biblioteca de ícones leve e moderna.
* **Framer Motion:** Microinterações, efeitos de scroll e transições suaves de tela.

### 7. Hospedagem, Automação (CI/CD) e Ambientes
* **Vercel:** Hospedagem com deploy automático a cada `git push` no GitHub, SSL gratuito e URLs de preview (staging) para homologação com o cliente.

---

## 📊 Tabela de Requisitos e Escopo Ajustada

Com essa reestruturação, a tabela do seu planejamento fica muito mais clara em relação ao que entra no **MVP do Template (Etapa 1)** e o que fica para **Expansões Futuras por Cliente (Etapa 2)**:

| Camada | 1º Etapa (MVP do Template) | 2º Etapa (Expansões Sob Demanda) |
| --- | --- | --- |
| **Framework** | **Next.js** (App Router / SSG)
| **Next.js** (SSR, Server Actions, Dynamic Routes)|
| **Estilização** | Tailwind CSS + Shadcn/ui | idem + Temas customizados por cliente |
| **SEO & Mídias** | Metadata API + Sitemap + OpenGraph | Otimizações regionais / Analytics avançado |
| **Formulários** | React Hook Form + Zod | Formulários multi-etapas / Upload de arquivos |
| **E-mails Transacionais** | Resend API (Notificação de contato) | Automação de marketing / E-mails de boas-vindas |
| **Gestão de Conteúdo** | Keystatic (Markdown/Git-based) | CMS em Nuvem (Sanity.io/Strapi se o cliente exigir) |
| **Hospedagem / CI/CD** | Vercel (Plano Hobby / Deploy via Git) | Vercel Pro ou Servidor Próprio (Docker/VPS) |
| **Recursos Avançados** | Componentes Institucionais (Hero, Sobre, Serviços, FAQ, Contato) | Área de Membros, Login, Pagamentos (Stripe/Mercado Pago) |

---
