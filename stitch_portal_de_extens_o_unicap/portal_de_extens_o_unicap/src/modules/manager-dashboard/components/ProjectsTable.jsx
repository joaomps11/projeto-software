import PropTypes from "prop-types";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { executionRate } from "../dashboardLogic";
import { truncate } from "../../../utils/format";
import { Sort } from "../../../components/ui/Icons";

const SORTABLE_COLUMNS = [
  { key: "title", label: "Projeto & Coordenação", aria: "Ordenar por título" },
  { key: "impact", label: "Impacto / Vagas", aria: "Ordenar por impacto" },
  { key: "execution", label: "Execução", aria: "Ordenar por execução orçamentária" }
];

/** Tabela de projetos com ordenação por coluna e resumo de execução. */
export default function ProjectsTable({ projects, sortBy, onSortChange, onViewDetails }) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="font-headline-md font-bold text-on-surface">Projetos em acompanhamento</h2>
        <p className="text-body-sm text-on-surface-variant">
          Monitoramento de vigência, impacto e execução orçamentária
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-surface-container-highest">
        <table className="w-full text-left text-body-md">
          <caption className="sr-only">
            Lista de projetos de extensão com centro, impacto, execução e status
          </caption>
          <thead>
            <tr className="bg-surface-container text-on-surface-variant">
              {SORTABLE_COLUMNS.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSortChange(column.key)}
                    aria-label={column.aria}
                    className="inline-flex items-center gap-1 font-label-md uppercase tracking-wider hover:text-primary"
                  >
                    {column.label}
                    <Sort
                      className={`h-3.5 w-3.5 ${sortBy === column.key ? "text-primary" : "text-outline"}`}
                    />
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-label-md uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-label-md uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {projects.map((project) => {
              const rate = executionRate(project);
              return (
                <tr key={project.id} className="hover:bg-surface-container-low/80">
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-on-surface">{truncate(project.title, 48)}</span>
                    <span className="text-sm text-on-surface-variant">{project.coordinator}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-on-surface">{project.impact.toLocaleString("pt-BR")} pessoas</span>
                    <span className="text-sm text-on-surface-variant">
                      {project.scholarships} bolsistas • {project.volunteers} voluntários
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-highest"
                        role="progressbar"
                        aria-valuenow={rate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Execução orçamentária de ${project.id}: ${rate}%`}
                      >
                        <div
                          className={`h-full rounded-full ${rate >= 90 ? "bg-red-500" : "bg-primary"}`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-on-surface">{rate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={project.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant={project.status === "analysis" ? "primary" : "outline"}
                      size="small"
                      onClick={() => onViewDetails(project)}
                    >
                      {project.status === "analysis" ? "Parecer" : "Detalhes"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <p className="py-8 text-center text-body-md text-on-surface-variant">
          Nenhum projeto corresponde aos filtros selecionados.
        </p>
      )}
    </Card>
  );
}

ProjectsTable.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      coordinator: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      impact: PropTypes.number.isRequired,
      scholarships: PropTypes.number.isRequired,
      volunteers: PropTypes.number.isRequired
    })
  ).isRequired,
  sortBy: PropTypes.oneOf(["title", "impact", "execution"]).isRequired,
  onSortChange: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};
