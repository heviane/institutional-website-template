# Feature 003: Validação de Ambiente, Formulário Transacional & Conformidade Legal (Spec)

* **Status:** Em Especificação (Aguardando Aprovação do Desenvolvedor)
* **Data:** 2026-10-25
* **Fase do Roadmap:** [Fase 2 (Core & MVP)](../../docs/03-project-roadmap.md)
* **ADRs Vinculados:**
  * [ADR 0003: Estratégia de Formulários e Comunicação Transacional](../../docs/adr/0003-estrategia-de-formularios.md)
  * [ADR 0007: Conformidade com a LGPD e Privacidade por Design](../../docs/adr/0007-conformidade-lgpd-e-privacidade.md)
  * [ADR 0009: Política de Segurança, Headers HTTP e Validação de Ambiente](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)
  * [ADR 0011: Defesa Anti-Spam, Proteção de Formulários e Rate Limiting](../../docs/adr/0011-defesa-antispam-e-protecao-de-formularios.md)
* **Constituição de Engenharia:** [`AGENTS.md`](../../AGENTS.md)

---

## 🎯 1. Objetivo e Contexto

Com o Design System e o Layout Shell Demo estabelecidos na Feature 002, a **Feature 003** tem como objetivo implementar o fluxo transacional de captação de leads e contato institucional, sustentado por:
1. **Validação Segregada de Variáveis de Ambiente no Build:** Proteção contra falhas de configuração em tempo de execução via Zod (`src/env/server.ts` com `import "server-only"` e `src/env/client.ts`).
2. **Defesa Anti-Spam em 3 Camadas:** Proteção contra robôs automatizados preservando o teto gratuito de 100 e-mails/dia do Resend sem quebra de acessibilidade:
   - **Camada 1 (Honeypot):** Campo oculto com descarte silencioso e resposta de sucesso simulada para despistar bots.
   - **Camada 2 (Rate Limiting com Hash de IP):** Limitação de até 5 submissões/hora por IP, anonimizado via `HMAC-SHA256(ip, secret + YYYY-MM-DD)` em conformidade com a LGPD (Map em dev, Upstash Redis em prod).
   - **Camada 3 (Cloudflare Turnstile):** Verificação inteligente invisível sem cookies de rastreamento.
3. **Disparo Transacional via Resend API:** Envio direto do e-mail com contingência em caso de falha apontando para canais diretos (WhatsApp/Telefone) e arquitetura *Zero-Database* (sem persistência de dados pessoais em banco de dados).
4. **Formulário Acessível e Reativo:** Componente de interface construído com React Hook Form + Zod (`@hookform/resolvers/zod`), feedback inline, estados de carregamento e conformidade WCAG 2.1 AA.
5. **Páginas Legais Estáticas Fidedignas:** `/politica-de-privacidade` e `/termos-de-uso` estruturadas e integradas ao `siteConfig`, refletindo com fidelidade os serviços técnicos ativos.

---

## 📦 2. Escopo Funcional

### O que ESTÁ no escopo (In-Scope)

1. **Validação Segregada de Variáveis de Ambiente (`src/env/`):**
   - `src/env/client.ts`: Validação de variáveis públicas (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) acessíveis no browser e servidor.
   - `src/env/server.ts`: Protegido com `import "server-only";`, validando segredos (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL_TO`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_SECRET`).
   - Validação condicional: Em produção (`NODE_ENV === "production"`), Turnstile e Upstash são mandatórios; em desenvolvimento e testes, admitem bypass controlado para execução offline e CI.
   - Padrão *fail-fast*: Interrupção imediata do build caso alguma variável obrigatória esteja ausente ou malformatada.

2. **Schema Canônico de Contato (`src/lib/schemas/contact.ts`):**
   - Campos: `name` (mínimo 2 caracteres), `email` (e-mail válido), `phone` (opcional ou formatado), `message` (mínimo 10 e máximo 1000 caracteres), `website` (honeypot oculto, deve ser vazio), `turnstileToken` (token do Turnstile) e `privacyConsent` (salvaguarda de consentimento configurável com valor padrão `true`).
   - Mensagens de erro amigáveis em português (pt-BR).

3. **Rate Limiting Anônimo por Hash de IP (`src/lib/rate-limit.ts`):**
   - Extração segura do IP via headers confiáveis (`x-real-ip`, `cf-connecting-ip`, fallback `x-forwarded-for`).
   - Anonimização criptográfica via `HMAC-SHA256(ip, secret + YYYY-MM-DD)` garantindo consistência entre lambdas serverless sem armazenar IPs brutos.
   - Janela deslizante de 1 hora com limite de 5 requisições por hash.
   - Armazenamento em memória (`Map` nativo com TTL) para desenvolvimento/testes e integração com Upstash Redis REST em produção.

