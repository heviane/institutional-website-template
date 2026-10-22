# ADR 0008: Estratégia de Qualidade Automatizada, Testes e Acessibilidade Contínua

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Estabelece os portões de qualidade automatizados (*Quality Gates*) do template, combinando GitHub Actions CI, Dependabot, testes unitários com Vitest, auditoria profunda de acessibilidade via axe-core e monitoramento de performance com Lighthouse CI.

---

## 1. Contexto (Context)

Um template profissional reutilizável para múltiplos clientes precisa garantir que alterações em componentes, atualizações de dependências e customizações de código não introduzam regressões silenciosas de lógica, quebra de contratos de tipos, lentidão ou violações de acessibilidade.

A abordagem inicial de delegar a validação exclusivamente ao deploy automático da Vercel apresenta três deficiências estruturais:
1. **Falta de Portões de Qualidade em Pull Requests:** A Vercel avisa sobre falhas apenas no momento da compilação de deploy, sem impedir mesclagens (*merges*) de código quebrado no repositório.
2. **Ausência de Testes Automatizados:** Erros de regras de negócio (como falhas na validação do Zod, ausência de dados obrigatórios no `siteConfig` ou quebras de renderização) não são interceptados pelo compilador do Next.js.
3. **Auditoria Superficial de Acessibilidade:** O Lighthouse tradicional realiza apenas uma varredura estática preliminar da página, detectando entre 30% e 40% das falhas de acessibilidade e ignorando o comportamento de componentes interativos (como navegação por teclado em modais e menus mobile).

---

## 2. Decisão (Decision)

Decidimos implementar uma infraestrutura integrada de garantia da qualidade (*Continuous Quality Assurance*) em cinco camadas complementares:

### 2.1. Portão de Integração Contínua (GitHub Actions CI)
Criamos um pipeline obrigatório em `.github/workflows/ci.yml` acionado a cada `push` e `pull_request` direcionado ao branch `main`:
* **`npm ci`:** Instalação limpa e determinística de dependências.
* **`npm run lint`:** Auditoria de sintaxe, boas práticas do Next.js e regras de acessibilidade básica (`eslint-plugin-jsx-a11y`).
* **`npm run typecheck`:** Validação estrita do compilador TypeScript (`tsc --noEmit`).
* **`npm test`:** Execução da suíte de testes unitários e de acessibilidade.
* **`npm run build`:** Validação completa do build de produção e SSR/SSG.

### 2.2. Testes Unitários e de Componentes (Vitest + Testing Library)
Adotamos o **Vitest** como o executor padrão de testes em substituição ao Jest:
* **Justificativa:** Integração nativa com ESM e TypeScript, execução instantânea e compatibilidade com a API do Jest.
* **Escopo Estratégico de Testes do Template:**
  1. **Integridade de Schemas (Zod):** Testar validações de e-mail, telefone e consentimento obrigatório da LGPD.
  2. **Configuração Global (`siteConfig`):** Testar se os campos mandatórios (nome, contatos, CNPJ, DPO) estão presentes e válidos.
  3. **Renderização de Componentes Shared:** Testar a montagem e renderização sem erros dos componentes estruturais (`Header`, `Footer`, `Hero`).

### 2.3. Acessibilidade Contínua com `axe-core`
Para assegurar a conformidade real com o padrão **WCAG 2.1 Nível AA**:
* **Varredura Estática:** O `eslint-plugin-jsx-a11y` valida atributos estáticos durante a escrita do código.
* **Varredura Dinâmica em Testes:** Integramos o **`vitest-axe`** para validar a árvore de acessibilidade do DOM gerada pelos componentes do Shadcn/ui (verificando contraste, atributos ARIA dinâmicos e estrutura de cabeçalhos).

### 2.4. Orçamentos de Performance (Lighthouse CI)
Configuramos parâmetros de aceitação com **Lighthouse CI** (`lighthouserc.json`) para prevenir degradação de Core Web Vitals:
* **Performance:** Score mínimo de **90**
* **Acessibilidade:** Score mínimo de **95**
* **Melhores Práticas:** Score mínimo de **90**
* **SEO:** Score mínimo de **95**

### 2.5. Gestão de Segurança de Dependências (Dependabot)
Configuração do `.github/dependabot.yml` com rotina semanal às segundas-feiras para:
* Dependências do ecossistema `npm` (`package.json`).
* Versões das ações do `github-actions` (`.github/workflows`).

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):
* **Blindagem do Branch Principal:** Impossibilita o merge de código com erros de tipagem, lint ou build quebrado.
* **Preservação dos 5 Pilares:** Garante continuamente Alta Performance (Lighthouse), Custo $0 (sem infraestrutura paga), Acessibilidade Real (axe-core) e LGPD (testes no Zod).
* **Segurança e Manutenção Automatizada:** Atualizações de patches e correções de segurança chegam via PRs prontos do Dependabot.

### Negativas (Riscos e Desvantagens Aceitas):
* **Tempo de CI:** Adiciona cerca de 1 a 2 minutos no tempo de validação de cada Pull Request (custo negligenciável frente à estabilidade garantida).
* **Disciplina de Manutenção de Testes:** Exige atualizar testes de componentes caso o layout visual seja profundamente alterado para novos clientes.

---

## 4. Alternativas Consideradas

* **Apenas Vercel Deploy:** Descartado por não validar testes unitários, não inspecionar PRs antes do merge e não auditar segurança de dependências.
* **Jest:** Descartado por ser significativamente mais lento e exigir configurações complexas de Babel/Transformações em comparação à velocidade nativa do Vitest.
* **Testes E2E Pesados (Cypress/Playwright) no Template Base:** Descartados para o MVP por tornarem a esteira de CI lenta e onerosa para sites institucionais simples (permanecendo como opção evolutiva na Fase 3).

