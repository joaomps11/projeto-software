import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Calendar, Person, School } from "../../components/ui/Icons";
import { formatDate, formatPercentage } from "../../utils/format";
import FrequencyTable from "./components/FrequencyTable";
import MilestonesTimeline from "./components/MilestonesTimeline";
import ReportsPanel from "./components/ReportsPanel";
import useFrequencySheet from "./hooks/useFrequencySheet";
import { project, students, months, milestones, reports } from "./data/trackingData";

const tabs = [
  { id: "visao", label: "Visão Geral & Indicadores" },
  { id: "cronograma", label: "Cronograma & Atividades" },
  { id: "frequencia", label: "Bolsistas & Frequência" },
  { id: "relatorios", label: "Relatórios & Pareceres" }
];

export default function ProjectTracking() {
  const [activeTab, setActiveTab] = useState("frequencia");
  const [activeMonth, setActiveMonth] = useState(months[0].id);
  const [notice, setNotice] = useState(null);

  const { frequency, registerHours, homologate, homologateSelected, pendingCount, completion, totals } =
    useFrequencySheet(students);

  const month = months.find((m) => m.id === activeMonth) || months[0];

  const executionRate = useMemo(() => {
    const totalRegistered = Object.values(totals).reduce((sum, h) => sum + h, 0);
    const totalPlanned = project.hours * students.length;
    return totalPlanned > 0 ? Math.round((totalRegistered / totalPlanned) * 100) : 0;
  }, [totals]);

  const handleCobrar = (student) => {
    setNotice(`Lembrete de envio registrado para ${student.name} (mock).`);
    setTimeout(() => setNotice(null), 3000);
  };

  const showNotice = (message, duration = 4000) => {
    setNotice(message);
    setTimeout(() => setNotice(null), duration);
  };

  const handleHomologate = (monthId, studentId) => {
    const result = homologate(monthId, studentId);
    if (!result.ok && result.message) {
      setNotice(result.message);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleHomologateSelected = (monthId, ids) => {
    const results = homologateSelected(monthId, ids);
    const failures = results.filter((r) => !r.ok);
    if (failures.length > 0) {
      setNotice(`${failures.length} registro(s) não puderam ser homologados: ${failures[0].message}`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleSubmitReport = (report) => {
    setNotice(`Envio de "${report.label}" registrado (mock). Aguarde parecer do comitê.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
              Código: {project.code}
            </span>
            <span className="rounded-full bg-secondary-container px-2.5 py-1 text-sm text-on-secondary-fixed">
              Edital {project.edital}
            </span>
            <span className="rounded-full bg-surface-container-low px-2.5 py-1 text-label-sm text-secondary">
              <Calendar className="mr-1 inline h-3 w-3" /> Vigência: {formatDate(project.start)} a{" "}
              {formatDate(project.end)}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-body-md text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Person className="h-4 w-4 text-primary" />
              <strong>Coordenador(a):</strong> {project.coordinator}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5">
              <School className="h-4 w-4 text-secondary" />
              {project.center}
            </span>
            <span className="rounded bg-surface-container-high px-2 py-0.5 text-sm font-semibold text-secondary">
              ODS {project.ods}: Paz, Justiça e Instituições Eficazes
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:w-64 lg:flex-col">
          <Button
            className="flex-1"
            onClick={() =>
              showNotice(
                `Declaração de vigência de "${project.title}" emitida (mock) — em produção o documento seria baixado em PDF.`
              )
            }
          >
            Emitir Declaração do Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Carga Horária Aprovada</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-primary">{project.hours}h</span>
            <span className="text-label-sm text-on-surface-variant">semestrais</span>
          </div>
          <p className="text-label-sm text-secondary">{project.expectedMonthlyHours}h mensais por discente</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Equipe Discente</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface">{students.length}</span>
            <span className="text-label-sm text-on-surface-variant">integrantes</span>
          </div>
          <p className="text-label-sm text-secondary">
            {students.filter((s) => s.type === "pbex").length} Bolsistas PIBEX •{" "}
            {students.filter((s) => s.type === "voluntary").length} Voluntários
          </p>
        </Card>
        <Card className="p-5">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Beneficiários Diretos</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface">{project.beneficiaries}</span>
            <span className="text-label-sm text-on-surface-variant">atendimentos</span>
          </div>
          <p className="text-label-sm text-secondary">Comunidade Santo Amaro & Coelhos</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Índice de Execução</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-primary">{formatPercentage(executionRate)}</span>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, executionRate)}%` }} />
            </div>
          </div>
          <p className="text-label-sm text-secondary">
            {pendingCount(activeMonth)} pendência(s) em {month.label.split(" / ")[0]}
          </p>
        </Card>
      </div>

      <nav aria-label="Seções de acompanhamento" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {notice && (
        <div role="status" className="rounded-lg border border-secondary/40 bg-secondary-container/30 p-3 text-sm text-on-surface">
          {notice}
        </div>
      )}

      {activeTab === "visao" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 font-headline-md font-semibold text-on-surface">Indicadores por discente</h2>
            <div className="flex flex-col gap-4">
              {students.map((student) => {
                const total = totals[student.id] || 0;
                const pct = Math.min(100, Math.round((total / student.totalHours) * 100));
                return (
                  <div key={student.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-on-surface">{student.name}</span>
                      <span className="text-on-surface-variant">
                        {total}h / {student.totalHours}h
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="mb-4 font-headline-md font-semibold text-on-surface">Homologação por competência</h2>
            <div className="flex flex-col gap-3">
              {months.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-on-surface">{m.label}</span>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${completion(m.id)}%` }} />
                    </div>
                    <span className="w-10 text-right font-semibold text-on-surface-variant">{completion(m.id)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "cronograma" && <MilestonesTimeline milestones={milestones} />}

      {activeTab === "frequencia" && (
        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {months.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMonth(m.id)}
                className={`rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                  activeMonth === m.id
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {m.label.replace(" / 2025", "")}
              </button>
            ))}
          </div>
          <FrequencyTable
            month={month}
            expectedHours={project.expectedMonthlyHours}
            frequency={frequency}
            students={students}
            totals={totals}
            onRegisterHours={registerHours}
            onHomologate={handleHomologate}
            onHomologateSelected={handleHomologateSelected}
            onCobrar={handleCobrar}
            notice={notice || undefined}
          />
        </Card>
      )}

      {activeTab === "relatorios" && <ReportsPanel reports={reports} onSubmit={handleSubmitReport} />}
    </div>
  );
}
