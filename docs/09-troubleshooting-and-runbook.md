# 09 - Guia de Resolução de Problemas e Runbook de Incidentes (Troubleshooting)

Este documento centraliza procedimentos padronizados de diagnóstico rápido, análise de causa-raiz e remediação para falhas operacionais e de desenvolvimento no **`institutional-website-template`**. Foi elaborado para orientar o desenvolvedor em momentos de emergência técnica ("o que fazer quando algo falha às 22h") e acelerar o onboarding de novos engenheiros.

---

## 🎯 1. Filosofia de Diagnóstico Sistemático

Ao se deparar com qualquer comportamento anômalo em ambiente local ou de produção:

1. **Isole a Camada do Problema:** Determine se a falha é de **Build/Compilação** (Zod, TypeScript, Next.js), de **Runtime Serverless** (Server Actions, Rate Limit, Resend) ou de **Cliente/Navegador** (Hydration, Turnstile, DOM).
2. **Consulte os Logs Canônicos:**
   - **Ambiente Local:** Terminal do servidor Next.js (`npm run dev`) e Console do Navegador (F12).
   - **Produção:** Painel de _Runtime Logs_ na Vercel (ou Cloudflare Pages) e Dashboard de requisições no Upstash Redis e Resend API.
3. **Nunca Fragilize os Quality Gates:** Se um erro ocorrer durante testes ou build, corrija a causa-raiz no código ou na configuração; nunca desabilite verificações estritas para forçar o deploy.

---

## 📬 2. Problemas no Formulário de Contato e Server Actions (`src/app/actions/contact.ts`)

### 2.1. O formulário retorna "Limite de envios atingido. Tente novamente mais tarde."

- **Sintoma:** O usuário recebe a mensagem amigável de rate limit mesmo na primeira tentativa ou em testes consecutivos legítimos.
- **Causas Prováveis:**
  1. O IP da rede local de testes realizou mais de 5 tentativas dentro da janela de 1 hora (3.600s).
  2. Todos os IPs locais foram agrupados sob o identificador de contingência `"127.0.0.1"` por ausência de headers reais de proxy (`x-forwarded-for` ou `cf-connecting-ip`).
  3. No modo Upstash Redis (`serverEnv.UPSTASH_REDIS_REST_URL` configurado), o limite por hash de IP atingiu o teto.
- **Ação Imediata (Resolução):**
  - **Em Desenvolvimento:** Aguarde a expiração natural da janela ou reinicie o servidor local para limpar o mapa em memória (`memoryStore`), caso não esteja conectado ao Redis.
  - **No Upstash Redis (Produção/Staging):** Acesse o console do Upstash Redis, procure pelas chaves prefixadas com `rate_limit:contact:` e remova a chave correspondente ao hash do IP de teste com o comando `DEL rate_limit:contact:<hash>`.
  - **No Modo Lite (ADR 0012):** Lembre-se de que instâncias serverless locais mantêm contadores em memória efêmeros por nó de execução.

---

### 2.2. O formulário é submetido, mas o e-mail não chega à caixa postal

- **Sintoma:** O formulário exibe tela de sucesso (`"Mensagem enviada com sucesso!"`), mas o destinatário comercial não recebe a mensagem.
- **Causas Prováveis:**
  1. A chave `RESEND_API_KEY` é inválida, foi revogada ou pertence a uma conta sem domínio verificado.
  2. O endereço remetente `RESEND_FROM_EMAIL` utiliza um domínio que não foi autenticado com registros DNS (SPF, DKIM e DMARC) no painel do Resend.
  3. A cota diária do plano gratuito do Resend (100 e-mails/dia) foi esgotada.
  4. A mensagem caiu na pasta de Spam/Lixo Eletrônico do destinatário.
