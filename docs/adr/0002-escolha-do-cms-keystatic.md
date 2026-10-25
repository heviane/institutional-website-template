# ADR 0002: Escolha da Camada de Gestão de Conteúdo (Headless CMS) - Keystatic

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

---

## 1. Contexto (Context)

Para o `institutional-website-template`, necessitávamos de uma solução de gestão de conteúdo (Headless CMS) que permitisse ao cliente final (não técnico) editar textos, artigos de blog, depoimentos e informações gerais do site de forma simples e intuitiva.

A solução precisava respeitar os quatro pilares fundamentais do projeto:

1. **Alta Performance:** O carregamento do conteúdo não pode impactar o SEO nem os índices de Core Web Vitals do Google.
2. **Infraestrutura de Baixo Custo / Custo Otimizado:** Eliminar a necessidade mandatória de bancos de dados gerenciados pagos (PostgreSQL, MySQL, MongoDB) ou assinaturas de SaaS dispendiosas para sites pequenos e médios, priorizando tiers gratuitos e eficientes.
3. **Segurança de Tipos (Type-Safety):** Integração fluida com o TypeScript e o ecossistema Next.js (App Router).
4. **Independência de Código:** Desacoplar os dados do layout para que o cliente atualize o site sem risco de quebrar componentes visuais.

---

## 2. Decisão (Decision)

Decidimos adotar o **Keystatic** como a ferramenta padrão de gestão de conteúdo baseada em Git (*Git-based CMS*).

### Justificativas Principais:

1. **Armazenamento em Git / Arquivos Locais:** O Keystatic grava todas as edições feitas no painel administrativo diretamente em arquivos Markdown (Markdoc/MDX) ou JSON/YAML salvos no repositório do GitHub.
2. **Integração Nativa com Next.js e TypeScript:** Possui integração dedicada via `@keystatic/next`, gerando *schemas* fortemente tipados e permitindo leitura direta de arquivos em tempo de compilação (*SSG/ISR*) com React Server Components.
3. **Experiência do Usuário (UI/UX) Superior:** Entrega um painel administrativo limpo, responsivo e com editor rico por blocos (*WYSIWYG*), ideal para leigos.
4. **Dual Mode (Local e Produção):** Em ambiente de desenvolvimento local, grava diretamente no sistema de arquivos da máquina (`npm run dev`). Em produção, sincroniza com o repositório no GitHub via OAuth/GitHub App sem necessidade de configurar proxies de autenticação complexos.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Custo de Infraestrutura Otimizado:** Por salvar o conteúdo diretamente no Git e gerar compilação estática (SSG/ISR), elimina custos recorrentes de bancos de dados gerenciados ou licenças de CMS pagos enquanto o projeto permanecer dentro das cotas dos planos gratuitos do GitHub e da hospedagem.
* **Versionamento e Backup Automático:** Todo o histórico de edições do cliente fica registrado no histórico de *commits* do Git, facilitando reversões de conteúdo (*rollbacks*).
* **Performance Extrema:** Não existem requisições de API em tempo de execução para servidores terceiros de CMS durante o carregamento de páginas estáticas.

### Negativas (Riscos e Desvantagens Aceitas):

* **Tempo de Rebuild/Invalidação:** A cada alteração salva no CMS, o GitHub dispara um novo *commit*, exigindo que a Vercel recompile a aplicação ou revalide a rota, o que leva alguns segundos até o conteúdo ficar visível no ar.
* **Escalabilidade de Mídias:** Armazenar imagens grandes diretamente no repositório Git pode inchar o projeto com o tempo (exigindo estratégias complementares de armazenamento de mídia, como Cloudinary ou Vercel Blob, em projetos de grande porte).
* **Limitação para Múltiplas Permissões:** Não oferece controle granular de papéis de usuários (ex: revisor, editor, admin) tão avançado quanto CMSs em nuvem (Sanity ou Strapi).

---

## 4. Alternativas Consideradas

* **Decap CMS (antigo Netlify CMS):** Descartado por depender de arquivos de configuração em YAML sem validação nativa de TypeScript, interface defasada e complexidade para autenticação fora do ecossistema Netlify.
* **Sanity.io / Contentful (API-driven CMS):** Descartados para o modelo base padrão por introduzir dependência de serviços externos com limites de requisições e potenciais custos recorrentes para os clientes.
* **Strapi (Self-hosted CMS):** Descartado por exigir servidor Node.js e banco de dados PostgreSQL/MySQL rodando continuamente, elevando o custo de infraestrutura.

---
