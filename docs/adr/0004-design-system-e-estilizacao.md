# ADR 0004: Design System, Estilização e Acessibilidade

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a estratégia de UI/UX combinando Tailwind CSS, Shadcn/ui e Radix UI para garantir responsividade, acessibilidade (WCAG), consistência e facilidade de customização para diferentes marcas de clientes.

---

## 1. Contexto (Context)

Para que o `institutional-website-template` seja facilmente adaptado à identidade visual de novos clientes, a camada de interface precisava atender a três critérios fundamentais:

1. **Velocidade de Desenvolvimento:** Criar layouts responsivos rapidamente sem escrever CSS tradicional do zero.
2. **Acessibilidade Nativa (WCAG) e Usabilidade:** Garantir que componentes interativos (como menus e modais) funcionem perfeitamente com leitores de tela e navegação por teclado.
3. **Controle Total do Código (Desacoplamento e Customização):** Controle completo do código-fonte (autonomia) dos componentes para trocar cores, tipografia e espaçamentos em minutos para cada cliente. Evitar bibliotecas engessadas.

---

## 2. Decisão (Decision)

Adotamos a combinação complementar do **Tailwind CSS** com o **Shadcn/ui (baseado em Radix UI)** como o padrão de design system do projeto.

### Divisão de Responsabilidades na Arquitetura:

1. **Radix UI:** Biblioteca de primitivos que gerencia o comportamento, estado e regras estritas de acessibilidade dos componentes interativos complexos, ou seja, responsável pela lógica complexa e **acessibilidade (WCAG/ARIA)** de elementos interativos, sem impor estilos visuais pré-definidos (*unstyled components*).

2. **Tailwind CSS (v4):** *Engine* de estilização utilitária de alta performance (baseada no motor Oxide e arquitetura *CSS-first*). Elimina a necessidade de arquivos de configuração JS/TS (`tailwind.config.ts`), centralizando tokens e temas via diretiva `@theme` no `src/app/globals.css`, mantendo o CSS final extremamente enxuto.

3. **Shadcn/ui:** A ponte que une as duas tecnologias. Ele fornece componentes acessíveis do Radix já estilizados com Tailwind, com seus **códigos-fonte copiados diretamente para dentro do projeto (`src/components/ui/`)**.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Propriedade do Código:** Como os componentes residem no próprio repositório, podemos customizá-los livremente sem sofrer com limitações de bibliotecas externas de terceiros. Diferente de bibliotecas como Material UI ou Bootstrap, os componentes pertencem ao repositório do projeto, eliminando sobrescritas complexas de CSS (*CSS overrides*).

* **Base Sólida de Acessibilidade Comportamental (ARIA & Teclado):** O Radix UI assegura conformidade nativa com especificações WAI-ARIA (gerenciamento de foco, navegação por teclado e estados de componentes interativos). A conformidade visual e de conteúdo (taxas de contraste via Tailwind, ordem de tabulação e textos alternativos) permanece sob governança direta do desenvolvedor.

* **Tematização Simples (via Variáveis CSS):** A paleta de cores de toda a aplicação pode ser alterada modificando apenas as variáveis de tema CSS no arquivo global (`globals.css`).

### Negativas (Riscos e Desvantagens Aceitas):

* **Poluição Visual no HTML/JSX:** A abordagem utilitária do Tailwind gera listas longas de classes no código JSX.

* **Manutenção Manual:** Como o código do Shadcn dos componentes foi copiado para o template (reside dentro do projeto), atualizações futuras de componentes precisam ser gerenciadas manualmente pelo desenvolvedor.

---

## 4. Alternativas Consideradas

* **Chakra UI / Material UI (MUI):** Descartados por introduzirem dependências pesadas de *CSS-in-JS* em tempo de execução, o que prejudica a performance de carregamento (desempenho de hidratação e métricas de Core Web Vitals) no Next.js.

* **Styled-Components / Emotion:** Descartados por incompatibilidade com o modelo de renderização de componentes de servidor (paradigma de *React Server Components (RSC)*) do Next.js App Router.

---