- **Passo a Passo de Investigação:**
  1. Acesse o **Dashboard do Resend** (`https://resend.com/emails`) e inspecione a aba _Emails_.
  2. Se o e-mail constar como **`Delivered`**, o problema é filtro do cliente de e-mail destinatário (solicite verificação de regras de spam corporativas).
  3. Se constar como **`Bounced`** ou **`Failed`**, verifique se o domínio configurado em `RESEND_FROM_EMAIL` possui status de DNS verificado no Resend.
  4. Se não constar nenhuma tentativa no log do Resend, consulte os _Runtime Logs_ da Vercel para identificar se a requisição falhou no Rate Limit, no Honeypot ou no Cloudflare Turnstile antes de acionar a API do Resend.

---

### 2.3. Erro de validação do Cloudflare Turnstile ("Verificação de segurança falhou")

- **Sintoma:** O envio é rejeitado com mensagem de falha no desafio de bot.
- **Causas Prováveis:**
  1. Descompasso entre a chave pública (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) e o segredo privado (`TURNSTILE_SECRET_KEY`).
  2. O domínio onde a aplicação está rodando não está autorizado na lista de domínios permitidos no painel do Cloudflare Turnstile.
  3. O widget do Turnstile expirou no cliente antes de o usuário clicar em "Enviar Mensagem" (o token tem validade de poucos minutos).
- **Ação Imediata (Resolução):**
  - Para testes locais, utilize as chaves de teste oficiais fornecidas pela Cloudflare (que sempre passam):
    - Site Key: `1x00000000000000000000AA`
    - Secret Key: `1x0000000000000000000000000000000AA`
  - Ou desabilite temporariamente a verificação definindo `NEXT_PUBLIC_ENABLE_TURNSTILE="false"` no `.env.local`.

---

## 🏗️ 3. Problemas de Build e Variáveis de Ambiente (`src/env/`)

### 3.1. `next build` falha com `Invalid environment variables: Required`

- **Sintoma:** O build aborta antes da compilação com um erro originado do schema Zod em `src/env/server.ts` ou `src/env/client.ts`.
- **Causa Fundamental:**
  - O Next.js 16 executa a **pré-renderização estática (Static Prerender)** de todas as rotas durante o `next build`. Se uma rota importar código protegido por validação de ambiente, o Zod executará a validação no momento do build.
  - Se o ambiente de compilação (ex.: CI no GitHub Actions ou máquina local sem `.env.local` preenchido) não possuir as credenciais de produção, o Zod lançará exceção e interromperá o processo.
- **Ação Imediata (Resolução):**
  - Se estiver executando build em ambiente sem chaves de terceiros configuradas, garanta que o `.env.local` defina `NEXT_PUBLIC_ENABLE_TURNSTILE="false"`, permitindo que os schemas de Turnstile e serviços externos operem em conformidade com o **Modo Lite (ADR 0012)**.
  - No CI (`.github/workflows/ci.yml`), verifique se as variáveis mínimas de stub estão mapeadas no step de build (conforme configurado no pipeline canônico).

---

### 3.2. Erro `import "server-only"` em componentes do cliente

- **Sintoma:** Mensagem de erro durante a compilação:
  ```text
  You're importing a component that needs "server-only". That only works in a Server Component which is not supported in the client module graph.
  ```
- **Causa Fundamental:**
  - Algum arquivo marcado com `'use client'` (ou uma dependência dele) importou direta ou indiretamente o módulo [`src/env/server.ts`](../src/env/server.ts).
- **Ação Imediata (Resolução):**
  - Componentes do cliente NUNCA devem importar `src/env/server.ts`.
  - Se o componente precisar ler configurações públicas (como URLs ou chaves de widgets), importe exclusivamente [`src/env/client.ts`](../src/env/client.ts) (`clientEnv`).
  - Se precisar disparar ações com segredos, invoque a Server Action correspondente (`sendContactEmail`) em vez de tentar ler credenciais na UI.

---

### 3.3. Erro de Divergência de Hidratação (_Hydration Mismatch_)

- **Sintoma:** Aviso em vermelho no console do navegador em desenvolvimento:
  ```text
  Warning: Text content did not match. Server: "..." Client: "..."
  ```
