# ADR 0010: Estratégia de Versionamento do Template e Propagação de Atualizações para Clientes

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a política de versionamento semântico (SemVer) do repositório template e estabelece o protocolo de experimentação e validação técnica para propagação de melhorias e correções para sites de clientes já implantados.

---

## 1. Contexto (Context)

O recurso *"Use this template"* do GitHub cria uma cópia limpa do projeto com um commit inicial independente, desconectando o histórico de versões do repositório de origem.

Embora esse comportamento seja benéfico para entregar repositórios limpos e sem o histórico interno de desenvolvimento aos clientes, ele introduz um desafio de manutenção no longo prazo: **os sites já implantados ficam desconectados de melhorias futuras do template**.

Quando o template recebe atualizações críticas (como correções de segurança na Server Action, novas versões do Next.js ou Tailwind, otimizações de Core Web Vitals ou melhorias de acessibilidade), os desenvolvedores precisam de um método padronizado, seguro e reproduzível para sincronizar essas mudanças sem sobrescrever as customizações específicas de cada cliente.

---

## 2. Decisão (Decision)

Decidimos estruturar a política de evolução do template sob os seguintes pilares:

### 2.1. Versionamento Semântico e GitHub Releases
O template segue a especificação estrita do **SemVer (Semantic Versioning - `MAJOR.MINOR.PATCH`)**:
* **`MAJOR` (ex: `v2.0.0`):** Mudanças arquiteturais profundas com quebra de retrocompatibilidade (ex.: nova versão principal do Next.js ou reestruturação de schemas do Keystatic).
* **`MINOR` (ex: `v1.1.0`):** Novos componentes de interface, layouts opcionais ou recursos complementares retrocompatíveis.
* **`PATCH` (ex: `v1.0.1`):** Correções de bugs, patches de segurança em dependências e ajustes de performance.

> Toda nova versão é formalizada como uma **GitHub Release** contendo um *Changelog* explícito com notas de atualização e diretrizes para aplicação em sites legados.

### 2.2. Protocolo de Sincronização via *Upstream Remote* (Hipótese Técnica sob Validação)
Para repositórios derivados via *"Use this template"*, o histórico de commits original é descartado pelo GitHub, criando um repositório com um único commit inicial órfão (*sem ancestral comum / merge-base com o template*).

A proposta inicial de vincular o repositório original como upstream:
```bash
git remote add template https://github.com/heviane/institutional-website-template.git
git fetch template
git merge template/main --allow-unrelated-histories -m "chore: sincronizar com a versao X do template"
```

> ⚠️ **Alerta Técnico de Riscos:** O comando `--allow-unrelated-histories` apenas desativa a trava de segurança do Git que impede merge entre históricos desconectados. Como não existe um ancestral comum, o Git pode interpretar arquivos modificados em ambos os lados como adições concorrentes (*both added*), gerando falsos conflitos massivos. Por essa razão, **este comando não deve ser adotado como procedimento padrão definitivo sem prévia validação em repositório derivado real**.

### 2.3. Estratégias Alternativas sob Avaliação
Para minimizar a superfície de conflito na entrega de melhorias para clientes:
1. **Patches Cirúrgicos (`git format-patch` / `git apply`):** Para hotfixes e correções pontuais de segurança (como atualizações de pacotes ou ajustes de Server Action), extrair e aplicar apenas o diff do commit em questão, sem forçar o merge de todo o histórico.
2. **Branch Upstream Dedicada:** Manter no repositório do cliente uma branch isolada (ex.: `template-upstream`) que rastreia diretamente as releases do template, permitindo testar e mesclar mudanças em um Pull Request com revisão manual controlada.
3. **Automação via GitHub Actions (ex.: Template Sync):** Empregar workflows automatizados de sincronização que abrem PRs periódicos contendo apenas os deltas de engenharia.

### 2.4. Arquitetura de Baixo Conflito (*Separation of Concerns*)
A estrutura do projeto foi intencionalmente desenhada para minimizar conflitos independentemente do método de propagação adotado:
* **Zona Imune do Cliente (Preservada):**
  * `src/config/site.ts` (dados da empresa, cores de marca, contatos, CNPJ e DPO).
  * `public/images/content/` (mídias dos clientes).
  * Arquivos de conteúdo Markdown/JSON gerenciados pelo Keystatic.
* **Zona de Engenharia do Template (Atualizada via Upstream):**
  * `src/app/actions/` (Server Actions e segurança).
  * `src/components/ui/` e `src/components/shared/` (componentes estruturais).
  * `src/env.ts`, `package.json` e `.github/workflows/` (regras e automações).

### 2.5. Roteiro Obrigatório de Validação Prática (Fase 2 do Roadmap)
Antes de homologar um método de sincronização como procedimento operacional padrão:
1. Criar um repositório de testes utilizando a função *"Use this template"*;
2. Simular customizações de um cliente real (marca em `siteConfig`, páginas adicionais, CSS customizado e posts no Keystatic);
3. Simular uma atualização no template (ex.: patch de dependência e melhoria em componente);
4. Executar os métodos de propagação (merge direto, cherry-pick/patch e branch upstream), medindo o volume de conflitos e a complexidade de resolução;
5. Documentar o procedimento homologado com o menor índice de atrito operacional.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):
* **Rastreabilidade e Governança:** O versionamento SemVer e as GitHub Releases dão clareza sobre o impacto de cada atualização.
* **Segurança Centralizada:** Uma vulnerabilidade corrigida no template pode ser propagada de forma controlada para clientes ativos.
* **Preservação de Dados de Clientes:** A separação arquitetural isola os dados de conteúdo e identidade do core de código.

### Negativas (Riscos e Desvantagens Aceitas):
* **Risco de Conflitos em Históricos Desconectados:** O merge direto com `--allow-unrelated-histories` requer validação empírica prévia para evitar interrupções operacionais graves em repositórios de clientes.
* **Necessidade de Disciplina de Manutenção:** Exige homologar e testar os procedimentos de atualização antes de orientar os clientes finais ou equipes de suporte.

---

## 4. Alternativas Consideradas

* **Forks do Repositório Template:** Descartado por poluir a conta do desenvolvedor com forks dependentes e não permitir transformar o repositório em um modelo público limpo para clientes.
* **Cópia Manual de Arquivos:** Descartado por ser sujeito a erros humanos graves, perda de arquivos e inviável para múltiplos projetos.
* **Template Sync Automatizado por Bots (Actions Template Sync):** Mantido como opção sob avaliação para repositórios corporativos maiores, priorizando o controle manual com Git para projetos freelancer padrão.

