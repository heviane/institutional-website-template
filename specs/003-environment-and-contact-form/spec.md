# Feature 003: Validação de Ambiente, Formulário Transacional & Conformidade Legal (Spec)

- **Status:** Concluída
- **Data:** 2026-10-25
- **Fase do Roadmap:** [Fase 2 (Core & MVP)](../../docs/03-project-roadmap.md)
- **ADRs Vinculados:**
  - [ADR 0003: Estratégia de Formulários e Comunicação Transacional](../../docs/adr/0003-estrategia-de-formularios.md)
  - [ADR 0007: Conformidade com a LGPD e Privacidade por Design](../../docs/adr/0007-conformidade-lgpd-e-privacidade.md)
  - [ADR 0009: Política de Segurança, Headers HTTP e Validação de Ambiente](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)
  - [ADR 0011: Defesa Anti-Spam, Proteção de Formulários e Rate Limiting](../../docs/adr/0011-defesa-antispam-e-protecao-de-formularios.md)
- **Constituição de Engenharia:** [`AGENTS.md`](../../AGENTS.md)

---

## 🎯 1. Objetivo e Contexto

Com o Design System e o Layout Shell Demo estabelecidos na Feature 002, a **Feature 003** tem como objetivo implementar o fluxo transacional de captação de leads e contato institucional, sustentado por:

1. **Validação Segregada de Variáveis de Ambiente no Build:** Proteção contra falhas de configuração em tempo de execução via Zod (`src/env/server.ts` com `import "server-only"` e `src/env/client.ts`).
2. **Defesa Anti-Spam em 3 Camadas:** Proteção contra robôs automatizados preservando o teto gratuito de 100 e-mails/dia do Resend sem quebra de acessibilidade:
   - **Camada 1 (Honeypot):** Campo oculto com descarte silencioso e resposta de sucesso simulada para despistar bots.
   - **Camada 2 (Rate Limiting com Hash de IP):** Limitação de até 5 submissões por janela fixa de 1 hora com TTL relativo, anonimizado via `HMAC-SHA256(ip, RATE_LIMIT_SECRET)` em estrita conformidade com a LGPD (Map em dev, Upstash Redis em prod).
   - **Camada 3 (Cloudflare Turnstile):** Verificação inteligente invisível sem cookies de rastreamento.
3. **Disparo Transacional via Resend API:** Envio direto do e-mail com contingência em caso de falha apontando para canais diretos (WhatsApp/Telefone) e arquitetura _Zero-Database_ (sem persistência de dados pessoais em banco de dados).
4. **Formulário Acessível e Reativo:** Componente de interface construído com React Hook Form + Zod (`@hookform/resolvers/zod`), feedback inline, estados de carregamento e conformidade WCAG 2.1 AA.
5. **Páginas Legais Estáticas Fidedignas:** `/politica-de-privacidade` e `/termos-de-uso` estruturadas e integradas ao `siteConfig`, refletindo com fidelidade os serviços técnicos ativos.

---

## 📦 2. Escopo Funcional

### O que ESTÁ no escopo (In-Scope)

1. **Validação Segregada de Variáveis de Ambiente (`src/env/`):**
   - `src/env/client.ts`: Validação de variáveis públicas (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_ENABLE_TURNSTILE`) acessíveis no browser e servidor.
   - `src/env/server.ts`: Protegido com `import "server-only";`, validando segredos (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL_TO`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_SECRET`).
   - **Ativação Progressiva & Modo "Lite" para Micro-Projetos:** As variáveis mínimas obrigatórias para produção são estritamente as do Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL_TO`), a URL do site (`NEXT_PUBLIC_SITE_URL`) e um `RATE_LIMIT_SECRET` forte. Os serviços de infraestrutura externa (Upstash Redis e Cloudflare Turnstile) são de ativação progressiva com suporte a Feature Flag (`NEXT_PUBLIC_ENABLE_TURNSTILE="false"` para desligar o Turnstile instantaneamente sem apagar credenciais). Se ausentes ou desativados, o sistema opera de forma segura e imediata em "Modo Lite" com as Camadas 1 (Honeypot) e 2 (Rate Limiting via `Map` em memória com TTL), viabilizando o deploy de sites institucionais simples sem atrito de contas de terceiros.
   - **Contrato Estrito de RATE_LIMIT_SECRET:** Em produção (`NODE_ENV === "production"`), `RATE_LIMIT_SECRET` é obrigatório (mínimo 16 caracteres) e **não pode** conter o valor padrão público de desenvolvimento. Em dev/test, admite fallback controlado para viabilizar execução offline e CI.
   - **Paridade Estrita do Upstash Redis:** Se `UPSTASH_REDIS_REST_URL` for configurado, `UPSTASH_REDIS_REST_TOKEN` também deve ser; e vice-versa. Configurações parciais são rejeitadas imediatamente no build.
   - **Sanitização de Logs:** Mensagens de erro de validação de ambiente listam apenas os nomes das variáveis e as mensagens de erro, sem vazar valores de segredos nos logs.
   - Padrão _fail-fast_: Interrupção imediata do build caso alguma variável core obrigatória esteja ausente ou malformatada.

