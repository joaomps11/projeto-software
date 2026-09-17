export function required(value, message = "Este campo é obrigatório") {
  if (!value || String(value).trim() === "") {
    return message;
  }
  return null;
}

export function minLength(value, min) {
  if (!value || String(value).trim().length < min) {
    return `Mínimo de ${min} caracteres`;
  }
  return null;
}

export function maxLength(value, max) {
  if (value && String(value).length > max) {
    return `Máximo de ${max} caracteres`;
  }
  return null;
}

export function email(value) {
  if (!value) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(String(value).trim())) {
    return "E-mail inválido";
  }
  return null;
}

export function cpf(value) {
  if (!value) return null;
  const cleaned = String(value).replace(/\D/g, "");
  if (cleaned.length !== 11) return "CPF inválido";
  if (/^(\d)\1{10}$/.test(cleaned)) return "CPF inválido";
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9), 10)) return "CPF inválido";
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10), 10)) return "CPF inválido";
  return null;
}

export function cnpj(value) {
  if (!value) return null;
  const cleaned = String(value).replace(/\D/g, "");
  if (cleaned.length !== 14) return "CNPJ inválido";
  if (/^(\d)\1{13}$/.test(cleaned)) return "CNPJ inválido";
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let remainder = sum % 11;
  remainder = remainder < 2 ? 0 : 11 - remainder;
  if (remainder !== parseInt(cleaned.charAt(12), 10)) return "CNPJ inválido";
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  remainder = sum % 11;
  remainder = remainder < 2 ? 0 : 11 - remainder;
  if (remainder !== parseInt(cleaned.charAt(13), 10)) return "CNPJ inválido";
  return null;
}
