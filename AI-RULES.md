# 🤖 Diretrizes Canônicas para Desenvolvimento Assistido por IA (Spec-Driven Development)

> Este documento é a **ÚNICA Fonte da Verdade (*Single Source of Truth*)** - cumpre o papel de contrato técnico entre humano e IA - e o conjunto de restrições inegociáveis para qualquer agente ou assistente de Inteligência Artificial (ChatGPT, Claude, GitHub Copilot, Cursor, Antigravity, Gemini) que atue no repositório `institutional-website-template`.

---

## 🧭 1. Princípio Fundamental: Spec-Driven Development (SDD)

1. **A Especificação Precede o Código:** Todas as decisões de arquitetura, governança, segurança, modelo de dados e qualidade já foram deliberadas e formalizadas no diretório [`docs/`](docs/).
2. **Proibição de Suposições / "Vibe Coding":** Nunca invente soluções, padrões de projeto, bibliotecas adicionais ou nomes de variáveis a partir de intuições genéricas. Consulte sempre a especificação canônica correspondente antes de gerar ou refatorar qualquer arquivo.
3. **Tratamento dos ADRs como Leis do Sistema:** As decisões registradas nos Architectural Decision Records ([`docs/adr/`](docs/adr/)) têm força mandatória. Nenhuma IA tem autorização para violar um ADR aprovado sem solicitação explícita e justificada do desenvolvedor.
4. **Protocolo "Stop-and-Ask" para Casos Ambíguos:** Se houver conflito, divergência ou lacuna técnica entre uma instrução do desenvolvedor e as especificações em [`docs/`](docs/) (ou entre diferentes documentos), a IA **DEVE** pausar a geração de código e solicitar esclarecimentos objetivos antes de prosseguir, sendo terminantemente proibido assumir premissas ou padrões arbitrários por conta própria.

### 🏛️ Constituição de Engenharia (9 Princípios Inegociáveis)

Todo código ou especificação gerada por IA neste repositório deve respeitar integralmente estes nove princípios:

1. **Simplicidade antes de Complexidade:** Nenhuma abstração, padrão indireto ou dependência externa deve ser introduzida sem necessidade objetiva e benefício concreto comprovado.
2. **Segurança por Padrão (*Security by Design*):** Toda entrada de usuário deve ser tratada como não confiável com validação estrita no servidor (Zod). Segredos e chaves de API nunca devem alcançar bundles de cliente, logs ou commits.
3. **Acessibilidade Inegociável (WCAG 2.1 AA):** Acessibilidade não é polimento tardio; é requisito de arquitetura desde o primeiro componente, validada continuamente via `vitest-axe` e suporte total a navegação por teclado.
4. **Testabilidade Obrigatória e Prática de TDD:** Funcionalidades críticas (schemas Zod, regras de negócio, validação de ambiente e Server Actions) devem ser estruturadas de modo desacoplado para viabilizar testes unitários e de integração confiáveis com *mocks*. Para essas camadas lógicas, a IA deve adotar o ciclo TDD (*Red-Green-Refactor*), criando os testes antes da implementação em `src/`.
5. **Reprodutibilidade em Clone Limpo:** A instalação de dependências (`npm ci`), compilação (`npm run build`) e testes (`npm test`) devem ser rigorosamente determinísticos a partir de um repositório clonado do zero, ancorados em `package-lock.json`.
6. **Rastreabilidade e Decisões Explícitas:** Todo código gerado deve atender a uma especificação em [`specs/`](specs/) ou a um ADR aprovado em [`docs/adr/`](docs/adr/), sem mudanças de contrato ou escopo não documentadas.
7. **Mitigação Realista vs. Afirmações Absolutas:** Não presumir imunidade matemática ou conformidade cega; utilizar barreiras defensivas em camadas, monitoramento contínuo e procedimentos claros de contingência.
8. **Soberania da Revisão Humana:** Todo código e artefato gerado por IA é tratado como proposta técnica não confiável até a validação formal pelos testes automatizados e aprovação expressa do desenvolvedor.
9. **Código Real como Única Fonte da Verdade (Anti-Doc Rot):** Trechos extensos de código em `docs/` e `specs/` são permitidos SOMENTE antes da implementação como contratos preliminares ou especificações de design. Uma vez que o código correspondente for implementado e testado em `src/`, os blocos duplicados na documentação devem ser removidos e substituídos por referências diretas para os arquivos reais. O código executável, tipado e testado é a única fonte viva da verdade do sistema.

