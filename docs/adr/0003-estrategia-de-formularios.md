# ADR 0003: Estratégia de Formulários e Comunicação Transacional

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

---

## 1. Contexto (Context)

Websites institucionais exigem mecanismos confiáveis para capturar interações dos visitantes (como formulários de "Fale Conosco", solicitações de orçamento e cadastro de *newsletters*). 

Para atender aos requisitos da arquitetura do `institutional-website-template`, a solução de formulários precisava garantir:

1. **Desempenho no Cliente (Core Web Vitals):** A captura dos dados de entrada não pode causar re-renderizações desnecessárias no navegador, preservando a fluidez de interação (INP/FID)[cite: 1].
2. **Segurança de Tipos e Validação Dupla (Type-Safety):** Validação estrita dos dados tanto na interface do usuário quanto na camada de servidor (Serverless API)[cite: 1].
3. **Entrega Transacional sem Servidor Fixo:** Disparo confiável de e-mails de notificação e confirmação em ambientes Serverless/Edge (Vercel) sem a complexidade de manter servidores SMTP dedicados[cite: 1].

---

## 2. Decisão (Decision)

Decidimos adotar a combinação **React Hook Form + Zod + Resend API** como o padrão para gerenciamento de formulários e envio de mensagens transacionais no projeto[cite: 1].

### Estrutura do Trio Tecnológico:

1. **React Hook Form (Gerenciamento de Estado no Cliente):** Utiliza componentes não controlados (*uncontrolled components*) via referências do DOM para gerenciar os inputs sem re-renderizar a página a cada caractere digitado[cite: 1].
2. **Zod (Validação de Schemas):** Define a estrutura e as regras de negócio dos dados (ex.: e-mails válidos, campos obrigatórios, tamanho mínimo de mensagens)[cite: 1]. O *schema* é compartilhado entre o cliente e o servidor do Next.js via `@hookform/resolvers`[cite: 1].
3. **Resend API (Infraestrutura de E-mails Transacionais):** Recebe as requisições validadas através de uma Rota de API do Next.js (`/app/api/contact/route.ts`) e dispara os e-mails utilizando servidores otimizados para Serverless[cite: 1].

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Performance Extrema no Frontend:** Minimiza o uso de memória e CPU do navegador do usuário por evitar `useState` em cada campo de entrada[cite: 1].
* **Validação Unificada:** O mesmo *schema* do Zod valida o formulário instantaneamente no navegador e re-valida na Route Handler do Next.js, protegendo o backend contra requisições maliciosas[cite: 1].
* **Layouts de E-mail com React:** Integração nativa com `@react-email/components`, permitindo construir os templates de e-mail utilizando componentes React estilizados em vez de strings HTML antigas.
* **Custo $0:** A API do Resend oferece até 3.000 e-mails/mês no plano gratuito, cobrindo com folga as necessidades de sites institucionais pequenos e médios[cite: 1].

### Negativas (Riscos e Desvantagens Aceitas):

* **Dependência de Serviço de Terceiros (Resend):** O disparo de e-mails depende do tempo de resposta e disponibilidade da API do Resend (embora com SLA elevado para ambientes serverless)[cite: 1].
* **Sobrecarga de Código para Formulários Ultra Simples:** Configurar a validação com Zod e a rota de API exige mais código boilerplate inicial do que soluções externas prontas do tipo *embed* (ex.: Formspree ou Typeform).

---

## 4. Alternativas Consideradas

* **Formspree / Getform (Formulários Gerenciados via SaaS):** Descartados por redirecionarem requisições para serviços externos sem controle do código no servidor, além de limites severos nos planos gratuitos.
* **Nodemailer com SMTP Tradicional:** Descartado por ser desafiador de configurar e manter de forma estável em ambientes de execução Serverless efêmeros (Edge/Serverless Functions)[cite: 1].
* **Netlify Forms:** Descartado por prender a funcionalidade exclusivamente à infraestrutura do Netlify, reduzindo a portabilidade do template[cite: 1].

---
