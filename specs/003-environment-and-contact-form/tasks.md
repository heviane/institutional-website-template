# Feature 003: Validação de Ambiente, Formulário Transacional & Conformidade Legal (Tasks)

- **Spec:** [`spec.md`](spec.md)
- **Plan:** [`plan.md`](plan.md)
- **Status:** Concluída (Quality Gates Validados)

---

## 📋 Checklist de Tarefas Executáveis

- [x] **1. Instalação de Dependências de Formulário e Serviços:**
  - [x] Instalar dependências de produção: `react-hook-form`, `@hookform/resolvers`, `resend`, `@upstash/redis` e `@marsidev/react-turnstile`.
  - [x] Validar integridade do `package-lock.json` e execução de `npm run typecheck`.

- [x] **2. Validação Segregada de Variáveis de Ambiente (`src/env/`) — TDD:**
  - [x] 🔴 **Red:** Criar suíte de testes em `tests/env.test.ts` cobrindo a matriz estrita de contratos.
  - [x] 🟢 **Green:** Implementar `src/env/client.ts` com validação de `NEXT_PUBLIC_*`, checagem de chave obrigatória em produção quando ativo e flag booleana.
  - [x] 🟢 **Green:** Implementar `src/env/server.ts` com `import "server-only"`, validação condicional rigorosa de `RATE_LIMIT_SECRET`, paridade de Upstash e chave do Turnstile obrigatória em produção quando ativo.
  - [x] 🟢 **Green:** Atualizar `.github/workflows/ci.yml` com `RATE_LIMIT_SECRET` e `NEXT_PUBLIC_ENABLE_TURNSTILE: "false"` para o build de produção do CI.
  - [x] 🔵 **Refactor:** Garantir segurança de tipos, relatório de erros sanitizado e proteção contra vazamento acidental para o cliente.

- [x] **3. Schema Canônico de Contato & Rate Limiting com Pseudonimização de IP — TDD:**
  - [x] 🔴 **Red:** Criar testes em `tests/contact-schema.test.ts` validando encadeamento no Zod 3 e LGPD.
  - [x] 🔴 **Red:** Criar testes em `tests/rate-limit.test.ts` validando hash HMAC de IP, execução atômica via Lua script e extração segura de IP.
  - [x] 🟢 **Green:** Implementar `src/lib/schemas/contact.ts` exportando `contactFormSchema` e tipos TypeScript.
  - [x] 🟢 **Green:** Implementar `src/lib/rate-limit.ts` com suporte híbrido (Map nativo por padrão e Upstash Redis via script Lua atômico quando configurado).
  - [x] 🔵 **Refactor:** Eliminar duplicações e validar conformidade com LGPD.

- [x] **4. Cliente Resend & Server Action com Defesa em 3 Camadas & Fail-Closed — TDD:**
  - [x] 🔴 **Red:** Criar suíte em `tests/contact-action.test.ts` com _mocks_ para Resend, Upstash e Turnstile cobrindo a matriz estrita de 10 casos de políticas de falha.
  - [x] 🟢 **Green:** Implementar `src/lib/resend.ts` inicializando o cliente Resend.
  - [x] 🟢 **Green:** Implementar `src/app/actions/contact.ts` exportando `sendContactEmail` com defesas _Fail-Closed_, sanitização absoluta e limite `bodySizeLimit: "64kb"`.
  - [x] 🔵 **Refactor:** Garantir tipagem estrita de retorno (`ActionResponse`) sem retornar códigos HTTP.

- [x] **5. Componente de Formulário Reativo e Acessível (`src/components/shared/contact-form/`) — TDD:**
  - [x] 🔴 **Red:** Criar testes em `tests/components/contact-form.test.tsx` validando renderização de campos, mensagens inline, estados visuais e WCAG 2.1 AA (`axe`).
  - [x] 🟢 **Green:** Implementar `src/components/shared/contact-form/contact-form.tsx` utilizando React Hook Form e Shadcn/ui (`Input`, `Textarea`, `Button`).
  - [x] 🔵 **Refactor:** Garantir alvos de toque mínimos de 44x44px e experiência fluida no mobile.