### 🔄 Ciclo de Trabalho por Funcionalidade (SDD Lifecycle)

Para qualquer funcionalidade ou entrega não trivial da Fase 2, a IA deve operar estritamente dentro da estrutura de três artefatos em `specs/<feature>/`:
* **`spec.md` (O quê e Por quê):** Problema, escopo funcional, requisitos, limites e critérios objetivos de aceitação.
* **`plan.md` (Como):** Solução técnica, arquitetura de componentes, contratos de dados, dependências e estratégia de testes.
* **`tasks.md` (Trabalho Executável):** Checklist de tarefas pequenas, sequenciais e verificáveis com testes automatizados.

#### 🧪 Execução de Tarefas com TDD (Red-Green-Refactor)
Para tarefas de código que envolvem lógica de validação (schemas Zod), variáveis de ambiente (`env.ts`), utilitários de negócio e Server Actions, a IA deve aplicar o ciclo TDD:
1. **🔴 Red (Teste Primeiro):** Escrever ou atualizar o arquivo de teste unitário (`*.test.ts`) expressando os requisitos do contrato definido em `plan.md`. Executar `npm test` para certificar que o teste falha pelas razões esperadas antes da implementação.
2. **🟢 Green (Implementação Mínima):** Desenvolver o código estritamente necessário em `src/` para fazer a suíte de testes passar no Vitest.
3. **🔵 Refactor (Qualidade & Limpeza):** Refatorar para atender aos Quality Gates (eliminar código duplicado, garantir tipagem estrita no TypeScript e acessibilidade no `vitest-axe`) mantendo todos os testes verdes.

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
| **Especificações de Funcionalidades (Fase 2)** | Diretório [`specs/`](specs/) (`spec.md`, `plan.md`, `tasks.md`) |

---

## 🔒 3. Invariantes Técnicos e Versões Inegociáveis

* **Node.js Runtime:** `24.x LTS (Active LTS)` — versão travada no [`.nvmrc`](.nvmrc) e no CI. Não gere sintaxes incompatíveis.
* **Framework:** `Next.js 16 (App Router / Active LTS)` — NUNCA gere arquivos ou arquitetura baseada no Pages Router (`pages/`).
* **React:** `19.x`.
* **Validação de Schemas (Zod):** Travada na versão estável **Zod v3 (`^3.24.x`)** para compatibilidade com `@hookform/resolvers/zod`. NUNCA use métodos ou sintaxes exclusivas do Zod 4.
* **CSS & Design System:** `Tailwind CSS v4` utilizando variáveis `@theme` diretamente no `src/app/globals.css`. NUNCA crie nem sugira o arquivo legado `tailwind.config.js`.
* **Componentes de UI:** `Shadcn/ui` fundamentado exclusivamente nos primitivos acessíveis do `Radix UI` (conformidade estrita com WCAG 2.1 AA).
* **Gestão de Conteúdo (CMS):** `Keystatic` gravando Markdown/JSON no repositório Git. Modo local em desenvolvimento e Keystatic Cloud em produção.
* **Envio Transacional:** `Resend API` (plano gratuito com cota de até 100 e-mails/dia).
* **Defesa Anti-Spam em 3 Camadas:** Honeypot oculto + Rate Limiting por Hash de IP com TTL + Cloudflare Turnstile (validação condicional a dev/prod).

---

## 📖 4. Dicionário Canônico de Nomenclatura (Ubiquitous Language)

Para evitar desvios e conflitos de código, a IA deve utilizar **obrigatoriamente** estes identificadores canônicos:

