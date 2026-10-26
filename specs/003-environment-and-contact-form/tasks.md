# Feature 003: Validação de Ambiente, Formulário Transacional & Conformidade Legal (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Pendente de Execução (Aguardando Aprovação do Desenvolvedor)

---

## 📋 Checklist de Tarefas Executáveis

* [ ] **1. Instalação de Dependências de Formulário e Serviços:**
  * [ ] Instalar dependências de produção: `react-hook-form`, `@hookform/resolvers`, `resend`, `@upstash/redis` e `@marsidev/react-turnstile`.
  * [ ] Validar integridade do `package-lock.json` e execução de `npm run typecheck`.

* [ ] **2. Validação Segregada de Variáveis de Ambiente (`src/env/`) — TDD:**
  * [ ] 🔴 **Red:** Criar suíte de testes em `tests/env.test.ts` cobrindo a matriz estrita de contratos:
    * Execução offline em `development` e `test` com fallbacks controlados (sem enfraquecer produção).
    * Rejeição em `production` se `RATE_LIMIT_SECRET` estiver ausente ou utilizar o valor padrão de desenvolvimento.
    * Paridade estrita de credenciais do Upstash (rejeita quando apenas URL ou apenas Token é fornecido).
    * Rejeição em `production` se o Turnstile estiver ativo (`NEXT_PUBLIC_ENABLE_TURNSTILE !== "false"`) com chaves ausentes (*Zero Fail-Open por desconfiguração*).
    * Rejeição imediata diante de variáveis core ausentes (`RESEND_API_KEY`, etc.) ou malformatadas sem vazar valores confidenciais no console.
    * Validação da Feature Flag `NEXT_PUBLIC_ENABLE_TURNSTILE` (true por padrão, false explícito ativando o Modo Lite).
  * [ ] 🟢 **Green:** Implementar `src/env/client.ts` com validação de `NEXT_PUBLIC_*`, checagem de chave obrigatória em produção quando ativo e flag booleana.
  * [ ] 🟢 **Green:** Implementar `src/env/server.ts` com `import "server-only"`, validação condicional rigorosa de `RATE_LIMIT_SECRET`, paridade de Upstash e chave do Turnstile obrigatória em produção quando ativo.
  * [ ] 🟢 **Green:** Atualizar `.github/workflows/ci.yml` com `RATE_LIMIT_SECRET` e `NEXT_PUBLIC_ENABLE_TURNSTILE: "false"` para o build de produção do CI.
  * [ ] 🔵 **Refactor:** Garantir segurança de tipos, relatório de erros sanitizado e proteção contra vazamento acidental para o cliente.

