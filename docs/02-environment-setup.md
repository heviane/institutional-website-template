# 02 - Environment e Setup

Guia de Configuração e Setup do Ambiente.

Este documento orienta o passo a passo técnico completo para a inicialização e estruturação do projeto **`institutional-website-template`**, cobrindo desde a execução dos comandos no terminal até a arquitetura de arquivos, padrões de governança de código e componentes base de layout.

---

## Parte 1: Inicialização e Bootstrapping

Após a conclusão do planejamento conceitual, o primeiro passo é erguer a infraestrutura base do projeto.

> **Nota:** Certifique-se de estar na raiz do repositório clonado localmente antes de executar os comandos.

### Pré-requisitos de Ambiente

* **Node.js:** Versão `24.x` (Active LTS padrão oficial) ou `>= 22.x` (Maintenance LTS mínimo suportado). O Node.js 20 alcançou o fim de vida útil (EOL) e não é suportado. O repositório inclui o arquivo [`.nvmrc`](.nvmrc) para sincronizar a versão do Node via `nvm use`.
* **Gerenciador de Pacotes:** `npm` (padrão) ou `pnpm`.
* **Git:** Para controle de versão e CI/CD.

---

### Passo 1: Inicializar o Next.js na raiz do repositório

Execute o criador oficial do Next.js (o ponto `.` final indica a instalação no diretório atual):

```bash
npx create-next-app@latest .
# Instala o Next.js 16 (Active LTS oficial) na raiz do repositório
```

Durante o assistente interativo, selecione as seguintes opções:

1. **Would you like to use TypeScript?** `Yes` *(Garante tipagem estrita e autocompletar)*
2. **Would you like to use ESLint?** `Yes` *(Garante padronização e qualidade de código)*
3. **Would you like to use Tailwind CSS?** `Yes` *(Instala o Tailwind CSS v4 com motor Oxide de alta velocidade)*
4. **Would you like your code inside a `src/` directory?** `Yes` *(Organização padrão de mercado)*
5. **Would you like to use App Router? (recommended)** `Yes` *(Arquitetura moderna do Next.js)*
6. **Would you like to use Turbopack for `next dev`?** `Yes` *(Compilação local otimizada)*
7. **Would you like to customize the import alias (`@/*` by default)?** `No` *(O padrão `@/*` atende perfeitamente)*

---

### Passo 2: Inicializar o Shadcn/ui (Design System)

Com o Next.js e o Tailwind v4 instalados, inicialize o **Shadcn/ui** para configurar os componentes acessíveis baseados em Radix UI. É recomendável utilizar a flag `-d` para aplicar os padrões oficiais de forma imediata:

```bash
npx shadcn@latest init -d
```

Caso prefira responder aos prompts interativos manualmente (`npx shadcn@latest init`):

1. **Which style would you like to use?** `New York` (ou `Default`)
2. **Which color would you like to use as the base color?** `Slate` (ou `Neutral` — base neutra ideal para reestilizar para qualquer cliente)
3. **Would you like to use CSS variables for colors?** `Yes` *(Integração nativa com a diretiva `@theme` do Tailwind v4)*

---

### Passo 3: Instalar as Bibliotecas da Stack (Comando Único)

Instale as dependências essenciais de validação, formulários, e-mails, ícones e animações:

```bash
npm install react-hook-form zod @hookform/resolvers lucide-react resend motion
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

### Fase 1: Padronização de Código e Governança (Linting, Formatting & Typecheck)

1. **Scripts de Auditoria e Governança (`package.json`):**

* No Next.js 16 com ESLint 9 (Flat Config via `eslint.config.mjs`), a auditoria de código migrou para o ESLint CLI direto. Configure os scripts essenciais no `package.json`:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "typecheck": "tsc --noEmit"
}
```

* **`npm run lint`**: Executa o ESLint CLI para validar regras de qualidade, acessibilidade e Next.js.
* **`npm run typecheck`**: Compilação estrita de tipos do TypeScript sem emissão de arquivos (`tsc --noEmit`), garantindo integridade de schemas e contratos.

