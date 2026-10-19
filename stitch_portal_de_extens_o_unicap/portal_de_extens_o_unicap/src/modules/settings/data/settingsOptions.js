// Dados estáticos de opções da tela de Configurações.

export const PROFILE_LABELS = {
  gestor: "Gestor / Docente",
  estudante: "Estudante / Comunidade"
};

export const DENSITY_LABELS = {
  confortavel: "Confortável",
  compacta: "Compacta"
};

export const NOTIFICATION_OPTIONS = [
  {
    id: "notifyDeadlines",
    title: "Alertas de prazos",
    description: "Avisos de vencimento de relatórios, folhas de frequência e editais."
  },
  {
    id: "notifyHomologacoes",
    title: "Homologações e pareceres",
    description: "Notifica quando o comitê homologa frequências ou emite parecer."
  },
  {
    id: "notifyEditais",
    title: "Novos editais",
    description: "Divulgação de editais PIBEX, PROEXT e cursos da PROPAEXT."
  },
  {
    id: "weeklyDigest",
    title: "Resumo semanal",
    description: "E-mail consolidado de segunda-feira com suas pendências."
  }
];

export const DENSITY_OPTIONS = [
  { id: "confortavel", label: "Confortável (padrão)" },
  { id: "compacta", label: "Compacta (mais linhas por tela)" }
];