2. **Schema Canônico de Contato (`src/lib/schemas/contact.ts`):**
   - Campos: `name` (mínimo 2 caracteres), `email` (e-mail válido), `phone` (opcional ou formatado), `message` (mínimo 10 e máximo 1000 caracteres), `website` (honeypot oculto, deve ser vazio), `turnstileToken` (token do Turnstile, opcional se Turnstile não estiver configurado) e `privacyConsent` (salvaguarda de consentimento configurável com valor padrão `true`).
   - Mensagens de erro amigáveis em português (pt-BR).

3. **Rate Limiting com Pseudonimização de IP por Hash HMAC (`src/lib/rate-limit.ts`):**
   - Extração segura do IP via headers confiáveis (`x-real-ip`, `cf-connecting-ip`, fallback `x-forwarded-for`).
   - Pseudonimização técnica do endereço IP via `HMAC-SHA256(ip, serverEnv.RATE_LIMIT_SECRET)` (conforme Art. 13, § 4º da LGPD), garantindo consistência determinística entre lambdas serverless sem armazenar ou expor endereços IP brutos em texto claro.
   - **Algoritmo de Janela Fixa com TTL Relativo (Fixed Window):** Limite de até 5 submissões por janela de 3.600 segundos (1 hora). O TTL é estabelecido na primeira requisição e expira naturalmente após 1 hora de inatividade, eliminando o registro da memória/Redis sem resíduos de dados e sem anomalias na virada da meia-noite.
   - **Armazenamento Híbrido com Fallback Gracioso (Modo Robusto vs. Modo Lite):** Integração nativa com Upstash Redis REST (`INCR` + `EXPIRE 3600`) quando as variáveis de ambiente estiverem configuradas em produção (Modo Robusto); e fallback para `Map` nativo em memória com timestamp de expiração no Modo Lite ([ADR 0012](../../docs/adr/0012-deploy-progressivo-modo-lite-e-rate-limiting-serverless.md)). Registra-se formalmente que, em ambiente serverless sem Redis, o armazenamento em memória opera em regime de **"melhor esforço" (_best-effort_)**, contendo rajadas por container sem coordenação global entre lambdas concorrentes.

4. **Cliente Resend & Server Action Canônica (`src/app/actions/contact.ts`):**
   - Inicialização isolada do cliente Resend em `src/lib/resend.ts`.
   - Server Action `sendContactEmail(rawInput: unknown): Promise<ActionResponse>`:
     - Guarda Preliminar de Payload Bruto (Anti-DoS): Rejeição imediata antes do parse caso o payload bruto serializado exceda 5.000 caracteres (~5 KB), protegendo a CPU serverless contra buffer stuffing.
     - Validação estrita do payload não confiável via Zod com limite funcional de 1.000 caracteres no campo `message`.
     - Checagem da Camada 1 (Honeypot): se `website` contiver texto, simula sucesso (`{ success: true, message: "Mensagem enviada com sucesso!" }`) e descarta silenciosamente.
     - Checagem da Camada 2 (Rate Limiting - _Fail-Closed_): verifica taxa de envio do hash de IP. Se excedido ou se o Redis em produção sofrer pane/indisponibilidade, a requisição é bloqueada (_Fail-Closed_, impedindo que falhas de infraestrutura contornem o limite) e retorna mensagem de contingência orientando o contato via WhatsApp.
     - Checagem da Camada 3 (Turnstile - _Fail-Closed_): quando ativado (`NEXT_PUBLIC_ENABLE_TURNSTILE`), valida o token na Cloudflare. Se o token for inválido OU se a API da Cloudflare falhar/estiver indisponível (timeout/5xx), a Server Action bloqueia o envio imediatamente (_Fail-Closed_, não invoca o Resend) e retorna erro amigável de validação de segurança. Se em modo Lite (desativado ou chaves ausentes), essa camada é ignorada de forma transparente.
     - Disparo Transacional via Resend: acionado apenas se todas as 3 camadas forem rigorosamente aprovadas.
     - Contingência com Sanitização Absoluta: se a chamada ao Resend falhar (ex.: status 429, cota diária esgotada ou instabilidade), o erro é registrado internamente via log estruturado (`console.error`), mas a resposta para o frontend NUNCA expõe stack traces, chaves de API, status HTTP ou respostas brutas do provedor. Retorna mensagem amigável instruindo o contato via WhatsApp/telefone da empresa (`siteConfig.contact`).
     - Retorno tipado em JavaScript (`ActionResponse`), **nunca códigos HTTP REST**.