2. **Configurar Prettier com Ordenação Automática do Tailwind:**

* Instale o formatador e o plugin oficial:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

3. **Configurar os Aliases de Importação (`paths` no `tsconfig.json`):**

* Manter atalhos limpos para evitar importações relativas longas (`../../components/...`):

```json
"paths": {
  "@/*": ["./src/*"]
}
```

* *Acessos limpos:* `@/components/...`, `@/config/...`, `@/lib/...`, `@/types/...`.

4. **Configurar Cabeçalhos de Segurança HTTP (`next.config.ts`):**
* Conforme definido na ADR 0009, aplica cabeçalhos HTTP rígidos em todas as rotas para blindar o site contra ataques web:

```typescript
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS conservador ativo apenas em produção (sem includeSubDomains/preload para não afetar outros subdomínios do cliente)
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
    : []),
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

### Fase 2: Modelagem de Dados & Configuração Global (Site Configuration)

Para reutilizar este template em novos clientes, é fundamental desacoplar as informações do cliente dos componentes visuais.

1. **Criar a camada de abstração de dados globais (`src/config/site.ts`):**

```typescript
export const siteConfig = {
  name: "Empresa Exemplo",
  description: "Website institucional moderno, acessível e de alta performance.",
  url: "https://www.empresaexemplo.com.br",
  ogImage: "https://www.empresaexemplo.com.br/og.jpg",
  legal: {
    companyName: "Empresa Exemplo Ltda",
    cnpj: "00.000.000/0001-00",
    dpoEmail: "privacidade@empresaexemplo.com.br",
  },
  contact: {
    email: "contato@empresaexemplo.com.br",
    phone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
  },
  social: {
    instagram: "https://instagram.com/empresaexemplo",
    linkedin: "https://linkedin.com/company/empresaexemplo",
  },
};

export type SiteConfig = typeof siteConfig;
```

2. **Vantagem Arquitetural:** Em novos projetos de clientes, basta atualizar este único arquivo de configuração para refletir dados globais no cabeçalho, rodapé, contatos, metadados e termos de privacidade.

3. **Schema de Validação do Formulário com LGPD (`src/lib/schemas/contact.ts`):**

* Conforme definido na ADR 0007, o schema Zod valida os campos e o consentimento explícito de privacidade:

```typescript
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres."),
  email: z.string().email("Insira um e-mail válido."),
  phone: z.string().optional(),
  message: z.string().min(10, "A mensagem deve conter pelo menos 10 caracteres."),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar a Política de Privacidade para enviar." }),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

4. **Server Action com Defesa Anti-Spam (`src/app/actions/contact.ts`):**
* Conforme definido na ADR 0003, processa a submissão via Server Action como fronteira pública não confiável, aplicando validação estrita de dados no servidor e defesa em camadas:

```typescript
"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { resend } from "@/lib/resend";

export async function sendContactEmail(formData: ContactFormData & { honeypot?: string }) {
  // 1. Defesa Honeypot: se robô preencheu o campo oculto, descarta silenciosamente
  if (formData.honeypot) {
    return { success: true };
  }

  // 2. Validação estrita dos dados com Zod no servidor
  const parsed = contactFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  // 3. Disparo seguro via Resend API
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.CONTACT_EMAIL_TO!,
      subject: `Novo contato: ${parsed.data.name}`,
      text: parsed.data.message,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao enviar e-mail. Tente novamente mais tarde." };
  }
}
```

5. **Validação Segregada de Variáveis de Ambiente no Build (`src/env.ts`):**
* Conforme definido na ADR 0009, valida rigorosamente todas as variáveis de ambiente durante o `next build` com segregação explícita entre escopos de servidor e cliente:

