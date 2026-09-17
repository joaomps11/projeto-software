import PropTypes from "prop-types";
import Card from "../../../components/ui/Card";
import { formatDate } from "../../../utils/format";
import { CheckCircle, Pending, Clock } from "../../../components/ui/Icons";

const statusStyle = {
  completed: {
    icon: <CheckCircle className="h-5 w-5 text-teal-700" />,
    ring: "border-primary bg-primary-container/20",
    label: "Concluído"
  },
  current: {
    icon: <Pending className="h-5 w-5 text-secondary" />,
    ring: "border-secondary bg-secondary-container/20",
    label: "Em andamento"
  },
  upcoming: {
    icon: <Clock className="h-5 w-5 text-on-surface-variant" />,
    ring: "border-surface-container-highest bg-surface-container-low",
    label: "Previsto"
  }
};

export default function MilestonesTimeline({ milestones }) {
  return (
    <Card className="p-6">
      <h2 className="mb-1 font-headline-md font-semibold text-on-surface">Cronograma & Marcos</h2>
      <p className="mb-5 text-body-sm text-on-surface-variant">
        Execução prevista vs. realizada ao longo da vigência do projeto.
      </p>

      <ol className="relative flex flex-col gap-6 border-l-2 border-surface-container-highest pl-6">
        {milestones.map((milestone) => {
          const style = statusStyle[milestone.status] || statusStyle.upcoming;
          return (
            <li key={milestone.id} className="relative">
              <span
                className={`absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-surface-container-lowest ${style.ring}`}
              >
                {style.icon}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-lg font-semibold text-on-surface">{milestone.label}</span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-xs font-medium text-on-surface-variant">
                  {style.label}
                </span>
              </div>
              <p className="text-body-sm text-secondary">
                {formatDate(milestone.date)}
              </p>
              <p className="mt-1 text-body-md text-on-surface-variant">{milestone.detail}</p>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

MilestonesTimeline.propTypes = {
  milestones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["completed", "current", "upcoming"]).isRequired,
      detail: PropTypes.string.isRequired
    })
  ).isRequired
};
