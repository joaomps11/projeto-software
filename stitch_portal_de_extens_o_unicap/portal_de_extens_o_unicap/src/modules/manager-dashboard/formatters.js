// Formatação específica do painel gestor (números e meses em pt-BR).

export function formatNumber(value) {
  if (value == null || isNaN(value)) return "0";
  return new Intl.NumberFormat("pt-BR").format(value);
}

const MONTHS_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function monthLabel(date) {
  const d = new Date(date);
  return MONTHS_SHORT[d.getMonth()];
}
