# ADR 0004: Design System, Estilização e Acessibilidade

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a estratégia de UI/UX unindo Tailwind CSS + Shadcn/ui & Radix UI para garantir acessibilidade (WCAG), consistência e facilidade de customização de marca para novos clientes.

---

## 1. Contexto (Context)

Para garantir que o `institutional-website-template` seja facilmente adaptável à identidade visual de diferentes clientes freelancer, necessitávamos de uma estratégia de estilização e componentes de interface que atendesse aos seguintes critérios:

1. **Velocidade de Desenvolvimento:** Criação rápida de componentes responsivos sem perda de tempo escrevendo CSS tradicional do zero[cite: 1].
2. **Acessibilidade e Usabilidade (WCAG):** Componentes interativos (menus responsivos, modais, *accordions*) compatíveis com navegação via teclado e leitores de tela[cite: 1].
3. **Desacoplamento e Customização Total:** Controle completo do código-fonte dos componentes para trocar cores, tipografia e espaçamentos em minutos para cada cliente[cite: 1].

---

## 2. Decisão (Decision)

Decidimos adotar a combinação do **Tailwind CSS** como *engine* de estilização utilitária juntamente com o **Shadcn/ui (baseado nos primitivos do Radix UI)** como o *Design System* padrão do projeto[cite: 1].

### Divisão de Responsabilidades na Arquitetura:

1. **Radix UI:** Gerencia o comportamento, estado e regras estritas de acessibilidade dos componentes interativos complexos sem impor estilos visuais (*unstyled components*)[cite: 1].
2. **Tailwind CSS:** Fornece as classes utilitárias para estilização, layout responsivo, animações e o processo de *tree-shaking* que mantém o arquivo CSS compilado minúsculo[cite: 1].
3. **Shadcn/ui:** Age como a ponte, fornecendo os componentes pré-estilizados com Tailwind CSS cujos códigos-fonte são copiados diretamente para o repositório local (`src/components/ui/`)[cite: 1].

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Propriedade do Código:** Diferente de bibliotecas como Material UI ou Bootstrap, os componentes pertencem ao repositório do projeto, eliminando sobrescritas complexas de CSS (*CSS overrides*)[cite: 1].
* **Acessibilidade Nativa:** Garantia de conformidade com padrões WCAG e ARIA sem custo adicional de desenvolvimento[cite: 1].
* **Tematização via Variáveis CSS:** Troca do esquema de cores de toda a aplicação alterando apenas as variáveis de tema no arquivo `globals.css`[cite: 1].

### Negativas (Riscos e Desvantagens Aceitas):

* **Poluição Visual no HTML/JSX:** A abordagem utilitária do Tailwind gera listas longas de classes no código JSX.
* **Responsabilidade de Atualização:** Como o código do Shadcn reside dentro do projeto, atualizações de novos componentes precisam ser gerenciadas manualmente pelo desenvolvedor.

---

## 4. Alternativas Consideradas

* **Chakra UI / Material UI (MUI):** Descartados por introduzir dependências pesadas de *CSS-in-JS* em tempo de execução, prejudicando o desempenho de hidratação e métricas de Core Web Vitals no Next.js.
* **Styled-Components / Emotion:** Descartados devido à incompatibilidade com o paradigma de React Server Components (RSC) do Next.js App Router.

---
