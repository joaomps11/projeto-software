import { describe, it, expect } from "vitest";
import {
  monthlyProgress,
  cumulativeHours,
  homologateRecord,
  countPendingHomologations,
  monthCompletion,
  HOMOLOGATED,
  PENDING,
  MISSING,
  buildFrequencyCsv
} from "./trackingLogic";
import { initialFrequency, project } from "./data/trackingData";

describe("monthlyProgress", () => {
  it("calcula percentual em relação à carga esperada", () => {
    expect(monthlyProgress({ hours: 30 })).toBe(100);
    expect(monthlyProgress({ hours: 15 })).toBe(50);
  });

  it("limita a 100% mesmo com horas extras dentro da tolerância", () => {
    expect(monthlyProgress({ hours: 31 })).toBe(100);
  });

  it("retorna 0 para registros vazios", () => {
    expect(monthlyProgress(null)).toBe(0);
    expect(monthlyProgress({ hours: 0 })).toBe(0);
  });
});

describe("cumulativeHours", () => {
  it("soma todas as horas do estudante nos meses registrados", () => {
    // estudante 1: 30 (mar) + 30 (abr) + 28 (mai) = 88
    expect(cumulativeHours(initialFrequency, 1)).toBe(88);
  });

  it("retorna 0 para estudante sem registros", () => {
    expect(cumulativeHours(initialFrequency, 999)).toBe(0);
  });
});

describe("homologateRecord", () => {
  it("homologa folha com horas dentro do teto", () => {
    const result = homologateRecord({ hours: 30, status: PENDING });
    expect(result.ok).toBe(true);
    expect(result.status).toBe(HOMOLOGATED);
  });

  it("rejeita homologação com 0 horas", () => {
    const result = homologateRecord({ hours: 0, status: PENDING });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/0 horas/i);
    expect(result.status).toBe(MISSING);
  });

  it("rejeita horas acima do teto mensal", () => {
    const result = homologateRecord({ hours: 45, status: PENDING });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/teto mensal/i);
    expect(result.status).toBe(PENDING);
  });

  it("aceita pequena tolerância acima do teto (até 2h)", () => {
    expect(homologateRecord({ hours: 32, status: PENDING }).ok).toBe(true);
    expect(homologateRecord({ hours: 33, status: PENDING }).ok).toBe(false);
  });

  it("rejeita folha já homologada", () => {
    const result = homologateRecord({ hours: 30, status: HOMOLOGATED });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/já homologada/i);
  });
});

describe("countPendingHomologations", () => {
  it("conta registros pendentes com horas registradas", () => {
    // 2025-03: ids 2 e 3 pendentes com horas; id 4 pendente com 0h (não conta)
    expect(countPendingHomologations(initialFrequency, "2025-03")).toBe(2);
  });

  it("retorna 0 para mês inexistente", () => {
    expect(countPendingHomologations(initialFrequency, "2099-01")).toBe(0);
  });
});

describe("monthCompletion", () => {
  it("calcula percentual de homologados no mês", () => {
    // 2025-04: 2 de 4 homologados = 50%
    expect(monthCompletion(initialFrequency, "2025-04")).toBe(50);
  });

  it("retorna 0 quando nenhum homologado", () => {
    expect(monthCompletion(initialFrequency, "2099-01")).toBe(0);
  });
});

describe("consistência com dados mock", () => {
  it("carga mensal esperada do projeto é positiva", () => {
    expect(project.expectedMonthlyHours).toBeGreaterThan(0);
  });
});

describe("buildFrequencyCsv — exportação da folha", () => {
  const students = [
    {
      id: "s1",
      name: "Ana Souza",
      mat: "20201001",
      course: "Direito",
      modality: "Bolsista PIBEX",
      totalHours: 80
    },
    {
      id: "s2",
      name: "Beto Lima",
      mat: "20201002",
      course: "Psicologia",
      modality: "Voluntário",
      totalHours: 80
    },
    {
      id: "s3",
      name: "Cássia Melo",
      mat: "20201003",
      course: "Serviço Social",
      modality: "Bolsista PIBEX",
      totalHours: 80
    }
  ];

  const sheet = {
    s1: { hours: 30, status: HOMOLOGATED },
    s2: { hours: 0, status: MISSING },
    s3: { hours: 12, status: PENDING }
  };

  it("gera uma linha por discente com horas, previsão e situação", () => {
    const csv = buildFrequencyCsv({
      monthLabel: "Março / 2025",
      expectedHours: 30,
      students,
      sheet,
      totals: { s1: 60, s2: 0, s3: 12 }
    });
    const [header, ...rows] = csv.replace(/^\uFEFF/, "").trim().split("\r\n");

    expect(header).toContain("Discente");
    expect(header).toContain("Horas (Março / 2025)");
    expect(rows).toHaveLength(3);

    expect(rows[0]).toContain("Ana Souza");
    expect(rows[0]).toContain("Homologada");
    expect(rows[1]).toContain("Beto Lima");
    expect(rows[1]).toContain("Sem envio");
    expect(rows[2]).toContain("Cássia Melo");
    expect(rows[2]).toContain("Pendente");
  });

  it("funciona sem registro de folha (trata como sem envio)", () => {
    const csv = buildFrequencyCsv({
      monthLabel: "Abril / 2025",
      expectedHours: 30,
      students: [students[1]],
      sheet: {},
      totals: {}
    });
    const rows = csv.replace(/^\uFEFF/, "").trim().split("\r\n");

    expect(rows).toHaveLength(2);
    expect(rows[1]).toContain("Beto Lima");
    expect(rows[1]).toContain("Sem envio");
  });
});
