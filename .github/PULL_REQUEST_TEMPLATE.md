## 📌 Descrição da Alteração

Descreva de forma clara e concisa o que foi implementado, refatorado ou corrigido.

---

## 🎯 Especificação Associada (Spec-Driven Development)

* **Especificação da Funcionalidade:** `specs/XXX-nome-da-feature/spec.md`
* **Item do Roadmap:** `docs/03-project-roadmap.md` (Seção 2.1 / 2.2)
* **ADRs Relacionados:** [docs/adr/](docs/adr/) (ex.: ADR 0001, ADR 0003...)

---

## 🚦 Quality Gates (Verificação Obrigatória do CI)

Marque os critérios técnicos atendidos antes de solicitar revisão:

* [ ] `npm run lint` executado com zero erros de ESLint.
* [ ] `npm run typecheck` executado com zero erros de tipagem TypeScript.
* [ ] `npm test` executado com toda a suíte do Vitest verde (incluindo testes de acessibilidade `vitest-axe`).
* [ ] `npm run build` compilado com sucesso de forma determinística.
* [ ] O arquivo `package-lock.json` está versionado e sincronizado com o `package.json` (`npm ci`).

---

## 🏛️ Checklist da Constituição de Engenharia (`AI-RULES.md`)

* [ ] **Simplicidade:** Nenhuma dependência desnecessária ou abstração prematura foi introduzida.
* [ ] **Segurança:** Toda entrada pública é tratada como não confiável; chaves secretas estão fora do bundle cliente.
* [ ] **Acessibilidade:** Componentes atendem aos padrões WCAG 2.1 AA e suportam navegação completa por teclado.
* [ ] **Testabilidade:** Foram adicionados testes unitários ou de integração para comportamentos novos ou alterados.
* [ ] **Transparência:** As páginas legais e documentações refletem os serviços e tratamentos efetivamente ativos.
* [ ] **Revisão Humana:** O código foi revisado por um desenvolvedor antes da mesclagem final.
