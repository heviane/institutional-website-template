# Feature 002: Design System, Layout Base & Componentes Essenciais (Tasks)

* **Spec:** [`spec.md`](spec.md)
* **Plan:** [`plan.md`](plan.md)
* **Status:** Em Execução (Tarefas 1, 2 e 3 Concluídas)

---

## 📋 Checklist de Tarefas Executáveis

* [x] **1. Instalação de Dependências e Configuração do Shadcn/ui:**
  * [x] Instalar dependências de UI: `lucide-react`, `class-variance-authority`, `@radix-ui/react-slot` e `@radix-ui/react-dialog`.
  * [x] Instalar dependências de teste de acessibilidade: `vitest-axe` e `axe-core`.
  * [x] Criar arquivo `components.json` alinhado ao Tailwind CSS v4.
  * [x] Configurar `tests/setup.ts` com matchers do `vitest-axe` e registrar em `vitest.config.ts`.

* [x] **2. Camada de Configuração & Utilitários Resilientes de Contato — TDD:**
  * [x] 🔴 **Red:** Expandir `tests/utils.test.ts` adicionando testes para `formatWhatsAppUrl`, `formatTelUrl` e `formatPhoneDisplay`.
  * [x] 🔴 **Red:** Criar teste unitário em `tests/site-config.test.ts` validando presença de campos obrigatórios (`slogan`, `name`, `legal`, `contact`, `social`), estrutura do array `nav` e tipagem escalável.
  * [x] 🟢 **Green:** Implementar as funções utilitárias em `src/lib/utils.ts`.
  * [x] 🟢 **Green:** Implementar `src/config/site.ts` exportando as interfaces (`SiteConfig`, `NavItem`, etc.) e o objeto canônico `siteConfig`.
  * [x] 🔵 **Refactor:** Garantir imutabilidade (`as const`), tipagem estrita no TypeScript e testes verdes.

* [x] **3. Primitivos Atômicos de UI & Testes de Foco (`src/components/ui/`):**
  * [x] 🔴 **Red:** Criar testes em `tests/components/button.test.tsx` cobrindo o Caso 6 da Matriz (`Button variants render classes as expected`: variantes `cta`, `whatsapp` e suporte polimórfico `asChild`) e asserção `axe`.
  * [x] 🔴 **Red:** Criar testes em `tests/components/card.test.tsx` validando composição e asserção `axe`.
  * [x] 🔴 **Red:** Criar testes em `tests/components/dialog.test.tsx` cobrindo o Caso 3 da Matriz: ciclo completo de foco (abertura transfere foco para o modal, `Escape` fecha o diálogo e foco é restaurado ao trigger).
  * [x] 🟢 **Green:** Implementar `src/components/ui/button.tsx` com variantes CVA e toque mínimo de 44x44px.
  * [x] 🟢 **Green:** Implementar `src/components/ui/card.tsx` com subcomponentes compostos (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) sem hexadecimais brutos.
  * [x] 🟢 **Green:** Implementar `src/components/ui/dialog.tsx` baseado em `@radix-ui/react-dialog` com focus trap acessível.
  * [x] 🟢 **Green:** Implementar `src/components/ui/input.tsx` e `src/components/ui/textarea.tsx`.

* [ ] **4. Componentes Estruturais de Layout (Server-First) & Matriz Enxuta de UI (`src/components/shared/`) — TDD:**
  * [ ] 🔴 **Red:** Criar suíte de testes em `tests/components/layout.test.tsx` cobrindo os Casos da Matriz:
    * **Caso 1:** `Header renders nav items` (links vindos de `siteConfig.nav`).
    * **Caso 2:** `Mobile menu toggles correctly` (abrir/fechar via hambúrguer, `Esc` e clique em âncora).
    * **Caso 4:** `CTA links point to correct anchors` (WhatsApp e `#servicos`).
    * **Caso 5:** `Footer shows legal/contact info` (Razão Social, CNPJ e contatos).
    * Asserções `axe` para WCAG 2.1 AA em todos os componentes de layout.
  * [ ] 🟢 **Green:** Implementar `src/components/shared/header/header.tsx` como Server Component (RSC).
  * [ ] 🟢 **Green:** Implementar `src/components/shared/header/mobile-nav.tsx` como o único Client Component (`'use client'`) com Radix Dialog e auto-close.
  * [ ] 🟢 **Green:** Implementar `src/components/shared/hero/hero.tsx` como Server Component (RSC) com `HeroProps` agnóstica e hierarquia clara de botões (máximo 1 CTA primária).
  * [ ] 🟢 **Green:** Implementar `src/components/shared/footer/footer.tsx` como Server Component (RSC) com dados legais e canais de contato.
  * [ ] 🔵 **Refactor:** Eliminar redundâncias e validar conformidade total de acessibilidade.

* [ ] **5. Composição do "Layout Shell Demo" na Home Page (`src/app/page.tsx` - RSC):**
  * [ ] Atualizar `src/app/layout.tsx` (RSC) com carregamento de fonte `Inter` via `next/font/google` e metadados dinâmicos.
  * [ ] Atualizar `src/app/page.tsx` (RSC) aplicando rigorosamente os guardrails de UX (`max-w-7xl`, `py-16 md:py-24`, tokens semânticos, zero raw hex) montando: `<Header />`, `<Hero />`, seção de serviços em grid de `<Card />` e `<Footer />`.
  * [ ] Validar responsividade e harmonia visual no navegador (`http://localhost:3000`).

* [ ] **6. Execução e Homologação dos Quality Gates Locais:**
  * [ ] Executar `npm run verify` e certificar que todos os passos (`audit:docs`, `lint`, `typecheck`, `test`, `build`) estão 100% verdes.

* [ ] **7. Sincronização Documental Obrigatória & Anti-Doc Rot (Tarefa Final):**
  * [ ] Atualizar `docs/03-project-roadmap.md` marcando a Feature 002 como concluída.
  * [ ] Atualizar a árvore canônica em `docs/04-folder-structure.md` com todos os novos arquivos criados.
  * [ ] Atualizar `CHANGELOG.md` registrando a entrega da Feature 002 sob `[Unreleased]`.
  * [ ] Executar e validar `npm run audit:docs` (0 erros).
  * [ ] Realizar commit semântico e enviar push para `main`.
