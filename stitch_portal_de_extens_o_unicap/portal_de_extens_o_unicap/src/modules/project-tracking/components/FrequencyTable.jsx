import { useState } from "react";
import PropTypes from "prop-types";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { AlertTriangle, Download } from "../../../components/ui/Icons";
import { project } from "../data/trackingData";
import { PENDING, HOMOLOGATED, MISSING } from "../trackingLogic";

export default function FrequencyTable({
  month,
  expectedHours,
  frequency,
  students,
  totals,
  onRegisterHours,
  onHomologate,
  onHomologateSelected,
  onCobrar,
  notice
}) {
  const monthId = month.id;
  const monthLabel = month.label;
  const [selected, setSelected] = useState([]);
  const sheet = frequency[monthId] || {};

  const toggleAll = () => {
    setSelected(selected.length === students.length ? [] : students.map((s) => s.id));
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const homologableSelected = selected.filter((id) => {
    const record = sheet[id];
    return record && record.status !== HOMOLOGATED && Number(record.hours) > 0;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="font-headline-md font-semibold text-on-surface">
              Equipe Discente e Homologação de Frequência
            </h2>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Competência de Referência: <strong>{monthLabel}</strong> — Carga horária mensal esperada:{" "}
            {expectedHours}h
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            disabled={homologableSelected.length === 0}
            onClick={() => {
              onHomologateSelected(monthId, homologableSelected);
              setSelected([]);
            }}
          >
            Homologar Selecionados ({homologableSelected.length})
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Exportar Folha
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-surface-container-highest">
        <table className="w-full text-left text-body-md">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Selecionar todos"
                  checked={selected.length === students.length && students.length > 0}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded accent-primary"
                />
              </th>
              <th className="px-4 py-3 font-label-md uppercase tracking-wider">Discente / Matrícula</th>
              <th className="px-4 py-3 font-label-md uppercase tracking-wider">Curso</th>
              <th className="px-4 py-3 font-label-md uppercase tracking-wider">Modalidade</th>
              <th className="px-4 py-3 font-label-md uppercase tracking-wider">Horas do mês</th>
              <th className="px-4 py-3 font-label-md uppercase tracking-wider">Progresso CH</th>
              <th className="px-4 py-3 text-right font-label-md uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {students.map((student) => {
              const record = sheet[student.id] || { hours: 0, status: MISSING };
              const isHomologated = record.status === HOMOLOGATED;
              const isMissing = record.status === MISSING || Number(record.hours) === 0;

              return (
                <tr key={student.id} className="hover:bg-surface-container-low/80">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Selecionar ${student.name}`}
                      checked={selected.includes(student.id)}
                      onChange={() => toggleOne(student.id)}
                      disabled={isHomologated}
                      className="h-4 w-4 rounded accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-fixed">
                        {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <span className="block font-semibold text-on-surface">{student.name}</span>
                        <span className="text-xs text-on-surface-variant">Mat. {student.mat}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{student.course}</td>
                  <td className="px-4 py-3">
                    <Badge type={student.type === "pbex" ? "pbex" : "voluntary"} label={student.modality} />
                  </td>
                  <td className="px-4 py-3">
                    {isHomologated ? (
                      <span className="text-sm font-semibold text-on-surface">{record.hours}h ✓</span>
                    ) : (
                      <input
                        type="number"
                        aria-label={`Horas de ${student.name} em ${monthLabel}`}
                        min={0}
                        max={expectedHours + 2}
                        value={record.hours}
                        onChange={(e) => onRegisterHours(monthId, student.id, e.target.value)}
                        className="input h-9 w-20 text-center"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-on-surface">{totals[student.id] || 0}h</span>
                        <span>{student.totalHours}h</span>
                      </div>
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-surface-container-highest">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, Math.round(((totals[student.id] || 0) / student.totalHours) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isHomologated ? (
                      <Badge status="completed" label="Homologada" />
                    ) : isMissing ? (
                      <Button variant="ghost" onClick={() => onCobrar(student)}>
                        Cobrar Envio
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => onHomologate(monthId, student.id)}>
                        Homologar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-none text-primary" />
          <span>
            {notice ||
              `A folha homologada é enviada automaticamente para a Divisão Financeira até o dia 28 para liberação do estipêndio PIBEX (teto mensal: ${project.expectedMonthlyHours}h).`}
          </span>
        </div>
        <span className="font-semibold text-primary">
          {Object.values(sheet).filter((r) => r?.status === PENDING && Number(r.hours) > 0).length} pendência(s) neste mês
        </span>
      </div>
    </div>
  );
}

FrequencyTable.propTypes = {
  month: PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.string.isRequired }).isRequired,
  expectedHours: PropTypes.number.isRequired,
  frequency: PropTypes.object.isRequired,
  students: PropTypes.array.isRequired,
  totals: PropTypes.object.isRequired,
  onRegisterHours: PropTypes.func.isRequired,
  onHomologate: PropTypes.func.isRequired,
  onHomologateSelected: PropTypes.func.isRequired,
  onCobrar: PropTypes.func.isRequired,
  notice: PropTypes.string
};
