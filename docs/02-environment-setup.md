# 02 - Environment e Setup

Guia de Configuração e Setup do Ambiente.

Este documento orienta o passo a passo técnico completo para a inicialização e estruturação do projeto **`institutional-website-template`**, cobrindo desde a execução dos comandos no terminal até a arquitetura de arquivos, padrões de governança de código e componentes base de layout.

---

## Parte 1: Inicialização e Bootstrapping

Após a conclusão do planejamento conceitual, o primeiro passo é erguer a infraestrutura base do projeto.

> **Nota:** Certifique-se de estar na raiz do repositório clonado localmente antes de executar os comandos.

### Pré-requisitos de Ambiente

* **Node.js:** Versão `24.x` (Active LTS padrão oficial travado no [`.nvmrc`](../.nvmrc) e no CI). Versões legadas (Node 20 ou anterior) não são suportadas. O repositório inclui o arquivo [`.nvmrc`](../.nvmrc) para sincronizar a versão do Node via `nvm use`.
* **Gerenciador de Pacotes:** `npm` (padrão) ou `pnpm`.
* **Git:** Para controle de versão e CI/CD.

---

### Passo 1: Inicialização Declarativa do Next.js na Raiz

Como este repositório já contém a arquitetura, governança e documentação pré-configuradas na raiz (`AGENTS.md`, `README.md`, `docs/`, `specs/`, `.gitignore`, etc.), a inicialização é feita de forma **declarativa e determinística**, evitando assistentes interativos como `create-next-app` (que conflitam com pastas não-vazias e arriscam sobrescrever arquivos de governança).

O setup declarativo estabelece o `package.json` canônico com dependências travadas e scripts de qualidade, as configurações essenciais (`tsconfig.json`, `next.config.ts`, `eslint.config.mjs`), os utilitários de design system e a estrutura mínima em `src/`:

```bash
# Instalação determinística de todas as dependências declaradas no package.json
npm install
```

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

* Todos os scripts de ciclo de vida e quality gates residem no arquivo canônico [`package.json`](../package.json):
  * **`npm run dev`**: Servidor local de desenvolvimento do Next.js 16.
  * **`npm run build`**: Compilação de produção com Turbopack e geração de SSG.
  * **`npm run lint`**: Auditoria do ESLint 9 (Flat Config via `eslint.config.mjs`).
  * **`npm run typecheck`**: Geração de tipos com `next typegen` e compilação de tipos com `tsc --noEmit`.
  * **`npm test`**: Execução da suíte de testes unitários e de acessibilidade no Vitest.
  * **`npm run audit:docs`**: Auditoria documental e Anti-Doc Rot (`scripts/audit-docs.mjs`).
  * **`npm run verify`**: Quality gate unificado local obrigatório antes de commits e no CI.

2. **Configurar Prettier com Ordenação Automática do Tailwind:**

* Formatador e plugin oficial instalados em `devDependencies`: `prettier` e `prettier-plugin-tailwindcss`.

3. **Configurar os Aliases de Importação (`paths` no `tsconfig.json`):**

* Os atalhos canônicos `@/*` mapeiam diretamente para `./src/*` no arquivo [`tsconfig.json`](../tsconfig.json), permitindo importações limpas (`@/components/...`, `@/config/...`, `@/lib/...`, `@/env/...`).

4. **Configurar Cabeçalhos de Segurança HTTP (`next.config.ts`):**
* Conforme formalizado na [ADR 0009](adr/0009-seguranca-headers-e-validacao-de-ambiente.md) e implementado no arquivo canônico [`next.config.ts`](../next.config.ts), o template aplica cabeçalhos HTTP defensivos em todas as rotas da aplicação para blindar o site contra ataques web (*Clickjacking*, *MIME sniffing*, injeções) e monitorar scripts via `Content-Security-Policy-Report-Only` (liberando Cloudflare Turnstile, mídias e conexões seguras).
* Em produção, ativa `Strict-Transport-Security` (HSTS) conservador com `max-age=31536000` (1 ano), deliberadamente sem `includeSubDomains` para não impactar a infraestrutura legada de subdomínios do cliente.
* O código executável, tipado e testado reside diretamente em [`next.config.ts`](../next.config.ts).

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

3. **Schema de Validação do Formulário com LGPD e Limites de Payload (`src/lib/schemas/contact.ts`):**

* Conforme definido nas [ADR 0003](adr/0003-estrategia-de-formularios.md) e [ADR 0007](adr/0007-conformidade-lgpd-e-privacidade.md), o schema Zod valida tipos, restringe limites de caracteres contra sobrecarga (DoS) e inclui os campos de segurança:

