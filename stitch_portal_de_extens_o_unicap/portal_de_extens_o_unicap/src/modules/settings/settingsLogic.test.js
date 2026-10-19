import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  validateSettings,
  sanitizeSettings,
  settingsAreEqual,
  settingsAreDefault
} from "./settingsLogic";

describe("settingsLogic — validação e sanitização", () => {
  it("aceita configurações válidas", () => {
    const result = validateSettings({
      ...DEFAULT_SETTINGS,
      displayName: "Maria",
      alternateEmail: "maria@exemplo.br",
      deadlineAlertDays: 5,
      density: "compacta",
      sessionTimeoutMinutes: 60
    });
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejeita e-mail alternativo inválido", () => {
    const result = validateSettings({ ...DEFAULT_SETTINGS, alternateEmail: "quebrado@" });
    expect(result.ok).toBe(false);
    expect(result.errors.alternateEmail).toMatch(/e-mail válido/i);
  });

  it("rejeita antecedência fora de 1–30 dias e valor não inteiro", () => {
    for (const days of [0, 31, 4.5, NaN, "abc"]) {
      const result = validateSettings({ ...DEFAULT_SETTINGS, deadlineAlertDays: days });
      expect(result.ok).toBe(false);
      expect(result.errors.deadlineAlertDays).toBeTruthy();
    }
  });

  it("rejeita densidade e timeout inválidos e booleanos não-booleanos", () => {
    const result = validateSettings({
      ...DEFAULT_SETTINGS,
      density: "gigante",
      sessionTimeoutMinutes: 45,
      notifyEditais: "sim"
    });
    expect(result.errors.density).toBeTruthy();
    expect(result.errors.sessionTimeoutMinutes).toBeTruthy();
    expect(result.errors.notifyEditais).toBeTruthy();
  });

  it("sanitizeSettings preenche faltantes e corrige corrompidos com o padrão", () => {
    const sanitized = sanitizeSettings({ deadlineAlertDays: 99, notifyEditais: true });
    expect(sanitized.deadlineAlertDays).toBe(DEFAULT_SETTINGS.deadlineAlertDays);
    expect(sanitized.notifyEditais).toBe(true);
    expect(sanitized.density).toBe(DEFAULT_SETTINGS.density);
    expect(sanitized.sessionTimeoutMinutes).toBe(DEFAULT_SETTINGS.sessionTimeoutMinutes);
  });

  it("settingsAreEqual e settingsAreDefault comparam corretamente", () => {
    expect(settingsAreEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(settingsAreEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(settingsAreDefault({ ...DEFAULT_SETTINGS })).toBe(true);
    expect(settingsAreDefault({ ...DEFAULT_SETTINGS, notifyEditais: true })).toBe(false);
  });
});