* **Variáveis de E-mail:**
  * Remetente autenticado: SEMPRE `RESEND_FROM_EMAIL` (ex.: `"Contato <contato@empresa.com.br>"`).
  * Destinatário de recebimento de leads: SEMPRE `CONTACT_EMAIL_TO` (ex.: `comercial@empresa.com.br`).
  * Chave de API: SEMPRE `RESEND_API_KEY`.
* **Acesso a Variáveis de Ambiente:**
  * NUNCA utilize `process.env.*` solto dentro de componentes ou actions.
  * Importe SEMPRE os schemas validados `serverEnv` (protegido com `import "server-only"`) ou `clientEnv` a partir de `@/env` (conforme [ADR 0009](docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)).
* **Configuração Centralizada da Marca:**
  * Objeto e arquivo único: `src/config/site.ts` exportando a constante `siteConfig` e o tipo `SiteConfig`.
  * Canal WhatsApp corporativo: SEMPRE `siteConfig.contact.whatsapp` (não confunda com `siteConfig.contact.phone`).
* **Processamento de Formulários:**
  * Server Action canônica: `src/app/actions/contact.ts` exportando a função `sendContactEmail(rawInput: unknown)`.
  * Schema de validação Zod: `src/lib/schemas/contact.ts` exportando `contactFormSchema`.

---

## 🚫 5. Restrições Negativas (O que a IA NUNCA deve fazer)

1. **NUNCA introduzir bancos de dados relacionais (SQL) ou NoSQL persistentes no MVP:** A arquitetura do template é intencionalmente efêmera (*Zero-Database Architecture*), com encaminhamento direto de mensagens para a caixa de e-mail do cliente via Resend API ([ADR 0007](docs/adr/0007-conformidade-lgpd-e-privacidade.md)).
2. **NUNCA criar rotas REST manuais em `src/app/api/contact/route.ts` para formulários:** Utilize exclusivamente Server Actions com `'use server'` ([ADR 0003](docs/adr/0003-estrategia-de-formularios.md)).
3. **NUNCA armazenar endereços IP brutos no Rate Limiting:** Em conformidade com a LGPD e a política de Zero-Database, calcule e armazene sempre o hash criptográfico anônimo do IP (`SHA-256(ip + salt)`) com expiração de curto prazo (TTL).
4. **NUNCA retornar códigos HTTP em Server Actions:** Server Actions retornam objetos JavaScript tipados (`ActionResponse` com `{ success: boolean, message?: string }`), não status HTTP REST como 400 ou 429.
5. **NUNCA instalar dependências redundantes:** Sempre verifique se o projeto já não possui a ferramenta necessária antes de sugerir pacotes npm (ex.: use Zod para validação, Vitest para testes, Radix para acessibilidade).
6. **NUNCA recomendar merge de históricos desconectados como procedimento padrão:** O comando `git merge --allow-unrelated-histories` é experimental; atualizações do template devem priorizar releases e patches cirúrgicos (`cherry-pick`) em branch isolada ([ADR 0010](docs/adr/0010-estrategia-de-atualizacao-e-versionamento.md)).
7. **NUNCA fazer afirmações de qualidade ou segurança absolutas:** Utilize sempre linguagem baseada em metas probabilísticas e redução de riscos (ex.: *"mitigação de abuso"*, *"metas planejadas"*), nunca *"100% blindado"* ou *"imunidade absoluta"*.
8. **NUNCA manter blocos extensos de código duplicados na documentação após sua implementação em `src/`:** A documentação pós-implementação deve focar no *porquê*, arquitetura, regras de negócio e referenciar os arquivos reais via links, combatendo a deterioração da documentação (*doc rot*).
9. **NUNCA ajustar testes apenas para forçar aprovação de código defeituoso:** Testes automatizados expressam os critérios objetivos de aceitação do `spec.md`. Se um teste falhar, corrija a implementação em `src/`, nunca fragilize as asserções do teste para mascarar falhas.
10. **NUNCA manter código morto ou comentado (*Zombie Code*):** O histórico do Git é o arquivo definitivo. Trechos depreciados, rascunhos comentados ou `TODOs` órfãos devem ser excluídos.

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
