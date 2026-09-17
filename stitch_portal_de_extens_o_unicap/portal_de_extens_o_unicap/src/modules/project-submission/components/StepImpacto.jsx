import PropTypes from "prop-types";
import Badge from "../../../components/ui/Badge";
import { thematicLines, odsOptions } from "../data/submissionOptions";

export default function StepImpacto({ form, updateForm, errors }) {
  const odsSelected = form.ods || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
        <div>
          <span className="font-label-sm font-bold uppercase tracking-wider text-secondary">Seção 2</span>
          <h2 className="font-headline-sm font-semibold text-on-surface">Alinhamento Pedagógico e ODS da ONU</h2>
          <p className="text-body-sm text-on-surface-variant">
            Conexão com a Agenda 2030, linha temática institucional e impacto comunitário.
          </p>
        </div>
        <Badge label="Agenda 2030" />
      </div>

      <div>
        <label htmlFor="thematic-line" className="mb-1 block font-label-md font-semibold text-on-surface">
          Linha Temática de Extensão
        </label>
        <select
          id="thematic-line"
          value={form.thematicLine}
          onChange={(e) => updateForm({ thematicLine: e.target.value })}
          className="input"
        >
          {thematicLines.map((line) => (
            <option key={line} value={line}>
              {line}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="font-label-md font-semibold text-on-surface">
            Objetivos de Desenvolvimento Sustentável (ODS) *
          </span>
          <span className="text-label-sm text-secondary">{odsSelected.length} ODS selecionados</span>
        </div>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Selecione o ODS primário e secundários prioritários que serão impactados pelas atividades.
        </p>
        {errors.ods && <p className="mt-1 text-sm text-error">{errors.ods}</p>}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {odsOptions.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                odsSelected.includes(o.value)
                  ? "border-primary bg-primary-container text-on-primary"
                  : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <input
                type="checkbox"
                value={o.value}
                checked={odsSelected.includes(o.value)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...odsSelected, o.value]
                    : odsSelected.filter((x) => x !== o.value);
                  updateForm({ ods: next });
                }}
                className="sr-only"
              />
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-on-primary">
                {o.value.padStart(2, "0")}
              </span>
              <span className="text-center text-sm">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="justificativa" className="mb-1 block font-label-md font-semibold text-on-surface">
          Justificativa Social e Diagnóstico Comunitário *
        </label>
        <textarea
          id="justificativa"
          value={form.socialJustification}
          onChange={(e) => updateForm({ socialJustification: e.target.value })}
          className={`h-28 w-full resize-none rounded-lg border px-3 py-2 text-body-md text-on-surface outline-none transition-colors focus:ring-2 focus:ring-primary-container ${
            errors.socialJustification
              ? "border-error"
              : "border-surface-container-highest bg-surface-container-low focus:border-primary"
          }`}
          placeholder="Descreva o problema, o público-alvo e a relevância social da ação (mín. 50 caracteres)."
        />
        {errors.socialJustification && (
          <p className="mt-1 text-sm text-error">{errors.socialJustification}</p>
        )}
      </div>
    </div>
  );
}

StepImpacto.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  errors: PropTypes.object
};