```typescript
import { z } from "zod";

// Travado na versão estável Zod 3 (^3.24.x) para compatibilidade com @hookform/resolvers/zod
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "O nome deve conter pelo menos 2 caracteres.").max(100, "O nome excede 100 caracteres."),
  email: z.string().trim().email("Insira um e-mail válido.").max(255, "E-mail muito longo."),
  phone: z.string().trim().max(20, "Telefone inválido.").optional(),
  message: z.string().trim().min(10, "A mensagem deve conter pelo menos 10 caracteres.").max(5000, "A mensagem excede o limite de 5.000 caracteres."),
  // Salvaguarda LGPD configurável (ADR 0007): z.literal(true) para opt-in explícito (Art. 7º, I) ou opcional para contato preliminar (Art. 7º, V)
  privacyConsent: z.boolean().optional(),
  // Camada 1: Campo Honeypot (deve estar vazio em envios legítimos)
  honeypot: z.string().max(0, "Tentativa de automação detectada.").optional(),
  // Camada 3: Token efêmero do Cloudflare Turnstile gerado no frontend (opcional em dev/test sem chaves)
  turnstileToken: z.string().optional(),
}).superRefine((data, ctx) => {
  // Em produção, a presença do token do Turnstile é obrigatória para combater automações
  if (process.env.NODE_ENV === "production" && !data.turnstileToken) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["turnstileToken"],
      message: "A verificação de segurança é obrigatória.",
    });
  }
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

4. **Server Action com Defesa em Camadas e Contingência (`src/app/actions/contact.ts`):**
* Conforme definido no [ADR 0003](adr/0003-estrategia-de-formularios.md) e [ADR 0011](adr/0011-defesa-antispam-e-protecao-de-formularios.md), a Server Action é tratada como fronteira pública não confiável (*untrusted boundary*), validando tipo e tamanho do payload, aplicando Honeypot, Rate Limiting por IP, verificação na API do Turnstile, envio via Resend e tratamento de contingência de cota com mascaramento de erros internos:

```typescript
"use server";

import { headers } from "next/headers";
import { contactFormSchema } from "@/lib/schemas/contact";
import { resend } from "@/lib/resend";
import { serverEnv } from "@/env/server";
import { siteConfig } from "@/config/site";
import { checkRateLimit } from "@/lib/rate-limit"; // Upstash Redis em produção / Map com TTL em desenvolvimento

export type ActionResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

// Verificação do token na API do Cloudflare Turnstile
async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  // Bypass gracioso para desenvolvimento local ou CI caso a chave não esteja configurada
  if (process.env.NODE_ENV !== "production" && !serverEnv.TURNSTILE_SECRET_KEY) {
    return true;
  }
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: serverEnv.TURNSTILE_SECRET_KEY ?? "",
        response: token,
        remoteip: remoteIp ?? "",
      }),
    });

    const data = (await response.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

export async function sendContactEmail(rawInput: unknown): Promise<ActionResponse> {
  // 1. Extração segura do IP do visitante (prioriza x-real-ip e cf-connecting-ip contra forjamento)
  const headerList = await headers();
  const rawIp =
    headerList.get("x-real-ip") ??
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1";

  // 2. Proteção preliminar de tipo e tamanho da carga (fronteira pública)
  if (!rawInput || typeof rawInput !== "object") {
    return { success: false, message: "Payload de requisição inválido." };
  }

  // 3. Camada 1: Honeypot (descarte silencioso com resposta de sucesso simulada para despistar bots)
  const inputRecord = rawInput as Record<string, unknown>;
  if (inputRecord.honeypot && typeof inputRecord.honeypot === "string" && inputRecord.honeypot.length > 0) {
    return { success: true, message: "Mensagem enviada com sucesso!" };
  }

  // 4. Camada 2: Rate Limiting por Hash de IP (padrão de até 5 requisições/hora, sem armazenar IP bruto)
  const isRateLimitAllowed = await checkRateLimit(rawIp);
  if (!isRateLimitAllowed) {
    return {
      success: false,
      message: `Limite temporário de envios atingido. Para atendimento imediato, entre em contato via WhatsApp (${siteConfig.contact.whatsapp}) ou e-mail corporativo (${siteConfig.contact.email}).`,
    };
  }

  // 5. Validação rigorosa dos campos e limites via Zod
  const parsed = contactFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Por favor, preencha os campos obrigatórios corretamente.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, message, turnstileToken } = parsed.data;

  // 6. Camada 3: Verificação do desafio Cloudflare Turnstile no servidor
  const isTurnstileValid = await verifyTurnstileToken(turnstileToken, rawIp);
  if (!isTurnstileValid) {
    return {
      success: false,
      message: "Falha na validação de segurança anti-robô. Por favor, recarregue a página e tente novamente.",
    };
  }

  // Higienização contra Email Header Injection (remoção de caracteres de controle CR/LF)
  const sanitizedSubjectName = name.replace(/[\r\n]/g, "").trim();

  // 7. Envio via Resend API com tratamento gracioso de falhas e contingência de cota
  try {
    const { error } = await resend.emails.send({
      from: serverEnv.RESEND_FROM_EMAIL,
      to: serverEnv.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `[Contato Site] Mensagem de ${sanitizedSubjectName}`,
      text: `Nome: ${name}\nE-mail: ${email}\nTelefone: ${phone ?? "Não informado"}\n\nMensagem:\n${message}`,
    });

    if (error) {
      // Falha reportada pelo provedor (ex.: HTTP 429 ou cota diária excedida)
      return {
        success: false,
        message: `Não foi possível encaminhar seu formulário no momento. Por favor, utilize nosso WhatsApp (${siteConfig.contact.whatsapp}) ou e-mail direto (${siteConfig.contact.email}).`,
      };
    }

    return {
      success: true,
      message: "Mensagem recebida com sucesso! Retornaremos o seu contato em breve.",
    };
  } catch {
    // Mascaramento de erros internos de runtime sem vazar credenciais ou rastreamento de pilha
    return {
      success: false,
      message: `Ocorreu uma instabilidade no envio. Caso prefira, utilize nossos canais diretos: WhatsApp (${siteConfig.contact.whatsapp}) ou e-mail (${siteConfig.contact.email}).`,
    };
  }
}
```

5. **Validação Segregada de Variáveis de Ambiente no Build (`src/env/`):**
* Conforme formalizado na [ADR 0009](adr/0009-seguranca-headers-e-validacao-de-ambiente.md), valida rigorosamente todas as variáveis de ambiente durante o `next build` com segregação física entre escopos de servidor e cliente em dois módulos dedicados:

**Módulo de Cliente (`src/env/client.ts`):**
```typescript
import { z } from "zod";

