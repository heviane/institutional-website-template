# 12 - Guia de Performance, Core Web Vitals e Gestão de Scripts de Terceiros

Este guia orienta engenheiros de software, designers e gestores de tráfego sobre como manter notas de excelência no Google PageSpeed Insights (pontuações 95–100 no Mobile) e garantir que o **`institutional-website-template`** atenda rigorosamente aos **Core Web Vitals**. 

O objetivo primordial é assegurar que a introdução de mídias pesadas ou tags de marketing de terceiros (Meta Pixel, Google Tag Manager, Hotjar) não degrade a experiência do usuário nem penalize o ranqueamento orgânico de SEO.

---

## 🎯 1. Orçamento de Performance (*Performance Budget*)

Todo website institucional construído sobre este template deve operar dentro das seguintes metas objetivas:

| Métrica Core Web Vital | Limite Recomendado pelo Google | Meta de Engenharia do Template | Impacto na Experiência |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | $\le \text{2,5 segundos}$ | **$\le \text{1,8 segundos}$** | Percepção de carregamento visual da dobra superior. |
| **INP (Interaction to Next Paint)** | $\le \text{200 milissegundos}$ | **$\le \text{100 milissegundos}$** | Responsividade e fluidez ao clicar em botões e inputs. |
| **CLS (Cumulative Layout Shift)** | $\le \text{0,10}$ | **$\le \text{0,02}$** | Estabilidade visual (zero "pulos" de layout ao carregar). |
| **FCP (First Contentful Paint)** | $\le \text{1,8 segundos}$ | **$\le \text{1,0 segundo}$** | Primeiro sinal visível de renderização de conteúdo. |
| **TBT (Total Blocking Time)** | $\le \text{200 milissegundos}$ | **$\le \text{50 milissegundos}$** | Tempo em que a thread principal do navegador fica travada. |

---

## 🖼️ 2. Diretrizes Mandatórias para Imagens e Mídia

Imagens não otimizadas são a causa número um de LCP alto e CLS indesejado. Para mitigar esse risco:

### 2.1. Uso Compulsório do Componente `<Image>` do Next.js
* **Nunca utilize a tag HTML nativa `<img>`** para imagens de layout ou conteúdo institucional.
* Utilize sempre `import Image from "next/image"`, que realiza conversão automática para **WebP** e **AVIF**, redimensionamento responsivo sob demanda e inserção automática de atributos `srcset`.

### 2.2. A Regra de Ouro do LCP: `priority={true}` na Imagem Principal
* A imagem da dobra superior (ex.: banner da seção Hero ou foto de destaque) DEVE receber a propriedade `priority`:
  ```tsx
  // ✅ Correto: Informa ao navegador para pré-carregar o maior elemento visual
  <Image
    src="/images/brand/hero-banner.webp"
    alt="Sede corporativa da empresa"
    width={1200}
    height={630}
    priority
    sizes="(max-width: 768px) 100vw, 1200px"
  />
  ```
* **Atenção:** NUNCA marque mais de uma imagem com `priority` na mesma página, pois isso divide a largura de banda de pré-carregamento e piora o LCP.

### 2.3. Prevenção de CLS com Dimensões Explícitas ou `fill`
* Para eliminar completamente o CLS (*Layout Shift*), o navegador precisa conhecer a proporção (*aspect ratio*) antes do download da imagem:
  * Forneça sempre `width` e `height` numéricos intrínsecos, ou:
  * Use a propriedade `fill` em conjunto com um container pai que possua `position: relative` e proporção CSS definida (`aspect-video`, `aspect-square`).

---

## 🏷️ 3. Gestão Segura de Scripts de Terceiros (Marketing & Analytics)

Scripts de marketing tradicionais (Meta Pixel, Google Tag Manager, LinkedIn Insight Tag, Hotjar) frequentemente baixam megabytes de JavaScript mal otimizado, executando processamentos pesados que bloqueiam a CPU do celular (destruindo o TBT e o INP).

### 3.1. Estratégias do Componente `<Script>` do Next.js

Para adicionar scripts de rastreamento sem prejudicar a pontuação:

```tsx
import Script from "next/script";

// ✅ 1. Analytics de Baixo Impacto (Plausible / Google Analytics essencial):
// Carregado após a página se tornar interativa
<Script
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
  data-domain={siteConfig.url}
/>

// ✅ 2. Tags de Retargeting e Mapas de Calor (Meta Pixel, Hotjar, Clarity):
// Carregado durante o tempo ocioso do navegador (não compete com o carregamento do site)
<Script id="meta-pixel" strategy="lazyOnload">
  {`
    !function(f,b,e,v,n,t,s)...
  `}
</Script>
```

### 3.2. Priorize Telemetria Sem Cookies (Plausible Analytics)
* Conforme formalizado na [ADR 0007](adr/0007-conformidade-lgpd-e-privacidade.md), o template adota por padrão o **Plausible Analytics**:
  * Pesa menos de **1 KB** (contra mais de 45 KB do Google Analytics 4).
  * Não utiliza cookies persistentes nem coleta dados pessoais identificáveis.
  * Preserva 100% dos Core Web Vitals sem exigir banners intrusivos de consentimento prévio de cookies.

---

## 🔤 4. Tipografia e Otimização de Folhas de Estilo

1. **Fontes com Auto-Hospedagem no Build:**
   * O template utiliza `next/font/google` com a fonte `Inter` em [`src/app/layout.tsx`](../src/app/layout.tsx).
   * O Next.js baixa os arquivos WOFF2 no momento do build e os hospeda diretamente no mesmo domínio, eliminando requisições externas para os servidores do Google Fonts e aplicando automaticamente `display: 'swap'` (evitando texto invisível / FOIT).
2. **Tailwind CSS v4 (@theme):**
   * Sem geradores legados de CSS em runtime.
   * Compilador em Rust via `@tailwindcss/postcss` que realiza tree-shaking cirúrgico, gerando um bundle CSS ultraleve (geralmente inferior a 15 KB).

---

## 📱 5. Como Realizar Auditoria de Performance Localmente

Para simular com fidelidade a avaliação do Googlebot e do PageSpeed Insights:

1. Gere o build de produção local e inicie o servidor:
   ```bash
   npm run build
   npm start
   ```
2. Abra o Google Chrome em uma **Janela Anônima** (para garantir que extensões instaladas não interfiram nas métricas).
3. Abra as Ferramentas do Desenvolvedor (F12) e selecione a aba **Lighthouse**.
4. Configure as seguintes opções:
   * **Modo:** Navegação (*Navigation*)
   * **Dispositivo:** Mobile (Smartphone de entrada simulado)
   * **Categorias:** Performance, Acessibilidade, Melhores Práticas, SEO
5. Clique em **Analyze page load**.
6. A meta estabelecida pelo template é atingir **pontuação 90+ em Mobile e 98+ em Desktop** em todas as categorias.

