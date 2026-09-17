import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { SessionProvider } from "./contexts/SessionContext";

function renderWithRouter(element, initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SessionProvider>{element}</SessionProvider>
    </MemoryRouter>
  );
}

describe("Sprint 1 — acesso e roteamento", () => {
  it("renderiza o formulário de login na página inicial", () => {
    renderWithRouter(<App />, "/");
    expect(screen.getByRole("heading", { name: /portal de extensão comunitária/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/login institucional/i)).toBeInTheDocument();
  });

  it("login redireciona para dashboard após credenciais válidas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/gestor \/ docente/i));
    expect(screen.getByRole("button", { name: /entrar no painel de gestão/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/login institucional/i), "teste@unicap.br");
    await user.type(screen.getByLabelText(/senha de acesso/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar no painel de gestão/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /painel de gestão da extensão comunitária/i })).toBeInTheDocument();
    });
  });
});
