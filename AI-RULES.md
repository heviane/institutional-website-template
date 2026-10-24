# 🤖 Diretrizes Canônicas para Desenvolvimento Assistido por IA (Spec-Driven Development)

> Este documento é a **ÚNICA Fonte da Verdade (*Single Source of Truth*)** - cumpre o papel de contrato técnico entre humano e IA - e o conjunto de restrições inegociáveis para qualquer agente ou assistente de Inteligência Artificial (ChatGPT, Claude, GitHub Copilot, Cursor, Antigravity, Gemini) que atue no repositório `institutional-website-template`.

---

## 🧭 1. Princípio Fundamental: Spec-Driven Development (SDD)

1. **A Especificação Precede o Código:** Todas as decisões de arquitetura, governança, segurança, modelo de dados e qualidade já foram deliberadas e formalizadas no diretório [`docs/`](docs/).
2. **Proibição de Suposições / "Vibe Coding":** Nunca invente soluções, padrões de projeto, bibliotecas adicionais ou nomes de variáveis a partir de intuições genéricas. Consulte sempre a especificação canônica correspondente antes de gerar ou refatorar qualquer arquivo.
3. **Tratamento dos ADRs como Leis do Sistema:** As decisões registradas nos Architectural Decision Records ([`docs/adr/`](docs/adr/)) têm força mandatória. Nenhuma IA tem autorização para violar um ADR aprovado sem solicitação explícita e justificada do desenvolvedor.
4. **Protocolo "Stop-and-Ask" para Casos Ambíguos:** Se houver conflito, divergência ou lacuna técnica entre uma instrução do desenvolvedor e as especificações em [`docs/`](docs/) (ou entre diferentes documentos), a IA **DEVE** pausar a geração de código e solicitar esclarecimentos objetivos antes de prosseguir, sendo terminantemente proibido assumir premissas ou padrões arbitrários por conta própria.

---

## 🗺️ 2. Mapa de Especificações (Onde encontrar a verdade)

Antes de executar qualquer tarefa, a IA **DEVE** consultar a especificação correspondente na tabela abaixo:

| Domínio da Tarefa | Especificação Canônica (Spec) |
| :--- | :--- |
| **Arquitetura Geral, Pilares & Escopo** | [`docs/01-architecture-overview.md`](docs/01-architecture-overview.md) |
| **Setup Técnico, Comandos & Código Canônico** | [`docs/02-environment-setup.md`](docs/02-environment-setup.md) |
| **Roadmap, Fases & Critérios de Aceitação** | [`docs/03-project-roadmap.md`](docs/03-project-roadmap.md) (Especialmente Seção 2.2) |
| **Estrutura de Pastas & Fronteiras do Projeto** | [`docs/04-folder-structure.md`](docs/04-folder-structure.md) |
| **Modelo de Dados & Collections do CMS** | [`docs/05-keystatic-content-model.md`](docs/05-keystatic-content-model.md) |
| **Design System, UI & Temas (Tailwind v4)** | [`docs/06-brand-theming-guide.md`](docs/06-brand-theming-guide.md) |
| **Onboarding de Clientes, Envs & Custos** | [`docs/07-client-onboarding-checklist.md`](docs/07-client-onboarding-checklist.md) |
| **Decisões de Arquitetura (0001 a 0011)** | [`docs/adr/README.md`](docs/adr/README.md) (Índice de ADRs) |

---

## 🔒 3. Invariantes Técnicos e Versões Inegociáveis

* **Node.js Runtime:** `24.x LTS (Active LTS)` — versão travada no [`.nvmrc`](.nvmrc) e no CI. Não gere sintaxes incompatíveis.
* **Framework:** `Next.js 16 (App Router / Active LTS)` — NUNCA gere arquivos ou arquitetura baseada no Pages Router (`pages/`).
* **React:** `19.x`.
* **CSS & Design System:** `Tailwind CSS v4` utilizando variáveis `@theme` diretamente no `src/app/globals.css`. NUNCA crie nem sugira o arquivo legado `tailwind.config.js`.
* **Componentes de UI:** `Shadcn/ui` fundamentado exclusivamente nos primitivos acessíveis do `Radix UI` (conformidade estrita com WCAG 2.1 AA).
* **Gestão de Conteúdo (CMS):** `Keystatic` gravando Markdown/JSON no repositório Git. Modo local em desenvolvimento e Keystatic Cloud em produção.
* **Envio Transacional:** `Resend API` (plano gratuito com cota de até 100 e-mails/dia).
* **Defesa Anti-Spam em 3 Camadas:** Honeypot oculto + Cloudflare Turnstile + Rate Limiting por IP (Upstash Redis em produção / Map em desenvolvimento local).

