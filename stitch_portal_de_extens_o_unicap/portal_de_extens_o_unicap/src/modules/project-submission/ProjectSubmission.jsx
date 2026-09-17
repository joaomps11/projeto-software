import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ArrowBack, ArrowForward, Save, CheckCircle } from "../../components/ui/Icons";
import Stepper from "./components/Stepper";
import StepIdentificacao from "./components/StepIdentificacao";
import StepImpacto from "./components/StepImpacto";
import StepEquipe from "./components/StepEquipe";
import StepTrabalho from "./components/StepTrabalho";
import StepOrcamento from "./components/StepOrcamento";
import StepRevisao from "./components/StepRevisao";
import useSubmissionDraft from "./hooks/useSubmissionDraft";
import { validateStep, validateAttachment } from "./validation";
import {
  steps,
  createEmptySubmission,
  annexRules
} from "./data/submissionOptions";

const stepComponents = {
  identificacao: StepIdentificacao,
  impacto: StepImpacto,
  equipe: StepEquipe,
  trabalho: StepTrabalho,
  orcamento: StepOrcamento,
  revisao: StepRevisao
};

export default function ProjectSubmission() {
  const { form, updateForm, clearDraft, savedAt } = useSubmissionDraft(createEmptySubmission());
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const [attachmentError, setAttachmentError] = useState(null);
  const [submittedTitle, setSubmittedTitle] = useState(null);

  const stepId = steps[currentStep].id;
  const StepComponent = stepComponents[stepId];
  const isLast = currentStep === steps.length - 1;

  const goTo = (index) => {
    setStepErrors({});
    setCurrentStep(index);
  };

  const handleNext = () => {
    const result = validateStep(stepId, form);
    if (!result.ok) {
      setStepErrors(result.errors);
      return;
    }
    setStepErrors({});
    if (!isLast) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Envio (mock): em produção, POST para a API do portal.
    setSubmittedTitle(form.title);
    clearDraft();
  };

  const handleBack = () => {
    setStepErrors({});
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleAddAttachment = (files) => {
    setAttachmentError(null);
    const attachments = form.attachments || [];

    if (attachments.length + files.length > annexRules.maxFiles) {
      setAttachmentError(`Máximo de ${annexRules.maxFiles} anexos.`);
      return;
    }
    for (const file of files) {
      const error = validateAttachment(file);
      if (error) {
        setAttachmentError(`"${file.name}": ${error}`);
        return;
      }
    }
    updateForm({ attachments: [...attachments, ...files] });
  };

  const handleRemoveAttachment = (index) => {
    setAttachmentError(null);
    updateForm({
      attachments: (form.attachments || []).filter((_, i) => i !== index)
    });
  };

  if (submittedTitle !== null) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest py-20 text-center shadow-sm">
        <CheckCircle className="h-12 w-12 text-teal-700" />
        <h1 className="font-headline-lg font-semibold text-on-surface">Proposta enviada com sucesso!</h1>
        <p className="max-w-md text-body-md text-on-surface-variant">
          A proposta <strong>{submittedTitle}</strong> foi registrada e encaminhada ao comitê de extensão para
          análise. O acompanhamento de status estará disponível no módulo de Acompanhamento.
        </p>
        <Button variant="secondary" onClick={() => setSubmittedTitle(null)} className="mt-2">
          Criar nova proposta
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 flex items-center gap-2">
        <Badge status="active" />
        <span className="text-label-sm text-on-surface-variant">Módulo Docente • DEG / PROPESP</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface">
            Submissão de Proposta de Extensão
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Preencha os dados institucionais, metas de impacto social e alinhamento curricular de acordo com a
            Resolução CNE/CES nº 7/2018.
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-sm sm:flex">
          <Save className={`h-4 w-4 ${savedAt ? "text-teal-700" : "text-secondary"}`} />
          <span className="text-label-sm text-on-surface-variant">
            {savedAt
              ? `Rascunho salvo às ${new Date(savedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : "Rascunho salvo automaticamente"}
          </span>
        </div>
      </div>

      <Stepper steps={steps} currentStep={currentStep} onStepClick={goTo} />

      <Card className="p-6">
        <StepComponent
          form={form}
          updateForm={updateForm}
          errors={stepErrors}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          attachmentError={attachmentError}
        />

        <div className="mt-6 flex items-center justify-between border-t border-surface-container-high pt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
            <ArrowBack className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={clearDraft}
              className="gap-2"
              title="Apaga o rascunho salvo e recomeça o formulário"
            >
              <Save className="h-4 w-4" />
              Limpar rascunho
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {isLast ? "Enviar proposta" : "Continuar"}
              <ArrowForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