- **Causas Prováveis:**
  1. Uso de datas dinâmicas sem formatação estática (ex.: `new Date().getFullYear()` calculado de forma diferente entre fuso de servidor e cliente).
  2. Acesso direto a APIs do navegador (`window.innerWidth`, `localStorage`, `navigator.userAgent`) durante a renderização inicial sem proteção de `useEffect`.
  3. Extensões do navegador (como tradutores automáticos, LastPass ou formatadores de gramática) alterando o DOM antes do React hidratar.
- **Ação Imediata (Resolução):**
  - Para o ano de copyright, o template utiliza o valor dinâmico centralizado em [`src/components/shared/footer/footer.tsx`](../src/components/shared/footer/footer.tsx) renderizado como Server Component puro, imune a erros de hidratação.
  - Para valores que obrigatoriamente dependam do cliente, utilize o padrão de montagem adiada:
    ```tsx
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);
    if (!isMounted) return null;
    ```

---

## 🗄️ 4. Problemas com o Keystatic CMS (`/keystatic`)

### 4.1. O painel administrativo retorna 404 em produção

- **Sintoma:** Acessar `https://meusite.com.br/keystatic` resulta em página Não Encontrada.
- **Causa Fundamental:**
  - O Keystatic precisa de duas rotas configuradas no App Router: o endpoint de API HTTP em `src/app/api/keystatic/[...params]/route.ts` e a página SPA do painel em `src/app/keystatic/[[...params]]/page.tsx`.
- **Ação Imediata (Resolução):**
  - Verifique se ambos os arquivos existem e se o `keystatic.config.ts` na raiz está exportando a configuração padrão.
  - Verifique se as variáveis `KEYSTATIC_SECRET` e `NEXT_PUBLIC_KEYSTATIC_PROJECT` estão configuradas no painel da Vercel.

---

### 4.2. Erro de autenticação do GitHub / Keystatic Cloud

- **Sintoma:** O editor clica para fazer login no painel e recebe mensagem de `Bad Request` ou erro de callback no GitHub.
- **Causas Prováveis:**
  1. A URL de callback no GitHub App ou no Keystatic Cloud não corresponde ao domínio de produção configurado.
  2. O repositório remoto está com branch protection em `main` que impede commits diretos vindos da integração do Keystatic Cloud.
- **Ação Imediata (Resolução):**
  - Acesse as configurações da sua organização no Keystatic Cloud e confirme se a URL permitida inclui tanto `https://seu-dominio.com.br` quanto URLs de preview da Vercel.
  - Para equipes com branch protection estrita, configure o Keystatic Cloud para criar Pull Requests em vez de realizar commits diretos na `main` ([ADR 0006](adr/0006-autenticacao-cms-e-gestao-de-midia.md)).

---

## 📊 5. Matriz Rápida: Sintoma ➔ Causa ➔ Ação Imediata

| Sintoma Observado                              | Provável Causa                                   | Ação Imediata                                                              |
| :--------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------- |
| **Erro 429 no envio de formulário**            | Janela de Rate Limit excedida                    | Aguardar 1h ou deletar chave no Upstash (`DEL rate_limit:contact:<hash>`). |
| **Sucesso na tela, mas e-mail não chega**      | Domínio não verificado no Resend / Cota esgotada | Inspecionar dashboard do Resend e registros DNS (SPF/DKIM).                |
| **Build falha por falta de variáveis no CI**   | Validação Zod estrita no Static Prerender        | Definir `NEXT_PUBLIC_ENABLE_TURNSTILE="false"` no ambiente ou stub no CI.  |
| **Erro de compilação com `server-only`**       | Importação indevida de `src/env/server.ts` na UI | Mudar importação para `src/env/client.ts` ou delegar para Server Action.   |
| **Desafio do Turnstile falha permanentemente** | Chaves inválidas ou domínio não cadastrado       | Usar chaves de teste da Cloudflare ou desabilitar no `.env.local`.         |
| **Painel `/keystatic` em branco ou 404**       | Rotas do App Router ausentes ou sem envs         | Verificar arquivos em `src/app/api/keystatic/` e `src/app/keystatic/`.     |
