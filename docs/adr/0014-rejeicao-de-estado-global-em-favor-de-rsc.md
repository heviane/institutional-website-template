# ADR 0014: Rejeição de Gerenciadores de Estado Global em favor de React Server Components

* **Status:** Aceito
* **Data:** 2026-10-26
* **Decisores:** Engenharia de Software / Autor do Projeto

> Complementa a [ADR 0001](0001-escolha-do-framework-next.md), [ADR 0003](0003-estrategia-de-formularios.md) e [ADR 0013](0013-arquitetura-unificada-fullstack-vs-separacao-fisica.md) estabelecendo a diretriz formal sobre o modelo de gerenciamento de dados na interface e rejeitando o uso de bibliotecas de estado global (Redux, Zustand, Recoil ou Context API em cascata).

---

## 1. Contexto (Context)

Em aplicações web tradicionais desenvolvidas em React (Single Page Applications no modelo Vite/CRA), é prática comum a introdução precoce de bibliotecas de gerenciamento de estado global como **Redux Toolkit, Zustand, Jotai, Recoil, MobX** ou a proliferação de Provedores em cascata da **React Context API** (`ThemeProvider`, `UserProvider`, `NotificationProvider`, `CartProvider`).

O argumento clássico para essas ferramentas é evitar o repasse de propriedades (*prop drilling*) e permitir que componentes em posições distantes da árvore compartilhem variáveis em memória.

No entanto, o **`institutional-website-template`** foi concebido sobre a arquitetura moderna do **Next.js 16 (App Router)** e opera no modelo de renderização estática orientada a conteúdo institucional. A introdução de estado global em um website institucional frequentemente acarreta efeitos colaterais severos:
1. **Forçar Componentes para o Cliente:** Provedores de contexto do React exigem obrigatoriamente a diretiva `'use client'`, o que transforma toda a subárvore em componentes de cliente, anulando os benefícios de React Server Components (RSC), eliminando o streaming de HTML e inflando o bundle JavaScript enviado ao navegador.
2. **Complexidade Acidental:** Websites institucionais possuem dados essencialmente unidirecionais e estáticos (informações da marca, lista de serviços, artigos de blog e dados de contato). Não existe um modelo de domínio volátil ou mutável que justifique um *store* reativo em memória no navegador.

---

## 2. Decisão (Decision)

Decidimos **rejeitar a instalação e uso de bibliotecas de gerenciamento de estado global** no template institucional, fundamentando a arquitetura de dados da interface em **três primitivos nativos**:

### 2.1. Primitivos Canônicos de Estado do Template

1. **Dados de Conteúdo e Marca (Server-First via RSC):**
   * Informações institucionais (`siteConfig`), artigos do blog e listagens do CMS são carregados diretamente no servidor em **React Server Components (RSC)**.
   * Os dados fluem de forma transparente via propriedades estritamente tipadas (`interface HeaderProps`, `interface HeroProps`, `interface FooterProps`), sem necessidade de provedores no cliente.
2. **Estado Efêmero de Interatividade (Colocalizado na Folha):**
   * Onde há interação do usuário (ex.: o formulário de contato ou o menu responsivo), o estado é encapsulado estritamente no componente folha com `'use client'`.
   * O formulário utiliza **React Hook Form** isolado em [`src/components/shared/contact-form/contact-form.tsx`](../../src/components/shared/contact-form/contact-form.tsx), descartando seu estado após a submissão bem-sucedida.
   * O menu mobile gerencia a abertura do diálogo via Radix UI acessível sem vazar estado para componentes irmãos.
3. **Estado Compartilhado e Navegação (URL First via SearchParams):**
   * Se houver necessidade de estados persistentes entre telas (ex.: filtro de categorias de serviços ou paginação de blog), utiliza-se o estado nativo da **URL** (`searchParams` e âncoras), garantindo que a página seja indexável por mecanismos de busca (SEO) e compartilhável via link.

---

## 3. Justificativas Principais (Why)

1. **Preservação Máxima do Desempenho (Zero-JS Overhead):**
   * A eliminação de bibliotecas de estado global reduz o First Load JS do navegador, permitindo atingir pontuações 98–100 no Lighthouse Mobile com menor consumo de bateria e dados em celulares.
2. **Alinhamento com o Princípio 1 ([AGENTS.md](../../AGENTS.md)):**
   * *Simplicidade antes de Complexidade:* Não introduzir abstrações indiretas sem benefício concreto comprovado.
3. **Eliminação de Problemas de Hidratação:**
   * Stores globais que persistem dados em `localStorage` frequentemente causam descompassos de hidratação (*hydration mismatches*) entre o HTML gerado no servidor e o estado reidratado no cliente.

---

## 4. Critérios de Exceção (Quando o Estado Global Seria Aceito?)

A introdução de uma biblioteca leve de estado global (como `zustand`) só será autorizada se o projeto for estendido para casos de uso substancialmente diferentes do propósito deste template:
1. **Comércio Eletrônico Completo:** Adição de carrinho de compras multi-produtos com persistência em tempo real e cálculo instantâneo de frete entre dezenas de páginas.
2. **Painel SaaS Interativo:** Uma aplicação autenticada de gestão corporativa com painéis divididos (*split views*), edição concorrente de tabelas e múltiplos widgets que alteram o mesmo modelo de dados simultaneamente.

Para a proposta do template (websites corporativos, páginas institucionais e landing pages de conversão), tais cenários estão explicitamente fora de escopo.

---

## 5. Consequências e Trade-offs (Consequences)

### Positivas:
* **Bundle Ultraleve:** Zero kilobytes desperdiçados com despachantes de ações, redutores ou provedores de contexto.
* **Código Previsível e Rastreador Direto:** Qualquer desenvolvedor pode rastrear de onde vem um dado inspecionando diretamente as props do componente pai em RSC.
* **Aderência aos Padrões Modernos do React 19:** Utilização plena do ecossistema de Server Components sem padrões legados da era SPA de 2018.

### Negativas (Riscos Aceitos):
* **Prop Drilling em Profundidades Moderadas:** Se uma propriedade precisar ser repassada por 2 ou 3 níveis de componentes de layout (ex.: links do menu), isso deve ser feito de forma explícita via props tipadas ou composição de componentes (`children`), o que é considerado uma prática saudável e transparente de arquitetura de software.