```typescript
import { z } from "zod";

// 1. Variáveis exclusivas do Servidor (Segredos NUNCA expostos ao navegador)
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Comunicação Transacional (Core do Formulário)
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY é obrigatória."),
  RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL é obrigatória."),
  CONTACT_EMAIL_TO: z.string().email("CONTACT_EMAIL_TO deve ser um e-mail válido."),

  // Proteção Anti-Spam (Opcional em dev / validado quando Turnstile estiver ativo em produção)
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // Rate Limiting Distribuído (Upstash Redis para Serverless / opcional em dev com fallback para Map)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Keystatic CMS (Segredos necessários caso utilize GitHub App próprio em vez de Keystatic Cloud)
  KEYSTATIC_SECRET: z.string().optional(),
  KEYSTATIC_GITHUB_CLIENT_ID: z.string().optional(),
  KEYSTATIC_GITHUB_CLIENT_SECRET: z.string().optional(),
});

// 2. Variáveis Públicas do Cliente (Acessíveis no navegador via NEXT_PUBLIC_)
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL deve ser uma URL válida."),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_KEYSTATIC_PROJECT: z.string().optional(),
});

// 3. Schema Unificado com Validação Fail-Fast
export const envSchema = serverEnvSchema.merge(clientEnvSchema);

export const env = envSchema.parse(process.env);
```

> 🛡️ **Garantias Técnicas de Segurança:**
> 1. **Prevenção de Vazamentos:** Segredos definidos em `serverEnvSchema` não podem ser importados em componentes com `'use client'`, garantindo que chaves de API nunca cheguem ao bundle JavaScript público.
> 2. **Diferenciação Core vs. Opcionais:** As variáveis do formulário (`RESEND_*`) e URL base (`NEXT_PUBLIC_SITE_URL`) são mandatárias para o build, enquanto credenciais de integrações de borda (Turnstile, Upstash, Keystatic Cloud) admitem fallbacks graciosos para desenvolvimento local e pipelines de CI.
> 3. **Testabilidade Automatizada:** A validação é coberta por testes no Vitest (`src/env.test.ts`), confirmando o comportamento em cenários de setup mínimo (CI), setup completo de produção e rejeição de entradas inválidas.

---

### Fase 3: Design de Componentes da Interface (Layout & UI System)

Com a configuração central pronta, constrói-se a estrutura visual base do projeto:

1. **Configurar Variáveis Visuais no Tailwind CSS v4:**

* O Tailwind v4 adota uma arquitetura CSS-first (sem necessidade de arquivo `tailwind.config.ts`). A paleta de cores e extensões do tema são configuradas diretamente no arquivo `src/app/globals.css` via diretiva `@theme` e variáveis CSS (`primary`, `secondary`, `accent`, `background`), simplificando a personalização de marca para novos clientes.

2. **Implementar o Layout Raiz (`src/app/layout.tsx`):**

* Carregamento otimizado de fontes do Google via `next/font/google` (ex.: Inter ou Plus Jakarta Sans).
* Injeção de metadados dinâmicos consumindo as propriedades de `siteConfig`.

3. **Construir os Componentes de Infraestrutura Visual (`src/components/shared/`):**

* **`Header / Navbar`**: Menu navegável responsivo com suporte a acessibilidade e *mobile drawer*.
* **`Footer`**: Rodapé com contatos centralizados, redes sociais e copyright dinâmico.
* **`Hero Section`**: Bloco principal de apresentação e chamada para ação (*Call to Action - CTA*).

4. **Diretrizes de Animação Consciente (Motion & Acessibilidade):**

* **CSS First:** Priorizar transições nativas do Tailwind (`transition-*`) para estados simples (`hover`, `focus`, opacidade).
* **Bundle Otimizado:** Ao utilizar `motion/react`, encapsular as animações com `<LazyMotion features={domAnimation}>`, reduzindo o peso do JavaScript carregado.
* **Acessibilidade Obrigatória:** Respeitar o `prefers-reduced-motion` utilizando classes `motion-reduce:` do Tailwind ou o hook `useReducedMotion()`, garantindo conformidade WCAG para usuários com sensibilidade vestibular.

---

### Fase 4: Checklist de Go-Live & E-mails Transacionais (Resend)