5. **Componente de Formulário Acessível (`src/components/shared/contact-form/contact-form.tsx`):**
   - Ilha de cliente (`'use client'`) com React Hook Form e `@hookform/resolvers/zod`.
   - Alvos de toque mínimos de 44x44px nos botões e inputs.
   - Campo honeypot invisível para humanos (`tabIndex={-1}`, `aria-hidden="true"`, posicionado fora da tela).
   - Widget do Cloudflare Turnstile com carregamento assíncrono.
   - Estados visuais claros: ocioso, enviando (_loading spinner_ com botão desabilitado), sucesso (_alert_ verde) e erro (_alert_ de alerta com link para WhatsApp).
   - Acessibilidade WCAG 2.1 AA (`aria-describedby`, `aria-invalid`, `role="alert"`).

6. **Páginas Legais Estáticas (`src/app/(legal)/`):**
   - `src/app/(legal)/politica-de-privacidade/page.tsx`: Declaração transparente dos serviços reais de infraestrutura (Vercel para hospedagem/borda, Resend para envio efêmero e Upstash para rate limiting com IP pseudonimizado), base legal, direitos dos titulares, contato do DPO (`siteConfig.legal.dpoEmail`) e cláusula de Transferência Internacional de Dados (Art. 33 da LGPD). A exibição de serviços opcionais (como Cloudflare Turnstile, Plausible Analytics ou Google Analytics) é estritamente condicional à configuração (`siteConfig.legal.services`), assegurando fidelidade aos serviços ativos (ADR 0007) sem listar ferramentas inativas.
   - `src/app/(legal)/termos-de-uso/page.tsx`: Termos gerais de uso do site institucional consumindo Razão Social e CNPJ de `siteConfig`.
   - Renderizadas como Server Components (RSC) com container de leitura `max-w-4xl mx-auto py-16 px-4`.

7. **Integração na Home Page (`src/app/page.tsx`):**
   - Substituição do bloco estático de CTA de contato pela renderização do formulário real `<ContactForm />` integrado na seção `#contato`.

8. **Botão Flutuante de WhatsApp (`src/components/shared/floating-whatsapp/floating-whatsapp.tsx`):**
   - Componente de ação flutuante (`fixed bottom-6 right-6 z-50`) exibindo o ícone oficial do WhatsApp, cantos circulares (`rounded-full`), sombra projetada e transição suave.
   - Dimensões acessíveis com alvo de toque de 56x56px (superior ao mínimo WCAG de 44x44px).
   - Rótulo acessível `aria-label="Falar conosco no WhatsApp"`, foco visível por teclado (`focus-visible:ring-2`) e segurança de link externo (`target="_blank"` e `rel="noopener noreferrer"`).
   - Integrado globalmente no `src/app/layout.tsx`, respeitando a flag de configuração `siteConfig.contact.showFloatingWhatsapp` (padrão: `true`).

### O que NÃO está no escopo (Out-of-Scope)

- Armazenamento persistente de leads em banco de dados SQL ou NoSQL (terminantemente proibido pelo ADR 0007 - _Zero-Database Architecture_).
- Painel administrativo e coleções de conteúdo do Keystatic CMS (_Tratados na Feature 004_).
- Configuração de sitemap dinâmico e Schema.org JSON-LD (_Tratados na Feature 005_).
- Cookie banner intrusivo para pixels de publicidade (o template opera em modo cookieless por padrão).

