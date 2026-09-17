import PropTypes from "prop-types";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { formatDate } from "../../../utils/format";
import { FileText, Upload, Download } from "../../../components/ui/Icons";

const statusMap = {
  pending: { status: "pending", label: "Pendente de envio" },
  received: { status: "analysis", label: "Recebido — em análise" },
  approved: { status: "completed", label: "Aprovado" },
  future: { status: "suspended", label: "Ainda não liberado" }
};

export default function ReportsPanel({ reports, onSubmit }) {
  return (
    <Card className="p-6">
      <h2 className="mb-1 font-headline-md font-semibold text-on-surface">Relatórios & Pareceres</h2>
      <p className="mb-5 text-body-sm text-on-surface-variant">
        Entregas documentais exigidas pelo edital e pela DEG/PROPESP ao longo do ciclo.
      </p>

      <div className="flex flex-col gap-3">
        {reports.map((report) => {
          const badge = statusMap[report.status] || statusMap.pending;
          const canSubmit = report.status === "pending";
          const canDownload = report.status === "approved" || report.status === "received";

          return (
            <div
              key={report.id}
              className="flex flex-col gap-3 rounded-xl border border-surface-container-highest bg-surface-container-lowest p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-surface-container text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label-lg font-semibold text-on-surface">{report.label}</span>
                    <Badge {...badge} withDot={false} />
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    {report.period} • Prazo: {formatDate(report.dueDate)}
                  </p>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{report.detail}</p>
                </div>
              </div>

              <div className="flex flex-none items-center gap-2">
                {canDownload && (
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                )}
                {canSubmit && (
                  <Button variant="primary" onClick={() => onSubmit(report)}>
                    <Upload className="h-4 w-4" />
                    Enviar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

ReportsPanel.propTypes = {
  reports: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};
