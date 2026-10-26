# Feature 002: Design System, Layout Base & Componentes Essenciais (Spec)

- **Status:** Concluída
- **Data:** 2026-10-24
- **Fase do Roadmap:** [Fase 2 (Core & MVP)](../../docs/03-project-roadmap.md)
- **ADRs Vinculados:** [ADR 0001: Next.js App Router](../../docs/adr/0001-escolha-do-framework-next.md), [ADR 0004: Design System](../../docs/adr/0004-design-system-e-estilizacao.md), [ADR 0008: Qualidade Automatizada](../../docs/adr/0008-qualidade-automatizada-e-testes.md)
- **Constituição de Engenharia:** [`AGENTS.md`](../../AGENTS.md)

---

## 🎯 1. Objetivo e Contexto

Com o bootstrap e os quality gates consolidados na Feature 001, a **Feature 002** tem como objetivo estabelecer o **Design System**, a **camada de dados centralizados do cliente com tipagem escalável**, utilitários de contato resilientes e a entrega de um **Layout Shell Demo institucional completo, acessível (WCAG 2.1 AA) e 100% web responsivo**, construído sob a arquitetura **Server-First (React Server Components)**.

A aplicação adota uma estética **visualmente profissional, neutra e elegante**, eliminando qualquer marca comercial chumbada no código. O template deve servir como uma tela neutra de alta qualidade, pronta para absorver a identidade de qualquer novo cliente (tecnologia, advocacia, saúde, indústria) através de `src/config/site.ts` e tokens no `src/app/globals.css`.

---

## 📦 2. Escopo Funcional

### O que ESTÁ no escopo (In-Scope)

1. **Configuração Centralizada do Cliente (`src/config/site.ts`) & Tipagem Escalável:**
   - Declaração de interfaces TypeScript exportadas e modulares: `NavItem`, `ContactConfig`, `LegalConfig`, `SocialLinks` e `SiteConfig`.
   - Objeto canônico `siteConfig` populado com dados neutros de exemplo:
     - `name`: Nome corporativo neutro ("Empresa Exemplo").
     - `slogan`: Proposta de valor genérica e elegante.
     - `description`: Descrição institucional para SEO e metadados.
     - `url` e `ogImage`: Endereço base e imagem padrão de compartilhamento.
     - `nav`: Lista declarativa de rotas (`Início`, `Serviços`, `Sobre`, `Contato`).
     - `contact`: E-mail corporativo, telefone formatado, WhatsApp em dígitos canônicos e endereço físico completo.
     - `legal`: Razão social, CNPJ formatado e e-mail do DPO/Encarregado LGPD.
     - `social`: Links corporativos (Instagram, LinkedIn, etc.).
   - **Utilitários Resilientes de Contato (`src/lib/utils.ts`):**
     - `formatWhatsAppUrl(phone, text?)`: sanitiza dígitos (`\D`), normaliza DDI (`55`) e constrói link para `https://wa.me/` sem risco de quebra.
     - `formatTelUrl(phone)`: padroniza chamadas `tel:+55...`.
     - `formatPhoneDisplay(phone)`: formata para máscara amigável `(XX) XXXXX-XXXX`.

2. **Arquitetura Server-First Rigorosa (RSC por Padrão):**
   - **Componentes de Servidor (RSC):** `layout.tsx`, `page.tsx`, `Header` (barra desktop e logo), `Hero` e `Footer` são estritamente Server Components, garantindo zero peso de JavaScript no cliente e hidratação instantânea.
   - **Ilha de Interatividade Isolada (Client Component):** Apenas `mobile-nav.tsx` recebe a diretiva `'use client'` para controlar o estado do diálogo modal (`useState(false)`).

