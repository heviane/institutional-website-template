import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Termos e Condições de Uso do website da ${siteConfig.legal.companyName}.`,
};

export default function TermsOfUsePage() {
  const { legal, contact } = siteConfig;

  return (
    <article className="max-w-4xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-foreground">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Termos de Uso
        </h1>
        <p className="text-muted-foreground text-sm">
          Última atualização: Outubro de 2026 • Condições gerais aplicáveis ao uso deste website institucional.
        </p>
      </header>

      <div className="space-y-10 leading-relaxed text-muted-foreground text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e navegar por este website institucional, de titularidade de{" "}
            <strong className="text-foreground">{legal.companyName}</strong>, inscrita no CNPJ sob o nº{" "}
            <strong className="text-foreground">{legal.cnpj}</strong>, você concorda expressamente em cumprir e vincular-se a estes Termos de Uso e à nossa Política de Privacidade.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Finalidade do Portal</h2>
          <p>
            Este portal tem caráter primordialmente institucional e informativo, visando apresentar as soluções corporativas, serviços prestados, valores e canais oficiais de comunicação da nossa organização.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Propriedade Intelectual</h2>
          <p>
            Todos os textos, marcas, logotipos, identidades visuais, códigos-fonte, fotografias e ilustrações disponibilizados neste site são protegidos pelas leis de propriedade intelectual vigentes no Brasil e pertencem com exclusividade à {legal.companyName} ou a licenciadores autorizados. É proibida qualquer reprodução, distribuição ou modificação sem prévia autorização por escrito.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Uso Adequado e Segurança</h2>
          <p>
            O usuário compromete-se a utilizar este site de maneira lícita e ética, abstendo-se de praticar atos que possam causar sobrecarga, indisponibilidade ou violação dos mecanismos de segurança do servidor, bem como de utilizar ferramentas automatizadas (bots, scrapers) para extração de dados não autorizada.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Limitação de Responsabilidade</h2>
          <p>
            Empregamos nossos melhores esforços para manter as informações deste site sempre atualizadas e precisas. No entanto, não nos responsabilizamos por eventuais indisponibilidades técnicas momentâneas decorrentes de falhas em conexões de telecomunicações ou manutenção de servidores de terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Foro e Legislação Aplicável</h2>
          <p>
            Estes Termos de Uso são regidos e interpretados em conformidade com as leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias oriundas da utilização deste website, fica eleito o foro da comarca da sede da empresa, com renúncia expressa a qualquer outro.
          </p>
          <p>
            Dúvidas ou solicitações podem ser encaminhadas diretamente ao nosso e-mail de contato:{" "}
            <a href={`mailto:${contact.email}`} className="text-primary underline underline-offset-4 hover:opacity-80">
              {contact.email}
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}

