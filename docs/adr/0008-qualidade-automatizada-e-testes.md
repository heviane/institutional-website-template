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

Decidimos implementar uma infraestrutura integrada de garantia da qualidade (*Continuous Quality Assurance*) dividida em duas etapas de maturação: ferramentas base de esteira (Fase 1) e validações no código (Fase 2):

### 2.1. Ferramental Base e Automação de Esteira (Configurado na Fase 1)
* **Pipeline de CI (`.github/workflows/ci.yml`):** Estrutura automatizada acionada a cada `push` e `pull_request` na `main`, com portões estritos preparados para validar `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` assim que a aplicação for bootstrappada.
* **Determinismo de Build e Validação Estrita de Lockfile:** O workflow valida obrigatoriamente a presença do `package-lock.json` junto ao `package.json`. A ausência do lockfile falha imediatamente o job de CI, assegurando que o `npm ci` instale exatamente as versões congeladas de dependências e garantindo a integridade do cache do `actions/setup-node`.
* **Gestão de Segurança de Dependências (`.github/dependabot.yml`):** Monitoramento ativo com rotinas semanais para checar vulnerabilidades e atualizações do ecossistema `npm` e das ações do `github-actions`.

### 2.2. Suíte de Testes Automatizados no Código (Planejado para Implementação na Fase 2)
Adotamos o **Vitest** como o executor padrão de testes em substituição ao Jest para ativação assim que o código Next.js for criado:
* **Justificativa:** Integração nativa com ESM e TypeScript, execução instantânea e compatibilidade com a API do Jest.
* **Metodologia de Execução (TDD - Test-Driven Development):** Para módulos de lógica crítica (schemas Zod, validação de ambiente em `src/env/` e Server Actions), a escrita do teste unitário em `tests/` precede a implementação do código produtivo (ciclo *Red-Green-Refactor*), garantindo convergência estrita com os contratos especificados em `specs/` e prevenindo que testes sejam moldados para mascarar implementações imperfeitas.
* **Escopo Estratégico de Testes:**
  1. **Integridade de Schemas (Zod):** Validações de e-mail, telefone e salvaguardas configuráveis de privacidade da LGPD ([ADR 0007](0007-conformidade-lgpd-e-privacidade.md)).
  2. **Configuração Global (`siteConfig`):** Testes unitários garantindo que os campos mandatórios (nome, contatos, CNPJ, DPO) estão presentes e válidos.
  3. **Renderização de Componentes:** Testar montagem sem erros dos componentes estruturais (`Header`, `Footer`, `Hero`).

### 2.3. Acessibilidade Contínua com `axe-core` (Planejado para a Fase 2)
Para assegurar a conformidade real com o padrão **WCAG 2.1 Nível AA**:
* **Varredura Estática:** `eslint-plugin-jsx-a11y` validando atributos estáticos no build/lint.
* **Varredura Dinâmica em Testes:** Integração do **`vitest-axe`** para auditar a árvore de acessibilidade do DOM gerada pelos componentes do Shadcn/ui (contraste, atributos ARIA e hierarquia de títulos).

### 2.4. Orçamentos de Performance com Lighthouse CI (Planejado para o MVP na Fase 2)
Parâmetros de aceitação via **Lighthouse CI** (`lighthouserc.json`) a serem executados na pipeline após o bootstrap do build para prevenir regressões de Core Web Vitals:
* **Performance:** Score mínimo de **90**
* **Acessibilidade:** Score mínimo de **95**
* **Melhores Práticas:** Score mínimo de **95**
* **SEO:** Score de **100**

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):
* **Blindagem do Branch Principal:** Impossibilita o merge de código com erros de tipagem, lint ou build quebrado.
* **Salvaguarda dos Pilares Arquiteturais:** Monitora e protege continuamente Alta Performance (Lighthouse CI), Infraestrutura de Baixo Custo, Acessibilidade Real (axe-core) e LGPD (testes no Zod).
* **Segurança e Manutenção Automatizada:** Atualizações de patches e correções de segurança chegam via PRs prontos do Dependabot.

### Negativas (Riscos e Desvantagens Aceitas):
* **Tempo de CI:** Adiciona cerca de 1 a 2 minutos no tempo de validação de cada Pull Request (custo negligenciável frente à estabilidade garantida).
* **Disciplina de Manutenção de Testes:** Exige atualizar testes de componentes caso o layout visual seja profundamente alterado para novos clientes.

---

## 4. Alternativas Consideradas

* **Apenas Vercel Deploy:** Descartado por não validar testes unitários, não inspecionar PRs antes do merge e não auditar segurança de dependências.
* **Jest:** Descartado por ser significativamente mais lento e exigir configurações complexas de Babel/Transformações em comparação à velocidade nativa do Vitest.
* **Testes E2E Pesados (Cypress/Playwright) no Template Base:** Descartados para o MVP por tornarem a esteira de CI lenta e onerosa para sites institucionais simples (permanecendo como opção evolutiva na Fase 3).