3. **Componentes Atômicos de UI Focados em Marketing Institucional (`src/components/ui/`):**
   - Configuração de `components.json` alinhado ao Tailwind CSS v4.
   - Instalação e implementação de primitivos atômicos acessíveis em `src/components/ui/`:
     - `button.tsx`: Variantes focadas em conversão institucional (`default`, `cta`, `whatsapp`, `outline`, `secondary`, `ghost`, `link`), tamanhos e suporte polimórfico `asChild` via Radix Slot. (Variantes administrativas irrelevantes como `destructive` são omitidas da UI pública).
     - `card.tsx`: Estrutura composta (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
     - `dialog.tsx`: Janela modal/dialog acessível baseada em Radix UI com **gerenciamento estrito de ciclo de foco**:
       - Foco inicial transferido para dentro do modal ao abrir.
       - Tecla `Escape` fecha o modal instantaneamente.
       - Restauração automática de foco para o botão disparador (_trigger_) após o fechamento.
     - `input.tsx` e `textarea.tsx`: Campos de entrada tipados e preparados para formulários acessíveis.

4. **Componentes Compostos de Layout (`src/components/shared/`):**
   - **`Header` (`src/components/shared/header/header.tsx` - RSC):**
     - Barra de navegação com comportamento _sticky_ e desfoque de fundo (`backdrop-blur`).
     - Consumo dinâmico de `siteConfig.name` e `siteConfig.nav`. Zero rotas chumbadas no JSX.
     - Botão de ação (CTA) em destaque.
     - Inclusão do `<MobileNav />` como ilha de cliente.
   - **`Menu Mobile` (`mobile-nav.tsx` - Client Component via Radix Dialog):**
     - Trava de foco (_focus trap_) e trava de rolagem de fundo (_scroll lock_) durante a exibição em telas estreitas.
     - Fechamento automático ao clicar em qualquer link de âncora interno.
     - Fechamento alternativo via tecla `Esc` e restauração de foco para o botão hambúrguer.
   - **`Hero Section` (`src/components/shared/hero/hero.tsx` - RSC) — Template-Agnostic:**
     - Estrutura modular desacoplada através da interface `HeroProps` (`badge`, `title`, `subtitle`, `primaryCta`, `secondaryCta`).
     - Suporte a _fallbacks_ automáticos consumindo `siteConfig` caso nenhuma propriedade seja passada.
   - **`Footer` (`src/components/shared/footer/footer.tsx` - RSC):**
     - Rodapé corporativo com copyright dinâmico (ano atual), dados legais, links de navegação e canais de contato.

5. **Entrega do "Layout Shell Demo" (Página Inicial Viva & Discreta):**
   - Composição completa em `src/app/page.tsx` demonstrando a integração real:
     - `<Header />` no topo.
     - `<Hero />` com proposta de valor neutra e CTAs de ação.
     - Seção de Destaques/Serviços demonstrativa construída com `<Card />` e ícones neutros do `lucide-react`.
     - `<Footer />` no rodapé.
   - Validação de ritmo vertical (_spacing_), alinhamento de containers (`max-w-7xl mx-auto`), contraste e ausência de transbordamento horizontal (_overflow-x_).

6. **Diretrizes Canônicas de UX & Design System (Guardrails Visuais Inegociáveis):**
   - **Container Max-Width:** Padrão institucional estrito em `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` e container de leitura em `max-w-4xl`.
   - **Sistema de Espaçamento:** Ritmo de seções baseado em `py-16 md:py-24`, grids com `gap-6 md:gap-8` e escala 4px/8px.
   - **Hierarquia de Botões:** No máximo **1 CTA primária por dobra/seção** (`cta` ou `whatsapp`).
   - **Escala Tipográfica:** Hierarquia fixa de H1 (`4xl` a `6xl`), H2 (`3xl` a `4xl`), subtítulos (`lg` a `xl`), H3 (`xl`) e corpo (`base`).
   - **Mobile-First & Touch Targets (Web Responsiva):** Alvos interativos com área mínima de toque de **44 × 44 pixels** (WCAG 2.1 AA).
   - **Zero Cores Hexadecimais Brutas (`no raw hex`):** Uso exclusivo de tokens semânticos (`text-primary`, `bg-background`, etc.).

7. **Bateria Enxuta de Testes Funcionais de UI (Alto ROI) & Acessibilidade:**
   - **6 Testes Funcionais Essenciais:**
     1. `Header renders nav items`: valida renderização dos links vindos de `siteConfig.nav`.
     2. `Mobile menu toggles correctly`: valida abertura e fechamento interativo do menu mobile.
     3. `Dialog focus lifecycle`: valida foco no modal ao abrir, fechamento via `Escape` e restauração de foco no trigger.
     4. `CTA links point to correct anchors`: valida links corretos do WhatsApp e serviços.
     5. `Footer shows legal/contact info`: valida exibição de CNPJ, dados legais e canais de contato.
     6. `Button variants render classes as expected`: valida aplicação das classes nas variantes `cta`, `whatsapp` e `asChild`.
   - **Acessibilidade Contínua:** Verificação automatizada com `vitest-axe` em todos os componentes (zero violações).

### O que NÃO está no escopo (Out-of-Scope)

- **Aplicativos móveis nativos (React Native, iOS, Android):** O MVP e o template são **estritamente para navegadores Web** de forma responsiva.
- Formulário transacional funcional com envio de e-mails, Resend API, Rate Limiting e Turnstile — _Tratado na Feature 003_.
- Páginas legais estáticas completas (`/politica-de-privacidade` e `/termos-de-uso`) — _Tratadas na Feature 003_.
- Painel administrativo e coleções de conteúdo do Keystatic CMS — _Tratado na Feature 004_.
- Integrações de analytics (Plausible) e testes de performance de produção no Lighthouse CI — _Tratados na Feature 005_.

---

## 🚦 3. Critérios Objetivos de Aceitação (Acceptance Criteria)

1. **Arquitetura Server-First Respeitada:**
   - `layout.tsx`, `page.tsx`, `Header`, `Hero` e `Footer` não utilizam a diretiva `'use client'`.
   - Apenas `mobile-nav.tsx` é marcado como Client Component para isolamento de interatividade.
2. **Neutralidade e Reutilização do Template:**
   - O código JSX não contém nomes de marcas, telefones ou URLs hardcoded; todos os dados derivam de `siteConfig`.
   - A demonstração visual na página inicial utiliza textos universais e paleta neutra de alto contraste.
3. **Ciclo de Foco Acessível do Dialog (WCAG 2.1 AA):**
   - Ao abrir o modal, o foco do navegador é transferido para dentro do container do Dialog.
   - Pressionar a tecla `Escape` fecha o modal.
   - Ao fechar, o foco é restaurado com precisão para o botão disparador (_trigger_).
4. **Aprovação nos Testes Funcionais de UI (Web Responsiva):**
   - O `Header` renderiza exatamente os links informados em `siteConfig.nav`.
   - O menu de navegação responsivo abre com clique no hambúrguer e fecha com clique em link ou `Esc`.
   - As CTAs da Hero apontam para os destinos corretos (WhatsApp sanitizado e `#servicos`).
   - O `Footer` apresenta a Razão Social, CNPJ formatado e canais de contato do `siteConfig`.
   - As variantes `cta`, `whatsapp` e `asChild` do `Button` aplicam suas classes correspondentes.
5. **Conformidade com os Guardrails de UX & Design System:**
   - Grid `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` e ritmo `py-16 md:py-24` aplicados rigorosamente.
   - Zero uso de cores hexadecimais arbitrárias no código (`no raw hex`).
   - Todos os elementos interativos respeitam o alvo de toque mínimo de 44 × 44 pixels em telas touch.
6. **Layout Shell Demo Funcional no Navegador:**
   - Ao executar `npm run dev` e acessar `http://localhost:3000`, a página inicial renderiza de ponta a ponta o cabeçalho fixo, hero institucional, grid de destaques com cards e o rodapé.
   - Zero quebras horizontais (_no horizontal overflow_) em resoluções mobile (320px+), tablet (768px+) e desktop (1024px+ e 1440px+).
7. **Acessibilidade Inegociável (WCAG 2.1 AA):**
   - Todos os componentes de UI (`Button`, `Card`, `Dialog`, `Header`, `Footer`, `Hero`) executam a suíte automatizada do `vitest-axe` com **zero violações críticas ou sérias**.
8. **Execução Verde dos Quality Gates:**
   - `npm run verify` executa sem nenhum erro de auditoria documental, lint, tipos, testes ou build.
