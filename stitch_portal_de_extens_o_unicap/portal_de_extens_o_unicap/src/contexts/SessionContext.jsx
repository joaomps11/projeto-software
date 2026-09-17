import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (identifier, password, selectedProfile) => {
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

    if (selectedProfile && !["gestor", "estudante"].includes(selectedProfile)) {
      setError("Perfil inválido.");
      setLoading(false);
      return false;
    }

    // Mock: qualquer credencial válida abre sessão de teste.
    setProfile(selectedProfile || "estudante");
    setLoading(false);
    return true;
  };

  const logout = () => {
    setProfile(null);
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
