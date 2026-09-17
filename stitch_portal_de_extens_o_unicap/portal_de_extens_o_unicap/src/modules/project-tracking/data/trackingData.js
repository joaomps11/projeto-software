// Dados de exemplo (mock) do módulo de acompanhamento — Sprint 4.
// Centralizados para facilitar a futura troca por API/DB (ver [[Decisões do Projeto]]).

export const project = {
  code: "EXT-2025-042",
  title: "Clínica de Direitos Humanos e Cidadania Dom Helder Câmara",
  status: "active",
  coordinator: "Profa. Dra. Ana Silva",
  center: "Ciências Jurídicas",
  ods: "16",
  edital: "PIBEX 2024-2025",
  start: "2025-03-01",
  end: "2026-02-28",
  hours: 120,
  expectedMonthlyHours: 30,
  team: 4,
  beneficiaries: "240+"
};

export const students = [
  {
    id: 1,
    name: "Lucas Andrade Bezerra",
    mat: "2022104928",
    course: "Direito (7º Per.)",
    modality: "PIBEX (R$ 700)",
    totalHours: 120,
    type: "pbex"
  },
  {
    id: 2,
    name: "Mariana Albuquerque Lima",
    mat: "2023101183",
    course: "Direito (5º Per.)",
    modality: "PIBEX (R$ 700)",
    totalHours: 120,
    type: "pbex"
  },
  {
    id: 3,
    name: "Gabriela Dias Vasconcelos",
    mat: "2021203419",
    course: "Serviço Social",
    modality: "Voluntária (Ext.)",
    totalHours: 120,
    type: "voluntary"
  },
  {
    id: 4,
    name: "Rafael Mendes Gusmão",
    mat: "2024109820",
    course: "Jornalismo",
    modality: "Voluntário (Com.)",
    totalHours: 120,
    type: "voluntary"
  }
];

export const months = [
  { id: "2025-03", label: "Março / 2025" },
  { id: "2025-04", label: "Abril / 2025" },
  { id: "2025-05", label: "Maio / 2025" },
  { id: "2025-06", label: "Junho / 2025" },
  { id: "2025-07", label: "Julho / 2025" },
  { id: "2025-08", label: "Agosto / 2025" }
];

// Registros de frequência iniciais: { [monthId]: { [studentId]: { hours, status } } }
export const initialFrequency = {
  "2025-03": {
    1: { hours: 30, status: "homologada" },
    2: { hours: 28, status: "pending" },
    3: { hours: 24, status: "pending" },
    4: { hours: 0, status: "missing" }
  },
  "2025-04": {
    1: { hours: 30, status: "homologada" },
    2: { hours: 26, status: "homologada" },
    3: { hours: 20, status: "pending" },
    4: { hours: 12, status: "pending" }
  },
  "2025-05": {
    1: { hours: 28, status: "pending" },
    2: { hours: 30, status: "pending" },
    3: { hours: 0, status: "missing" },
    4: { hours: 18, status: "pending" }
  }
};

export const milestones = [
  {
    id: 1,
    label: "Início das atividades",
    date: "2025-03-01",
    status: "completed",
    detail: "Equipe formada e comunidade mapeada com a parceria local."
  },
  {
    id: 2,
    label: "Oficinas de capacitação inicial",
    date: "2025-04-15",
    status: "completed",
    detail: "3 turmas iniciadas com 62 participantes."
  },
  {
    id: 3,
    label: "Relatório parcial de extensão",
    date: "2025-06-30",
    status: "current",
    detail: "Entrega prevista ao DEG com dados de frequência consolidados."
  },
  {
    id: 4,
    label: "Avaliação de meio de ciclo",
    date: "2025-08-10",
    status: "upcoming",
    detail: "Reunião técnica com a parceria institucional."
  },
  {
    id: 5,
    label: "Encerramento e relatório final",
    date: "2026-02-28",
    status: "upcoming",
    detail: "Consolidação de produtos sociais e prestação de contas."
  }
];

export const reports = [
  {
    id: 1,
    label: "Relatório Parcial de Extensão",
    period: "Mar–Mai / 2025",
    dueDate: "2025-06-30",
    status: "pending",
    detail: "Aguarda consolidação da frequência de maio e anexos do produto social."
  },
  {
    id: 2,
    label: "Parecer Técnico da Parceria",
    period: "Atividades Abril",
    dueDate: "2025-05-15",
    status: "received",
    detail: "Recebido da Defensoria Pública com recomendações operacionais."
  },
  {
    id: 3,
    label: "Lista de Frequência Consolidada",
    period: "Mar–Abr / 2025",
    dueDate: "2025-05-05",
    status: "approved",
    detail: "Homologada e enviada à Divisão Financeira em 28/04."
  },
  {
    id: 4,
    label: "Relatório Final de Extensão",
    period: "Ciclo 2025–2026",
    dueDate: "2026-02-28",
    status: "future",
    detail: "Será liberado para preenchimento no último mês de vigência."
  }
];
