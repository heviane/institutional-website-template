# Feature 001: Project Bootstrap & Quality Gates (Plan)

* **Status:** Pronto para Aprovação
* **Spec de Referência:** [`spec.md`](spec.md)
* **Constituição de Engenharia:** [`AI-RULES.md`](../../AI-RULES.md)

---

## 🏗️ 1. Arquitetura Técnica e Decisões de Implementação

### 1.1. Stack de Dependências

| Pacote / Ferramenta | Versão Alvo | Justificativa Arquitetural |
| :--- | :--- | :--- |
| **Node.js** | `24.x LTS` | Versão travada no `.nvmrc` e no GitHub Actions runner. |
| **Next.js** | `16.x (Active LTS)` | App Router, Server Actions nativas e compilação otimizada ([ADR 0001](../../docs/adr/0001-escolha-do-framework-next.md)). |
| **React / React DOM** | `19.x` | Runtime nativo do Next.js 16. |
| **TypeScript** | `^5.x` | Tipagem estrita end-to-end com alias `@/*` via `tsconfig.json`. |
| **Tailwind CSS** | `^4.x` | CSS-first moderno utilizando `@theme` no `src/app/globals.css` ([ADR 0004](../../docs/adr/0004-design-system-e-estilizacao.md)). |
| **Zod** | `^3.24.x` | Validação estrita de schemas em runtime (travada na v3 para compatibilidade com `@hookform/resolvers/zod`). |
| **server-only** | `^0.0.1` | Impede importação acidental de módulos de servidor (`serverEnv`) em Client Components ([ADR 0009](../../docs/adr/0009-seguranca-headers-e-validacao-de-ambiente.md)). |
| **Shadcn/ui & Radix** | Latest | Primitivos acessíveis (WCAG 2.1 AA) e utilitário `cn` (`clsx` + `tailwind-merge`). |
| **Vitest** | `^3.x` | Runner de testes ultra rápido em ESM com `jsdom` e `vitest-axe` ([ADR 0008](../../docs/adr/0008-qualidade-automatizada-e-testes.md)). |

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
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 24
      cache: "npm"
  - run: npm ci
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

* **Risco de Conflitos de Peer Dependencies (React 19 vs. Pacotes Radix):**  
  *Mitigação:* Usar versões recentes do Shadcn/ui que já possuem suporte testado ao React 19.
* **Sobrescrita Acidental de Documentação:**  
  *Mitigação:* Inicializar o projeto de forma cirúrgica na raiz sem sobrescrever `docs/`, `AI-RULES.md` ou `README.md`.
