# ADR 0010: Estratégia de Versionamento do Template e Propagação de Atualizações para Clientes

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a política de versionamento semântico (SemVer) do repositório template e estabelece o procedimento operacional de propagação de melhorias, correções de segurança e novas funcionalidades para sites de clientes já implantados.

---

## 1. Contexto (Context)

O recurso *"Use this template"* do GitHub cria uma cópia limpa do projeto com um commit inicial independente, desconectando o histórico de versões do repositório de origem.

Embora esse comportamento seja benéfico para entregar repositórios limpos e sem o histórico interno de desenvolvimento aos clientes, ele introduz um desafio de manutenção no longo prazo: **os sites já implantados ficam desconectados de melhorias futuras do template**.

Quando o template recebe atualizações críticas (como correções de segurança na Server Action, novas versões do Next.js ou Tailwind, otimizações de Core Web Vitals ou melhorias de acessibilidade), os desenvolvedores precisam de um método padronizado, seguro e reproduzível para sincronizar essas mudanças sem sobrescrever as customizações específicas de cada cliente.

---

## 2. Decisão (Decision)

Decidimos adotar uma estratégia de manutenção e evolução em três frentes:

### 2.1. Versionamento Semântico e GitHub Releases
O template segue a especificação estrita do **SemVer (Semantic Versioning - `MAJOR.MINOR.PATCH`)**:
* **`MAJOR` (ex: `v2.0.0`):** Mudanças arquiteturais profundas com quebra de retrocompatibilidade (ex.: nova versão principal do Next.js ou reestruturação de schemas do Keystatic).
* **`MINOR` (ex: `v1.1.0`):** Novos componentes de interface, layouts opcionais ou recursos complementares retrocompatíveis.
* **`PATCH` (ex: `v1.0.1`):** Correções de bugs, patches de segurança em dependências e ajustes de performance.

> Toda nova versão é formalizada como uma **GitHub Release** contendo um *Changelog* explícito com notas de atualização e diretrizes para aplicação em sites legados.

### 2.2. Fluxo Git de Sincronização via *Upstream Remote*
Para repositórios de clientes derivados do template, adotamos o fluxo padrão de vinculação remota:

1. **Vincular o Template Original:**
   ```bash
   git remote add template https://github.com/heviane/institutional-website-template.git
   ```
2. **Buscar Novidades do Template:**
   ```bash
   git fetch template
   ```
3. **Mesclagem Controlada de Históricos Desconectados:**
   ```bash
   git merge template/main --allow-unrelated-histories -m "chore: sincronizar com a versao X do template"
   ```
   *(A flag `--allow-unrelated-histories` instrui o Git a reconciliar a raiz do template com a raiz do cliente de forma determinística).*

### 2.3. Aplicação Cirúrgica de Hotfixes (*Cherry-Pick*)
Para atualizações críticas de segurança ou correções isoladas onde o desenvolvedor não deseja mesclar todas as novidades recentes do template, utiliza-se a técnica de *cherry-pick*:
```bash
git fetch template
git cherry-pick <hash-do-commit-de-correcao>
```

### 2.4. Arquitetura de Baixo Conflito (*Separation of Concerns*)
A estrutura do projeto foi intencionalmente desenhada para minimizar conflitos de merge durante sincronizações:
* **Zona Imune do Cliente (Preservada):**
  * `src/config/site.ts` (dados da empresa, cores de marca, contatos, CNPJ e DPO).
  * `public/images/content/` (mídias dos clientes).
  * Arquivos de conteúdo Markdown/JSON gerenciados pelo Keystatic.
* **Zona de Engenharia do Template (Atualizada via Upstream):**
  * `src/app/actions/` (Server Actions e segurança).
  * `src/components/ui/` e `src/components/shared/` (componentes estruturais).
  * `src/env.ts`, `package.json` e `.github/workflows/` (regras e automações).

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):
* **Sustentabilidade de Longo Prazo:** Permite oferecer contratos de suporte contínuo para clientes com custo operacional quase nulo.
* **Segurança Centralizada:** Uma vulnerabilidade corrigida no template pode ser propagada em minutos para dezenas de clientes com comandos Git simples.
* **Rastreabilidade e Governança:** O desenvolvedor mantém controle total sobre o que entra em cada cliente através do histórico de Pull Requests.

### Negativas (Riscos e Desvantagens Aceitas):
* **Necessidade de Resolução Manual de Conflitos Pontuais:** Caso o desenvolvedor tenha alterado o código-fonte de componentes base no projeto do cliente, o merge do upstream exigirá revisão manual de conflitos (*merge conflicts*).
* **Disciplina de Versionamento:** Exige que todas as mudanças no template sejam testadas antes de serem mergeadas na branch `main`.

---

## 4. Alternativas Consideradas

* **Forks do Repositório Template:** Descartado por poluir a conta do desenvolvedor com forks dependentes e não permitir transformar o repositório em um modelo público limpo para clientes.
* **Cópia Manual de Arquivos:** Descartado por ser sujeito a erros humanos graves, perda de arquivos e inviável para múltiplos projetos.
* **Template Sync Automatizado por Bots (Actions Template Sync):** Mantido como opção avançada para repositórios corporativos maiores, priorizando o controle manual com Git para projetos freelancer padrão.