---

## 📖 4. Dicionário Canônico de Nomenclatura (Ubiquitous Language)

Para evitar desvios e conflitos de código, a IA deve utilizar **obrigatoriamente** estes identificadores canônicos:

* **Variáveis de E-mail:**
  * Remetente autenticado: SEMPRE `RESEND_FROM_EMAIL` (ex.: `"Contato <contato@empresa.com.br>"`).
  * Destinatário de recebimento de leads: SEMPRE `CONTACT_EMAIL_TO` (ex.: `comercial@empresa.com.br`).
  * Chave de API: SEMPRE `RESEND_API_KEY`.
* **Acesso a Variáveis de Ambiente:**
  * NUNCA utilize `process.env.*` solto dentro de componentes ou actions.
  * Importe SEMPRE os schemas validados `serverEnv` ou `clientEnv` a partir de `@/env` (conforme [ADR 0009](docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)).
* **Configuração Centralizada da Marca:**
  * Objeto e arquivo único: `src/config/site.ts` exportando a constante `siteConfig` e o tipo `SiteConfig`.
* **Processamento de Formulários:**
  * Server Action canônica: `src/app/actions/contact.ts` exportando a função `sendContactEmail(rawInput: unknown)`.
  * Schema de validação Zod: `src/lib/schemas/contact.ts` exportando `contactFormSchema`.

---

## 🚫 5. Restrições Negativas (O que a IA NUNCA deve fazer)

1. **NUNCA introduzir bancos de dados relacionais (SQL) ou NoSQL persistentes no MVP:** A arquitetura do template é intencionalmente efêmera (*Zero-Database Architecture*), com encaminhamento direto de mensagens para a caixa de e-mail do cliente via Resend API ([ADR 0007](docs/adr/0007-conformidade-lgpd-e-privacidade.md)).
2. **NUNCA criar rotas REST manuais em `src/app/api/contact/route.ts` para formulários:** Utilize exclusivamente Server Actions com `'use server'` ([ADR 0003](docs/adr/0003-estrategia-de-formularios.md)).
3. **NUNCA instalar dependências redundantes:** Sempre verifique se o projeto já não possui a ferramenta necessária antes de sugerir pacotes npm (ex.: use Zod para validação, Vitest para testes, Radix para acessibilidade).
4. **NUNCA recomendar merge de históricos desconectados como procedimento padrão:** O comando `git merge --allow-unrelated-histories` é experimental; atualizações do template devem priorizar releases e patches cirúrgicos (`cherry-pick`) em branch isolada ([ADR 0010](docs/adr/0010-estrategia-de-atualizacao-e-versionamento.md)).
5. **NUNCA fazer afirmações de qualidade ou segurança absolutas:** Utilize sempre linguagem baseada em metas probabilísticas e redução de riscos (ex.: *"mitigação de abuso"*, *"metas planejadas"*), nunca *"100% blindado"* ou *"imunidade absoluta"*.

---

## 🚦 6. Ciclo de Qualidade e Critérios de Aceitação da IA

Ao implementar qualquer funcionalidade na Fase 2:

1. **Consulte a Seção 2.2 do [`docs/03-project-roadmap.md`](docs/03-project-roadmap.md):** O trabalho só será considerado concluído se atender aos critérios de aceitação objetivos ali estipulados.
2. **Execute os Quality Gates:**

   ```bash
   npm run lint        # Zero erros no ESLint
   npm run typecheck   # Zero erros no TypeScript
   npm test            # Suíte do Vitest verde (incluindo testes de acessibilidade vitest-axe)
   npm run build       # Build de produção do Next.js 16 compilando de forma determinística
   ```

3. **Critério de Entrega Bloqueante:** Nenhuma tarefa, PR ou sugestão de código gerado por IA pode ser considerada concluída se qualquer um dos comandos acima falhar (tolerância zero para erros de lint, falhas de tipos no TypeScript, testes quebrados no Vitest ou erros no build de produção).
4. **Mantenha o CI Determinístico:** Qualquer alteração no `package.json` deve ser imediatamente acompanhada da atualização e versionamento do `package-lock.json`.