Para que o formulário de contato funcione em produção enviando mensagens para o cliente final, a autenticação do domínio no DNS é uma etapa **obrigatória**:

1. **Adicionar o Domínio no Resend:**
   * Acesse o painel da [Resend (Domains)](https://resend.com/domains) e clique em **Add Domain**.
   * Cadastre o domínio principal do cliente (ex.: `empresa.com.br`) ou um subdomínio transacional (ex.: `mail.empresa.com.br`).

2. **Cadastrar Entradas DNS no Provedor (Cloudflare, Registro.br, GoDaddy):**
   * **SPF (TXT):** Autoriza os servidores da Resend a dispararem mensagens em nome do domínio.
   * **DKIM (CNAME / TXT):** Assinatura criptográfica que atesta a autenticidade e evita a caixa de spam.
   * **DMARC (TXT):** Política de segurança obrigatória para entrega no Gmail, Outlook e Yahoo (`v=DMARC1; p=none; ...`).

3. **Configurar Variáveis de Ambiente de Produção (Vercel):**
   * `RESEND_API_KEY`: Chave de API gerada no Resend.
   * `RESEND_FROM_EMAIL`: Remetente com o domínio verificado (ex.: `"Contato <contato@empresa.com.br>"`). *(Sem o domínio verificado, a API restringe o envio apenas para `onboarding@resend.dev`)*.
   * `CONTACT_EMAIL_TO`: E-mail do cliente onde os contatos devem chegar.

4. **Proteção Anti-Spam (Cota de 100 e-mails/dia):**
   * O plano gratuito da Resend possui cota de **3.000 e-mails/mês** e teto estrito de **100 e-mails/dia**. O formulário deve conter proteção anti-bot (campo *honeypot* ou Cloudflare Turnstile) para evitar que envios automatizados consumam a cota diária.

---

### Fase 5: Manutenção Contínua e Estratégia de Atualização (Upstream)

Conforme estabelecido na [ADR 0010](adr/0010-estrategia-de-atualizacao-e-versionamento.md), os projetos de clientes derivados deste template utilizam versionamento SemVer e releases oficiais para receber melhorias de código e patches de segurança.

> [!WARNING]
> **Status do Procedimento de Mesclagem de Históricos:**  
> Como o recurso *"Use this template"* gera um repositório com histórico desconectado do template original, a execução direta de `git merge template/main --allow-unrelated-histories` é classificada como **estratégia experimental**. Por ausência de ancestral comum (*merge-base*), o Git pode interpretar arquivos modificados como adições concorrentes (*both added*), gerando falsos conflitos massivos. A separação arquitetural (`siteConfig` e conteúdo desacoplados) mitiga mas não elimina esse risco por si só. Um procedimento de sincronização completo e seguro será formalmente homologado na Fase 2.

#### Procedimento Recomendado no Momento:

1. **Vincular o Template como Remote Secundário:**
   No diretório do projeto do cliente (executar uma única vez):
   ```bash
   git remote add template https://github.com/heviane/institutional-website-template.git
   ```

2. **Avaliação das Mudanças e Releases:**
   Consultar o *Changelog* na release oficial antes de qualquer intervenção, identificando se a atualização contém correções críticas de segurança ou novos recursos desejados.

3. **Aplicação de Hotfixes Críticos (Cherry-Pick em Branch Isolada):**
   Para aplicar uma correção pontual ou atualização de pacote em segurança:
   ```bash
   # Buscar novidades do template
   git fetch template

   # Criar branch de teste para isolar a atualização
   git checkout -b chore/patch-seguranca

   # Aplicar cirurgicamente o commit desejado
   git cherry-pick <hash-do-commit>

   # Executar os portões de qualidade para garantir integridade
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

4. **Preservação de Dados do Cliente:**
   A arquitetura desacoplada busca proteger `src/config/site.ts`, mídias em `/public/images/content/` e conteúdos do Keystatic contra substituições acidentais durante a manutenção.

---
