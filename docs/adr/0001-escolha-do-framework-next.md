# ADR 0001: Escolha do Framework Base - Next.js

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projetos

---

## 1. Contexto (Context)

Necessitávamos definir a estrutura fundamental e o modelo de renderização para o `institutional-website-template`. O objetivo era criar um *boilerplate* altamente performático para sites institucionais estáticos, mas que possuísse flexibilidade para evoluir para recursos dinâmicos (como áreas logadas, integrações de API e formulários avançados) sem a necessidade de reescrever o projeto do zero.

---

## 2. Decisão (Decision)

Decidimos utilizar o **Next.js (App Router)** como a espinha dorsal da arquitetura frontend e backend leve do projeto.

### Justificativas Principais:

1. **Modelo Híbrido de Renderização:** Permite gerar páginas estáticas (SSG) para o site institucional base, mas mantém suporte a SSR/ISR para evoluções futuras.
2. **Fronteira Cliente/Servidor Única:** Uso de Server Actions e Route Handlers para processar formulários (ex: Zod + Resend) sem a necessidade de manter um servidor backend separado.
3. **Integração com ecossistema React:** Compatibilidade nativa com Tailwind CSS, Shadcn/ui e Keystatic CMS.
4. **Hospedagem Zero-Config:** Integração imediata com CI/CD na infraestrutura Serverless/Edge da Vercel.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Escalabilidade:** O template pode atender desde landing pages simples até portais de clientes e e-commerces complexos.
* **Ecossistema:** Ampla disponibilidade de bibliotecas, componentes acessíveis e facilidade de contratação/desenvolvimento em React.
* **Automação de Deploy:** Fluxo de CI/CD simplificado com URLs de *preview* por branch.

### Negativas (Riscos e Desvantagens Aceitas):

* **Sobrecarga de JavaScript (Hidratação):** O *runtime* do React é enviado ao navegador mesmo em páginas estáticas, o que pode impactar levemente métricas como INP/TBT em dispositivos móveis comparado a frameworks puramente estáticos (ex: Astro).
* **Vendor Lock-in sutil:** O projeto fica fortemente otimizado para a infraestrutura da Vercel. Hospedar em servidores VPS/Docker próprios exigirá gerenciamento manual de servidor Node.js e instâncias de cache.
* **Complexidade de Cache:** O cache agressivo do Next.js exige controle cuidadoso ao revalidar conteúdos alterados via CMS.

---

## 4. Alternativas Consideradas

* **Astro:** Descartado para o MVP base por não ter a mesma facilidade de integração caso o projeto precise evoluir rapidamente para aplicações totalmente dinâmicas ou áreas logadas em React, embora ofereça melhor performance para sites 100% estáticos.
* **React SPA puro (Vite):** Descartado por falta de suporte nativo a SSR/SSG, prejudicando o SEO e a indexação nos buscadores.

---
