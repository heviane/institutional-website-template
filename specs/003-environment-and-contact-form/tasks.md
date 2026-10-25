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
  * [ ] 🔴 **Red:** Criar suíte de testes em `tests/env.test.ts` testando cenários de micro-projeto (configuração mínima do Resend em produção), produção com integrações ativas (Upstash/Turnstile opcionais com ativação progressiva) e rejeição imediata diante de variáveis core ausentes ou malformatadas.
  * [ ] 🟢 **Green:** Implementar `src/env/client.ts` com validação de `NEXT_PUBLIC_*`.
  * [ ] 🟢 **Green:** Implementar `src/env/server.ts` com `import "server-only"`, chaves mínimas obrigatórias e ativação condicional de Upstash/Turnstile.
  * [ ] 🔵 **Refactor:** Garantir segurança de tipos e proteção contra vazamento acidental para o cliente.

* [ ] **3. Schema Canônico de Contato & Rate Limiting Anônimo — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/contact-schema.test.ts` validando campos obrigatórios, regras de tamanho, e-mail, campo honeypot (`website`) e consentimento de privacidade.
  * [ ] 🔴 **Red:** Criar testes em `tests/rate-limit.test.ts` validando cálculo de hash HMAC de IP com rotação diária, fallback resiliente para Map nativo em memória e bloqueio na 6ª requisição.
  * [ ] 🟢 **Green:** Implementar `src/lib/schemas/contact.ts` exportando `contactFormSchema` e tipos TypeScript.
  * [ ] 🟢 **Green:** Implementar `src/lib/rate-limit.ts` com suporte híbrido (Map nativo por padrão e Upstash Redis quando configurado).
  * [ ] 🔵 **Refactor:** Eliminar duplicações e validar conformidade com LGPD.

* [ ] **4. Cliente Resend & Server Action com Defesa em 3 Camadas — TDD:**
  * [ ] 🔴 **Red:** Criar suíte em `tests/contact-action.test.ts` com *mocks* para Resend e Turnstile cobrindo:
    * **Caso 1:** Submissão válida dispara e-mail via Resend e retorna sucesso.
    * **Caso 2:** Bot preenchendo campo honeypot é descartado silenciosamente com sucesso simulado.
    * **Caso 3:** Estouro de taxa de requisições por IP bloqueia a execução antes de chamar APIs externas.
    * **Caso 4:** Validação do Turnstile (rejeita quando configurado com token inválido; ignora de forma segura e transparente no modo micro-projeto).
    * **Caso 5:** Erro ou esgotamento de cota do Resend aciona procedimento de contingência apontando para WhatsApp/telefone.
    * **Caso 6:** Payload malformado é rejeitado sem exceção não tratada.
  * [ ] 🟢 **Green:** Implementar `src/lib/resend.ts` inicializando o cliente Resend.
  * [ ] 🟢 **Green:** Implementar `src/app/actions/contact.ts` exportando `sendContactEmail`.
  * [ ] 🔵 **Refactor:** Garantir tipagem estrita de retorno (`ActionResponse`) sem retornar códigos HTTP.

* [ ] **5. Componente de Formulário Reativo e Acessível (`src/components/shared/contact-form/`) — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/components/contact-form.test.tsx` validando renderização de campos, mensagens de erro inline com `aria-invalid`, estado de carregamento com botão desabilitado, campo honeypot oculto e asserções `axe` para WCAG 2.1 AA.
  * [ ] 🟢 **Green:** Implementar `src/components/shared/contact-form/contact-form.tsx` utilizando React Hook Form e Shadcn/ui (`Input`, `Textarea`, `Button`).
  * [ ] 🔵 **Refactor:** Garantir alvos de toque mínimos de 44x44px e experiência fluida no mobile.

* [ ] **6. Páginas Legais Estáticas Fidedignas (`src/app/(legal)/`) — TDD:**
  * [ ] 🔴 **Red:** Criar testes em `tests/legal-pages.test.tsx` validando que a Política de Privacidade e os Termos de Uso exibem a Razão Social, CNPJ, canal do DPO e serviços ativos com conformidade WCAG 2.1 AA (`axe`).
  * [ ] 🟢 **Green:** Implementar `src/app/(legal)/politica-de-privacidade/page.tsx` (RSC).
  * [ ] 🟢 **Green:** Implementar `src/app/(legal)/termos-de-uso/page.tsx` (RSC).
  * [ ] 🔵 **Refactor:** Alinhamento estrito aos dados reais do cliente em `siteConfig`.

* [ ] **7. Integração na Home Page (`src/app/page.tsx`):**
  * [ ] Atualizar a seção `#contato` em `src/app/page.tsx` integrando o componente real `<ContactForm />`.
  * [ ] Atualizar os testes em `tests/components/home.test.tsx` validando a integração e a ausência de violações WCAG 2.1 AA.

* [ ] **8. Execução e Homologação dos Quality Gates Locais:**
  * [ ] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.

* [ ] **9. Sincronização Documental Obrigatória & Anti-Doc Rot (Tarefa Final):**
  * [ ] Atualizar `docs/03-project-roadmap.md` marcando a Feature 003 como concluída.
  * [ ] Atualizar a árvore canônica em `docs/04-folder-structure.md` com todos os novos arquivos criados.
  * [ ] Atualizar `CHANGELOG.md` registrando a entrega da Feature 003 sob `[Unreleased]`.
  * [ ] Executar e validar `npm run audit:docs` (0 erros).
  * [ ] Realizar commit semântico e enviar push para `main`.

