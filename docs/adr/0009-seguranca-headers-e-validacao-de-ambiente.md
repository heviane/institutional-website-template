# ADR 0009: Política de Segurança, Headers HTTP e Validação de Ambiente

* **Status:** Aceito (Emendado parcialmente pelo [ADR 0012](0012-deploy-progressivo-modo-lite-e-rate-limiting-serverless.md))
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> [!NOTE] Emenda Arquitetural (ADR 0012)
> A obrigatoriedade estrita das chaves do Turnstile em produção descrita na Seção 2.1 foi flexibilizada pelo [ADR 0012](0012-deploy-progressivo-modo-lite-e-rate-limiting-serverless.md) para viabilizar o **Modo Lite (Progressive Enhancement)** em micro-projetos, mantendo a obrigatoriedade estrita apenas quando o Modo Robusto estiver ativado.

> Estabelece os padrões de segurança defensiva do template, incluindo validação de variáveis de ambiente no build via Zod, cabeçalhos HTTP de segurança no Next.js e política de divulgação responsável de vulnerabilidades.

---

## 1. Contexto (Context)

Websites institucionais e corporativos são alvos frequentes de scanners automatizados de vulnerabilidade na internet. A ausência de configurações defensivas expõe os sites a ataques comuns como *Clickjacking*, *MIME-sniffing*, injeções de scripts maliciosos e vazamento de informações de navegação via *Referrer*.

Além disso, um problema operacional clássico em deploys serverless no Next.js é a **ausência ou má formatação de variáveis de ambiente**. Sem validação prévia, a aplicação é compilada normalmente e os erros só se manifestam em tempo de execução quando um cliente tenta enviar uma mensagem, gerando falhas silenciosas e perda de oportunidades de negócio.

---

## 2. Decisão (Decision)

Decidimos implementar uma arquitetura de segurança preventiva composta por três mecanismos:

### 2.1. Validação Segregada de Variáveis de Ambiente no Build (`src/env/server.ts` e `src/env/client.ts`)
Adotamos a validação estrita com **Zod** para todas as variáveis de ambiente em tempo de compilação (*fail-fast build pattern*), com segregação física entre escopos para evitar vazamento acidental para o navegador:
* **Segregação Física de Módulos (Server vs. Client):**
  * `src/env/client.ts`: Valida e exporta `clientEnv` apenas com variáveis públicas (`NEXT_PUBLIC_*`). Seguro para consumo tanto em Client Components quanto em Server Components.
  * `src/env/server.ts`: Protegido com a diretiva nativa `import "server-only";`, valida e exporta `serverEnv` contendo os segredos corporativos (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, etc.). O compilador do Next.js bloqueia em tempo de build qualquer tentativa de importar este arquivo em componentes com `'use client'`.
  * Essa segregação em arquivos distintos elimina o defeito de runtime onde a execução de código do servidor em arquivo único provocava erros fatais de inicialização no navegador.
