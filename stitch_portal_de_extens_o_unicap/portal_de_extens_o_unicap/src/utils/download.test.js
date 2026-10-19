import { describe, it, expect, vi, afterEach } from "vitest";
import { escapeCsvValue, toCsv, downloadTextFile } from "./download";

describe("utils/download — exportação de arquivos", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete URL.createObjectURL;
    delete URL.revokeObjectURL;
  });

  it("escapa campos CSV com vírgula, aspa ou quebra de linha", () => {
    expect(escapeCsvValue("texto simples")).toBe("texto simples");
    expect(escapeCsvValue("a,b")).toBe('"a,b"');
    expect(escapeCsvValue('diz "oi"')).toBe('"diz ""oi"""');
    expect(escapeCsvValue("linha1\nlinha2")).toBe('"linha1\nlinha2"');
    expect(escapeCsvValue(null)).toBe("");
    expect(escapeCsvValue(12)).toBe("12");
  });

  it("gera CSV com BOM, cabeçalho e separador ponto e vírgula", () => {
    const csv = toCsv(["Nome", "Valor"], [["Alpha", "1;2"]]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Nome;Valor");
    expect(csv).toContain('Alpha;"1;2"');
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("dispara o download com Blob, nome de arquivo e object URL", async () => {
    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    let clickedName = null;
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function click() {
      clickedName = this.download;
    });

    const filename = downloadTextFile("relatorio.csv", "conteudo", "text/csv;charset=utf-8");

    expect(filename).toBe("relatorio.csv");
    expect(clickedName).toBe("relatorio.csv");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(createObjectURL.mock.calls[0][0].type).toContain("text/csv");

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});
