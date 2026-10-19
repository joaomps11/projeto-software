import PropTypes from "prop-types";
import { budgetCategories, annexRules } from "../data/submissionOptions";
import { totalBudget } from "../validation";
import { formatCurrency } from "../../../utils/format";
import { Attachment, Close } from "../../../components/ui/Icons";

export default function StepOrcamento({ form, updateForm, errors, onAddAttachment, onRemoveAttachment, attachmentError }) {
  const budget = form.budget || [];
  const attachments = form.attachments || [];

  const updateAmount = (category, value) => {
    updateForm({
      budget: budget.map((item) =>
        item.category === category ? { ...item, amount: Number(value) || 0 } : item
      )
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
        <div>
          <span className="font-label-sm font-bold uppercase tracking-wider text-secondary">Seção 5</span>
          <h2 className="font-headline-sm font-semibold text-on-surface">Orçamento, Parcerias e Anexos</h2>
          <p className="text-body-sm text-on-surface-variant">
            Distribuição dos recursos por categoria e documentação comprobatória da proposta.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="font-label-md font-semibold text-on-surface">Orçamento estimado por categoria *</span>
          <span className="font-label-lg font-bold text-primary">{formatCurrency(totalBudget(budget))}</span>
        </div>
        {errors.budget && <p className="mt-1 text-sm text-error">{errors.budget}</p>}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {budget.map((item) => {
            const label = budgetCategories.find((c) => c.value === item.category)?.label || item.category;
            return (
              <div key={item.category} className="flex items-center justify-between gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-3">
                <label htmlFor={`budget-${item.category}`} className="text-sm font-medium text-on-surface">
                  {label}
                </label>
                <input
                  id={`budget-${item.category}`}
                  type="number"
                  min={0}
                  step={100}
                  value={item.amount}
                  onChange={(e) => updateAmount(item.category, e.target.value)}
                  className="input h-9 w-32 text-right"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="parceiro" className="mb-1 block font-label-md font-semibold text-on-surface">
          Parceria institucional / comunitária
        </label>
        <input
          id="parceiro"
          type="text"
          value={form.partnerName}
          onChange={(e) => updateForm({ partnerName: e.target.value })}
          className="input"
          placeholder="Ex: Defensoria Pública de Pernambuco (opcional)"
        />
      </div>

      <div>
        <span className="font-label-md font-semibold text-on-surface">
          Anexos (plano de trabalho, carta de aceite, etc.)
        </span>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Até {annexRules.maxFiles} arquivos • {annexRules.acceptedExtensions.join(", ")} • máx. {annexRules.maxFileMb} MB cada
        </p>
        {attachmentError && <p className="mt-1 text-sm text-error">{attachmentError}</p>}

        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-container-highest bg-surface-container-lowest p-6 text-center transition-colors hover:border-primary hover:bg-surface-container-low">
          <Attachment className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-on-surface">Clique para anexar documentos</span>
          <input
            type="file"
            multiple
            accept={annexRules.acceptedExtensions.join(",")}
            className="sr-only"
            onChange={(e) => onAddAttachment(Array.from(e.target.files || []))}
          />
        </label>

        {attachments.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {attachments.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-surface-container-highest bg-surface-container-lowest px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2 text-on-surface">
                  <Attachment className="h-4 w-4 text-secondary" />
                  {file.name}
                  <span className="text-on-surface-variant">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Remover anexo ${file.name}`}
                  onClick={() => onRemoveAttachment(index)}
                  className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
                >
                  <Close className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

StepOrcamento.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onAddAttachment: PropTypes.func.isRequired,
  onRemoveAttachment: PropTypes.func.isRequired,
  attachmentError: PropTypes.string
};
