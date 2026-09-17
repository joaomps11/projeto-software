import { useMemo, useState, useCallback } from "react";

const ALL_AREAS = "Todas as áreas";
const ALL_LOCALS = "Todos os locais";

function hoursToNumber(hours) {
  if (!hours) return 0;
  const match = String(hours).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function deadlineTime(project) {
  const time = new Date(project.deadline).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

/**
 * Filtro e ordenação pura da vitrine — isolado do React para testabilidade.
 * Exportado como função para testes de unidade diretos.
 */
export function applyProjectFilters(projects, criteria) {
  const {
    search = "",
    area = ALL_AREAS,
    local = ALL_LOCALS,
    turnos = [],
    onlyOpen = false,
    sortBy = "deadline"
  } = criteria || {};

  const term = (search || "").trim().toLowerCase();

  const filtered = projects.filter((project) => {
    if (onlyOpen && project.spotsLeft === 0) return false;
    if (area !== ALL_AREAS && project.area !== area) return false;
    if (local !== ALL_LOCALS && project.local !== local) return false;
    if (turnos.length > 0 && !turnos.some((t) => project.turnos?.includes(t))) return false;
    if (term) {
      const haystack = [project.title, project.shortDesc, project.area, project.courses, project.local]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  const sorters = {
    deadline: (a, b) => deadlineTime(a) - deadlineTime(b),
    hours: (a, b) => hoursToNumber(b.hours) - hoursToNumber(a.hours),
    spots: (a, b) => b.spotsLeft - a.spotsLeft
  };

  return [...filtered].sort(sorters[sortBy] || sorters.deadline);
}

export default function useProjectFilters(projects) {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState(ALL_AREAS);
  const [local, setLocal] = useState(ALL_LOCALS);
  const [turnos, setTurnos] = useState([]);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");

  const toggleTurno = useCallback((turno) => {
    setTurnos((prev) =>
      prev.includes(turno) ? prev.filter((t) => t !== turno) : [...prev, turno]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setArea(ALL_AREAS);
    setLocal(ALL_LOCALS);
    setTurnos([]);
    setOnlyOpen(false);
  }, []);

  const hasActiveFilters =
    search.trim() !== "" ||
    area !== ALL_AREAS ||
    local !== ALL_LOCALS ||
    turnos.length > 0 ||
    onlyOpen;

  const filteredProjects = useMemo(
    () =>
      applyProjectFilters(projects, {
        search,
        area,
        local,
        turnos,
        onlyOpen,
        sortBy
      }),
    [projects, search, area, local, turnos, onlyOpen, sortBy]
  );

  return {
    // estado
    search,
    area,
    local,
    turnos,
    onlyOpen,
    sortBy,
    // derivados
    filteredProjects,
    hasActiveFilters,
    // ações
    setSearch,
    setArea,
    setLocal,
    toggleTurno,
    setOnlyOpen,
    setSortBy,
    clearFilters
  };
}
