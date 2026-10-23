# 05 - Modelo de Conteúdo do Keystatic (Content Modeling)

Este documento descreve a arquitetura de dados e modelagem de conteúdo gerenciada pelo **Keystatic CMS** no `institutional-website-template`. O Keystatic é um CMS baseado em Git (*Git-based CMS*) que armazena os conteúdos diretamente no repositório em arquivos Markdown (Markdoc) e JSON, garantindo **custo de infraestrutura otimizado** (sem necessidade de banco de dados gerenciado dedicado), portabilidade total e tempo de carregamento estático ultrarrápido (SSG/ISR).

---

## ⚙️ Arquitetura do Keystatic no Projeto

Toda a definição de coleções, esquemas de campos e regras de armazenamento é centralizada no arquivo de configuração raiz:

`keystatic.config.ts`

### Modos de Operação (Dual Mode)

* **Em Desenvolvimento Local (`npm run dev`):**  
  Opera em modo local (`storage: { kind: 'local' }`), gravando e lendo alterações instantaneamente no sistema de arquivos da máquina dentro do diretório `/content`.
* **Em Produção:**  
  Conforme definido na **ADR 0006**, opera preferencialmente integrado ao **Keystatic Cloud** (`storage: { kind: 'cloud' }`), permitindo que clientes não técnicos façam login por e-mail sem precisar de conta no GitHub, enquanto o serviço assina os *commits* no repositório automaticamente.

---

## 📚 Modelagem de Coleções (`collections`)

As coleções são conjuntos de itens repetíveis com a mesma estrutura de campos (ex.: posts de blog, lista de serviços, depoimentos de clientes).

### 1. Coleção: Posts do Blog (`posts`)
* **Caminho de Armazenamento:** `content/posts/[slug]/`
* **Formato:** Arquivo Markdown com campos estruturados em Frontmatter e corpo rico em Markdoc.

| Campo | Tipo do Campo | Obrigatório? | Descrição |
| :--- | :--- | :---: | :--- |
| `title` | `fields.text` | Sim | Título principal do artigo |
| `slug` | `fields.slug` | Sim | Identificador único de URL amigável gerado do título |
| `publishedDate` | `fields.date` | Sim | Data de publicação do artigo |
| `summary` | `fields.text` | Sim | Resumo curto do artigo para listagens e SEO (Meta Description) |
| `coverImage` | `fields.image` | Não | Imagem de destaque (salva em `public/images/content/posts`) |
| `author` | `fields.text` | Não | Nome do autor da postagem |
| `content` | `fields.markdoc` | Sim | Corpo do texto com editor rico WYSIWYG (títulos, links, listas, citações) |

---

### 2. Coleção: Serviços da Empresa (`services`)
* **Caminho de Armazenamento:** `content/services/[slug].json`
* **Formato:** JSON estruturado.

| Campo | Tipo do Campo | Obrigatório? | Descrição |
| :--- | :--- | :---: | :--- |
| `title` | `fields.text` | Sim | Nome do serviço prestado (ex.: "Consultoria Empresarial") |
| `slug` | `fields.slug` | Sim | Slug para âncora ou página individual |
| `icon` | `fields.text` | Sim | Nome do ícone da biblioteca [Lucide Icons](https://lucide.dev/) (ex.: `Briefcase`, `ShieldCheck`) |
| `shortDescription` | `fields.text` | Sim | Descrição sucinta para exibição nos cards da Home Page |
| `features` | `fields.array` | Sim | Lista de diferenciais e benefícios incluídos no serviço |

---

### 3. Coleção: Depoimentos de Clientes (`testimonials`)
* **Caminho de Armazenamento:** `content/testimonials/[slug].json`
* **Formato:** JSON estruturado.

| Campo | Tipo do Campo | Obrigatório? | Descrição |
| :--- | :--- | :---: | :--- |
| `clientName` | `fields.text` | Sim | Nome completo do cliente ou parceiro |
| `companyOrRole` | `fields.text` | Não | Cargo e nome da empresa (ex.: "Diretora de Marketing na Alfa S.A.") |
| `avatar` | `fields.image` | Não | Foto de perfil do cliente |
| `quote` | `fields.text` | Sim | O depoimento ou avaliação textual |
| `rating` | `fields.integer` | Sim | Nota em estrelas (de 1 a 5) |

---

### 4. Coleção: Perguntas Frequentes (`faqs`)
* **Caminho de Armazenamento:** `content/faqs/[slug].json`
* **Formato:** JSON estruturado.

| Campo | Tipo do Campo | Obrigatório? | Descrição |
| :--- | :--- | :---: | :--- |
| `question` | `fields.text` | Sim | A pergunta comum feita pelos clientes |
| `answer` | `fields.markdoc` | Sim | Resposta detalhada com suporte a links e formatação |
| `order` | `fields.integer` | Não | Número de ordenação para exibição no acordeão |

---

## 📄 Modelagem de Páginas Fixas (`singletons`)

Os *singletons* representam documentos únicos, ideais para páginas institucionais com blocos específicos de conteúdo.

### 1. Singleton: Página Inicial (`homePage`)
* **Caminho de Armazenamento:** `content/singletons/home.json`
* **Campos Principais:**
  * `heroHeadline`: Frase de impacto do banner principal.
  * `heroSubheadline`: Parágrafo explicativo da proposta de valor.
  * `primaryCtaLabel`: Texto do botão principal (ex.: "Fale com um Especialista").
  * `primaryCtaLink`: Destino do botão (ex.: `#contato` ou `/servicos`).
  * `showTestimonials`: Interruptor booleano (`true`/`false`) para exibir ou ocultar a seção de depoimentos.

### 2. Singleton: Página Sobre a Empresa (`aboutPage`)
* **Caminho de Armazenamento:** `content/singletons/about.json`
* **Campos Principais:**
  * `mission`: Declaração de missão da empresa.
  * `vision`: Declaração de visão de futuro.
  * `values`: Lista de valores centrais.
  * `story`: História da fundação e trajetória em texto rico (Markdoc).

---

## ⚡ Como Consumir os Dados no Next.js (Reader API)

O Keystatic fornece uma biblioteca de leitura direta em tempo de compilação (`@keystatic/core/reader`). Como os dados residem no próprio sistema de arquivos em produção, **não existem chamadas de rede lentas para APIs externas**, garantindo renderização instantânea em *React Server Components*:

```typescript
// src/lib/keystatic.ts
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);
```

```tsx
// Exemplo de uso em um Server Component (ex: src/app/page.tsx)
import { reader } from "@/lib/keystatic";

export default async function HomePage() {
  // Leitura assíncrona instantânea de arquivos locais
  const homeData = await reader.singletons.homePage.read();
  const services = await reader.collections.services.all();

  return (
    <main>
      <h1>{homeData?.heroHeadline}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.slug} className="p-6 border rounded-lg">
            <h3>{service.entry.title}</h3>
            <p>{service.entry.shortDescription}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

---

## 🛡️ Diretrizes de Mídia e Imagens (Conformidade com a ADR 0006)

Para evitar o inchaço do histórico do Git (*Git Bloat*) com fotos pesadas:
* Todas as imagens adicionadas no Keystatic são salvas no diretório `public/images/content/`.
* É configurado um limite no schema de no máximo **1 MB** por imagem.
* As fotos são processadas e servidas pelo componente `<Image />` do Next.js, que realiza compressão automática em tempo de execução para formatos modernos como **WebP e AVIF**.