4. **Cliente Resend & Server Action Canônica (`src/app/actions/contact.ts`):**
   - Inicialização isolada do cliente Resend em `src/lib/resend.ts`.
   - Server Action `sendContactEmail(rawInput: unknown): Promise<ActionResponse>`:
     - Validação estrita do payload não confiável via Zod.
     - Checagem da Camada 1: se `website` contiver texto, simula sucesso (`{ success: true, message: "Mensagem enviada com sucesso!" }`) e descarta silenciosamente.
     - Checagem da Camada 2: se rate limit estourar, retorna erro tipado (`{ success: false, message: "Limite temporário de envios atingido. Por favor, tente novamente mais tarde ou use nosso WhatsApp." }`).
     - Checagem da Camada 3: validação do token do Turnstile na API da Cloudflare (com bypass gracioso em dev/test).
     - Disparo do e-mail com remetente autenticado `RESEND_FROM_EMAIL` para o destinatário corporativo `CONTACT_EMAIL_TO`.
     - Contingência: em caso de erro da API do Resend (ex.: cota esgotada), captura e retorna mensagem amigável instruindo o contato via WhatsApp corporativo (`siteConfig.contact.whatsapp`).
     - Retorno tipado em JavaScript, **nunca códigos HTTP REST**.

5. **Componente de Formulário Acessível (`src/components/shared/contact-form/contact-form.tsx`):**
   - Ilha de cliente (`'use client'`) com React Hook Form e `@hookform/resolvers/zod`.
   - Alvos de toque mínimos de 44x44px nos botões e inputs.
   - Campo honeypot invisível para humanos (`tabIndex={-1}`, `aria-hidden="true"`, posicionado fora da tela).
   - Widget do Cloudflare Turnstile com carregamento assíncrono.
   - Estados visuais claros: ocioso, enviando (*loading spinner* com botão desabilitado), sucesso (*alert* verde) e erro (*alert* de alerta com link para WhatsApp).
   - Acessibilidade WCAG 2.1 AA (`aria-describedby`, `aria-invalid`, `role="alert"`).

6. **Páginas Legais Estáticas (`src/app/(legal)/`):**
   - `src/app/(legal)/politica-de-privacidade/page.tsx`: Declaração transparente dos serviços ativos (Resend, Cloudflare Turnstile, Plausible), base legal, direitos dos titulares e contato do DPO (`siteConfig.legal.dpoEmail`).
   - `src/app/(legal)/termos-de-uso/page.tsx`: Termos gerais de uso do site institucional consumindo Razão Social e CNPJ de `siteConfig`.
   - Renderizadas como Server Components (RSC) com container de leitura `max-w-4xl mx-auto py-16 px-4`.

7. **Integração na Home Page (`src/app/page.tsx`):**
   - Substituição do bloco estático de CTA de contato pela renderização do formulário real `<ContactForm />` integrado na seção `#contato`.

### O que NÃO está no escopo (Out-of-Scope)

* Armazenamento persistente de leads em banco de dados SQL ou NoSQL (terminantemente proibido pelo ADR 0007 - *Zero-Database Architecture*).
* Painel administrativo e coleções de conteúdo do Keystatic CMS (*Tratados na Feature 004*).
* Configuração de sitemap dinâmico e Schema.org JSON-LD (*Tratados na Feature 005*).
* Cookie banner intrusivo para pixels de publicidade (o template opera em modo cookieless por padrão).

---

## 🚦 3. Critérios Objetivos de Aceitação (Acceptance Criteria)

1. **Validação de Ambientes e Segregação de Envs (Item 1 da Seção 2.2 do Roadmap):**
   - `npm run build` compila com sucesso sob a configuração mínima de desenvolvimento/CI.
   - `npm run build` rejeita imediatamente com relatório explícito caso alguma variável obrigatória esteja ausente ou malformatada.
   - Tentativa de importar `src/env/server.ts` em Client Component resulta em erro de compilação bloqueante (`server-only`).
   - Suíte `tests/env.test.ts` valida os cenários de dev, prod e entradas inválidas.

2. **Defesa Anti-Spam & Resiliência Transacional (Item 3 da Seção 2.2 do Roadmap):**
   - **Honeypot:** Submissão com campo `website` preenchido retorna sucesso simulado sem acionar a Resend API.
   - **Rate Limit:** Submissões repetidas a partir do mesmo IP acima do teto de 5/hora são bloqueadas com mensagem amigável antes de bater no Resend.
   - **Turnstile:** Submissão sem token válido é rejeitada em ambiente de produção.
   - **Resend Mock:** Envio bem-sucedido dispara e-mail com os dados preenchidos para `CONTACT_EMAIL_TO`.
   - **Contingência:** Falha na API do Resend (ex.: status 429 ou cota esgotada) retorna resposta amigável apontando para o WhatsApp e telefone da empresa.
   - **Payload Não Confiável:** Objetos malformados, arrays ou tipos primitivos na Server Action são rejeitados pelo Zod sem exceções não tratadas (*unhandled rejections*).

3. **Acessibilidade & Usabilidade (WCAG 2.1 AA):**
   - O formulário `<ContactForm />` e as páginas legais possuem **zero violações de acessibilidade** auditadas pelo `vitest-axe`.
   - Todos os campos de entrada possuem rótulos (`<label>`) associados via `htmlFor`/`id`.
   - Mensagens de erro são associadas aos campos via `aria-describedby` e `aria-invalid`.
   - Teclado navega por todos os campos de forma lógica, sem armadilhas de foco.

4. **Homologação dos Quality Gates:**
   - Todos os testes no Vitest passam (100% verdes).
   - `npm run verify` (`audit:docs`, `lint`, `typecheck`, `test`, `build`) passa com zero erros.