// Variáveis Públicas do Cliente (Acessíveis no navegador via NEXT_PUBLIC_)
export const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL deve ser uma URL válida."),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    // Keystatic Cloud (Padrão de produção conforme ADR 0006)
    NEXT_PUBLIC_KEYSTATIC_PROJECT: z.string().optional(),
    // Keystatic Modo GitHub App (Alternativa self-hosted)
    NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Em produção, o Turnstile é mandatório para proteção anti-spam do formulário (ADR 0011)
    if (process.env.NODE_ENV === "production" && !data.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
        message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY é obrigatória em produção para proteção contra spam.",
      });
    }
  });

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_KEYSTATIC_PROJECT: process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT,
  NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
});
```

**Módulo de Servidor (`src/env/server.ts`):**
```typescript
import "server-only";
import { z } from "zod";

// Variáveis exclusivas do Servidor (Segredos NUNCA expostos ao navegador)
export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // Comunicação Transacional (Core do Formulário)
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY é obrigatória."),
    RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL é obrigatória."),
    CONTACT_EMAIL_TO: z.string().email("CONTACT_EMAIL_TO deve ser um e-mail válido."),

    // Proteção Anti-Spam (Mandatória em produção conforme ADR 0011 / opcional em dev)
    TURNSTILE_SECRET_KEY: z.string().optional(),

    // Rate Limiting Distribuído (Upstash Redis para Serverless / opcional em dev com fallback para Map)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

    // Keystatic CMS (Segredos necessários caso utilize GitHub App próprio em vez de Keystatic Cloud)
    KEYSTATIC_SECRET: z.string().optional(),
    KEYSTATIC_GITHUB_CLIENT_ID: z.string().optional(),
    KEYSTATIC_GITHUB_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Em produção, a chave secreta do Turnstile é mandatória para validação dos tokens (ADR 0011)
    if (data.NODE_ENV === "production" && !data.TURNSTILE_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["TURNSTILE_SECRET_KEY"],
        message: "TURNSTILE_SECRET_KEY é obrigatória em produção para validação dos envios de formulário.",
      });
    }
  });

export const serverEnv = serverEnvSchema.parse(process.env);
```

> 🛡️ **Garantias Técnicas de Segurança:**
> 1. **Prevenção de Vazamentos:** O arquivo `src/env/server.ts` utiliza `import "server-only";`, fazendo com que o compilador do Next.js aborte o build se qualquer Client Component tentar importá-lo.
> 2. **Imunidade a Erros de Inicialização no Cliente:** Como `src/env/client.ts` é um módulo isolado, Client Components importam `clientEnv` de `@/env/client` sem carregar o código de servidor nem disparar exceções no navegador.
> 3. **Consistência Anti-Spam (Fail-Fast):** Em produção, o build falha de imediato se o Turnstile não for configurado em ambas as pontas (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` no cliente e `TURNSTILE_SECRET_KEY` no servidor), eliminando formulários quebrados para o usuário final ([ADR 0011](adr/0011-defesa-antispam-e-protecao-de-formularios.md)).
> 4. **Testabilidade Automatizada:** A validação é coberta por testes no Vitest (`tests/env.test.ts`), confirmando o comportamento em cenários de setup mínimo (CI), setup completo de produção e rejeição de entradas inválidas.

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
