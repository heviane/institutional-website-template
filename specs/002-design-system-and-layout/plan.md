# Feature 002: Design System, Layout Base & Componentes Essenciais (Plan)

* **Status:** Em Especificação (Refinada com Arquitetura Server-First & Design Neutro)
* **Spec de Referência:** [`spec.md`](spec.md)
* **Constituição de Engenharia:** [`AGENTS.md`](../../AGENTS.md)
* **ADRs Vinculados:** [ADR 0001: Next.js App Router](../../docs/adr/0001-escolha-do-framework-next.md), [ADR 0004: Design System](../../docs/adr/0004-design-system-e-estilizacao.md), [ADR 0008: Qualidade Automatizada](../../docs/adr/0008-qualidade-automatizada-e-testes.md)

---

## 🏗️ 1. Arquitetura Técnica e Decisões de Implementação

### 1.1. Arquitetura Server-First & Fronteira de Componentes (RSC vs Client Component)

Para assegurar **Core Web Vitals excelentes (LCP < 2,5s, INP < 200ms)** e reduzir o pacote de JavaScript ao mínimo essencial, o layout adota o padrão de **Ilhas de Interatividade**:

| Arquivo / Componente | Tipo de Componente | Justificativa Arquitetural |
| :--- | :--- | :--- |
| `src/app/layout.tsx` | **Server Component (RSC)** | Layout raiz com injeção de fontes e metadados no servidor. |
| `src/app/page.tsx` | **Server Component (RSC)** | Composição estática da Home Page. |
| `src/components/shared/header/header.tsx` | **Server Component (RSC)** | Renderiza marca e navegação desktop no servidor. |
| `src/components/shared/header/mobile-nav.tsx` | **Client Component (`'use client'`)** | **Único Client Component do layout.** Gerencia o estado de abertura/fechamento da gaveta (`useState(false)`). |
| `src/components/shared/hero/hero.tsx` | **Server Component (RSC)** | Renderização estática pura de tipografia e links de conversão. |
| `src/components/shared/footer/footer.tsx` | **Server Component (RSC)** | Renderização estática pura de dados legais e contatos corporativos. |

### 1.2. Novas Dependências Necessárias

| Pacote | Tipo | Finalidade Arquitetural |
| :--- | :--- | :--- |
| **`lucide-react`** | Produção | Biblioteca de ícones acessíveis em SVG para navegação, contatos e ações do usuário. |
| **`class-variance-authority` (`cva`)** | Produção | Gerenciamento tipado de variantes visuais (tamanhos, cores e estados de botões e cards). |
| **`@radix-ui/react-slot`** | Produção | Primitivo do Radix para composição polimórfica (`asChild`), permitindo que botões renderizem tags `<a>` ou `<Link>` mantendo a estilização e acessibilidade. |
| **`@radix-ui/react-dialog`** | Produção | Primitivo do Radix para modais e o menu web responsivo, garantindo nativamente *focus trap*, *scroll lock*, *escape listener* e *focus restoration*. |
| **`vitest-axe` & `axe-core`** | Desenvolvimento | Integração do motor oficial do axe-core com o Vitest para validação contínua e automatizada de WCAG 2.1 AA ([ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md)). |

### 1.3. Proteção de Arquivos Existentes (Anti-Sobrescrita do Shadcn)

Para preservar integralmente os arquivos canônicos já configurados e validados na Feature 001 (`src/app/globals.css` com `@custom-variant dark` e tokens OKLCH, e `src/lib/utils.ts` com o helper `cn()`):

