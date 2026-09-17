import PropTypes from "prop-types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Search, Close } from "../../../components/ui/Icons";

/** Barra de filtros avançados: busca textual + centro, linha, status e edital. */
export default function DashboardFilters({
  filters,
  onChange,
  onClear,
  options,
  activeCount
}) {
  const set = (key) => (event) =>
    onChange({ ...filters, [key]: event.target.value });

  const selectClass =
    "rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            type="search"
            value={filters.search}
            onChange={set("search")}
            placeholder="Buscar por título, coordenação ou ID..."
            aria-label="Buscar projetos"
            className="w-full pl-9"
          />
        </div>
        <Button variant="outline" size="small" onClick={onClear} className="self-start sm:self-center">
          <Close className="h-4 w-4" />
          Limpar filtros
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
          Centro
          <select
            className={selectClass}
            value={filters.center}
            onChange={set("center")}
            aria-label="Filtrar por centro"
          >
            <option value="all">Todos os centros</option>
            {options.centers.map((center) => (
              <option key={center} value={center}>{center}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
          Linha temática
          <select
            className={selectClass}
            value={filters.thematicLine}
            onChange={set("thematicLine")}
            aria-label="Filtrar por linha temática"
          >
            <option value="all">Todas as linhas</option>
            {options.thematicLines.map((line) => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
          Status
          <select
            className={selectClass}
            value={filters.status}
            onChange={set("status")}
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os status</option>
            {options.statuses.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
          Edital
          <select
            className={selectClass}
            value={filters.grant}
            onChange={set("grant")}
            aria-label="Filtrar por edital"
          >
            <option value="all">Todos os editais</option>
            {options.grants.map((grant) => (
              <option key={grant} value={grant}>{grant}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-label-sm text-on-surface-variant" role="status" aria-live="polite">
        {activeCount === 1
          ? "1 projeto encontrado"
          : `${activeCount} projetos encontrados`}
      </p>
    </div>
  );
}

DashboardFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    center: PropTypes.string,
    thematicLine: PropTypes.string,
    status: PropTypes.string,
    grant: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  options: PropTypes.shape({
    centers: PropTypes.arrayOf(PropTypes.string),
    thematicLines: PropTypes.arrayOf(PropTypes.string),
    statuses: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
    ),
    grants: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  activeCount: PropTypes.number.isRequired
};