* **Validação de Borda e Proteção Anti-Spam em Produção:**
  * Em **produção (`NODE_ENV === "production"`)**, a presença das chaves do Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`) é **mandatória**, garantindo que o formulário nunca seja publicado em estado vulnerável ou disfuncional ([ADR 0011](0011-defesa-antispam-e-protecao-de-formularios.md)).
  * Em **desenvolvimento e testes (`NODE_ENV !== "production"`)**, as chaves do Turnstile e Redis são tratadas como opcionais com bypass gracioso para viabilizar execução offline e pipelines de CI.
* **Benefício:** Se qualquer variável mandatória estiver ausente ou malformatada, **o build é abortado imediatamente no CI/CD**, exibindo um relatório explícito dos campos com erro e impedindo a publicação de versões quebradas.
* **Testabilidade Automatizada:** Inclusão de suíte de testes no Vitest (`tests/env.test.ts`) validando o comportamento do parser sob configurações mínimas, setups completos de produção e entradas inválidas.

### 2.2. Cabeçalhos HTTP de Segurança no `next.config.ts`
Configuramos *Security Headers* obrigatórios aplicados a todas as rotas da aplicação:
* **`Strict-Transport-Security` (HSTS Conservador em Produção):** Ativado exclusivamente em produção (`max-age=31536000`, 1 ano) para forçar HTTPS no site institucional. As diretivas `includeSubDomains` e `preload` são mantidas deliberadamente desativadas por padrão como medida preventiva para não quebrar subdomínios legados ou sistemas internos do cliente (como VPNs ou intranets) que possam não dispor de HTTPS.
* **`X-Frame-Options: SAMEORIGIN`:** Protege contra ataques de *Clickjacking* mantendo compatibilidade com a renderização em iframe do painel administrativo do Keystatic (`/keystatic`).
* **`X-Content-Type-Options: nosniff`:** Impede que o navegador tente inferir tipos MIME diferentes dos declarados pelos servidores.
* **`Referrer-Policy: strict-origin-when-cross-origin`:** Garante que dados confidenciais na URL não vazem ao navegar para links externos.
* **`Permissions-Policy`:** Desativa permissões de hardware desnecessárias para um site institucional (`camera=(), microphone=(), geolocation=()`).
* **`X-DNS-Prefetch-Control: on`:** Habilita prefetch controlado de DNS para otimizar velocidade de navegação segura.
* **`Content-Security-Policy-Report-Only` (Monitoramento Preventivo sem Bloqueios):** Estabelece uma política base de controle de recursos (liberando `'self'`, `challenges.cloudflare.com` para o Turnstile, `data:`, `blob:` e origens HTTPS) em modo *Report-Only*. Essa abordagem atende aos scanners de conformidade de segurança (como Mozilla Observatory e SecurityHeaders) e viabiliza a auditoria de scripts sem o risco operacional de quebrar widgets ou fontes personalizadas de novos clientes.

### 2.3. Governança e Divulgação Responsável (`SECURITY.md`)
Instituímos o arquivo `SECURITY.md` na raiz do repositório, definindo versões suportadas e canal seguro para reporte privado de falhas, protegendo todos os sites derivados deste template.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios Esperados):
* **Alinhamento com Melhores Práticas de Segurança HTTP:** Estruturação de cabeçalhos com o objetivo de alcançar notas de excelência (como A ou A+) em analisadores reconhecidos (*Mozilla Observatory*, *SecurityHeaders.com*), a serem formalmente auditados no primeiro deploy do MVP.
* **Prevenção Ativa de Falhas de Configuração no Build:** A validação estrita com Zod impede compilações com variáveis essenciais ausentes ou malformatadas, reduzindo drasticamente falhas silenciosas de integração em tempo de execução.
* **Proteção em Camadas dos Dados dos Clientes:** Minimiza superfícies de ataque contra clickjacking, MIME sniffing e injeções básicas, em conformidade com as diretrizes de segurança da LGPD (Art. 6º, VII).

### Negativas (Riscos e Desvantagens Aceitas):
* **Não Imunidade a Falhas Operacionais de Runtime:** A validação de ambiente no build assegura que as variáveis foram fornecidas no formato esperado, mas não atesta a validade dinâmica das credenciais (ex.: chave de API revogada pelo provedor externo) nem previne falhas lógicas de execução.
* **Necessidade de Auditoria Pontual por Cliente:** A presença de cabeçalhos padrão não assegura nota estática invariável; a inserção de scripts externos específicos do cliente (pixels de mídia, widgets de chat) pode demandar ajustes finos na Content Security Policy (CSP).
* **Rigor no Setup:** Desenvolvedores precisam obrigatoriamente preencher o `.env.local` antes de rodar o build local ou a esteira de CI/CD.
* **HSTS Requer Avaliação Prévia para Subdomínios:** A elevação de HSTS para incluir `includeSubDomains` ou submissão ao `preload` nunca deve ser feita no nível de template genérico; ela requer auditoria específica de todos os subdomínios da infraestrutura de cada cliente.

---

## 4. Alternativas Consideradas

* **Validar Variáveis Apenas em Tempo de Execução:** Descartado por permitir que erros cheguem à produção e afetem usuários finais.
* **Configurar Headers Apenas na CDN/Vercel:** Descartado para garantir portabilidade do código (os headers continuam ativos mesmo se o template for hospedado no Cloudflare Pages ou em contêiner Docker).

