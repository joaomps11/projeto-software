import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PublicLanding from "./PublicLanding";
import { projects } from "./data/projects";

function renderLanding() {
  return render(
    <MemoryRouter>
      <PublicLanding />
    </MemoryRouter>
  );
}

describe("Sprint 2 — vitrine pública", () => {
  it("renderiza hero, filtros e a listagem de projetos", () => {
    renderLanding();

    expect(screen.getByRole("heading", { name: /conectando a unicap/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/área temática/i)).toBeInTheDocument();
    expect(screen.getByText(/projetos com editais ativos/i)).toBeInTheDocument();

    // Todos os 6 projetos mockados aparecem na listagem inicial
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("busca por texto reduz a listagem ao projeto correspondente", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.type(screen.getByLabelText(/buscar projetos/i), "hortas");

    expect(screen.getByText(/1 projetos com editais ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/Observatório de Segurança Alimentar/i)).toBeInTheDocument();
    expect(screen.queryByText(/Clínica de Direitos Humanos/i)).not.toBeInTheDocument();
  });

  it("filtra por área temática via select", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.selectOptions(screen.getByLabelText(/área temática/i), "Saúde Comunitária");

    expect(screen.getByText(/1 projetos com editais ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/Atenção Psicológica/i)).toBeInTheDocument();
  });

  it("botão limpar filtros restaura a listagem completa", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.selectOptions(screen.getByLabelText(/área temática/i), "Sustentabilidade");
    expect(screen.getByText(/1 projetos com editais ativos/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^limpar$/i }));
    expect(screen.getByText(/6 projetos com editais ativos/i)).toBeInTheDocument();
  });

  it("abre modal de detalhes e permite fechar", async () => {
    const user = userEvent.setup();
    renderLanding();

    const card = screen.getByText(/Clínica de Direitos Humanos/i).closest("article");
    await user.click(within(card).getByRole("button", { name: /detalhes/i }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/Atendimento jurídico gratuito, orientação processual/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/Atividades previstas/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Fechar", exact: false }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("projeto sem vagas exibe estado esgotado e botão desabilitado", () => {
    renderLanding();

    const card = screen.getByText(/Cultura Popular do Recife Antigo/i).closest("article");
    expect(within(card).getByText(/vagas esgotadas/i)).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: /inscrever-se/i })).toBeDisabled();
  });
});