---

## 🚦 3. Critérios Objetivos de Aceitação (Acceptance Criteria)

1. **Validação de Ambientes e Segregação de Envs (Item 1 da Seção 2.2 do Roadmap):**
   - `npm run build` compila com sucesso sob a configuração mínima de produção (Resend + URL do site), viabilizando micro-projetos sem dependência de contas externas.
   - `npm run build` rejeita imediatamente com relatório explícito caso alguma variável core obrigatória esteja ausente ou malformatada.
   - Tentativa de importar `src/env/server.ts` em Client Component resulta em erro de compilação bloqueante (`server-only`).
   - Suíte `tests/env.test.ts` valida:
     - Execução offline em `development` e `test` com fallbacks controlados.
     - Rejeição estrita em `production` se `RATE_LIMIT_SECRET` estiver ausente ou utilizar o valor padrão de desenvolvimento.
     - Paridade estrita de credenciais do Upstash (rejeita quando apenas URL ou apenas Token é fornecido).
     - Rejeição de variáveis malformatadas (ex.: e-mail ou URL inválidos) sem vazar valores confidenciais nos relatórios de erro.

2. **Defesa Anti-Spam, Políticas de Falha (Fail-Closed) & Resiliência Transacional:**
   - **Honeypot:** Submissão com campo `website` preenchido retorna sucesso simulado sem acionar a Resend API.
   - **Rate Limit & Fail-Closed do Redis:** Submissões repetidas acima de 5 envios/hora são bloqueadas antes do Resend. Caso o Upstash Redis em produção sofra pane ou indisponibilidade, o envio NÃO é liberado (_Fail-Closed_), retornando mensagem amigável de contingência.
   - **Turnstile & Fail-Closed:** Token inválido OU indisponibilidade da API da Cloudflare bloqueia o disparo de e-mail (_Fail-Closed_), preservando a cota do Resend. Se desativado (modo Lite), o desafio é ignorado de forma segura.
   - **Resend Mock & Sanitização Absoluta:** Envio bem-sucedido dispara e-mail com os dados preenchidos. Falha na Resend API (cota ou 429) retorna mensagem amigável e acessível sem vazar detalhes internos, credenciais ou mensagens brutas do provedor.
   - **Contingência no Formulário:** Respostas com `success: false` exibem no componente alerta acessível (`role="alert"`) com links diretos para WhatsApp e telefone.
   - **Payload Não Confiável & Limites de Tamanho:** Mensagens acima de 1.000 caracteres são rejeitadas pelo schema funcional Zod com feedback amigável; payloads abusivos acima de 5.000 caracteres (~5 KB), arrays ou tipos primitivos são bloqueados pelo guarda preliminar sem exceções não tratadas (_unhandled rejections_).

3. **Acessibilidade & Usabilidade (WCAG 2.1 AA):**
   - O formulário `<ContactForm />`, o botão flutuante `<FloatingWhatsApp />` e as páginas legais possuem **zero violações de acessibilidade** auditadas pelo `vitest-axe`.
   - O botão flutuante `<FloatingWhatsApp />` possui alvo de toque de pelo menos 44x44px (especificado em 56x56px), anel de foco visível, `aria-label` descritivo e abre o WhatsApp em nova aba com segurança (`rel="noopener noreferrer"`).
   - Todos os campos de entrada possuem rótulos (`<label>`) associados via `htmlFor`/`id`.
   - Mensagens de erro são associadas aos campos via `aria-describedby` e `aria-invalid`.
   - Teclado navega por todos os campos de forma lógica, sem armadilhas de foco.

4. **Homologação dos Quality Gates & Deploy Piloto:**
   - Todos os testes no Vitest passam (100% verdes).
   - `npm run verify` (`audit:docs`, `lint`, `typecheck`, `test`, `build`) passa com zero erros.
   - **Deploy Piloto de Sanidade na Vercel (Recomendado):** Validação prática de ponta a ponta em ambiente preview da Vercel após conclusão das tarefas da Feature 003, certificando o funcionamento de Server Actions, runtime serverless e Resend API em nuvem real.
