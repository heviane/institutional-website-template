import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Política de Privacidade e Proteção de Dados da ${siteConfig.legal.companyName}. Em conformidade com a LGPD (Lei nº 13.709/2018).`,
};

export default function PrivacyPolicyPage() {
  const { legal, contact } = siteConfig;
  const isTurnstileActive = legal.services?.turnstile !== false;
  const isPlausibleActive = legal.services?.plausible === true;
  const isGoogleAnalyticsActive = legal.services?.googleAnalytics === true;

  return (
    <article className="max-w-4xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-foreground">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Política de Privacidade & Proteção de Dados
        </h1>
        <p className="text-muted-foreground text-sm">
          Última atualização: Outubro de 2026 • Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
        </p>
      </header>

      <div className="space-y-10 leading-relaxed text-muted-foreground text-base">
        {/* Seção 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Identificação do Controlador de Dados</h2>
          <p>
            Esta plataforma é mantida e operada por <strong className="text-foreground">{legal.companyName}</strong>, pessoa jurídica de direito privado inscrita no CNPJ sob o nº <strong className="text-foreground">{legal.cnpj}</strong>, com sede em {contact.address}.
          </p>
          <p>
            Para assuntos relacionados à privacidade, tratamento de dados ou exercício de direitos de titular, nosso Encarregado de Proteção de Dados (DPO) pode ser contatado diretamente através do e-mail:{" "}
            <a href={`mailto:${legal.dpoEmail}`} className="text-primary underline underline-offset-4 hover:opacity-80">
              {legal.dpoEmail}
            </a>.
          </p>
        </section>

        {/* Seção 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Arquitetura Zero-Database e Efemeridade das Mensagens</h2>
          <p>
            Nosso portal opera sob o princípio da <em>Arquitetura Sem Banco de Dados</em> (<em>Zero-Database Architecture</em>). Não mantemos bancos de dados relacionais (SQL) ou não-relacionais (NoSQL) persistindo cadastros ou conteúdos enviados no formulário de contato.
          </p>
          <p>
            As mensagens enviadas por meio de nosso formulário de contato são transmitidas de forma puramente transitória e efêmera para o correio eletrônico corporativo de nossa equipe comercial, sendo processadas exclusivamente para fins de atendimento pré-contratual e resposta à sua solicitação direta.
          </p>
        </section>

        {/* Seção 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Provedores de Infraestrutura e Subprocessadores</h2>
          <p>
            Para garantir alta disponibilidade, segurança e entrega transacional confiável, contamos com os seguintes parceiros de infraestrutura de nuvem:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground">Vercel Inc.:</strong> Responsável pelo roteamento de borda e hospedagem da aplicação em rede serverless de alta performance.
            </li>
            <li>
              <strong className="text-foreground">Resend Inc. / Amazon Web Services (AWS):</strong> Plataforma de despacho transacional seguro que encaminha os e-mails recebidos do formulário diretamente para a nossa caixa postal com criptografia TLS 1.3 em trânsito.
            </li>
            <li>
              <strong className="text-foreground">Upstash Inc.:</strong> Provedor de infraestrutura de contenção temporária de rajadas e mitigação de robôs maliciosos. Para prevenção de ataques de negação de serviço (DoS), o endereço IP do visitante passa por um processo de <strong>pseudonimização técnica estrita por hash HMAC (Art. 13, § 4º da LGPD)</strong> com segredo seguro de servidor, sendo armazenado com auto-expiração atômica de curto prazo (TTL de 1 hora) e nunca em texto claro.
            </li>
          </ul>
        </section>

        {/* Seção 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Transferência Internacional de Dados (Art. 33 da LGPD)</h2>
          <p>
            Informamos que os servidores dos provedores de tecnologia parceiros (Vercel, AWS/Resend e Upstash) estão localizados nos Estados Unidos da América. A transferência internacional é realizada estritamente sob as hipóteses previstas no <strong>Artigo 33 da Lei nº 13.709/2018 (LGPD)</strong>, mediante adoção de salvaguardas contratuais rigorosas, criptografia avançada e padrões técnicos internacionais de segurança da informação.
          </p>
        </section>

        {/* Seção 5 - Serviços Condicionais */}
        {isTurnstileActive ? (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Mecanismo de Proteção Anti-Spam (Cloudflare Turnstile)</h2>
            <p>
              Utilizamos o serviço <strong>Cloudflare Turnstile</strong> para proteger nossos formulários contra automações maliciosas, ataques de força bruta e envio indiscriminado de spam. O Turnstile opera como uma alternativa inteligente e preservadora de privacidade aos tradicionais captchas interativos, avaliando sinais não-intrusivos de navegação sem ler dados pessoais confidenciais do usuário.
            </p>
          </section>
        ) : null}

        {isPlausibleActive ? (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Métricas e Estatísticas Sem Cookies (Plausible Analytics)</h2>
            <p>
              Utilizamos a plataforma Plausible Analytics para análise agregada e anônima de tráfego, sem coletar identificadores persistentes e sem rastreamento entre sites (cross-site tracking).
            </p>
          </section>
        ) : null}

        {isGoogleAnalyticsActive ? (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Métricas de Acesso (Google Analytics)</h2>
            <p>
              Utilizamos o Google Analytics para entender o perfil de navegação e aprimorar nossos serviços digitais.
            </p>
          </section>
        ) : null}

        {/* Seção 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Seus Direitos como Titular de Dados Pessoais</h2>
          <p>
            Nos termos do Artigo 18 da LGPD, você possui o direito de confirmar a existência de tratamento, acessar seus dados, solicitar a correção de dados incompletos ou inexatos, requerer a eliminação de dados desnecessários e revogar consentimentos previamente concedidos.
          </p>
          <p>
            Para exercer quaisquer desses direitos, envie uma mensagem para o nosso Encarregado pelo e-mail{" "}
            <a href={`mailto:${legal.dpoEmail}`} className="text-primary underline underline-offset-4 hover:opacity-80">
              {legal.dpoEmail}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}

