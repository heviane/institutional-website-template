import { config, fields, collection, singleton } from "@keystatic/core";

const isProduction = process.env.NODE_ENV === "production";
const keystaticProject = process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT;

export default config({
  storage:
    isProduction && keystaticProject
      ? {
          kind: "cloud",
        }
      : {
          kind: "local",
        },
  ...(keystaticProject ? { cloud: { project: keystaticProject } } : {}),
  collections: {
    posts: collection({
      label: "Artigos do Blog",
      slugField: "title",
      path: "content/posts/*/",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Título da Postagem" } }),
        status: fields.select({
          label: "Status de Publicação",
          options: [
            { label: "Publicado", value: "published" },
            { label: "Rascunho", value: "draft" },
          ],
          defaultValue: "draft",
        }),
        publishedDate: fields.date({
          label: "Data de Publicação",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        summary: fields.text({
          label: "Resumo (Meta Description)",
          multiline: true,
          validation: { isRequired: true },
        }),
        coverImage: fields.image({
          label: "Imagem de Capa",
          directory: "public/images/content/posts",
          publicPath: "/images/content/posts",
        }),
        author: fields.text({ label: "Nome do Autor" }),
        content: fields.markdoc({
          label: "Conteúdo do Artigo",
          options: {
            heading: [2, 3, 4],
            blockquote: true,
            table: true,
            link: true,
          },
        }),
      },
    }),
    services: collection({
      label: "Serviços Oferecidos",
      slugField: "title",
      path: "content/services/*",
      format: "json",
      schema: {
        title: fields.slug({ name: { label: "Nome do Serviço" } }),
        icon: fields.text({
          label: "Ícone Lucide",
          description:
            "Nome do ícone da biblioteca Lucide (ex.: Briefcase, ShieldCheck, TrendingUp)",
          validation: { isRequired: true },
        }),
        shortDescription: fields.text({
          label: "Descrição Sucinta",
          multiline: true,
          validation: { isRequired: true },
        }),
        features: fields.array(fields.text({ label: "Benefício / Diferencial" }), {
          label: "Diferenciais do Serviço",
          itemLabel: (props) => props.value,
        }),
      },
    }),
    testimonials: collection({
      label: "Depoimentos de Clientes",
      slugField: "clientName",
      path: "content/testimonials/*",
      format: "json",
      schema: {
        clientName: fields.slug({ name: { label: "Nome do Cliente" } }),
        companyOrRole: fields.text({ label: "Empresa ou Cargo" }),
        avatar: fields.image({
          label: "Foto de Perfil",
          directory: "public/images/content/testimonials",
          publicPath: "/images/content/testimonials",
        }),
        quote: fields.text({
          label: "Depoimento",
          multiline: true,
          validation: { isRequired: true },
        }),
        rating: fields.integer({
          label: "Avaliação (Estrelas de 1 a 5)",
          defaultValue: 5,
          validation: { min: 1, max: 5 },
        }),
      },
    }),
    faqs: collection({
      label: "Perguntas Frequentes (FAQs)",
      slugField: "question",
      path: "content/faqs/*",
      format: "json",
      schema: {
        question: fields.slug({ name: { label: "Pergunta" } }),
        answer: fields.markdoc({ label: "Resposta" }),
        order: fields.integer({ label: "Ordem de Exibição", defaultValue: 1 }),
      },
    }),
  },
  singletons: {
    homePage: singleton({
      label: "Página Inicial (Home)",
      path: "content/singletons/home",
      format: "json",
      schema: {
        heroHeadline: fields.text({
          label: "Título de Impacto (Headline)",
          validation: { isRequired: true },
        }),
        heroSubheadline: fields.text({
          label: "Subtítulo da Proposta de Valor",
          multiline: true,
          validation: { isRequired: true },
        }),
        primaryCtaLabel: fields.text({
          label: "Rótulo do Botão Principal",
          validation: { isRequired: true },
        }),
        primaryCtaLink: fields.text({
          label: "Destino do Botão Principal",
          validation: { isRequired: true },
        }),
        showTestimonials: fields.checkbox({
          label: "Exibir Seção de Depoimentos",
          defaultValue: true,
        }),
      },
    }),
    aboutPage: singleton({
      label: "Página Sobre a Empresa",
      path: "content/singletons/about",
      format: "json",
      schema: {
        mission: fields.text({
          label: "Missão",
          multiline: true,
          validation: { isRequired: true },
        }),
        vision: fields.text({ label: "Visão", multiline: true, validation: { isRequired: true } }),
        values: fields.array(fields.text({ label: "Valor" }), {
          label: "Valores Centrais",
          itemLabel: (props) => props.value,
        }),
        story: fields.markdoc({ label: "Nossa História / Trajetória" }),
      },
    }),
  },
});
