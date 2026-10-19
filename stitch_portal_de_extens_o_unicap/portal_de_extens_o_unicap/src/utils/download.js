/**
 * Exportação de arquivos (CSV/TXT) direto no navegador — sem dependências.
 * Usado pelo painel gestor (relatório MEC), acompanhamento (folha de
 * frequência e declaração) e relatórios do projeto.
 */

/** Escapa um valor para uso seguro dentro de um campo CSV. */
export function escapeCsvValue(value) {
  const text = value == null ? "" : String(value);
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Monta o conteúdo CSV a partir de cabeçalho e linhas (separador `;`). */
export function toCsv(headers, rows) {
  const lines = [headers.map(escapeCsvValue).join(";")];
  for (const row of rows) {
    lines.push(row.map(escapeCsvValue).join(";"));
  }
  // BOM para o Excel reconhecer UTF-8 (acentuação da interface).
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

/**
 * Dispara o download de um arquivo de texto no navegador.
 * Usa Blob + object URL (suportado por todos os navegadores modernos).
 */
export function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Libera a URL depois que o clique já foi processado.
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return filename;
}