* **Proibição de `npx shadcn init`:** O comando interativo de CLI não deve ser executado, pois tenta sobrescrever `globals.css` e `utils.ts`.
* **Configuração Declarativa Direta (`components.json`):** O arquivo de configuração `components.json` é criado manualmente na raiz, e os componentes primitivos (`button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `textarea.tsx`) são adicionados diretamente em `src/components/ui/` respeitando o Radix UI e o Tailwind CSS v4.

### 1.4. Contrato de Configuração do Cliente & Interfaces Tipadas (`src/config/site.ts`)

```typescript
export interface NavItem {
  title: string;
  href: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

export interface LegalConfig {
  companyName: string;
  cnpj: string;
  dpoEmail: string;
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  nav: readonly NavItem[];
  contact: ContactConfig;
  legal: LegalConfig;
  social: SocialLinks;
}

export const siteConfig: SiteConfig = {
  name: "Empresa Exemplo",
  slogan: "Soluções corporativas modernas, ágeis e de alta performance.",
  description: "Website institucional moderno, acessível e de alta performance com arquitetura serverless.",
  url: "https://www.empresaexemplo.com.br",
  ogImage: "https://www.empresaexemplo.com.br/og.jpg",
  nav: [
    { title: "Início", href: "#" },
    { title: "Serviços", href: "#servicos" },
    { title: "Sobre", href: "#sobre" },
    { title: "Contato", href: "#contato" },
  ],
  contact: {
    email: "contato@empresaexemplo.com.br",
    phone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
  },
  legal: {
    companyName: "Empresa Exemplo Ltda",
    cnpj: "00.000.000/0001-00",
    dpoEmail: "privacidade@empresaexemplo.com.br",
  },
  social: {
    instagram: "https://instagram.com/empresaexemplo",
    linkedin: "https://linkedin.com/company/empresaexemplo",
  },
} as const;
```

### 1.4. Utilitários Resilientes de Contato (`src/lib/utils.ts`)

```typescript
/**
 * Sanitiza o número e constrói link seguro para a API do WhatsApp
 */
export function formatWhatsAppUrl(phone: string, text?: string): string {
  const cleanDigits = phone.replace(/\D/g, "");
  const normalizedNumber = cleanDigits.startsWith("55") ? cleanDigits : `55${cleanDigits}`;
  const baseUrl = `https://wa.me/${normalizedNumber}`;
  return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}

/**
 * Sanitiza o número para links tel:
 */
export function formatTelUrl(phone: string): string {
  const cleanDigits = phone.replace(/\D/g, "");
  const normalizedNumber = cleanDigits.startsWith("55") ? cleanDigits : `55${cleanDigits}`;
  return `tel:+${normalizedNumber}`;
}

/**
 * Formata telefone para exibição humana (XX) XXXXX-XXXX
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const localDigits = digits.startsWith("55") ? digits.slice(2) : digits;
  if (localDigits.length === 11) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
  }
  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
  }
  return phone;
}
```

### 1.5. Contrato do Componente Header (`src/components/shared/header/`)

* **`header.tsx` (Server Component):**
  * Consome `siteConfig.name` para a marca e `siteConfig.nav` para as rotas. Zero rotas chumbadas no JSX.
  * Renderiza o container fixo (*sticky*), links desktop e inclui `<MobileNav items={siteConfig.nav} />`.
* **`mobile-nav.tsx` (Client Component via Radix Dialog):**
  * Gerencia o estado de abertura (`const [isOpen, setIsOpen] = useState(false)`).
  * Auto-fechamento imediato (`setIsOpen(false)`) ao clicar em qualquer link de âncora interno.
  * O Radix garante *focus trap*, *scroll lock* e restauração de foco ao fechar.

### 1.6. Contrato do Componente Hero (`src/components/shared/hero/hero.tsx` - RSC) — Template-Agnostic

```typescript
export interface HeroCta {
  text: string;
  href: string;
  variant?: "default" | "cta" | "whatsapp" | "outline" | "secondary";
}

export interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}
```

* **Estética Neutra e Universal:** Textos padrão discretos que servem a qualquer nicho de mercado (tecnologia, advocacia, consultoria, saúde) sem parecer um produto hiper-específico.

### 1.7. Variantes CVA do Button Focadas em Marketing (`src/components/ui/button.tsx`)

O `buttonVariants` foca nas variantes de interface institucional, eliminando opções administrativas irrelevantes (como `destructive`):

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        cta: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-transform",
        whatsapp: "bg-emerald-600 text-white shadow hover:bg-emerald-700 focus-visible:ring-emerald-500",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 1.8. Composição do "Layout Shell Demo" (`src/app/page.tsx` - RSC)

A Home Page demonstrará a harmonia e responsividade de toda a estrutura:

1. `<Header />`: Navegação fixa e botão CTA de contato.
2. `<Hero />`: Título institucional neutro com chamada primária de WhatsApp e secundária para serviços.
3. `<FeaturesSection />`: Grid de 3 colunas (`grid grid-cols-1 md:grid-cols-3 gap-6`) utilizando o primitivo `<Card />` com ícones neutros da Lucide.
4. `<Footer />`: Rodapé completo com canais de contato, endereço, links de navegação e direitos reservados.

### 1.9. Diretrizes Canônicas de UX & Design System (Guardrails Visuais)

1. **Largura Máxima de Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (geral) e `max-w-4xl` (leitura).
2. **Sistema de Espaçamento:** Ritmo de seções `py-16 md:py-24`, grids `gap-6 md:gap-8` e escala padrão 4px/8px.
3. **Hierarquia Visual de Botões:** No máximo **1 CTA primária por dobra/seção** (`cta` ou `whatsapp`).
4. **Escala Tipográfica:** H1 (`4xl` a `6xl`), H2 (`3xl` a `4xl`), subtítulos (`lg` a `xl`), H3 (`xl`) e corpo (`base`).
5. **Mobile-First & Touch Targets (Web Responsiva):** Alvos interativos com área mínima de toque de **44 × 44 pixels**.
6. **Zero Cores Hexadecimais Brutas (`no raw hex`):** Uso exclusivo de tokens semânticos (`text-primary`, `bg-background`, etc.).

---

## 📁 2. Estrutura de Arquivos a Ser Gerada / Atualizada

```text
/institutional-website-template
├── components.json                     # Configuração do Shadcn/ui com Tailwind v4
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # RSC: Layout raiz com Inter font, metadados dinâmicos, Header e Footer
│   │   └── page.tsx                    # RSC: Home institucional (Layout Shell Demo completo)
│   ├── config/
│   │   └── site.ts                     # Objeto canônico siteConfig e interfaces tipadas
│   ├── lib/
│   │   └── utils.ts                    # cn(), formatWhatsAppUrl(), formatTelUrl(), formatPhoneDisplay()
│   └── components/
│       ├── ui/                         # Primitivos atômicos do Shadcn/ui (Radix UI)
│       │   ├── button.tsx              # Button com variantes default, cta, whatsapp e asChild
│       │   ├── card.tsx                # Card composto
│       │   ├── dialog.tsx              # Dialog acessível com foco gerenciado
│       │   ├── input.tsx               # Input de formulário
│       │   └── textarea.tsx            # Textarea de formulário
│       └── shared/                     # Componentes de layout institucional
│           ├── header/
│           │   ├── header.tsx          # RSC: Cabeçalho consumindo siteConfig.nav dinamicamente
│           │   └── mobile-nav.tsx      # 'use client': Menu responsivo via Radix Dialog
│           ├── hero/
│           │   └── hero.tsx            # RSC: Seção Hero agnóstica de template com HeroProps
│           └── footer/
│               └── footer.tsx          # RSC: Rodapé institucional com links legais e dados da empresa
└── tests/
    ├── setup.ts                        # Configuração global de extensões do Vitest (vitest-axe)
    ├── site-config.test.ts             # Teste unitário da estrutura do siteConfig e interfaces
    ├── utils.test.ts                   # Testes dos helpers de telefone e WhatsApp
    └── components/
        ├── button.test.tsx             # Testes de variantes (cta/whatsapp), asChild e WCAG
        ├── card.test.tsx               # Testes de composição do Card e WCAG
        ├── dialog.test.tsx             # Teste de ciclo de foco do Dialog (abertura, Escape, restauração)
        └── layout.test.tsx             # Matriz funcional (Header, Footer, Hero, mobile toggle) e WCAG
```

---

## 🧪 3. Estratégia de Testes (TDD, Matriz Enxuta de UI & WCAG 2.1 AA)

### 📋 A Matriz de Testes Funcionais de UI

| # | Teste Funcional | Arquivo | Asserção Principal |
| :--- | :--- | :--- | :--- |
| **1** | **`Header renders nav items`** | `tests/components/layout.test.tsx` | Verifica se os links declarados em `siteConfig.nav` são renderizados com texto e atributo `href` corretos. |
| **2** | **`Mobile menu toggles correctly`** | `tests/components/layout.test.tsx` | Dispara clique no botão hambúrguer (dialog aberto) e clique em link ou botão fechar (dialog fechado). |
| **3** | **`Dialog focus lifecycle`** | `tests/components/dialog.test.tsx` | Valida que o foco vai para o modal ao abrir, `Escape` fecha o diálogo e o foco retorna ao trigger original. |
| **4** | **`CTA links point to correct anchors`** | `tests/components/layout.test.tsx` | Valida se a CTA principal aponta para a URL sanitizada de WhatsApp e a secundária para `#servicos`. |
| **5** | **`Footer shows legal/contact info`** | `tests/components/layout.test.tsx` | Verifica a presença na tela da Razão Social, CNPJ formatado e canais de contato do `siteConfig`. |
| **6** | **`Button variants render classes as expected`** | `tests/components/button.test.tsx` | Valida classes semânticas aplicadas em `cta` (escala/destaque), `whatsapp` (esmeralda) e `asChild` (renderiza `<a>`). |

### ♿ Teste de Acessibilidade (WCAG 2.1 AA)

Cada componente renderizado na suíte de testes passa pela asserção:

```typescript
const { container } = render(<Component />);
expect(await axe(container)).toHaveNoViolations();
```
