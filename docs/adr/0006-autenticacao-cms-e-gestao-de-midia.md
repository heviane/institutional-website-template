# ADR 0006: Estratégia de Autenticação do CMS em Produção e Gestão de Ativos de Mídia

- **Status:** Aceito
- **Data:** 2026-10-21
- **Decisores:** Engenharia de Software / Autor do Projeto

> Complementa a ADR 0002 definindo o fluxo de acesso e autenticação para clientes não técnicos em ambiente de produção e estabelece a política para evitar o inchaço do repositório Git por arquivos de mídia.

---

## 1. Contexto (Context)

A ADR 0002 definiu o **Keystatic** como o CMS baseado em Git padrão do projeto para eliminar custos fixos de banco de dados e garantir máxima performance via SSG/ISR. No entanto, a operação do CMS em produção com clientes reais impõe dois desafios operacionais e técnicos:

1. **Atrito de Onboarding para Clientes Não Técnicos:**
   No modo tradicional de produção via GitHub (`storage: { kind: 'github' }`), o usuário precisa possuir uma conta no GitHub, autorizar um aplicativo OAuth/GitHub App e ter permissões diretas de escrita (_Write_) no repositório de código-fonte. Esse fluxo é confuso e intimidador para clientes leigos (advogados, médicos, comerciantes) e introduz risco de governança ao conceder acesso ao repositório a usuários externos.

2. **Inchaço do Repositório Git com Arquivos de Mídia (_Git Bloat_):**
   Clientes comumente realizam upload de fotografias de alta resolução (8MB a 15MB) diretamente do smartphone. Em um CMS baseado em Git, armazenar binários pesados no histórico do repositório infla a pasta `.git` rapidamente, tornando os processos de clonagem e os _builds_ de deploy na Vercel lentos, além de arriscar bloqueios pelo limite de tamanho de arquivo do GitHub (máximo de 100MB por arquivo).

---

## 2. Decisão (Decision)

Decidimos adotar uma estratégia em duas frentes para a camada de produção:

### 2.1. Autenticação de Clientes: Keystatic Cloud (Camada Gerenciada Gratuita)

Adotamos o **Keystatic Cloud (Plano Gratuito)** como a rota padrão de autenticação em produção:

- **Acesso por E-mail:** Os editores do cliente são convidados por e-mail e fazem login por _magic link_ ou autenticação simplificada, sem qualquer necessidade de criar conta no GitHub.
- **Isolamento de Código:** Os clientes não precisam de permissões de escrita diretas no repositório. O serviço gerenciado do Keystatic Cloud interage com a API do GitHub e assina os _commits_ de conteúdo automaticamente.
- **Camada Gratuita (Até 3 Editores):** O plano gratuito do Keystatic Cloud atende equipes de até 3 usuários por projeto sem mensalidade, cobrindo integralmente as demandas habituais de sites institucionais pequenos e médios.

> **Fallback Desacoplado:** Caso o cliente prefira independência total de serviços de terceiros, o template mantém suporte total à configuração de um **GitHub App próprio** (`storage: { kind: 'github' }`), onde o desenvolvedor gerencia as credenciais manualmente.

### 2.2. Política de Gestão de Mídias e Imagens

Adotamos uma abordagem proporcional ao volume de conteúdo do projeto:

1. **Sites Institucionais Estáticos (MVP / Volume Baixo de Mídia):**
   - Imagens são salvas localmente no repositório em `/public/images/content/`.
   - **Diretriz de Tamanho Máximo:** Restrição recomendada no schema do Keystatic para uploads de até 1MB por imagem.
   - **Otimização de Entrega:** O componente `next/image` processa, comprime e converte as imagens para WebP/AVIF em tempo de execução na borda.

2. **Projetos com Alta Frequência de Atualização / Blog Ativo (Volume Alto de Mídia):**
   - Os uploads de mídia pesada não são gravados no repositório Git.
   - O template prevê a delegação do armazenamento para provedores externos com camadas gratuitas generosas, como **Cloudinary** (25GB/mês gratuitos com transformações na CDN) ou **Cloudflare R2** / **Vercel Blob**. No CMS, armazena-se apenas a referência (URL) do ativo.

---

## 3. Consequências e Trade-offs (Consequences)

### Positivas (Benefícios):

- **Experiência Amigável para o Cliente:** Elimina o atrito de onboarding do GitHub; o cliente edita o site como se fosse um CMS tradicional de mercado.
- **Segurança e Governança:** O código-fonte, branches protegidos e configurações de CI/CD ficam isolados de modificações acidentais pelo cliente.
- **Preservação da Saúde do Repositório Git:** Evita que o `.git` acumule gigabytes de binários obsoletos, mantendo _clones_ e _deploys_ rápidos.
- **Preservação do Pilar de Baixo Custo:** O Keystatic Cloud é gratuito para até 3 editores, e a estratégia de mídia prioriza tiers gratuitos de CDNs e serviços de armazenamento.

### Negativas (Riscos e Desvantagens Aceitas):

- **Dependência Adicional de Plataforma:** O Keystatic Cloud adiciona uma dependência do serviço operado pela Thinkmill (embora a reversão para o modo GitHub puro requeira apenas a alteração de uma flag no arquivo `keystatic.config.ts`).
- **Limite de Editores no Plano Free:** Se o cliente exigir mais de 3 editores simultâneos no Keystatic Cloud, há um custo de $10/mês para o plano Pro da plataforma.

---

## 4. Alternativas Consideradas

- **Obrigar Uso de Conta GitHub para o Cliente:** Descartado por gerar alto volume de dúvidas operacionais e fricção comercial no pós-venda.
- **Git LFS (Git Large File Storage):** Descartado por adicionar complexidade de configuração, custo adicional de largura de banda e armazenamento no GitHub e dificuldades de integração em pipelines serverless.
- **Migração para CMS Tradicional (Sanity/Strapi):** Descartado para manter os princípios de arquitetura baseada em Git e ausência de banco de dados definidos na ADR 0002.
