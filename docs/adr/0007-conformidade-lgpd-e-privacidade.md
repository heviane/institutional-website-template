# ADR 0007: Conformidade com a LGPD e Privacidade por Design (Privacy by Design)

* **Status:** Aceito
* **Data:** 2026-10-22
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a estratégia técnica e arquitetural orientada à Privacidade por Design (Privacy by Design) em conformidade com a LGPD (Lei nº 13.709/2018), equilibrando salvaguardas técnicas de privacidade, experiência do usuário (UX) e preservação dos índices de Core Web Vitals.

---

## 1. Contexto (Context)

Websites institucionais e corporativos no Brasil coletam dados pessoais de visitantes em formulários de contato, solicitações de orçamento e ferramentas de análise de tráfego. 

A ausência de salvaguardas técnicas e governança expõe empresas clientes a sanções administrativas da Autoridade Nacional de Proteção de Dados (ANPD), multas, notificações de órgãos de defesa do consumidor (Procon) e danos reputacionais.

Ao mesmo tempo, abordagens ingênuas de privacidade costumam introduzir *Cookie Banners* (CMPs) intrusivos e pesados que:

1. Prejudicam os índices de **Core Web Vitals** (em especial CLS por deslocamento de layout e LCP/INP pelo bloqueio de threads com scripts de terceiros);
2. Elevam a taxa de rejeição (*bounce rate*) logo no primeiro acesso do visitante;
3. Armazenam dados de forma desnecessária em bancos de dados pagos ou vulneráveis, violando o princípio da **minimização de dados** (Art. 6º, III da LGPD) e o pilar de **baixo custo** do template.

---

## 2. Decisão (Decision)

Decidimos adotar uma arquitetura fundamentada no princípio de **Privacidade por Design (*Privacy by Design*)**, estruturada em quatro pilares técnicos:

### 2.1. Transparência, Minimização e Validação nos Formulários (Zod + Salvaguarda de Consentimento)

* **Diferenciação de Bases Legais da LGPD:**
  * **Procedimentos Preliminares Relacionados a Contrato (Art. 7º, V):** Formulários padrão de contato ou solicitação de orçamento, iniciados espontaneamente pelo visitante para tirar dúvidas ou solicitar propostas comerciais, comumente se apoiam nessa base legal, dispensando checkbox de consentimento forçado, desde que acompanhados de aviso de privacidade claro com link direto para a Política de Privacidade.
  * **Consentimento Expresso (Art. 7º, I):** Indicado quando a finalidade for além do retorno pontual da mensagem enviada (ex.: opt-in simultâneo para newsletters, comunicações periódicas de marketing ou compartilhamento de leads com parceiros).
* **Salvaguarda Técnica Disponível no Template:** O template provê validação tipada via Zod caso a operação do cliente exija opt-in explícito por checkbox:
  ```typescript
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "É obrigatório aceitar a Política de Privacidade." }),
  }),
  ```
* **Diretriz de Governança:** A agência ou desenvolvedor deve alinhar com a assessoria jurídica ou encarregado de dados (DPO) do cliente qual a base legal aplicável a cada formulário, ativando ou dispensando o checkbox conforme o tratamento real pretendido.

### 2.2. Retenção Efêmera de Dados (*Zero-Database Architecture*)

* O template institucional base **não armazena dados de contato em bancos de dados relacionais ou NoSQL**.
* Os dados pessoais enviados trafegam temporariamente pela rota de API / Server Action do Next.js e são encaminhados de forma criptografada diretamente à caixa postal corporativa do cliente através da API do Resend.
* Essa abordagem atende tecnicamente aos princípios da **minimização** (Art. 6º, III), **segurança** (Art. 6º, VII) e **eliminação de dados** (Art. 16), reduzindo drasticamente a superfície de ataque contra vazamento de dados em repouso.

### 2.3. Telemetria e Analytics *Privacy-First* (Ausência de Cookies de Rastreamento)

* Adotamos o **Plausible Analytics** (ou Umami) como a solução padrão recomendada de análise de tráfego agregada:
  * Funciona **sem cookies (*cookieless*)** e não rastreia usuários entre diferentes websites (*cross-site tracking*).
  * Não coleta endereços IP persistentes nem dados pessoais identificáveis (PII), gerando métricas anônimas e consolidadas.
  * **Impacto em UX e Consentimento de Cookies:** Por não armazenar cookies persistentes no navegador do visitante nem gerar perfis para publicidade comportamental, dispensa tecnicamente os *Cookie Banners* (CMPs) invasivos que prejudicam Core Web Vitals (CLS/INP).
  * **Dever Contínuo de Transparência (Art. 6º, VI da LGPD):** A ausência de cookies não elimina o dever de informar. É mandatório descrever de forma clara na [Política de Privacidade](/politica-de-privacidade) que o site utiliza serviços de telemetria estatística agregada sem identificação pessoal do visitante.
* **Modo Alternativo (Google Analytics 4):** Caso o cliente exija expressamente o GA4 ou pixels de anúncio (Meta Pixel / Google Ads), a arquitetura orienta a ativação de um componente de Cookie Banner com bloqueio prévio de scripts antes do consentimento do usuário.

### 2.4. Páginas Legais Automatizadas via `siteConfig`

* O template disponibiliza rotas estáticas pré-estruturadas:
  * `/politica-de-privacidade`
  * `/termos-de-uso`
* O conteúdo dessas páginas consome dinamicamente os dados centralizados de governança definidos em `src/config/site.ts` (Razão Social, CNPJ, canal de atendimento do Encarregado de Dados/DPO, endereço e telefone), permitindo adaptação rápida e consistente para cada cliente.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Facilitação de Conformidade Técnica para o Cliente:** O template entrega mecanismos técnicos prontos e aderentes aos princípios de minimização, segurança e transparência da LGPD, simplificando o processo de homologação jurídica de cada empresa.
* **Diferencial Comercial de Venda:** Apresentar um website desenvolvido sob o princípio de "Privacy by Design" eleva a credibilidade técnica e a governança perante clientes corporativos.
* **Máxima Performance e UX Limpa:** O uso de telemetria agregada sem cookies mantém a navegação rápida e sem pop-ups invasivos no primeiro acesso.
* **Alinhamento com o Baixo Custo:** A ausência de banco de dados e o uso de soluções efêmeras eliminam despesas fixas com bancos de dados gerenciados para armazenamento desnecessário de formulários institucionais.

### Negativas (Riscos e Desvantagens Aceitas):

* **Necessidade de Alinhamento Caso a Caso:** A definição da base legal (consentimento expresso vs procedimentos pré-contratuais) deve ser avaliada com o cliente e seu DPO, sem assumir uma fórmula jurídica única para todos os formulários.
* **Métricas Agregadas no Analytics:** O Plausible entrega dados quantitativos consolidados de tráfego, sem identificação de visitantes individuais ou funis comportamentais avançados entre domínios (adequado para sites institucionais, mas exigindo transição para GA4 com Cookie Banner caso o cliente rode campanhas avançadas de retargeting).

---

## 4. Alternativas Consideradas

* **Ignorar a LGPD no Template Base:** Descartado por expor clientes a riscos regulatórios e transmitir falta de governança de engenharia.
* **Impor Cookie Banner Invasivo Sempre:** Descartado para manter os pilares de Core Web Vitals e experiência limpa do usuário quando o site não utiliza cookies invasivos ou rastreadores de publicidade.
* **Persistir Leads em Banco de Dados SQL:** Descartado por exigir infraestrutura de banco de dados paga, políticas de expiração de dados complexas e aumento do risco em caso de incidentes de segurança.

