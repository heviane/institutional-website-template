# ADR 0003: Estratégia de Formulários e Comunicação Transacional

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

---

## 1. Contexto (Context)

Websites institucionais exigem mecanismos confiáveis para capturar interações dos visitantes (como formulários de "Fale Conosco", solicitações de orçamento e cadastro de *newsletters*).

Para atender aos requisitos da arquitetura do `institutional-website-template`, a solução de formulários precisava garantir:

1. **Desempenho no Cliente (Core Web Vitals):** A captura dos dados de entrada não pode causar re-renderizações desnecessárias no navegador, preservando a fluidez de interação contínua e garantindo pontuação de excelência no **INP (Interaction to Next Paint)**.

2. **Segurança de Tipos e Validação Dupla (Type-Safety):** Validação estrita dos dados tanto na interface do usuário quanto na camada de servidor (Serverless API).

3. **Entrega Transacional sem Servidor Fixo:** Disparo confiável de e-mails de notificação e confirmação em ambientes Serverless/Edge (Vercel) sem a complexidade de manter servidores SMTP dedicados.

---

## 2. Decisão (Decision)

Decidimos adotar a combinação **React Hook Form + Zod + Server Actions (Next.js 16) + Resend API**, blindada por uma arquitetura de proteção anti-spam em camadas (Honeypot + Cloudflare Turnstile + Rate Limiting).

### Estrutura do Trio Tecnológico:

1. **React Hook Form (Gerenciamento de Estado no Cliente):** Utiliza componentes não controlados (*uncontrolled components*) via referências do DOM para gerenciar os inputs sem re-renderizar a página a cada caractere digitado.
2. **Zod (Validação de Schemas):** Define a estrutura e as regras de negócio dos dados (ex.: e-mails válidos, campos obrigatórios, tamanho mínimo de mensagem e consentimento LGPD). O pacote `@hookform/resolvers/zod` conecta as regras do Zod ao ciclo de validação do React Hook Form no navegador; o compartilhamento end-to-end do schema decorre da importação do mesmo arquivo TypeScript (ex.: `src/lib/schemas/contact.ts`) tanto no componente de formulário do cliente quanto na Server Action no servidor.
3. **Server Actions (`src/app/actions/contact.ts`):** Substitui Route Handlers REST manuais (`/api/contact`). Executa nativamente no servidor via diretiva `'use server'`, proporcionando integração de tipos nativa (*Type-Safety end-to-end*) e ergonomia com formulários React sem a necessidade de boilerplate de serialização HTTP. **Diretriz de Segurança:** Como qualquer Server Action compila para uma rota HTTP pública subjacente, ela é formalmente tratada como uma fronteira de entrada não confiável (*untrusted boundary*): todos os dados são revalidados estritamente no servidor via Zod, o tamanho do payload é limitado, a verificação do Turnstile é mandatória e os erros são mascarados para não expor detalhes internos da infraestrutura.
4. **Defesa em Camadas contra Spam e Ataques (veja [ADR 0011](0011-defesa-antispam-e-protecao-de-formularios.md)):**
   * **Honeypot:** Campo oculto no formulário (`website`) para descarte imediato e silencioso de requisições disparadas por bots simples.
   * **Cloudflare Turnstile:** Verificação inteligente invisível (sem captchas invasivos e sem cookies de rastreamento), validada no servidor.
   * **Rate Limiting por IP:** Limitação de até 5 submissões por hora por endereço IP, blindando o teto de 100 e-mails/dia do plano gratuito do Resend.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Performance Extrema no Frontend:** Minimiza o uso de memória e CPU do navegador do usuário por evitar `useState` em cada campo de entrada.
* **Validação Unificada e Tipagem Estrita:** O mesmo *schema* do Zod valida o formulário no navegador (para feedback imediato de UX) e revalida obrigatoriamente na Server Action do Next.js (garantia de integridade no servidor), eliminando duplicidade de código de validação.
* **Layouts de E-mail com React:** Integração nativa com `@react-email/components`, permitindo construir os templates de e-mail utilizando componentes React estilizados em vez de strings HTML antigas.
* **Custo de Mensageria Otimizado:** A API do Resend oferece até 3.000 e-mails/mês (com teto de 100 envios/dia) no plano gratuito, cobrindo com folga as necessidades de sites institucionais pequenos e médios sem custos iniciais recorrentes de disparo.

### Negativas (Riscos e Desvantagens Aceitas):

* **Superfície Pública da Server Action:** Toda Server Action compila para um endpoint HTTP acessível publicamente; requisições arbitrárias forjadas via scripts externos exigem barreiras obrigatórias (Honeypot, Turnstile e Rate Limiting) para impedir consumo indevido de cotas.
* **Dependência de Serviço de Terceiros (Resend):** O disparo de e-mails depende do tempo de resposta e disponibilidade da API do Resend (embora com SLA elevado para ambientes serverless).
* **Obrigatoriedade de Verificação de Domínio Próprio:** Em produção, o Resend bloqueia envios para destinatários externos caso o domínio do cliente não possua autenticação DNS ativa (SPF, DKIM e DMARC). Sem isso, o envio fica restrito exclusivamente ao e-mail cadastrado na conta do desenvolvedor (`onboarding@resend.dev`).
* **Limite Diário e Risco de Esgotamento por Spam:** O plano gratuito possui um limite diário estrito de 100 e-mails/dia. Disparos massivos por bots em formulários públicos podem esgotar a cota rapidamente, tornando recomendada a inclusão de proteção anti-spam (como técnica de *honeypot* ou Cloudflare Turnstile).
* **Sobrecarga de Código para Formulários Ultra Simples:** Configurar a validação com Zod e a rota de API exige mais código boilerplate inicial do que soluções externas prontas do tipo *embed* (ex.: Formspree ou Typeform).

---

## 4. Alternativas Consideradas

* **Formspree / Getform (Formulários Gerenciados via SaaS):** Descartados por redirecionarem requisições para serviços externos sem controle do código no servidor, além de limites severos nos planos gratuitos.
* **Nodemailer com SMTP Tradicional:** Descartado por ser desafiador de configurar e manter de forma estável em ambientes de execução Serverless efêmeros (Edge/Serverless Functions).
* **Netlify Forms:** Descartado por prender a funcionalidade exclusivamente à infraestrutura do Netlify, reduzindo a portabilidade do template.
* **Route Handlers Tradicionais (`/api/contact`):** Avaliado e descartado para submissões de formulários internos por exigir mais código boilerplate de serialização HTTP manual (`fetch`, headers, parsing de JSON) em comparação à ergonomia e tipagem nativa das Server Actions.

---
