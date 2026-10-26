# ADR 0013: Arquitetura Unificada Full-Stack (App Router) vs. Separação Física Frontend/Backend

- **Status:** Aceito
- **Data:** 2026-10-26
- **Decisores:** Engenharia de Software / Autor do Projeto

> Complementa a [ADR 0001](0001-escolha-do-framework-next.md), [ADR 0003](0003-estrategia-de-formularios.md) e [ADR 0009](0009-seguranca-headers-e-validacao-de-ambiente.md) estabelecendo a diretriz formal sobre a organização estrutural do código-fonte e justificando a rejeição de diretórios físicos separados (`frontend/` e `backend/`).

---

## 1. Contexto (Context)

Em equipes de desenvolvimento e agências com histórico em stacks tradicionais (ex.: Single Page Applications em React/Vite comunicando-se com APIs REST/GraphQL em Express, NestJS, Django ou Spring), é frequente o questionamento sobre a conveniência de organizar o repositório em dois diretórios físicos isolados:

```text
# Abordagem Tradicional em Duas Pastas (Descartada)
meu-projeto/
├── frontend/   # Aplicação client-side (SPA)
└── backend/    # API REST, servidor Express/NestJS, banco de dados
```

No entanto, o `institutional-website-template` adota como base tecnológica o **Next.js (App Router)** e opera sob o paradigma de **Arquitetura Sem Banco de Dados (_Zero-Database Architecture_)** com compilação estática (SSG/ISR).

Tornou-se imperativo deliberar e registrar formalmente por que a divisão em pastas físicas `frontend/` e `backend/` é contraproducente para este projeto, estabelecendo o padrão canônico para novos desenvolvedores e assistentes de Inteligência Artificial.

---

## 2. Decisão (Decision)

Decidimos adotar a **Arquitetura Unificada Full-Stack (_Unified Modular Monolith_)**, mantendo todo o código-fonte sob a árvore unificada `src/` e **rejeitando terminantemente a criação de pastas físicas independentes `frontend/` e `backend/`** ou a conversão do template em monorepo (Turborepo/Nx).

Em substituição à separação física de diretórios, o repositório adota a **Segregação Lógica de Fronteiras (_Logical Separation of Concerns_)**, fundamentada nos primitivos de compilação do Next.js e React 19:

### 2.1. Mapeamento Canônico de Fronteiras Lógicas

| Camada Lógica                     | Papel Arquitetural                                   | Diretório / Arquivo Canônico                                     | Salvaguarda de Isolamento                                                                         |
| :-------------------------------- | :--------------------------------------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **Backend: Segredos de Servidor** | Variáveis confidenciais (chaves de API, credenciais) | [`src/env/server.ts`](../../src/env/server.ts)                   | Blindagem nativa com `import "server-only"` (aborta o build se importado no cliente).             |
| **Backend: Regras Transacionais** | Processamento de formulários, honeypot, anti-spam    | [`src/app/actions/contact.ts`](../../src/app/actions/contact.ts) | Diretiva `'use server'` (função assíncrona executada puramente no servidor).                      |
| **Backend: Defesa Serverless**    | Rate Limiting e cálculo de hash HMAC de IP           | [`src/lib/rate-limit.ts`](../../src/lib/rate-limit.ts)           | Módulos `node:crypto` e `@upstash/redis` executados em runtime de borda/servidor.                 |
| **Backend: Gestão de Conteúdo**   | Leitura de Markdown/JSON no build                    | [`src/lib/keystatic.ts`](../../src/lib/keystatic.ts)             | Reader API (`@keystatic/core/reader`) executada durante o SSG/ISR.                                |
| **Contrato Compartilhado**        | Validação de tipos e schemas universais              | [`src/lib/schemas/`](../../src/lib/schemas/)                     | Schemas Zod consumidos tanto pelo React Hook Form (UI) quanto pela Server Action (Server).        |
| **Frontend: Interface Visual**    | Primitivos atômicos e componentes de layout          | [`src/components/`](../../src/components/)                       | React Server Components (RSC) por padrão; `'use client'` estritamente onde houver interatividade. |
| **Frontend: Variáveis Públicas**  | URLs públicas e chaves de widgets de terceiros       | [`src/env/client.ts`](../../src/env/client.ts)                   | Prefixadas obrigatoriamente com `NEXT_PUBLIC_*`.                                                  |

---

## 3. Justificativas Principais (Why)

1. **Unificação do Modelo Mental dos React Server Components (RSC):**
   - Em Next.js App Router, componentes de servidor renderizam marcação HTML estática executando código em Node.js no servidor, sem enviar código JavaScript para o bundle do navegador.
   - Criar pastas separadas quebraria esse modelo mental: _um componente como `Header` ou `Hero` (que é RSC puro) pertenceria ao frontend (por ser UI) ou ao backend (por rodar no servidor)?_ No App Router, eles são partes complementares do mesmo fluxo de renderização.

2. **Incompatibilidade com o Princípio de Zero-Database:**
   - O template não mantém servidores Node.js permanentes nem bancos relacionais (PostgreSQL/MySQL).
   - O "backend" existe sob demanda em funções serverless de ciclo de vida milissegúndico (Server Actions e Webhooks). Criar uma pasta `backend/` criaria a falsa impressão de que há uma API REST convencional a ser mantida.

3. **Prevenção de Complexidade Acidental (_Overengineering_):**
   - Separar em duas pastas forçaria uma arquitetura de monorepo com múltiplos `package.json`, `tsconfig.json`, pipelines de CI duplicados e problemas com compartilhamento de tipos TypeScript.
   - Violação direta do **Princípio 1 ([AGENTS.md](../../AGENTS.md))**: _Simplicidade antes de Complexidade_.

4. **Deploy Atômico e Determinístico:**
   - A compilação unificada na Vercel ou Cloudflare ocorre em um único processo estático e determinístico com um único `git push`, eliminando descompassos de versão entre cliente e servidor (_version skew_).

---

## 4. Critérios de Exceção (Quando a Separação Física Faria Sentido?)

A separação física em diretórios independentes ou monorepo só deverá ser reconsiderada se:

1. **Múltiplos Clientes Heterogêneos:** O projeto demandar um aplicativo móvel nativo (iOS/Android em Flutter ou React Native) ou extensões de terceiros que consumam os mesmos dados de negócio via API REST/GraphQL pública e unificada.
2. **Serviços de Background Contínuos:** O projeto evoluir para exigir filas persistentes (RabbitMQ/Kafka), microsserviços especializados ou bancos de dados relacionais dedicados operando fora do modelo serverless.

Para o propósito do **`institutional-website-template` (websites institucionais e corporativos de alta performance)**, tais requisitos estão fora de escopo.

---

## 5. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

- **Velocidade de Onboarding:** Desenvolvedores trabalham em um repositório único com um único comando de inicialização (`npm run dev`) e build determinístico (`npm run build`).
- **Segurança Reforçada sem Redundância:** O isolamento de dados confidenciais é garantido programaticamente pelo pacote `server-only` e pelas Server Actions, com custo zero de infraestrutura.
- **Tipagem End-to-End Nativa:** Schemas de validação e tipos TypeScript são consumidos de forma transparente por toda a aplicação sem pacotes intermediários.

### Negativas (Riscos Aceitos):

- **Curva de Aprendizado para Desenvolvedores Tradicionais:** Exige que novos colaboradores compreendam a fronteira entre Server Components e Client Components (`'use client'`), em vez de pensarem em termos clássicos de "requisição HTTP client-to-server".
