# ADR 0002: Escolha da Camada de Gestão de Conteúdo (Headless CMS) - Keystatic

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

---

## 1. Contexto (Context)

Para o `institutional-website-template`, necessitávamos de uma solução de gestão de conteúdo (Headless CMS) que permitisse ao cliente final (não técnico) editar textos, artigos de blog, depoimentos e informações gerais do site de forma simples e intuitiva.

A solução precisava respeitar os quatro pilares fundamentais do projeto:
1. **Alta Performance:** O carregamento do conteúdo não pode impactar o SEO nem os índices de Core Web Vitals do Google[cite: 1].
2. **Custo $0 de Infraestrutura:** Eliminar a necessidade de bancos de dados gerenciados pagos (PostgreSQL, MySQL, MongoDB) ou assinaturas de SaaS dispendiosas para sites pequenos e médios[cite: 1].
3. **Segurança de Tipos (Type-Safety):** Integração fluida com o TypeScript e o ecossistema Next.js (App Router)[cite: 1].
4. **Independência de Código:** Desacoplar os dados do layout para que o cliente atualize o site sem risco de quebrar componentes visuais[cite: 1].

---

## 2. Decisão (Decision)

Decidimos adotar o **Keystatic** como a ferramenta padrão de gestão de conteúdo baseada em Git (*Git-based CMS*)[cite: 1].

### Justificativas Principais:

1. **Armazenamento em Git / Arquivos Locais:** O Keystatic grava todas as edições feitas no painel administrativo diretamente em arquivos Markdown (Markdoc/MDX) ou JSON/YAML salvos no repositório do GitHub[cite: 1].
2. **Integração Nativa com Next.js e TypeScript:** Possui integração dedicada via `@keystatic/next`, gerando *schemas* fortemente tipados e permitindo leitura direta de arquivos em tempo de compilação (*SSG/ISR*) com React Server Components[cite: 1].
3. **Experiência do Usuário (UI/UX) Superior:** Entrega um painel administrativo limpo, responsivo e com editor rico por blocos (*WYSIWYG*), ideal para leigos[cite: 1].
4. **Dual Mode (Local e Produção):** Em ambiente de desenvolvimento local, grava diretamente no sistema de arquivos da máquina (`npm run dev`). Em produção, sincroniza com o repositório no GitHub via OAuth/GitHub App sem necessidade de configurar proxies de autenticação complexos[cite: 1].

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Custo Zero Vitalício:** Por salvar o conteúdo no Git e gerar compilação estática na Vercel, o custo de hospedagem e banco de dados permanece em **$0/mês**[cite: 1].
* **Versionamento e Backup Automático:** Todo o histórico de edições do cliente fica registrado no histórico de *commits* do Git, facilitando reversões de conteúdo (*rollbacks*)[cite: 1].
* **Performance Extrema:** Não existem requisições de API em tempo de execução para servidores terceiros de CMS durante o carregamento de páginas estáticas[cite: 1].

### Negativas (Riscos e Desvantagens Aceitas):

* **Tempo de Rebuild/Invalidação:** A cada alteração salva no CMS, o GitHub dispara um novo *commit*, exigindo que a Vercel recompile a aplicação ou revalide a rota, o que leva alguns segundos até o conteúdo ficar visível no ar[cite: 1].
* **Escalabilidade de Mídias:** Armazenar imagens grandes diretamente no repositório Git pode inchar o projeto com o tempo (exigindo estratégias complementares de armazenamento de mídia, como Cloudinary ou Vercel Blob, em projetos de grande porte).
* **Limitação para Múltiplas Permissões:** Não oferece controle granular de papéis de usuários (ex: revisor, editor, admin) tão avançado quanto CMSs em nuvem (Sanity ou Strapi)[cite: 1].

---

## 4. Alternativas Consideradas

* **Decap CMS (antigo Netlify CMS):** Descartado por depender de arquivos de configuração em YAML sem validação nativa de TypeScript, interface defasada e complexidade para autenticação fora do ecossistema Netlify[cite: 1].
* **Sanity.io / Contentful (API-driven CMS):** Descartados para o modelo base padrão por introduzir dependência de serviços externos com limites de requisições e potenciais custos recorrentes para os clientes[cite: 1].
* **Strapi (Self-hosted CMS):** Descartado por exigir servidor Node.js e banco de dados PostgreSQL/MySQL rodando continuamente, elevando o custo de infraestrutura[cite: 1].

---
