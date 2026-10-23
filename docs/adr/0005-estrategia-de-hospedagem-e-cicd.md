# ADR 0005: Estratégia de Hospedagem, Infraestrutura e CI/CD

* **Status:** Aceito
* **Data:** 2026-10-20
* **Decisores:** Engenharia de Software / Autor do Projeto

> Define a infraestrutura de publicação e automação de deploys baseada na Vercel + GitHub Integration como plataforma de referência oficial do MVP.

---

## 1. Contexto (Context)

A entrega de um website institucional para clientes exige uma infraestrutura de hospedagem segura, globalmente distribuída e automatizada, reduzindo o esforço manual do desenvolvedor a cada atualização de código ou conteúdo .

A solução de infraestrutura precisa atender aos seguintes pilares:

1. **Integração e Entrega Contínuas (CI/CD):** Compilação e deploy automáticos sincronizados com o repositório do GitHub e com o Keystatic CMS.

2. **Infraestrutura de Baixo Custo / Custo Otimizado:** Viabilidade financeira para manter múltiplos sites institucionais pequenos e médios priorizando custos reduzidos e ausência de despesas fixas para a agência/desenvolvedor.

3. **Ambiente de Homologação (*Preview Deployments*):** Capacidade de gerar links temporários para apresentar alterações ao cliente antes de publicar no domínio principal.

---

## 2. Decisão (Decision)

Decidimos utilizar a **Vercel** como a plataforma de referência oficial de hospedagem, distribuição em Borda (*Edge CDN*) e automação de CI/CD para o MVP do projeto.

### Justificativas Principais:

1. **Suporte Nativo ao Next.js:** Como desenvolvedores e mantenedores do Next.js, a Vercel oferece suporte imediato e sem atrito a todas as funcionalidades do App Router, Server Actions e otimização automática de imagens (`next/image`) sem a necessidade de compiladores ou adaptadores adicionais de runtime.

2. **Fluxo de CI/CD Zero-Config:** A conexão com o repositório GitHub dispara *builds* automáticos a cada `git push` no branch `main` e gera links de *Preview* para cada *Pull Request*.

3. **Certificados SSL e CDN Globais:** Distribuição estática automatizada em servidores de borda (*Edge*) com HTTPS/SSL renovado automaticamente sem custo.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

* **Zero Manutenção de Servidores:** Elimina a necessidade de configurar e atualizar servidores web (Nginx, Apache, instâncias Linux VPS).

* **Agilidade no Fechamento de Validações:** Envio imediato do link de *preview* para validação e aceite do cliente final.

* **Alta Disponibilidade:** Resiliência contra picos de tráfego sem queda de serviço.

### Negativas (Riscos e Desvantagens Aceitas):

* **Vendor Lock-in Sutil:** Migrar a infraestrutura do Next.js da Vercel para um servidor VPS tradicional/Docker no futuro exigirá a reconfiguração manual de rotas de cache, servidores Node.js em execução e otimização de mídias.

* **Conformidade de Licença e Custos da Vercel (Hobby vs. Pro):** O plano gratuito (Hobby) da Vercel restringe estritamente o uso a fins pessoais e não comerciais. Para projetos corporativos/comerciais de clientes pagantes, a política de conformidade exige o plano Pro ($20/mês por assento). A estratégia adotada é a transferência mandatória de titularidade: o cliente mantém a conta e assume o faturamento direto com seus próprios dados de cobrança, preservando a agência/desenvolvedor de custos de terceiros.

---

## 4. Alternativas Consideradas

* **Netlify:** Excelente plataforma de JAMstack, mas descartada como primeira opção devido ao suporte nativo mais ágil da Vercel para as atualizações contínuas do ecossistema Next.js.

* **Hospedagem VPS / Servidor Linux próprio (DigitalOcean, AWS EC2):** Descartada por introduzir custos fixos e exigir gerenciamento manual de servidor, segurança, SSL e configurações de Nginx.

* **Cloudflare Pages (Alternativa para Expansão Pós-MVP):** Plataforma viável para clientes que exigem operação comercial sem custos de assento, já que o plano gratuito da Cloudflare permite uso comercial. Contudo, não é um substituto *plug-and-play* imediato: exige adaptação do build via runtime Edge/OpenNext (`@cloudflare/next-on-pages`), testes rigorosos de compatibilidade com Server Actions, APIs Node e loader customizado de imagens. Por isso, a Vercel é a única plataforma de referência do MVP, ficando a Cloudflare reservada para uma trilha de implantação documentada e validada separadamente.

---
