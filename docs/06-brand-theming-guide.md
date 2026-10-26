# 06 - Guia de Customização Visual por Marca (Brand Theming Guide)

Este guia prático ensina como transformar a aparência completa do **`institutional-website-template`** para a identidade visual de um novo cliente em **menos de 10 minutos**, mantendo 100% de conformidade com os índices de Core Web Vitals e regras de acessibilidade (WCAG AA).

---

## 🎨 O Roteiro de 4 Passos da Personalização

```text
[ Novo Cliente ]
       ↓
1. Cores da Marca (Tailwind v4 @theme no src/app/globals.css)
       ↓
2. Tipografia (next/font/google no src/app/layout.tsx)
       ↓
3. Dados Institucionais e LGPD (src/config/site.ts)
       ↓
4. Logotipos e Metadados Visuais (public/images/brand/ e public/og.jpg)
```

---

### Passo 1: Cores da Marca no Tailwind CSS v4 (`src/app/globals.css`)

No Tailwind v4, toda a paleta de cores reside nas variáveis CSS nativas gerenciadas pela diretiva `@theme` dentro de `src/app/globals.css`.

#### 1. Mapeamento dos Tokens Principais:

| Token CSS              | Utilização                                                      | Exemplo Visual                          |
| :--------------------- | :-------------------------------------------------------------- | :-------------------------------------- |
| `--primary`            | Cor predominante da marca (botões principais, destaques, links) | Azul corporativo, verde saúde, etc.     |
| `--primary-foreground` | Cor do texto exibido sobre a cor primária                       | Quase sempre Branco ou Preto            |
| `--secondary`          | Cor de apoio (badges, botões secundários, cartões sutis)        | Cinza neutro suave                      |
| `--accent`             | Cor de destaque para interações (efeitos de hover em menus)     | Variação suave da cor primária          |
| `--background`         | Fundo principal da página                                       | Branco puro ou cinza gelo               |
| `--foreground`         | Cor padrão de leitura dos textos e títulos                      | Chumbo escuro / preto suave             |
| `--radius`             | Arredondamento dos cantos de botões e cards                     | `0.5rem` (arredondado) ou `0rem` (reto) |

#### 2. Como Aplicar a Cor do Cliente:

Basta converter a cor hexadecimal fornecida no manual de marca do cliente para o formato `oklch()` (padrão nativo do Tailwind v4 e Shadcn/ui) ou `hsl()` completo, e atualizar as variáveis em `src/app/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

:root {
  /* Exemplo: Cliente da área de Saúde (Verde Esmeralda) */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);

  /* Cor Principal da Marca: #059669 -> OKLCH */
  --primary: oklch(0.6 0.18 160);
  --primary-foreground: oklch(0.985 0 0);

  --secondary: oklch(0.97 0.02 160);
  --secondary-foreground: oklch(0.205 0.05 160);

  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);

  --accent: oklch(0.97 0.02 160);
  --accent-foreground: oklch(0.205 0.05 160);

  --border: oklch(0.922 0 0);
  --radius: 0.5rem;
}

.dark {
  /* Ajustes automáticos para Modo Escuro */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.65 0.18 160);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.269 0.05 160);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0.05 160);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
}
```

> ⚠️ **Regra de Ouro da Acessibilidade (WCAG AA):**  
> Antes de fechar a cor, teste a combinação de `--primary` com `--primary-foreground` em ferramentas como o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). A taxa de contraste deve ser de **no mínimo 4.5:1** para textos normais e **3:1** para botões grandes.

---

### Passo 2: Tipografia com `next/font/google` (`src/app/layout.tsx`)

O Next.js baixa e otimiza automaticamente as fontes do Google Fonts em tempo de build, eliminando requisições externas no navegador do visitante e garantindo **deslocamento de layout zero (CLS 0)**.

Para trocar a fonte do projeto, edite o topo de `src/app/layout.tsx`:

```typescript
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

// 1. Escolha a família tipográfica de acordo com o nicho do cliente:
// - Tech / Inovação: Inter
// - Corporativo / B2B Moderno: Plus_Jakarta_Sans
// - Advocacia / Luxo / Medicina Tradicional: Playfair_Display
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

E aplique no elemento `<body>`:

```tsx
<body className={cn("min-h-screen font-sans antialiased", fontSans.variable)}>{children}</body>
```

---

### Passo 3: Dados Institucionais e LGPD (`src/config/site.ts`)

Este é o arquivo central que alimenta todo o cabeçalho, rodapé, links de WhatsApp, metadados de SEO e páginas legais do site.

Abra `src/config/site.ts` e preencha as informações reais da empresa do cliente:

```typescript
export const siteConfig = {
  name: "Dra. Ana Silva Odontologia",
  description: "Clínica especializada em implantes e estética dental em Porto Alegre.",
  url: "https://draanasilva.com.br",
  ogImage: "https://draanasilva.com.br/og.jpg",

  // Dados Jurídicos para Governança e LGPD (ADR 0007)
  legal: {
    companyName: "Clínica Ana Silva Odontologia Ltda",
    cnpj: "12.345.678/0001-90",
    dpoEmail: "privacidade@draanasilva.com.br",
  },

  // Contatos Globais exibidos no Header, Footer e Contato
  contact: {
    email: "contato@draanasilva.com.br",
    phone: "(51) 3333-4444",
    whatsapp: "5551988887777", // Formato internacional sem traços para link da API
    address: "Av. Carlos Gomes, 1000 - Sala 402, Porto Alegre - RS",
  },

  // Redes Sociais da Empresa
  social: {
    instagram: "https://instagram.com/draanasilva",
    linkedin: "https://linkedin.com/company/draanasilva",
    facebook: "https://facebook.com/draanasilva",
  },
};
```

---

### Passo 4: Logotipos e Metadados Visuais (`public/`)

Substitua os arquivos padrão dentro da pasta `/public` pelos ativos visuais fornecidos pelo cliente:

| Arquivo                             | Dimensão Recomendada         |         Formato         | Dica                                                                  |
| :---------------------------------- | :--------------------------- | :---------------------: | :-------------------------------------------------------------------- |
| `public/images/brand/logo.svg`      | Vetorial (ou altura de 60px) | SVG ou PNG transparente | Versão colorida para fundos claros                                    |
| `public/images/brand/logo-dark.svg` | Vetorial (ou altura de 60px) | SVG ou PNG transparente | Versão branca/clara para fundo escuro                                 |
| `public/favicon.ico`                | 32x32 px                     |           ICO           | Ícone clássico para a aba do navegador                                |
| `public/icon.png`                   | 512x512 px                   |           PNG           | Ícone para navegadores modernos e PWA                                 |
| `public/apple-touch-icon.png`       | 180x180 px                   |           PNG           | Ícone exibido ao salvar o site na tela inicial do iPhone              |
| `public/og.jpg`                     | **1200 x 630 px** (Exato)    |  JPG ou PNG (< 300 KB)  | Imagem exibida ao compartilhar o link no WhatsApp, LinkedIn e Twitter |

---

### ✅ Checklist de Validação Visual Pré-Entrega

Antes de apresentar o site para o cliente:

- [ ] As cores primárias no cabeçalho e botões respeitam o manual de marca?
- [ ] O contraste de texto em botões e badges foi validado no WebAIM (score verde)?
- [ ] O link de WhatsApp abre diretamente a conversa com o número correto?
- [ ] O logotipo renderiza com nitidez em telas de alta densidade (Retina/Mobile)?
- [ ] Ao enviar o link do site no WhatsApp, o título, descrição e imagem de pré-visualização (`og.jpg`) carregam perfeitamente?
