export function formatCurrency(value) {
  if (value == null || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(d);
}

export function formatRelativeDate(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 30) return `${days} dias atrás`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 mês atrás";
  return `${months} meses atrás`;
}

export function truncate(str, length = 120) {
  if (!str) return "";
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural || `${singular}s`;
}

export function formatPercentage(value) {
  if (value == null || isNaN(value)) return "0%";
  return `${Math.round(value)}%`;
}
