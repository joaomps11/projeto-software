import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const SessionContext = createContext(null);

const STORAGE_KEY = "unicap:session:v1";
const VALID_PROFILES = ["gestor", "estudante"];

/** Recupera a sessão persistida ("Manter sessão conectada"), se válida. */
function readStoredProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return VALID_PROFILES.includes(parsed?.profile) ? parsed.profile : null;
  } catch {
    return null;
  }
}

function persistProfile(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, savedAt: Date.now() }));
  } catch {
    // localStorage indisponível (modo privado): a sessão segue apenas em memória.
  }
}

function clearStoredProfile() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}

export function SessionProvider({ children }) {
  const [profile, setProfile] = useState(readStoredProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (identifier, password, selectedProfile, options = {}) => {
    setLoading(true);
    setError(null);

    // Simula verificação leve e delay de rede.
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanIdentifier = (identifier || "").trim();
    if (!cleanIdentifier || !password) {
      setError("Preencha identificação e senha.");
      setLoading(false);
      return false;
    }

    if (selectedProfile && !VALID_PROFILES.includes(selectedProfile)) {
      setError("Perfil inválido.");
      setLoading(false);
      return false;
    }

    // Mock: qualquer credencial válida abre sessão de teste.
    const nextProfile = selectedProfile || "estudante";
    setProfile(nextProfile);
    if (options.persist) {
      persistProfile(nextProfile);
    } else {
      clearStoredProfile();
    }
    setLoading(false);
    return true;
  };

  const logout = () => {
    setProfile(null);
    clearStoredProfile();
  };

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      login,
      logout,
      isAuthenticated: profile != null
    }),
    [profile, loading, error]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

SessionProvider.propTypes = {
  children: PropTypes.node
};

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
