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

### 2.3. Telemetria e Analytics Orientados à Privacidade (Propriedades Técnicas Verificadas)

* Adotamos o **Plausible Analytics** (ou Umami) como a solução padrão recomendada de análise de tráfego agregada, fundamentada nas seguintes propriedades técnicas:
  * **Operação sem Cookies (*Cookieless*):** Não grava dados no armazenamento do navegador (`document.cookie`, `localStorage` ou `sessionStorage`) nem utiliza identificadores persistentes de dispositivo.
  * **Anonimização e Métricas Agregadas:** Gera estatísticas agregadas calculando um hash temporário a partir do endereço IP, User-Agent e um *salt* rotativo diário, descartando o endereço IP bruto imediatamente após o processamento.
  * **Isolamento de Domínio (*No Cross-Site Tracking*):** Não rastreia usuários entre diferentes websites nem cria perfis comportamentais para comercialização ou publicidade.
  * **Impacto em Consentimento e UX:** Por não utilizar armazenamento local no terminal do usuário para fins de rastreamento de terceiros, a configuração padrão minimiza a necessidade de *Cookie Banners* (CMPs) intrusivos que degradam Core Web Vitals (CLS/INP).
  * **Não Isenção Automática de Obrigações Legais:** A dispensa de mecanismos de consentimento ou banners informativos depende do enquadramento legal pelo DPO/assessoria jurídica do cliente e das diretrizes da autoridade competente (ANPD no Brasil, orientações setoriais ou regulamentos internacionais caso atenda visitantes estrangeiros). O template fornece salvaguardas técnicas, mas não substitui a governança jurídica.
  * **Dever Mandatório de Transparência (Art. 6º, VI da LGPD):** A ausência de cookies não elimina o dever de informar. É obrigatório descrever na [Política de Privacidade](/politica-de-privacidade) os serviços técnicos efetivamente ativados e o tratamento de dados realizado.
* **Modo Alternativo (Google Analytics 4 / Pixels de Mídia):** Caso o cliente decida utilizar o GA4 ou pixels de anúncio (Meta Pixel / Google Ads), a arquitetura orienta a ativação de um componente formal de Cookie Banner com bloqueio prévio de scripts antes do consentimento do usuário.

### 2.4. Páginas Legais Transparentes e Fidedignas aos Serviços Ativos

* O template disponibiliza rotas estáticas pré-estruturadas:
  * `/politica-de-privacidade`
  * `/termos-de-uso`
* O conteúdo dessas páginas consome dados centralizados de governança em `src/config/site.ts` (Razão Social, CNPJ, canal de atendimento do Encarregado de Dados/DPO, endereço e telefone).
* **Fidelidade aos Serviços Ativos:** A Política de Privacidade deve refletir com exatidão os serviços efetivamente integrados ao projeto (ex.: detecção de automação e segurança via Cloudflare Turnstile, tráfego de e-mails via Resend, telemetria agregada via Plausible ou cookies via GA4), evitando cláusulas genéricas descoladas da arquitetura real do website.

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
* **Não Substituição da Avaliação Jurídica:** Adoção de arquiteturas sem cookies ou telemetria anônima não dispensa o cliente de suas obrigações legais de transparência, devendo a Política de Privacidade ser periodicamente revisada para cobrir todos os serviços integrados.

---

## 4. Alternativas Consideradas

* **Ignorar a LGPD no Template Base:** Descartado por expor clientes a riscos regulatórios e transmitir falta de governança de engenharia.
* **Impor Cookie Banner Invasivo Sempre:** Descartado para manter os pilares de Core Web Vitals e experiência limpa do usuário quando o site não utiliza cookies invasivos ou rastreadores de publicidade.
* **Persistir Leads em Banco de Dados SQL:** Descartado por exigir infraestrutura de banco de dados paga, políticas de expiração de dados complexas e aumento do risco em caso de incidentes de segurança.

