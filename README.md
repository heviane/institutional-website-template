# 🚀 Institutional Website Template

> Template/Boilerplate genérico, modular e de alta performance para a criação e implantação rápida de websites institucionais e corporativos.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/ui](https://img.shields.io/badge/Shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-orange?style=for-the-badge&logo=git)](docs/03-project-roadmap.md)

> [!WARNING]
> **Projeto em Desenvolvimento Ativo (WIP — Work in Progress)**  
> Este template possui sua fundação arquitetural e de governança concluída (Fase 1), e encontra-se em fase de implementação ativa do Core & MVP (Fase 2). Os recursos descritos abaixo representam a arquitetura planejada e em construção. Acompanhe o status detalhado de cada componente no [Roadmap do Projeto](docs/03-project-roadmap.md).

---

## 🎯 Sobre o Projeto

Este repositório foi desenvolvido para servir como o **ponto de partida (*starter kit*) reutilizável** em projetos de desenvolvimento web freelance e de agência. Ele foi projetado para eliminar tarefas repetitivas de setup inicial, oferecendo uma arquitetura planejada para alta estabilidade, auditada tecnicamente e guiada por cinco pilares estratégicos:

1. ⚡ **Alta Performance (SEO & Core Web Vitals):** Páginas estáticas com metas de LCP < 2,5 s, INP < 200 ms e CLS < 0,1 em conexões móveis.
2. 🛠️ **Produtividade & Reutilização:** Estrutura modular desacoplada onde a marca do cliente é configurada em menos de 2 horas.
3. 💰 **Meta de Custo Reduzido ($0 inicial):** Maximização consciente dos planos gratuitos de Git, DNS e Serverless, dispensando servidores dedicados para sites institucionais padrão.
4. 📝 **Autonomia para o Cliente:** Gestão de conteúdo simplificada via Keystatic CMS sem que o cliente precise manipular Git ou código.
5. 🔒 **Privacidade & Conformidade LGPD por Padrão:** Formulários com consentimento explícito no Zod, métricas sem cookies (Plausible) e páginas legais padronizadas.

---

## 🛠️ Tech Stack & Arquitetura

* **Framework Principal:** [Next.js](https://nextjs.org/) (React / App Router com SSG/ISR).
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita end-to-end).
* **Estilização & UI System:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/) (baseado nos primitivos do Radix UI).
* **Gestão de Conteúdo (Headless CMS):** [Keystatic](https://keystatic.com/) (Git-based CMS em Markdown/JSON).
* **Formulários & Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/).
* **E-mails Transacionais:** [Resend API](https://resend.com/).
* **Animações & Ícones:** [Motion](https://motion.dev/) (`motion/react`) + [Lucide Icons](https://lucide.dev/).
* **Hospedagem & CI/CD:** [Vercel](https://vercel.com/).

---

## 📚 Documentação Técnica do Projeto

Para garantir governança, rastreabilidade e facilidade de *onboarding*, o projeto conta com uma documentação técnica completa dividida por etapas dentro do diretório `/docs`:

* 🏗️ **[Visão Geral da Arquitetura](docs/01-architecture-overview.md):** Especificação de requisitos, decisões de stack e mapeamento das camadas do sistema.
* ⚙️ **[Guia de Setup e Inicialização](docs/02-environment-setup.md):** Passo a passo prático para instalação do ambiente, padrões de código e estruturação de dados globais.
* 🗺️ **[Roadmap do Projeto](docs/03-project-roadmap.md):** Planejamento estratégico, fases de desenvolvimento (MVP e pós-MVP) e critérios de sucesso.
* 📁 **[Estrutura de Pastas e Padrões de Projeto](docs/04-folder-structure.md):** Organização do diretório `src/`, convenções de nomenclatura e fronteiras de customização.
* 📦 **[Modelo de Conteúdo do Keystatic](docs/05-keystatic-content-model.md):** Especificação de coleções, singletons, schema de blog/serviços e Reader API.
* 🎨 **[Guia de Tema por Marca](docs/06-brand-theming-guide.md):** Passo a passo de 10 minutos para trocar cores, tipografia e assets por cliente com Tailwind v4.
* 📋 **[Checklist de Onboarding de Cliente](docs/07-client-onboarding-checklist.md):** Checklist operacional completo de 8 etapas do repositório ao deploy, DNS, Resend e entrega.
* 📌 **[Registros de Decisão Arquitetural (ADRs)](docs/adr/README.md):**
  * [ADR 0001: Escolha do Framework Base - Next.js](docs/adr/0001-escolha-do-framework-next.md)
  * [ADR 0002: Escolha da Camada de Gestão de Conteúdo - Keystatic](docs/adr/0002-escolha-do-cms-keystatic.md)
  * [ADR 0003: Estratégia de Formulários e Comunicação Transacional](docs/adr/0003-estrategia-de-formularios.md)
  * [ADR 0004: Design System, Estilização e Acessibilidade](docs/adr/0004-design-system-e-estilizacao.md)
  * [ADR 0005: Estratégia de Hospedagem, Infraestrutura e CI/CD](docs/adr/0005-estrategia-de-hospedagem-e-cicd.md)
  * [ADR 0006: Autenticação do CMS em Produção e Gestão de Mídia](docs/adr/0006-autenticacao-cms-e-gestao-de-midia.md)
  * [ADR 0007: Conformidade com a LGPD e Privacidade por Design](docs/adr/0007-conformidade-lgpd-e-privacidade.md)
  * [ADR 0008: Qualidade Automatizada, Testes e Acessibilidade Contínua](docs/adr/0008-qualidade-automatizada-e-testes.md)
  * [ADR 0009: Política de Segurança, Headers HTTP e Validação de Ambiente](docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)
  * [ADR 0010: Estratégia de Versionamento do Template e Propagação de Atualizações para Clientes](docs/adr/0010-estrategia-de-atualizacao-e-versionamento.md)
  * [ADR 0011: Defesa Anti-Spam, Proteção de Formulários e Rate Limiting](docs/adr/0011-defesa-antispam-e-protecao-de-formularios.md)

---

## 🚀 Como Usar Este Template

### 1. Criando um Novo Repositório a partir do Template

Clique no botão **"Use this template"** no topo da página do GitHub para gerar uma cópia limpa deste projeto em sua conta pessoal ou na organização do seu cliente .

### 2. Instalação Local

Clone o novo repositório criado e instale as dependências:

```bash
# Clonar o repositório
git clone https://github.com/heviane/institutional-website-template.git

# Entrar na pasta do projeto
cd nome-do-projeto

# Instalar as dependências
npm install
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com base no arquivo `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=sua_chave_resend_aqui
RESEND_FROM_EMAIL="Contato <contato@empresa.com.br>"
CONTACT_EMAIL_TO=contato@empresa.com.br
NEXT_PUBLIC_TURNSTILE_SITE_KEY=seu_site_key_aqui
TURNSTILE_SECRET_KEY=sua_secret_key_aqui
```

### 4. Executando o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador para ver a aplicação em execução.

### 5. Sincronizando Atualizações Futuras do Template

Como o botão *"Use this template"* gera um repositório com histórico desconectado, configure o template original como `upstream` no projeto do cliente para puxar melhorias contínuas e patches de segurança com facilidade:

```bash
# 1. Vincular o template original como remote (executar uma única vez no repositório do cliente):
git remote add template https://github.com/heviane/institutional-website-template.git

# 2. Buscar atualizações do template:
git fetch template

# 3. Mesclar as melhorias mais recentes (reconciliando históricos desconectados):
git merge template/main --allow-unrelated-histories -m "chore: sincronizar com a versao mais recente do template"

# Dica: Para aplicar apenas uma correção de segurança específica (hotfix):
git cherry-pick <hash-do-commit>
```

---

## 🎨 Personalização Rápida para Clientes

Toda a informação global do cliente (nome da empresa, redes sociais, telefones, e-mail e endereço) está desacoplada dos componentes e centralizada no arquivo:

`src/config/site.ts`

Basta alterar os valores desse arquivo para que todo o cabeçalho, rodapé e metadados SEO sejam atualizados automaticamente no site.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE) - sinta-se à vontade para reutilizar, modificar e aplicar comercialmente em projetos de clientes.

---

## 🔒 Segurança

Levamos a segurança da informação e a privacidade a sério. Para reportar vulnerabilidades ou consultar nossas diretrizes de divulgação responsável, consulte o arquivo [SECURITY.md](SECURITY.md).
