Processo contínua e sequencial de **Inicialização do Ambiente (Bootstrapping)** e **Design de Software, Estruturação e Padrões de Código (Setup)**:

# 02 - Guia de Configuração e Setup do Ambiente (Environment Setup)

Este documento orienta o passo a passo técnico completo para a inicialização e estruturação do projeto **`institutional-website-template`**, cobrindo desde a execução dos comandos no terminal até a arquitetura de arquivos, padrões de governança de código e componentes base de layout.

---

## Parte 1: Inicialização e Bootstrapping

Após a conclusão do planejamento conceitual, o primeiro passo é erguer a infraestrutura base do projeto.

> **Nota:** Certifique-se de estar na raiz do repositório clonado localmente antes de executar os comandos.

### Passo 1: Inicializar o Next.js na raiz do repositório

Execute o criador oficial do Next.js (o ponto `.` final indica a instalação no diretório atual):

```bash
npx create-next-app@latest .
```

Durante o assistente interativo, selecione as seguintes opções:

1. **Would you like to use TypeScript?** `Yes` *(Garante tipagem estrita e autocompletar)*
2. **Would you like to use ESLint?** `Yes` *(Garante padronização e qualidade de código)*
3. **Would you like to use Tailwind CSS?** `Yes` *(Engine de estilização utilitária)*
4. **Would you like your code inside a `src/` directory?** `Yes` *(Organização padrão de mercado)*
5. **Would you like to use App Router? (recommended)** `Yes` *(Arquitetura moderna do Next.js)*
6. **Would you like to use Turbopack for `next dev`?** `Yes` *(Compilação local otimizada)*
7. **Would you like to customize the import alias (`@/*` by default)?** `No` *(O padrão `@/*` atende perfeitamente)*

---

### Passo 2: Inicializar o Shadcn/ui (Design System)

Com o Next.js instalado, configure o **Shadcn/ui** para prover a biblioteca de componentes acessíveis baseados em Radix UI:

```bash
npx shadcn@latest init
```

Responda aos prompts interativos com as opções:

1. **Which style would you like to use?** `New York` (ou `Default`)
2. **Which color would you like to use as the base color?** `Slate` (ou `Neutral` — base neutra ideal para reestilizar para qualquer cliente)
3. **Would you like to use CSS variables for colors?** `Yes`

---

### Passo 3: Instalar as Bibliotecas da Stack (Comando Único)

Instale as dependências essenciais de validação, formulários, e-mails, ícones e animações:

```bash
npm install react-hook-form zod @hookform/resolvers lucide-react resend framer-motion
```

---

### Passo 4: Validar e Testar o Ambiente Local

Execute o servidor de desenvolvimento para garantir que a instalação ocorreu sem conflitos:

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador para visualizar a página padrão do Next.js.

---

### Passo 5: Salvar o Estado Inicial no Git

Pressione `Ctrl + C` para interromper o servidor local e faça o commit inicial da infraestrutura:

```bash
git add .
git commit -m "feat: setup inicial com Next.js, Tailwind, Shadcn e bibliotecas base"
git push origin main
```

---

## Parte 2: Design de Software, Estruturação do Projeto e Padrões de Código

Com as dependências e o repositório base criados, o foco passa a ser o design de software e a governança para tornar a base reutilizável, modular e limpa.

### Sequência Lógica do Setup:

```text
[ Repositório e Bootstrapping Prontos ]
                  ↓
1. Governança & Padronização (ESLint, Prettier, TypeScript Aliases)
                  ↓
2. Modelagem de Dados Globais (src/config/site.ts)
                  ↓
3. Configuração do Design System (Variáveis CSS no Tailwind)
                  ↓
4. Estruturação do Layout Raiz (Header, Footer, Hero Component)
```

---

### Fase 1: Padronização de Código e Governança (Linting & Formatting)

1. **Configurar ESLint e Prettier:**
* Garantir regras estritas de formato e importação no Next.js e TypeScript para evitar divergências de estilo entre commits.

2. **Configurar os Aliases de Importação (`paths` no `tsconfig.json`):**
* Manter atalhos limpos para evitar importações relativas longas (`../../components/...`):
```json
"paths": {
  "@/*": ["./src/*"]
}
```

* *Acessos limpos:* `@/components/...`, `@/config/...`, `@/lib/...`, `@/types/...`.

---

### Fase 2: Modelagem de Dados & Configuração Global (Site Configuration)

Para reutilizar este template em novos clientes, é fundamental desacoplar as informações do cliente dos componentes visuais.

1. **Criar a camada de abstração de dados globais (`src/config/site.ts`):**

```typescript
export const siteConfig = {
  name: "Empresa Genérica",
  description: "Website institucional genérico e de alta performance.",
  url: "[https://seusite.com.br](https://seusite.com.br)",
  ogImage: "[https://seusite.com.br/og.jpg](https://seusite.com.br/og.jpg)",
  contact: {
    email: "contato@empresa.com.br",
    phone: "(51) 99999-9999",
    whatsapp: "5551999999999",
    address: "Porto Alegre, RS",
  },
  social: {
    instagram: "[https://instagram.com/empresa](https://instagram.com/empresa)",
    linkedin: "[https://linkedin.com/company/empresa](https://linkedin.com/company/empresa)",
  },
};

export type SiteConfig = typeof siteConfig;
```

2. **Vantagem Arquitetural:** Em novos projetos de clientes, basta atualizar este único arquivo de configuração para refletir dados globais no cabeçalho, rodapé, contatos e metadados.

---

### Fase 3: Design de Componentes da Interface (Layout & UI System)

Com a configuração central pronta, constrói-se a estrutura visual base do projeto:

1. **Configurar Variáveis Visuais no Tailwind CSS:**
* Definir no `globals.css` / `tailwind.config.ts` a paleta de cores base via variáveis CSS (`primary`, `secondary`, `accent`, `background`), simplificando a alteração de tema visual para cada marca.

2. **Implementar o Layout Raiz (`src/app/layout.tsx`):**
* Carregamento otimizado de fontes do Google via `next/font/google` (ex.: Inter ou Plus Jakarta Sans).
* Injeção de metadados dinâmicos consumindo as propriedades de `siteConfig`.

3. **Construir os Componentes de Infraestrutura Visual (`src/components/shared/`):**
* **`Header / Navbar`**: Menu navegável responsivo com suporte a acessibilidade e *mobile drawer*.
* **`Footer`**: Rodapé com contatos centralizados, redes sociais e copyright dinâmico.
* **`Hero Section`**: Bloco principal de apresentação e chamada para ação (*Call to Action - CTA*).

---
