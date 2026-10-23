# ADR 0007: Conformidade com a LGPD e Privacidade por Design (Privacy by Design)

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a estratégia técnica e arquitetural para garantir conformidade nativa com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), equilibrando obrigações legais, experiência do usuário (UX) e preservação dos índices de Core Web Vitals.

---

## 1. Contexto (Context)

Websites institucionais e corporativos no Brasil coletam dados pessoais de visitantes em formulários de contato, solicitações de orçamento e ferramentas de análise de tráfego. 

A ausência de conformidade com a LGPD expõe empresas clientes a sanções administrativas da Autoridade Nacional de Proteção de Dados (ANPD), multas, notificações de órgãos de defesa do consumidor (Procon) e danos reputacionais.

Ao mesmo tempo, abordagens ingênuas de privacidade costumam introduzir *Cookie Banners* (CMPs) intrusivos e pesados que:

1. Prejudicam os índices de **Core Web Vitals** (em especial CLS por deslocamento de layout e LCP/INP pelo bloqueio de threads com scripts de terceiros);
2. Elevam a taxa de rejeição (*bounce rate*) logo no primeiro acesso do visitante;
3. Armazenam dados de forma desnecessária em bancos de dados pagos ou vulneráveis, violando o princípio da **minimização de dados** (Art. 6º, III da LGPD) e o pilar de **baixo custo** do template.

---

## 2. Decisão (Decision)

Decidimos adotar uma arquitetura fundamentada no princípio de **Privacidade por Design (*Privacy by Design*)**, estruturada em quatro pilares técnicos:

### 2.1. Consentimento e Minimização nos Formulários (Zod + Opt-in)

* **Base Legal:** Atendimento ao Art. 7º, I (Consentimento expresso) e Art. 7º, V (Procedimentos preliminares relacionados a contrato a pedido do titular).
* **Checkbox Obrigatório no Frontend:** O formulário de contato incluirá um campo de seleção explícito com link direto para os termos de privacidade:
  > *"Concordo com o tratamento dos meus dados para retorno de contato, conforme a [Política de Privacidade](/politica-de-privacidade)."*
* **Validação Dupla com Zod:** O schema do formulário valida o aceite tanto na interface quanto na Route Handler do Next.js:
  ```typescript
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "É obrigatório aceitar a Política de Privacidade." }),
  }),
  ```

### 2.2. Retenção Efêmera de Dados (*Zero-Database Architecture*)

* O template institucional base **não armazena dados de contato em bancos de dados relacionais ou NoSQL**.
* Os dados pessoais enviados trafegam temporariamente pela rota de API do Next.js e são encaminhados de forma criptografada diretamente à caixa postal corporativa do cliente através da API do Resend.
* Essa abordagem atende por definição aos princípios da **minimização** (Art. 6º, III), **segurança** (Art. 6º, VII) e **eliminação de dados** (Art. 16), reduzindo drasticamente a superfície de ataque contra vazamento de dados em repouso.

### 2.3. Analytics *Privacy-First* (Isenção de Cookie Banner por Padrão)

* Adotamos o **Plausible Analytics** (ou Umami) como a solução padrão recomendada de análise de tráfego:
  * Funciona **sem cookies (*cookieless*)** e não rastreia usuários entre diferentes websites.
  * Não coleta endereços IP persistentes nem dados pessoais identificáveis (PII).
  * **Consequência Legal:** Por não utilizar cookies de rastreamento nem tratar dados pessoais, **dispensa legalmente a obrigatoriedade de banners de consentimento de cookies**, preservando a estética do site, a velocidade de carregamento e o Core Web Vitals.
* **Modo Alternativo (Google Analytics 4):** Caso o cliente exija expressamente o GA4 para integração com Google Ads, a documentação instrui a ativação de um componente de Cookie Banner com bloqueio prévio de scripts antes do consentimento do usuário.

### 2.4. Páginas Legais Automatizadas via `siteConfig`

* O template disponibiliza rotas estáticas pré-estruturadas:
  * `/politica-de-privacidade`
  * `/termos-de-uso`
* O conteúdo dessas páginas consome dinamicamente os dados centralizados de governança definidos em `src/config/site.ts` (Razão Social, CNPJ, canal de atendimento do Encarregado de Dados/DPO, endereço e telefone), permitindo adaptação automática para cada novo cliente em minutos.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Blindagem Jurídica para o Cliente:** O site do cliente já entra em produção com conformidade às exigências da ANPD e da legislação brasileira.
* **Diferencial Comercial de Venda:** Apresentar um website "LGPD-Ready por padrão" eleva o valor percebido e a autoridade técnica do desenvolvedor freelancer perante empresas.
* **Máxima Performance e UX Limpa:** O uso de analytics sem cookies mantém a navegação rápida e sem pop-ups invasivos logo no carregamento da página inicial.
* **Alinhamento com o Baixo Custo:** A ausência de banco de dados e o uso de soluções efêmeras eliminam despesas fixas de bancos de dados gerenciados para armazenamento seguro de dados de leads.

### Negativas (Riscos e Desvantagens Aceitas):

* **Fricção Adicional no Formulário:** A inclusão de um checkbox obrigatório pode reduzir marginalmente a taxa de conversão em comparação a formulários sem opt-in (trade-off necessário para estrita conformidade legal).
* **Métricas Agregadas no Analytics:** O Plausible entrega dados agregados de tráfego e visualizações, sem perfis detalhados de usuários individuais (o que é suficiente para 99% dos sites institucionais, mas requer transição para GA4 com Cookie Banner caso o cliente rode campanhas avançadas de retargeting).

---

## 4. Alternativas Consideradas

* **Ignorar a LGPD no Template Base:** Descartado por expor clientes a riscos jurídicos graves e transmitir falta de profissionalismo.
* **Impor Cookie Banner Invasivo Sempre:** Descartado para manter os pilares de Core Web Vitals e experiência limpa do usuário quando o site não utiliza cookies invasivos.
* **Persistir Leads em Banco de Dados SQL:** Descartado por exigir infraestrutura de banco de dados paga, políticas de expiração de dados complexas e aumento do risco em caso de incidentes de segurança.

