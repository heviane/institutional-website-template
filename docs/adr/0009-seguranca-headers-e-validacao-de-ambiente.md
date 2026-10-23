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

### 2.1. Validação de Variáveis de Ambiente no Build (`src/env.ts`)
Adotamos a validação estrita com **Zod** para todas as variáveis de ambiente em tempo de compilação (*fail-fast build pattern*):
* **Comportamento:** O módulo `src/env.ts` valida as variáveis do servidor e do cliente (`process.env`) no momento da execução do `next build`.
* **Benefício:** Se qualquer variável obrigatória (como `RESEND_API_KEY` ou `RESEND_FROM_EMAIL`) estiver ausente ou malformatada, **o build é abortado imediatamente no CI/CD**, exibindo um relatório explícito dos campos com erro e impedindo a publicação de versões quebradas.

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

### Positivas (Benefícios):
* **Classificação de Segurança A+:** Garante pontuação máxima em auditorias como *Mozilla Observatory* e *SecurityHeaders.com*.
* **Zero Falhas Silenciosas em Produção:** Impede que sites subam para a Vercel com credenciais esquecidas ou malformatadas.
* **Proteção Nativa de Dados dos Clientes:** Minimiza superfícies de ataque em conformidade com as diretrizes de segurança da LGPD (Art. 6º, VII).

### Negativas (Riscos e Desvantagens Aceitas):
* **Rigor no Setup:** Desenvolvedores precisam obrigatoriamente preencher o `.env.local` antes de rodar o build local ou a esteira de CI/CD.
* **Ajuste Fino de CSP se Houver Scripts Externos:** A inclusão de scripts de terceiros (como Google Ads ou pixels de conversão) pode exigir personalização pontual da Content Security Policy (CSP).
* **HSTS Requer Avaliação Prévia para Subdomínios:** A elevação de HSTS para incluir `includeSubDomains` ou submissão ao `preload` nunca deve ser feita no nível de template genérico; ela requer auditoria específica de todos os subdomínios da infraestrutura de cada cliente.

---

## 4. Alternativas Consideradas

* **Validar Variáveis Apenas em Tempo de Execução:** Descartado por permitir que erros cheguem à produção e afetem usuários finais.
* **Configurar Headers Apenas na CDN/Vercel:** Descartado para garantir portabilidade do código (os headers continuam ativos mesmo se o template for hospedado no Cloudflare Pages ou em contêiner Docker).

