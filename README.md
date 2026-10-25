# 🚀 Institutional Website Template

> Template/Boilerplate genérico, modular e de alta performance para a criação e implantação rápida de websites institucionais e corporativos.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/ui](https://img.shields.io/badge/Shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)
[![CI Quality Gates](https://img.shields.io/github/actions/workflow/status/heviane/institutional-website-template/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20Quality%20Gates)](https://github.com/heviane/institutional-website-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Fase_2_Em_Andamento-yellow?style=for-the-badge&logo=git)](docs/03-project-roadmap.md)

> [!NOTE]
> **Status do Projeto: Fase 2 (Core & MVP) em Andamento — Feature 001 Concluída**  
> Este template concluiu a fundação documental (Fase 1) e iniciou a materialização em código da Fase 2. A **Feature 001 (Project Bootstrap & Quality Gates)** está entregue com Next.js 16, TypeScript, Tailwind CSS v4, Vitest e Quality Gates 100% verdes no CI. Acompanhe o status detalhado de cada componente no [Roadmap do Projeto](docs/03-project-roadmap.md).

---

## 🎯 Sobre o Projeto

Este repositório foi desenvolvido para servir como o **ponto de partida (*starter kit*) reutilizável** em projetos de desenvolvimento web freelance e de agência. Ele foi projetado para eliminar tarefas repetitivas de setup inicial, oferecendo uma arquitetura planejada para alta estabilidade, auditada tecnicamente e guiada por cinco pilares estratégicos:

1. ⚡ **Alta Performance (SEO & Core Web Vitals):** Páginas estáticas com metas planejadas de LCP < 2,5 s, INP < 200 ms e CLS < 0,1 em conexões móveis.
2. 🛠️ **Produtividade & Reutilização:** Estrutura modular desacoplada com meta planejada de configuração de novo cliente em menos de 2 horas (a ser validada em projeto piloto).
3. 💰 **Infraestrutura de Baixo Custo (Custo Otimizado):** Priorização de serviços gratuitos ou de baixo custo (Git, DNS e Serverless) compatíveis com a escala de sites institucionais, eliminando a obrigatoriedade de servidores dedicados ou bancos de dados caros.
4. 📝 **Autonomia para o Cliente:** Gestão de conteúdo simplificada via Keystatic CMS sem que o cliente precise manipular Git ou código.
5. 🔒 **Privacidade & Governança LGPD por Design:** Arquitetura efêmera sem banco de dados, salvaguarda configurável de consentimento no Zod, telemetria agregada sem cookies (Plausible) e páginas legais padronizadas.

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
* 🔍 **[Revisão Arquitetural da Fase 1](docs/08-architecture-review-phase1.md):** Relatório técnico de auditoria, limites operacionais e validação de requisitos da fundação documental.
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

> [!TIP]
> **Ambiente Operacional e Reprodutível:**  
> A aplicação está inicializada na raiz do repositório com Next.js 16, React 19, Tailwind CSS v4 e TypeScript sob Node.js 24 LTS. Os comandos abaixo são totalmente funcionais e verificados continuamente na esteira de CI do GitHub Actions.

### 1. Criando um Novo Repositório a partir do Template

Clique no botão **"Use this template"** no topo da página do GitHub para gerar uma cópia limpa deste projeto em sua conta pessoal ou na organização do seu cliente.

### 2. Instalação Local

Clone o novo repositório criado e instale as dependências:

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/nome-do-projeto.git

# Entrar na pasta do projeto
cd nome-do-projeto

# Instalar as dependências de forma reproduzível (Lockfile estrito)
npm ci
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

### 4. Executando o Servidor de Desenvolvimento e Verificação

```bash
# Iniciar o servidor local de desenvolvimento
npm run dev

# Executar todos os Quality Gates de uma só vez (Auditoria, Lint, Typecheck, Testes e Build)
npm run verify
```

Acesse `http://localhost:3000` no seu navegador para ver a aplicação em execução.

### 5. Atualizações e Manutenção do Template

O template segue versionamento semântico ([SemVer](https://semver.org/)) formalizado via GitHub Releases. A arquitetura desacopla a zona de engenharia das customizações do cliente (`src/config/site.ts`, mídias em `/public` e conteúdo Markdown), reduzindo a probabilidade de conflitos durante atualizações.

> [!WARNING]
> **Fluxo de Sincronização em Validação (Procedimento Experimental)**  
> Repositórios criados a partir do botão *"Use this template"* possuem histórico Git desconectado do template original (*sem ancestral comum*). Conforme documentado no [ADR 0010](docs/adr/0010-estrategia-de-atualizacao-e-versionamento.md), a mesclagem direta de históricos (`--allow-unrelated-histories`) pode gerar falsos conflitos massivos e **não é recomendada como procedimento padrão até a conclusão dos testes na Fase 2**.
>
> **Fluxo Recomendado para Atualizações e Hotfixes:**
> 1. Consulte o *Changelog* detalhado na [Release oficial](https://github.com/heviane/institutional-website-template/releases) do template.
> 2. Para aplicar **correções pontuais de segurança (hotfixes)**, utilize cherry-pick ou patches cirúrgicos em uma branch de teste isolada:
>    ```bash
>    # 1. Vincular o template como remote secundário (apenas uma vez):
>    git remote add template https://github.com/heviane/institutional-website-template.git
>
>    # 2. Buscar atualizações:
>    git fetch template
>
>    # 3. Aplicar a correção específica em branch de teste:
>    git checkout -b chore/patch-seguranca
>    git cherry-pick <hash-do-commit>
>    ```
> 3. Um procedimento homologado de sincronização completa (via branch upstream ou automação) será definido empiricamente após validação em repositório derivado de testes.

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
