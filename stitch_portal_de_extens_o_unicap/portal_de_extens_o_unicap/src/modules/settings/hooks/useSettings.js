import { useCallback, useEffect, useState } from "react";
import { sanitizeSettings, settingsAreEqual, DEFAULT_SETTINGS } from "../settingsLogic";

const STORAGE_KEY = "portal-unicap.settings.v1";

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(DEFAULT_SETTINGS);

  // Carrega uma única vez no mount (evita mismatch com o primeiro render).
  useEffect(() => {
    const stored = readStored() || DEFAULT_SETTINGS;
    setSettings(stored);
    setSavedSnapshot(stored);
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback((next) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedSnapshot(next);
      return { ok: true, savedAt: new Date().toISOString() };
    } catch {
      return { ok: false, error: "Não foi possível salvar suas preferências neste navegador." };
    }
  }, []);

  const discard = useCallback(() => {
    setSettings({ ...savedSnapshot });
  }, [savedSnapshot]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // navegação privada: apenas reseta em memória
    }
    setSettings({ ...DEFAULT_SETTINGS });
    setSavedSnapshot({ ...DEFAULT_SETTINGS });
    return { ok: true };
  }, []);

  return { settings, update, save, discard, reset, isDirty: !settingsAreEqual(settings, savedSnapshot) };
}