* [ ] **3. Schema Canônico de Contato & Rate Limiting com Pseudonimização de IP — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/contact-schema.test.ts` validando:
    * Encadeamento rigoroso no Zod 3 (strings com apenas espaços em branco sofrem `.trim()` prévio e falham no `.min(2)` ou `.min(10)`).
    * Normalização prévia de e-mail com `.trim().toLowerCase()` antes da validação de formato `.email()`.
    * Regras de tamanho funcional (aceitando até 1.000 caracteres e rejeitando a partir de 1.001 caracteres no campo `message`).
    * Detecção de automação pelo campo honeypot (`website`).
    * Conformidade LGPD: `privacyConsent` opcional sem injeção de consentimento presumido (`.default(true)` proibido por LGPD Art. 5º, XII).
  * [ ] 🔴 **Red:** Criar testes em `tests/rate-limit.test.ts` validando cálculo determinístico de hash HMAC de IP com `RATE_LIMIT_SECRET`, algoritmo de janela fixa de 1 hora com TTL de 3.600s, bloqueio na 6ª requisição e liberação após expiração (cobrindo tanto o Map local quanto a simulação com Upstash Redis).
  * [ ] 🟢 **Green:** Implementar `src/lib/schemas/contact.ts` exportando `contactFormSchema` e tipos TypeScript.
  * [ ] 🟢 **Green:** Implementar `src/lib/rate-limit.ts` com suporte híbrido (Map nativo por padrão e Upstash Redis quando configurado).
  * [ ] 🔵 **Refactor:** Eliminar duplicações e validar conformidade com LGPD.

* [ ] **4. Cliente Resend & Server Action com Defesa em 3 Camadas & Fail-Closed — TDD:**
  * [ ] 🔴 **Red:** Criar suíte em `tests/contact-action.test.ts` com *mocks* para Resend, Upstash e Turnstile cobrindo a matriz estrita de políticas de falha:
    * **Caso 1 (Caminho Feliz):** Submissão válida dispara e-mail via Resend e retorna sucesso.
    * **Caso 2 (Honeypot):** Bot preenchendo campo `website` é descartado silenciosamente com sucesso simulado (sem acionar Upstash ou Resend).
    * **Caso 3 (Rate Limit Estourado):** Excesso de requisições bloqueia antes do Resend com mensagem orientando WhatsApp.
    * **Caso 4 (Rate Limit Fail-Closed):** Pane/indisponibilidade do Upstash Redis em produção bloqueia o envio (*Fail-Closed*, não chama o Resend).
    * **Caso 5 (Turnstile Fail-Closed):** Token inválido OU indisponibilidade da API da Cloudflare (500/timeout) bloqueia o envio (*Fail-Closed*, não chama o Resend).
    * **Caso 6 (Turnstile Modo Lite):** Quando Turnstile desativado (`NEXT_PUBLIC_ENABLE_TURNSTILE="false"` ou chaves ausentes), ignora a Camada 3 e prossegue com envio válido.
    * **Caso 7 (Resend Fail & Sanitização Absoluta):** Erro de cota (429) ou indisponibilidade da Resend API retorna mensagem de contingência sanitizada, sem vazar chaves, status HTTP ou payloads de erro internos.
    * **Caso 8 (Guarda Preliminar de Payload Anti-DoS):** Payload abusivo serializado com mais de 5.000 caracteres (~5 KB) ou tipo não-objeto é rejeitado sumariamente pelo guarda prévio sem onerar os parsers.
    * **Caso 9 (Validação Zod de Payload):** Payload malformado ou campos inválidos (ex.: mensagem > 1.000 caracteres) são rejeitados pelo Zod retornando erros estruturados sem exceções não tratadas (*unhandled rejections*).
  * [ ] 🟢 **Green:** Implementar `src/lib/resend.ts` inicializando o cliente Resend.
  * [ ] 🟢 **Green:** Implementar `src/app/actions/contact.ts` exportando `sendContactEmail` com defesas *Fail-Closed*.
  * [ ] 🔵 **Refactor:** Garantir tipagem estrita de retorno (`ActionResponse`) sem retornar códigos HTTP.

* [ ] **5. Componente de Formulário Reativo e Acessível (`src/components/shared/contact-form/`) — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/components/contact-form.test.tsx` validando renderização de campos, alternância do widget Turnstile conforme flag `NEXT_PUBLIC_ENABLE_TURNSTILE`, mensagens de erro inline com `aria-invalid`, estado de carregamento com botão desabilitado, campo honeypot oculto, alerta de erro acessível (`role="alert"`) com links para WhatsApp/telefone e asserções `axe` para WCAG 2.1 AA.
  * [ ] 🟢 **Green:** Implementar `src/components/shared/contact-form/contact-form.tsx` utilizando React Hook Form e Shadcn/ui (`Input`, `Textarea`, `Button`).
  * [ ] 🔵 **Refactor:** Garantir alvos de toque mínimos de 44x44px e experiência fluida no mobile.

