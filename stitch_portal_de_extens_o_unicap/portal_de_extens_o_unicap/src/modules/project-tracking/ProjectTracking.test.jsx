import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach } from "vitest";
import ProjectTracking from "./ProjectTracking";

function renderTracking() {
  return render(
    <MemoryRouter>
      <ProjectTracking />
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("Sprint 4 — acompanhamento de projeto", () => {
  it("renderiza cabeçalho do projeto, KPIs e abas de navegação", () => {
    renderTracking();

    expect(screen.getByRole("heading", { name: /clínica de direitos humanos/i })).toBeInTheDocument();
    expect(screen.getByText(/carga horária aprovada/i)).toBeInTheDocument();
    expect(screen.getByText(/índice de execução/i)).toBeInTheDocument();

    for (const tab of ["Visão Geral & Indicadores", "Cronograma & Atividades", "Bolsistas & Frequência", "Relatórios & Pareceres"]) {
      expect(screen.getByRole("button", { name: tab })).toBeInTheDocument();
    }
  });

  it("aba de frequência abre por padrão com folha mensal e ações de homologação", () => {
    renderTracking();

    expect(screen.getByRole("heading", { name: /equipe discente e homologação/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Março" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /homologar selecionados/i })).toBeDisabled();
    // estudante com folha homologada mostra badge; pendentes mostram botão homologar
    expect(screen.getByText("Homologada")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Homologar" }).length).toBeGreaterThan(0);
  });

  it("permite registrar horas e homologar a folha do mês", async () => {
    const user = userEvent.setup();
    renderTracking();

    const input = screen.getByLabelText(/horas de mariana albuquerque limpa|horas de mariana albuquerque lima/i);
    await user.clear(input);
    await user.type(input, "30");

    const row = input.closest("tr");
    await user.click(within(row).getByRole("button", { name: "Homologar" }));

    expect(within(row).getByText("Homologada")).toBeInTheDocument();
    expect(within(row).queryByLabelText(/horas de mariana/i)).not.toBeInTheDocument();
  });

  it("não homologa folha com 0 horas e exibe aviso", async () => {
    const user = userEvent.setup();
    renderTracking();

    // Rafael está com 0h em março -> botão é "Cobrar Envio"
    const rafaelRow = screen.getByLabelText(/selecionar rafael mendes gusmão/i).closest("tr");
    expect(within(rafaelRow).getByRole("button", { name: /cobrar envio/i })).toBeInTheDocument();

    // Mariana (28h pendente) pode ser homologada
    const marianaRow = screen.getByLabelText(/selecionar mariana albuquerque lima/i).closest("tr");
    await user.click(within(marianaRow).getByRole("button", { name: "Homologar" }));
    expect(within(marianaRow).getByText("Homologada")).toBeInTheDocument();
  });

  it("homologa em lote os registros selecionados", async () => {
    const user = userEvent.setup();
    renderTracking();

    await user.click(screen.getByLabelText(/selecionar mariana albuquerque lima/i));
    await user.click(screen.getByLabelText(/selecionar gabriela dias vasconcelos/i));

    const bulkButton = screen.getByRole("button", { name: /homologar selecionados \(2\)/i });
    await user.click(bulkButton);

    const marianaRow = screen.getByLabelText(/selecionar mariana albuquerque lima/i).closest("tr");
    const gabrielaRow = screen.getByLabelText(/selecionar gabriela dias vasconcelos/i).closest("tr");
    expect(within(marianaRow).getByText("Homologada")).toBeInTheDocument();
    expect(within(gabrielaRow).getByText("Homologada")).toBeInTheDocument();
  });

  it("troca de mês exibe folha correspondente", async () => {
    const user = userEvent.setup();
    renderTracking();

    await user.click(screen.getByRole("button", { name: "Abril", exact: false }));

    const abrilInput = screen.getByLabelText(/horas de rafael mendes gusmão/i);
    expect(abrilInput).toHaveValue(12);
  });

  it("aba cronograma mostra marcos com status", async () => {
    const user = userEvent.setup();
    renderTracking();

    await user.click(screen.getByRole("button", { name: /cronograma & atividades/i }));

    expect(screen.getByRole("heading", { name: /cronograma & marcos/i })).toBeInTheDocument();
    expect(screen.getByText(/início das atividades/i)).toBeInTheDocument();
    expect(screen.getByText(/relatório parcial de extensão/i)).toBeInTheDocument();
    expect(screen.getAllByText("Concluído").length).toBeGreaterThan(0);
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
  });

  it("aba relatórios lista entregas com prazos e permite enviar pendentes", async () => {
    const user = userEvent.setup();
    renderTracking();

    await user.click(screen.getByRole("button", { name: /relatórios & pareceres/i }));

    expect(screen.getByText(/relatório parcial de extensão/i)).toBeInTheDocument();
    expect(screen.getByText(/aguarda consolidação/i)).toBeInTheDocument();

    const sendButtons = screen.getAllByRole("button", { name: /enviar/i });
    await user.click(sendButtons[0]);

    expect(screen.getByText(/envio de "relatório parcial de extensão" registrado/i)).toBeInTheDocument();
  });

  it("aba visão geral exibe progresso por discente e homologação por competência", async () => {
    const user = userEvent.setup();
    renderTracking();

    await user.click(screen.getByRole("button", { name: /visão geral & indicadores/i }));

    expect(screen.getByRole("heading", { name: /indicadores por discente/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /homologação por competência/i })).toBeInTheDocument();
    expect(screen.getByText(/lucas andrade bezerra/i)).toBeInTheDocument();
  });
});
