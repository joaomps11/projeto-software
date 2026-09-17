import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { Download, Plus } from "../../components/ui/Icons";
import { dashboardProjects, filterOptions, semesterInfo } from "./data/dashboardData";
import {
  filterProjects,
  sortProjects,
  paginate,
  buildDeadlines,
  computeKpis
} from "./dashboardLogic";
import KpiCards from "./components/KpiCards";
import DashboardFilters from "./components/DashboardFilters";
import ProjectsTable from "./components/ProjectsTable";
import CommitteeDeadlines from "./components/CommitteeDeadlines";
import PendingActions from "./components/PendingActions";
import ProjectDetailModal from "./components/ProjectDetailModal";

const DEFAULT_FILTERS = {
  search: "",
  center: "all",
  thematicLine: "all",
  status: "all",
  grant: "all"
};

/** Painel de gestão institucional da extensão comunitária. */
export default function ManagerDashboard() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("title");
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = useMemo(() => filterProjects(dashboardProjects, filters), [filters]);
  const sorted = useMemo(() => sortProjects(filtered, sortBy), [filtered, sortBy]);
  const paged = useMemo(() => paginate(sorted, page), [sorted, page]);
  const deadlines = useMemo(() => buildDeadlines(), []);

  // Volta para a primeira página sempre que filtros ou ordenação mudam.
  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };
  const handleSortChange = (key) => {
    setSortBy(key);
    setPage(1);
  };

  const kpis = computeKpis(dashboardProjects);
  const overdueCount = deadlines.filter((d) => d.urgency === "overdue").length;
  const analysisCount = dashboardProjects.filter((p) => p.status === "analysis").length;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 font-semibold text-on-secondary-fixed">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Semestre Vigente: {semesterInfo.code}
              </span>
              <span className="text-on-surface-variant">• {semesterInfo.cycle}</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
              Painel de Gestão da Extensão Comunitária
            </h1>
            <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Supervisão institucional de curricularização, impacto metropolitano no Grande Recife,
              bolsas acadêmicas e alinhamento à Agenda 2030 da ONU.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Exportar Relatório MEC
            </Button>
            <Button>
              <Plus className="h-4 w-4" />
              Novo Edital PIBEX
            </Button>
          </div>
        </div>
      </section>

      <KpiCards projects={dashboardProjects} />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <section aria-label="Projetos" className="flex flex-col gap-2">
            <DashboardFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={() => handleFilterChange(DEFAULT_FILTERS)}
              options={filterOptions}
              activeCount={sorted.length}
            />
            <ProjectsTable
              projects={paged.items}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onViewDetails={setSelectedProject}
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-on-surface-variant">
              <span aria-live="polite">
                Mostrando {paged.items.length} de {paged.total} projetos
                {paged.total !== dashboardProjects.length
                  ? ` (de ${dashboardProjects.length} no total)`
                  : ""}
              </span>
              {paged.pageCount > 1 && (
                <nav aria-label="Paginação de projetos" className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="small"
                    disabled={paged.page === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: paged.pageCount }, (_, i) => i + 1).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === paged.page ? "primary" : "outline"}
                      size="small"
                      onClick={() => setPage(pageNumber)}
                      aria-current={pageNumber === paged.page ? "page" : undefined}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="small"
                    disabled={paged.page === paged.pageCount}
                    onClick={() => setPage((current) => Math.min(paged.pageCount, current + 1))}
                  >
                    Próxima
                  </Button>
                </nav>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <PendingActions
            overdue={overdueCount}
            pendingReports={kpis.pendingReports}
            analysis={analysisCount}
            onReview={() => handleFilterChange({ ...DEFAULT_FILTERS, status: "analysis" })}
          />
          <CommitteeDeadlines deadlines={deadlines} />
        </div>
      </section>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