* [ ] **6. Botão Flutuante de WhatsApp Global (`src/components/shared/floating-whatsapp/`) — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/components/floating-whatsapp.test.tsx` validando renderização do botão FAB, alvo de toque mínimo de 56x56px, link correto com `formatWhatsAppUrl(siteConfig.contact.whatsapp)`, atributos de segurança (`target="_blank"`, `rel="noopener noreferrer"`), rótulo acessível (`aria-label`), desativação condicional quando `showFloatingWhatsapp: false` e asserções de acessibilidade WCAG 2.1 AA (`axe`).
  * [ ] 🟢 **Green:** Adicionar propriedade `showFloatingWhatsapp?: boolean` em `src/config/site.ts`.
  * [ ] 🟢 **Green:** Implementar `src/components/shared/floating-whatsapp/floating-whatsapp.tsx` e integrá-lo globalmente no `src/app/layout.tsx`.
  * [ ] 🔵 **Refactor:** Otimizar SVG inline do WhatsApp e assegurar foco visível por teclado (`focus-visible:ring-2`).

* [ ] **7. Páginas Legais Estáticas Fidedignas (`src/app/(legal)/`) — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/legal-pages.test.tsx` validando que:
    * A Política de Privacidade e os Termos de Uso exibem a Razão Social, CNPJ e canal do DPO.
    * A Política de Privacidade descreve com transparência os provedores reais (Vercel, Resend e Upstash com IP pseudonimizado) e a cláusula de Transferência Internacional de Dados (Art. 33 da LGPD).
    * Fidelidade aos serviços ativos (ADR 0007): com `plausible: false` (padrão da Feature 003), nenhuma menção ao Plausible é renderizada no DOM.
    * A seção do Cloudflare Turnstile é renderizada condicionalmente conforme configuração (`siteConfig.legal.services.turnstile`).
    * Ambas as páginas possuem conformidade WCAG 2.1 AA (`axe`).
  * [ ] 🟢 **Green:** Adicionar tipagem e valores de `services?: { turnstile?: boolean; plausible?: boolean; googleAnalytics?: boolean; }` em `src/config/site.ts`.
  * [ ] 🟢 **Green:** Implementar `src/app/(legal)/politica-de-privacidade/page.tsx` (RSC) com seções condicionais e cláusula do Art. 33.
  * [ ] 🟢 **Green:** Implementar `src/app/(legal)/termos-de-uso/page.tsx` (RSC).
  * [ ] 🔵 **Refactor:** Alinhamento estrito aos dados reais do cliente em `siteConfig`.

* [ ] **8. Integração na Home Page (`src/app/page.tsx`):**
  * [ ] Atualizar a seção `#contato` em `src/app/page.tsx` integrando o componente real `<ContactForm />`.
  * [ ] Atualizar os testes em `tests/components/home.test.tsx` validando a integração e a ausência de violações WCAG 2.1 AA.

* [ ] **9. Execução e Homologação dos Quality Gates Locais & Smoke Test:**
  * [ ] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.
  * [ ] Executar deploy piloto de sanidade em preview da Vercel (opcional/recomendado) para homologar Server Actions e Resend em ambiente real.

* [ ] **10. Sincronização Documental Obrigatória, Anti-Doc Rot & Auditoria de PRs (Tarefa Final):**
  * [ ] Atualizar status da feature na tríade de governança:
    * `CHANGELOG.md`: marcar Feature 003 como concluída `[x]` sob `### 📊 Status das Features` e registrar notas da entrega sob `[Unreleased]` (fonte da verdade de status).
    * `README.md`: atualizar bloco de alerta de status para "Features 001, 002 e 003 Concluídas" e indicar a Feature 004 como próxima.
    * `docs/03-project-roadmap.md`: atualizar cabeçalho da Fase 2 para "Features 001, 002 e 003 Concluídas", marcar checkboxes de execução da Feature 003 como concluídas e indicar a Feature 004.
  * [ ] Atualizar a árvore canônica em `docs/04-folder-structure.md` com todos os novos arquivos criados.
  * [ ] Aplicar o Princípio 9 (Anti-Doc Rot): substituir blocos de código implementados em `docs/` por referências diretas via links.
  * [ ] Executar e validar `npm run audit:docs` (0 erros e 0 warnings, validando a sincronização semântica automática).
  * [ ] Auditar Pull Requests abertos no GitHub (`gh pr list`), tratando pendências de dependências ou colaboradores.
  * [ ] Realizar commit semântico e enviar push para `main`.

