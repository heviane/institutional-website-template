# Guia de Contribuição (Contributing Guide)

Agradecemos o seu interesse em contribuir com o **`institutional-website-template`**!  
Este projeto adota práticas rigorosas de engenharia de software fundamentadas na metodologia **Spec-Driven Development (SDD)**.

---

## 🧭 1. Princípios de Contribuição (SDD & TDD)

Antes de escrever qualquer linha de código, consulte o arquivo canônico central [**`AGENTS.md`**](AGENTS.md), que define a **Constituição de Engenharia** e as restrições negativas inegociáveis do repositório.

1. **A Especificação Precede o Código:**  
   Nenhuma nova funcionalidade ou alteração estrutural deve ser iniciada sem sua respectiva especificação aprovada em [`specs/`](specs/) ou registro em [`docs/adr/`](docs/adr/).
2. **Ciclo TDD (_Red-Green-Refactor_):**  
   Para regras de negócio, validação de schemas (Zod), validação de ambiente (`env.ts`) e Server Actions, crie os testes unitários (`*.test.ts`) antes da implementação do código.
3. **Código Real como Única Fonte da Verdade:**  
   Evite duplicar código vivo dentro da documentação Markdown. Após implementar em `src/`, aponte links para os arquivos reais.

---

## 🛠️ 2. Configuração do Ambiente Local

### Pré-requisitos:

- **Node.js:** Versão `24.x LTS` (travada no `.nvmrc`).
- **npm:** Gerenciador padrão de dependências.
- **Git:** Para controle de versão.

### Instalação:

```bash
# Sincronizar a versão do Node (caso utilize NVM)
nvm use

# Instalar dependências de forma estrita
npm ci
```

---

## 🚦 3. Quality Gates Obrigatórios

Nenhuma contribuição (código gerado por humanos ou agentes de IA) pode ser mesclada se qualquer um dos cinco portões de qualidade falhar:

```bash
# Executar todos os Quality Gates de uma vez:
npm run audit:docs && npm run lint && npm run typecheck && npm test && npm run build
```

| Comando              | Finalidade                                  | Critério de Aceitação                      |
| :------------------- | :------------------------------------------ | :----------------------------------------- |
| `npm run audit:docs` | Auditoria de integridade documental e links | **0 erros** (links válidos e Anti-Doc Rot) |
| `npm run lint`       | Auditoria estática com ESLint               | **0 erros**                                |
| `npm run typecheck`  | Checagem estrita de tipos TypeScript        | **0 erros**                                |
| `npm test`           | Suíte de testes automatizados com Vitest    | **100% verde** (inclui `vitest-axe`)       |
| `npm run build`      | Compilação de produção do Next.js           | **Compilação determinística**              |

---

## 🌿 4. Fluxo de Trabalho e Branches

1. Crie uma branch a partir de `main` com nomenclatura semântica:
   - `feat/nome-da-funcionalidade` (ex.: `feat/contact-form`)
   - `fix/descricao-do-bug` (ex.: `fix/turnstile-bypass`)
   - `docs/nome-do-ajuste` (ex.: `docs/update-roadmap`)
2. Mantenha os commits no padrão **Conventional Commits**:
   - `feat: adicionar componente de depoimentos`
   - `fix: corrigir expressao regular do telefone`
   - `docs: atualizar checklist de onboarding`
   - `test: cobrir cenarios de erro do schema zod`
3. Abra um **Pull Request** para a branch `main` utilizando o modelo padrão [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md).

---

## 🔒 5. Segurança e Divulgação Responsável

Vulnerabilidades de segurança **NUNCA** devem ser abertas em Issues públicas.  
Consulte a nossa [Política de Segurança](SECURITY.md) para abrir um **Security Advisory Privado** de forma confidencial.