- [x] **6. Botão Flutuante de WhatsApp Global (`src/components/shared/floating-whatsapp/`) — TDD:**
  - [x] 🔴 **Red:** Criar testes em `tests/components/floating-whatsapp.test.tsx` validando renderização do botão FAB (56x56px), link seguro, `aria-label` e WCAG 2.1 AA (`axe`).
  - [x] 🟢 **Green:** Adicionar propriedade `showFloatingWhatsapp?: boolean` em `src/config/site.ts`.
  - [x] 🟢 **Green:** Implementar `src/components/shared/floating-whatsapp/floating-whatsapp.tsx` e integrá-lo globalmente no `src/app/layout.tsx`.
  - [x] 🔵 **Refactor:** Otimizar SVG inline do WhatsApp e assegurar foco visível por teclado (`focus-visible:ring-2`).

- [x] **7. Páginas Legais Estáticas Fidedignas (`src/app/(legal)/`) — TDD:**
  - [x] 🔴 **Red:** Criar testes em `tests/legal-pages.test.tsx` validando identificação corporativa, DPO, transparência de provedores, cláusula de transferência internacional (Art. 33), fidelidade aos serviços ativos (ADR 0007) e conformidade WCAG 2.1 AA (`axe`).
  - [x] 🟢 **Green:** Adicionar tipagem e valores de `services?: { turnstile?: boolean; plausible?: boolean; googleAnalytics?: boolean; }` em `src/config/site.ts`.
  - [x] 🟢 **Green:** Implementar `src/app/(legal)/politica-de-privacidade/page.tsx` (RSC) com seções condicionais e cláusula do Art. 33.
  - [x] 🟢 **Green:** Implementar `src/app/(legal)/termos-de-uso/page.tsx` (RSC) e layout compartilhado `(legal)/layout.tsx`.
  - [x] 🔵 **Refactor:** Alinhamento estrito aos dados reais do cliente em `siteConfig`.

- [x] **8. Integração na Home Page (`src/app/page.tsx`):**
  - [x] Atualizar a seção `#contato` em `src/app/page.tsx` integrando o componente real `<ContactForm />`.
  - [x] Atualizar os testes em `tests/components/home.test.tsx` validando a integração e a ausência de violações WCAG 2.1 AA.

- [x] **9. Execução e Homologação dos Quality Gates Locais & Smoke Test:**
  - [x] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.
  - [x] Validar consistência do build de produção e suíte Vitest com 84 testes passando.

- [x] **10. Sincronização Documental Obrigatória, Anti-Doc Rot & Auditoria de PRs (Tarefa Final):**
  - [x] Atualizar status da feature na tríade de governança:
    - `CHANGELOG.md`: marcar Feature 003 como concluída `[x]` sob `### 📊 Status das Features` e registrar notas da entrega sob `[Unreleased]` (fonte da verdade de status).
    - `README.md`: atualizar bloco de alerta de status para "Features 001, 002 e 003 Concluídas" e indicar a Feature 004 como próxima.
    - `docs/03-project-roadmap.md`: atualizar cabeçalho da Fase 2 para "Features 001, 002 e 003 Concluídas", marcar checkboxes de execução da Feature 003 como concluídas e indicar a Feature 004.
  - [x] Atualizar a árvore canônica em `docs/04-folder-structure.md` com todos os novos arquivos criados.
  - [x] Aplicar o Princípio 9 (Anti-Doc Rot): substituir blocos de código implementados em `docs/` por referências diretas via links.
  - [x] Executar e validar `npm run audit:docs` (0 erros e 0 warnings, validando a sincronização semântica automática).
  - [x] Auditar Pull Requests abertos no GitHub (`gh pr list`), tratando pendências de dependências ou colaboradores.
  - [x] Realizar commit semântico e enviar push para `main`.
