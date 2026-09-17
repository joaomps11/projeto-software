// Opções institucionais e template do formulário de submissão (mock, Sprint 3).
// Centralizados para facilitar a futura integração com API/DB (ver [[Decisões do Projeto]]).

export const steps = [
  { id: "identificacao", label: "Identificação Geral" },
  { id: "impacto", label: "Linha, Impacto e ODS" },
  { id: "equipe", label: "Equipe e Vagas" },
  { id: "trabalho", label: "Plano de Trabalho" },
  { id: "orcamento", label: "Orçamento & Anexos" },
  { id: "revisao", label: "Revisão e Envio" }
];

export const centers = [
  "ICST - Inst. de Ciências Sociais Aplicadas",
  "ICB - Inst. de Ciências Biológicas e Saúde",
  "ICT - Inst. de Ciências Exatas e Tecnologia",
  "IH - Inst. Humanitas de Direitos Humanos"
];

export const editais = [
  { value: "pibex-2025", label: "Edital PIBEX UNICAP 2025/2026" },
  { value: "proext-recife", label: "Edital PROEXT Inovação Social 2024.2" },
  { value: "fasa-comunidade", label: "Fundo FASA de Extensão Solidária" },
  { value: "livre", label: "Ação Não Vinculada a Bolsas" }
];

export const modalities = [
  { value: "programa", label: "Programa", icon: "account_tree" },
  { value: "projeto", label: "Projeto", icon: "assignment" },
  { value: "curso", label: "Curso / Oficina", icon: "school" },
  { value: "evento", label: "Evento", icon: "event" },
  { value: "servico", label: "Prestação Serv.", icon: "handshake" }
];

export const thematicLines = [
  "Educação e Cidadania",
  "Saúde e Bem-Estar Coletivo",
  "Meio Ambiente e Sustentabilidade",
  "Cultura e Patrimônio",
  "Direitos Humanos e Justiça Social",
  "Tecnologia e Inclusão Digital"
];

export const odsOptions = [
  { value: "1", label: "Erradicação Pobreza" },
  { value: "2", label: "Fome Zero" },
  { value: "3", label: "Saúde e Bem-Estar" },
  { value: "4", label: "Educação Qualidade" },
  { value: "5", label: "Igualdade Gênero" },
  { value: "8", label: "Trabalho Decente" },
  { value: "10", label: "Redução Desigualdades" },
  { value: "11", label: "Cidades Sustentáveis" },
  { value: "16", label: "Paz, Justiça e Inst." },
  { value: "17", label: "Parcerias e Meios" }
];

export const teamRoles = [
  { value: "bolsista", label: "Bolsista PIBEX" },
  { value: "voluntario", label: "Voluntário" },
  { value: "docente", label: "Docente colaborador" },
  { value: "comunidade", label: "Parceiro comunitário" }
];

export const deliverables = [
  { value: "relatorio_parcial", label: "Relatório parcial (semestral)" },
  { value: "relatorio_final", label: "Relatório final de extensão" },
  { value: "lista_frequencia", label: "Listas de frequência mensais" },
  { value: "produto_social", label: "Produto social / artigo / podcast" }
];

export const budgetCategories = [
  { value: "bolsas", label: "Bolsas de extensão" },
  { value: "material", label: "Material de consumo" },
  { value: "transporte", label: "Transporte / deslocamento" },
  { value: "divulgacao", label: "Divulgação e eventos" }
];

export const annexRules = {
  maxFiles: 5,
  // em MB
  maxFileMb: 10,
  acceptedTypes: ["application/pdf", "image/png", "image/jpeg"],
  acceptedExtensions: [".pdf", ".png", ".jpg", ".jpeg"]
};

export function createEmptySubmission() {
  return {
    // Etapa 1 — Identificação
    title: "",
    edital: "pibex-2025",
    center: centers[0],
    modality: "projeto",
    // Etapa 2 — Impacto e ODS
    thematicLine: thematicLines[0],
    ods: [],
    socialJustification: "",
    // Etapa 3 — Equipe e vagas
    bolsistas: 0,
    voluntarios: 0,
    expectedAudience: 0,
    teamMembers: [],
    // Etapa 4 — Plano de trabalho
    objectives: "",
    activities: "",
    timeline: "",
    selectedDeliverables: [],
    // Etapa 5 — Orçamento e anexos
    budget: [
      { category: "bolsas", amount: 0 },
      { category: "material", amount: 0 },
      { category: "transporte", amount: 0 },
      { category: "divulgacao", amount: 0 }
    ],
    partnerName: "",
    attachments: [],
    // Etapa 6 — Revisão
    compliance: {
      cne: false,
      forproex: false,
      lgpd: false,
      autorizacao: false
    }
  };
}
