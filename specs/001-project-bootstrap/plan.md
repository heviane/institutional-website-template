# Feature 001: Project Bootstrap & Quality Gates (Plan)

- **Status:** Concluída (Fase 2 Iniciada)
- **Spec de Referência:** [`spec.md`](spec.md)
- **Constituição de Engenharia:** [`AGENTS.md`](../../AGENTS.md)

---

## 🏗️ 1. Arquitetura Técnica e Decisões de Implementação

### 1.1. Metodologia de Bootstrap: Setup Declarativo Direto na Raiz

Como o repositório já possui a fundação documental e governança estabelecidas na Fase 1 (`AGENTS.md`, `README.md`, `docs/`, `specs/`, `.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc`), a inicialização do projeto adota o **Bootstrap Declarativo Direto**:

- **Sem uso de CLI interativo (`create-next-app`):** Assistentes interativos como `create-next-app` são projetados para diretórios vazios e tentam sobrescrever arquivos de governança (como `README.md`, `.gitignore` e `AGENTS.md`).
- **Criação declarativa e determinística:** O `package.json` base, configurações de compilador/linter (`tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`) e o scaffolding em `src/` são criados diretamente na raiz respeitando as especificações deste documento.
- **Resolução determinística de dependências:** O comando `npm install` é executado na raiz para baixar as dependências e produzir o `package-lock.json` imutável.

### 1.2. Stack de Dependências

| Pacote / Ferramenta       | Versão Alvo         | Justificativa Arquitetural                                                                                                                                            |
| :------------------------ | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**               | `24.x LTS`          | Versão travada no `.nvmrc` e no GitHub Actions runner.                                                                                                                |
| **Next.js**               | `16.x (Active LTS)` | App Router, Server Actions nativas e compilação otimizada ([ADR 0001](../../docs/adr/0001-escolha-do-framework-next.md)).                                             |
| **React / React DOM**     | `19.x`              | Runtime nativo do Next.js 16.                                                                                                                                         |
| **TypeScript**            | `^5.x`              | Tipagem estrita end-to-end com alias `@/*` via `tsconfig.json`.                                                                                                       |
| **Tailwind CSS**          | `^4.x`              | CSS-first moderno utilizando `@theme` no `src/app/globals.css` ([ADR 0004](../../docs/adr/0004-design-system-e-estilizacao.md)).                                      |
| **Zod**                   | `^3.24.x`           | Validação estrita de schemas em runtime (travada na v3 para compatibilidade com `@hookform/resolvers/zod`).                                                           |
| **server-only**           | `^0.0.1`            | Impede importação acidental de módulos de servidor (`serverEnv`) em Client Components ([ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)). |
| **clsx & tailwind-merge** | `^2.x`              | Utilitário canônico `cn()` para composição de classes. Componentes e primitivos Shadcn/ui diferidos para a Feature 002.                                               |
| **Vitest**                | `^3.x`              | Runner de testes ultra rápido em ESM com `jsdom` e `vitest-axe` ([ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md)).                                 |

### 1.3. Headers de Segurança em `next.config.ts` (ADR 0009)

Conforme deliberado no [ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md), a configuração base do Next.js injeta cabeçalhos HTTP estritos para defesa em profundidade:

- `X-Frame-Options: SAMEORIGIN` (mitigação de clickjacking).
- `X-Content-Type-Options: nosniff` (prevenção de MIME-sniffing).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- `X-DNS-Prefetch-Control: on`.
- `Content-Security-Policy-Report-Only` (modo observabilidade preliminar).
- `Strict-Transport-Security: max-age=31536000` (HSTS habilitado em produção).

---

## 📁 2. Estrutura de Arquivos a Ser Gerada

```text
/institutional-website-template
├── .github/
│   └── workflows/
│       └── ci.yml               # Promoção: remoção da lógica condicional da Fase 1
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS v4 com variáveis @theme
│   │   ├── layout.tsx           # Layout raiz mínimo acessível
│   │   └── page.tsx             # Página inicial placeholder
│   ├── components/              # Diretório preparado para Shadcn/ui
│   └── lib/
│       └── utils.ts             # Função cn() canônica
├── tests/
│   └── sanity.test.ts           # Teste de fumaça (smoke test) da suíte Vitest
├── package.json                 # Scripts: lint, typecheck, test, build
├── package-lock.json            # Versionamento determinístico das dependências
├── tsconfig.json                # Configuração TypeScript estrita com alias @/*
└── vitest.config.ts             # Configuração do runner de testes com ambiente jsdom
```

---

## 🔄 3. Estratégia de Promoção do Pipeline de CI

O arquivo `.github/workflows/ci.yml` deixará de ser provisório:

```yaml
# Fluxo Definitivo Incondicional:
steps:
  - uses: actions/checkout@v7
  - uses: actions/setup-node@v7
    with:
      node-version: 24
      cache: "npm"
  - run: npm ci
  - run: npm run audit:docs
  - run: npm run lint
  - run: npm run typecheck
  - run: npm test
  - run: npm run build
    env:
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
      RESEND_API_KEY: "mock_resend_key_for_ci"
      RESEND_FROM_EMAIL: "Contato <contato@empresa.com.br>"
      CONTACT_EMAIL_TO: "contato@empresa.com.br"
```

---

## ⚠️ 4. Riscos Monitorados e Mitigações

- **Escopo Mínimo de Bootstrap:**  
  _Mitigação:_ Adoção de dependências estritamente necessárias para a materialização da base técnica. A instalação de primitivos Radix UI e componentes Shadcn/ui foi intencionalmente diferida para a Feature 002, prevenindo atrito preliminar de _peer dependencies_ durante a fase de fundação.
- **Sobrescrita Acidental de Documentação e Governança:**  
  _Mitigação:_ Adoção do **Bootstrap Declarativo Direto na Raiz** (Seção 1.1), dispensando o utilitário interativo `create-next-app` e garantindo a preservação intocada de `README.md`, `AGENTS.md`, `.gitignore`, `docs/` e `specs/`.
