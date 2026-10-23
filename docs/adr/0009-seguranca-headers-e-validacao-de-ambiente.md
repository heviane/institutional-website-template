# ADR 0009: Política de Segurança, Headers HTTP e Validação de Ambiente

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Estabelece os padrões de segurança defensiva do template, incluindo validação de variáveis de ambiente no build via Zod, cabeçalhos HTTP de segurança no Next.js e política de divulgação responsável de vulnerabilidades.

---

## 1. Contexto (Context)

Websites institucionais e corporativos são alvos frequentes de scanners automatizados de vulnerabilidade na internet. A ausência de configurações defensivas expõe os sites a ataques comuns como *Clickjacking*, *MIME-sniffing*, injeções de scripts maliciosos e vazamento de informações de navegação via *Referrer*.

Além disso, um problema operacional clássico em deploys serverless no Next.js é a **ausência ou má formatação de variáveis de ambiente**. Sem validação prévia, a aplicação é compilada normalmente e os erros só se manifestam em tempo de execução quando um cliente tenta enviar uma mensagem, gerando falhas silenciosas e perda de oportunidades de negócio.

---

## 2. Decisão (Decision)

Decidimos implementar uma arquitetura de segurança preventiva composta por três mecanismos:

### 2.1. Validação Segregada de Variáveis de Ambiente no Build (`src/env.ts`)
Adotamos a validação estrita com **Zod** para todas as variáveis de ambiente em tempo de compilação (*fail-fast build pattern*), estruturada em escopos segregados:
* **Segregação de Escopos (Server vs. Client):** Separação formal entre `serverEnvSchema` (segredos que nunca chegam ao navegador, como `RESEND_API_KEY` e `TURNSTILE_SECRET_KEY`) e `clientEnvSchema` (variáveis públicas com prefixo obrigatório `NEXT_PUBLIC_`). Essa blindagem impede vazamento acidental de chaves de API em componentes de interface (`'use client'`).
* **Diferenciação entre Core e Opcionais por Feature:** Variáveis essenciais para renderização e formulários são obrigatórias no build. Já credenciais de serviços de borda com fallbacks locais (Cloudflare Turnstile, Upstash Redis e Keystatic Cloud) são tratadas como opcionais em desenvolvimento/CI e validadas conforme o ambiente (`NODE_ENV === "production"`).
* **Benefício:** Se qualquer variável mandatória estiver ausente ou malformatada, **o build é abortado imediatamente no CI/CD**, exibindo um relatório explícito dos campos com erro e impedindo a publicação de versões quebradas.
* **Testabilidade Automatizada:** Inclusão de suíte de testes no Vitest (`src/env.test.ts`) validando o comportamento do parser sob configurações mínimas, setups completos de produção e entradas inválidas.

### 2.2. Cabeçalhos HTTP de Segurança no `next.config.ts`
Configuramos *Security Headers* obrigatórios aplicados a todas as rotas da aplicação:
* **`Strict-Transport-Security` (HSTS Conservador em Produção):** Ativado exclusivamente em produção (`max-age=31536000`, 1 ano) para forçar HTTPS no site institucional. As diretivas `includeSubDomains` e `preload` são mantidas deliberadamente desativadas por padrão como medida preventiva para não quebrar subdomínios legados ou sistemas internos do cliente (como VPNs ou intranets) que possam não dispor de HTTPS.
* **`X-Frame-Options: SAMEORIGIN`:** Protege contra ataques de *Clickjacking* mantendo compatibilidade com a renderização em iframe do painel administrativo do Keystatic (`/keystatic`).
* **`X-Content-Type-Options: nosniff`:** Impede que o navegador tente inferir tipos MIME diferentes dos declarados pelos servidores.
* **`Referrer-Policy: strict-origin-when-cross-origin`:** Garante que dados confidenciais na URL não vazem ao navegar para links externos.
* **`Permissions-Policy`:** Desativa permissões de hardware desnecessárias para um site institucional (`camera=(), microphone=(), geolocation=()`).
* **`X-DNS-Prefetch-Control: on`:** Habilita prefetch controlado de DNS para otimizar velocidade de navegação segura.

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

