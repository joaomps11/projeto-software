import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const DEFAULT_PAGES = {
  gestor: "/dashboard",
  estudante: "/public",
  null: "/"
};

export default function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated } = useSession();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const target = DEFAULT_PAGES[profile] || "/public";
    const returnTo = location.state?.returnTo || target;

    // Evita loop caso já esteja no destino.
    if (location.pathname !== returnTo) {
      navigate(returnTo, { replace: true, state: { from: location.pathname } });
    }
  }, [profile, isAuthenticated, navigate, location]);
}
