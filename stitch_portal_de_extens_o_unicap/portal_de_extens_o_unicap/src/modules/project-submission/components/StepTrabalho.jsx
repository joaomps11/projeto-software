import PropTypes from "prop-types";
import Badge from "../../../components/ui/Badge";
import { deliverables } from "../data/submissionOptions";

function Field({ id, label, value, onChange, error, hint, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-label-md font-semibold text-on-surface">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={`h-24 w-full resize-none rounded-lg border px-3 py-2 text-body-md text-on-surface outline-none transition-colors focus:ring-2 focus:ring-primary-container ${
          error
            ? "border-error"
            : "border-surface-container-highest bg-surface-container-low focus:border-primary"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {!error && hint && <p className="mt-1 text-body-sm text-on-surface-variant">{hint}</p>}
    </div>
  );
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  placeholder: PropTypes.string
};

export default function StepTrabalho({ form, updateForm, errors }) {
  const selected = form.selectedDeliverables || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
        <div>
          <span className="font-label-sm font-bold uppercase tracking-wider text-secondary">Seção 4</span>
          <h2 className="font-headline-sm font-semibold text-on-surface">Plano de Trabalho</h2>
          <p className="text-body-sm text-on-surface-variant">
            Objetivos, atividades previstas, cronograma resumido e produtos/entregáveis institucionais.
          </p>
        </div>
        <Badge status="analysis" label="Plano" />
      </div>

      <Field
        id="objetivos"
        label="Objetivos da ação *"
        value={form.objectives}
        onChange={(e) => updateForm({ objectives: e.target.value })}
        error={errors.objectives}
        hint="Mín. 20 caracteres. Relacione os objetivos gerais e específicos."
        placeholder="Ex: Capacitar moradores para o uso seguro de serviços públicos digitais."
      />

      <Field
        id="atividades"
        label="Atividades previstas *"
        value={form.activities}
        onChange={(e) => updateForm({ activities: e.target.value })}
        error={errors.activities}
        hint="Mín. 20 caracteres. Descreva como os objetivos serão alcançados."
        placeholder="Ex: Oficinas semanais, mentorias individuais e rodas de conversa."
      />

      <Field
        id="cronograma"
        label="Cronograma resumido"
        value={form.timeline}
        onChange={(e) => updateForm({ timeline: e.target.value })}
        hint="Opcional. Indique meses/marcos principais (ex: mar–mai execução; jun avaliação)."
        placeholder="Ex: Mar: preparação • Abr–Out: execução • Nov: avaliação final"
      />

      <fieldset>
        <legend className="font-label-md font-semibold text-on-surface">
          Produtos e entregáveis *
        </legend>
        {errors.selectedDeliverables && (
          <p className="mt-1 text-sm text-error">{errors.selectedDeliverables}</p>
        )}
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {deliverables.map((d) => (
            <label
              key={d.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                selected.includes(d.value)
                  ? "border-primary bg-primary-container text-on-primary"
                  : "border-surface-container-highest bg-surface-container-low hover:bg-surface-container"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(d.value)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...selected, d.value]
                    : selected.filter((x) => x !== d.value);
                  updateForm({ selectedDeliverables: next });
                }}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-sm font-medium">{d.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

StepTrabalho.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  errors: PropTypes.object
};
