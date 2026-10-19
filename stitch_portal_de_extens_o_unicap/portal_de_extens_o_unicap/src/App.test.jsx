import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
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

describe("Sprint 8 — rotas protegidas, perfis e sessão", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("visitante em rota protegida é redirecionado para o login", async () => {
    renderWithRouter(<App />, "/settings");

    expect(
      await screen.findByRole("heading", { name: /portal de extensão comunitária/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/login institucional/i)).toBeInTheDocument();
  });

  it("login de estudante abre a vitrine pública com cabeçalho autenticado", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/estudante \/ comunidade/i));
    await user.type(screen.getByLabelText(/login institucional/i), "aluna@unicap.br");
    await user.type(screen.getByLabelText(/senha de acesso/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar no painel de gestão/i }));

    expect(
      await screen.findByRole("heading", { name: /conectando a unicap/i })
    ).toBeInTheDocument();
    // Cabeçalho do portal disponível para o estudante
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /configurações/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /acompanhamento/i })).toBeInTheDocument();
    // Área exclusiva do gestor não aparece para o estudante
    expect(screen.queryByRole("link", { name: /painel gestor/i })).not.toBeInTheDocument();

    // Botão Ajuda abre a central de ajuda (não é um botão morto)
    await user.click(screen.getByRole("button", { name: "Ajuda" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /como podemos ajudar\?/i })).toBeInTheDocument();
    expect(within(dialog).getByText("extensao@unicap.br")).toBeInTheDocument();
  });

  it("sessão persiste entre recargas quando 'manter conectada' está marcada", async () => {
    const user = userEvent.setup();
    const first = render(
      <MemoryRouter initialEntries={["/"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/gestor \/ docente/i));
    await user.type(screen.getByLabelText(/login institucional/i), "prof@unicap.br");
    await user.type(screen.getByLabelText(/senha de acesso/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar no painel de gestão/i }));
    await screen.findByRole("heading", { name: /painel de gestão da extensão comunitária/i });

    expect(window.localStorage.getItem("unicap:session:v1")).toBeTruthy();
    first.unmount();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /painel de gestão da extensão comunitária/i })
    ).toBeInTheDocument();
  });

  it("desmarcar 'manter conectada' não persiste a sessão", async () => {
    const user = userEvent.setup();
    const first = render(
      <MemoryRouter initialEntries={["/"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/gestor \/ docente/i));
    await user.click(screen.getByRole("checkbox", { name: /manter sessão/i }));
    await user.type(screen.getByLabelText(/login institucional/i), "prof@unicap.br");
    await user.type(screen.getByLabelText(/senha de acesso/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar no painel de gestão/i }));
    await screen.findByRole("heading", { name: /painel de gestão da extensão comunitária/i });

    expect(window.localStorage.getItem("unicap:session:v1")).toBeNull();
    first.unmount();

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /portal de extensão comunitária/i })
    ).toBeInTheDocument();
  });
});
