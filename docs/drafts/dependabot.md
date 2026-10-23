# Dependabot

Esses dois Pull Requests foram gerados **automaticamente pelo Dependabot** (o robô oficial de segurança do GitHub que ativamos através do arquivo [`.github/dependabot.yml`](file:///e:/Projects/GitHub/heviane/institutional-website-template/.github/dependabot.yml) no Commit 2)!

Isso é uma ótima notícia: **prova que a nossa governança e qualidade automatizada já estão ativas e funcionando no GitHub.** 🤖

---

## 🔍 Do que se trata cada um deles?

O Dependabot analisou o arquivo [`.github/workflows/ci.yml`](file:///e:/Projects/GitHub/heviane/institutional-website-template/.github/workflows/ci.yml) e identificou que existem versões mais recentes das **GitHub Actions oficiais**:

1. **Pull Request #1 (Aberto):**
   * **Título:** `ci(deps): bump actions/checkout from 4 to 7`
   * **O que faz:** Propõe atualizar a ação `actions/checkout` da versão `v4` para a `v7`. Essa é a ferramenta oficial do GitHub que faz o download do seu código para dentro da máquina virtual do CI. A versão `v7` traz melhorias de segurança contra clonagem não autorizada e execução em ESM.

2. **Pull Request #2 (Fechado):**
   * **Título:** `ci(deps): bump actions/setup-node from 4 to 7`
   * **O que faz:** Propôs atualizar o `actions/setup-node` da `v4` para a `v7` (a ferramenta que instala o Node.js 22 no CI).

---

### 💡 O que é recomendado fazer?

Como essas são as ações oficiais mantidas pelo próprio GitHub (com melhorias de performance e segurança), **a boa prática é aceitar a atualização.**

Você tem duas opções simples:

* **Opção 1 (Direto pelo site do GitHub):**
  Acesse o link do PR: [Pull Request #1](https://github.com/heviane/institutional-website-template/pull/1) e clique no botão verde **"Merge pull request"** (ou *Squash and merge*).
  
* **Opção 2 (Posso fazer por aqui):**
  Se preferir, posso rodar um comando pelo terminal para aprovar e fazer o merge do PR #1 para você, ou atualizar diretamente o [`.github/workflows/ci.yml`](file:///e:/Projects/GitHub/heviane/institutional-website-template/.github/workflows/ci.yml) para a `v7`.
