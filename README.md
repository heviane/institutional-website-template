# 🚀 Institutional Website Template

> Template/Boilerplate genérico, modular e de alta performance para a criação e implantação rápida de websites institucionais e corporativos.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn/ui](https://img.shields.io/badge/Shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🎯 Sobre o Projeto

Este repositório foi desenvolvido para servir como o **ponto de partida (*starter kit*) reutilizável** em projetos de desenvolvimento web freelancer. Ele foi projetado para eliminar tarefas repetitivas de setup inicial, oferecendo uma arquitetura pronta para produção, auditada e guiada por quatro pilares estratégicos:

1. ⚡ **Alta Performance (SEO & Core Web Vitals):** Páginas estáticas ultra-rápidas otimizadas para motores de busca[cite: 1].
2. 🛠️ **Produtividade & Reutilização:** Estrutura desacoplada onde os dados do cliente são configurados de forma centralizada[cite: 1].
3. 💰 **Custo Zero de Infraestrutura ($0/mês):** Sem dependência de bancos de dados pagos ou servidores dedicados para sites pequenos e médios[cite: 1].
4. 📝 **Autonomia para o Cliente:** Gestão de conteúdo simplificada sem que o cliente precise manipular código[cite: 1].

---

## 🛠️ Tech Stack & Arquitetura

* **Framework Principal:** [Next.js](https://nextjs.org/) (React / App Router com SSG/ISR)[cite: 1]
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita end-to-end)[cite: 1]
* **Estilização & UI System:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/) (baseado nos primitivos do Radix UI)[cite: 1]
* **Gestão de Conteúdo (Headless CMS):** [Keystatic](https://keystatic.com/) (Git-based CMS em Markdown/JSON)[cite: 1]
* **Formulários & Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)[cite: 1]
* **E-mails Transacionais:** [Resend API](https://resend.com/)[cite: 1]
* **Animações & Ícones:** [Framer Motion](https://www.framer.com/motion/) + [Lucide Icons](https://lucide.dev/)[cite: 1]
* **Hospedagem & CI/CD:** [Vercel](https://vercel.com/)[cite: 1]

---

## 📚 Documentação Técnica do Projeto

Para garantir governança, rastreabilidade e facilidade de *onboarding*, o projeto conta com uma documentação técnica completa dividida por etapas dentro do diretório `/docs`:

* 🏗️ **[Visão Geral da Arquitetura](docs/01-architecture-overview.md):** Especificação de requisitos, decisões de stack e mapeamento das camadas do sistema[cite: 1].
* ⚙️ **[Guia de Setup e Inicialização](docs/02-environment-setup.md):** Passo a passo prático para instalação do ambiente, padrões de código e estruturação de dados globais[cite: 1].
* 📌 **[Registros de Decisão Arquitetural (ADRs)](docs/adr/):**
  * [ADR 0001: Escolha do Framework Base - Next.js](docs/adr/0001-escolha-do-framework-nextjs.md)[cite: 1]
  * [ADR 0002: Escolha da Camada de Gestão de Conteúdo - Keystatic](docs/adr/0002-escolha-do-cms-keystatic.md)[cite: 1]
  * [ADR 0003: Estratégia de Formulários e Comunicação Transacional](docs/adr/0003-estrategia-de-formularios.md)[cite: 1]
  * [ADR 0004: Design System, Estilização e Acessibilidade](docs/adr/0004-design-system-e-estilizacao.md)[cite: 1]
  * [ADR 0005: Estratégia de Hospedagem, Infraestrutura e CI/CD](docs/adr/0005-estratégia-de-hospedagem-e-cicd.md)[cite: 1]

---

## 🚀 Como Usar Este Template

### 1. Criando um Novo Repositório a partir do Template

Clique no botão **"Use this template"** no topo da página do GitHub para gerar uma cópia limpa deste projeto em sua conta pessoal ou na organização do seu cliente[cite: 1].

### 2. Instalação Local

Clone o novo repositório criado e instale as dependências:

```bash
# Clonar o repositório
git clone [https://github.com/seu-usuario/nome-do-projeto.git](https://github.com/seu-usuario/nome-do-projeto.git)

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
CONTACT_EMAIL_TO=contato@empresa.com.br
```

### 4. Executando o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador para ver a aplicação em execução.

---

## 🎨 Personalização Rápida para Clientes

Toda a informação global do cliente (nome da empresa, redes sociais, telefones, e-mail e endereço) está desacoplada dos componentes e centralizada no arquivo:

`src/config/site.ts`

Basta alterar os valores desse arquivo para que todo o cabeçalho, rodapé e metadados SEO sejam atualizados automaticamente no site.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE) - sinta-se à vontade para reutilizar, modificar e aplicar comercialmente em projetos de clientes.
