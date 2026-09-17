import PropTypes from "prop-types";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { AlertTriangle, ArrowForward } from "../../../components/ui/Icons";

/** Destaques de ações pendentes que exigem atenção do gestor. */
export default function PendingActions({ overdue, pendingReports, analysis, onReview }) {
  const hasActions = overdue > 0 || pendingReports > 0 || analysis > 0;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2 text-red-700">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-label-md font-bold uppercase tracking-wider text-on-surface">
          Ações pendentes
        </span>
      </div>

      {hasActions ? (
        <ul className="space-y-2.5 text-body-sm">
          {overdue > 0 && (
            <li className="flex items-center justify-between gap-2 rounded-lg bg-red-50 px-3 py-2">
              <span className="text-red-700">
                <strong>{overdue}</strong> prazo{overdue > 1 ? "s" : ""} vencido{overdue > 1 ? "s" : ""}
              </span>
            </li>
          )}
          {pendingReports > 0 && (
            <li className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2">
              <span className="text-amber-800">
                <strong>{pendingReports}</strong> relatório{pendingReports > 1 ? "s" : ""} pendente{pendingReports > 1 ? "s" : ""}
              </span>
            </li>
          )}
          {analysis > 0 && (
            <li className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low px-3 py-2">
              <span className="text-on-surface">
                <strong>{analysis}</strong> projeto{analysis > 1 ? "s" : ""} aguardando parecer
              </span>
              <Button variant="outline" size="small" onClick={onReview}>
                Revisar
                <ArrowForward className="h-3.5 w-3.5" />
              </Button>
            </li>
          )}
        </ul>
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          Nenhuma pendência crítica no momento. 🎉
        </p>
      )}
    </Card>
  );
}

PendingActions.propTypes = {
  overdue: PropTypes.number.isRequired,
  pendingReports: PropTypes.number.isRequired,
  analysis: PropTypes.number.isRequired,
  onReview: PropTypes.func.isRequired
};
