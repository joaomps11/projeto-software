import { useCallback, useMemo, useState } from "react";
import { initialFrequency } from "../data/trackingData";
import {
  homologateRecord,
  countPendingHomologations,
  monthCompletion,
  HOMOLOGATED
} from "../trackingLogic";

export default function useFrequencySheet(students) {
  const [frequency, setFrequency] = useState(initialFrequency);

  const registerHours = useCallback((monthId, studentId, hours) => {
    setFrequency((prev) => ({
      ...prev,
      [monthId]: {
        ...prev[monthId],
        [studentId]: {
          // só reinicia status se estava faltando; edição não deshomologa
          status: prev[monthId]?.[studentId]?.status === HOMOLOGATED ? HOMOLOGATED : "pending",
          hours: Math.max(0, Number(hours) || 0)
        }
      }
    }));
  }, []);

  const homologate = useCallback((monthId, studentId) => {
    // Valida com o estado atual e só aplica a mudança se for válida;
    // nunca compute o retorno dentro do updater (pode rodar adiado/duas vezes).
    const record = frequency[monthId]?.[studentId];
    const result = homologateRecord(record);
    if (!result.ok) return result;
    setFrequency((prev) => ({
      ...prev,
      [monthId]: {
        ...prev[monthId],
        [studentId]: { ...record, status: result.status }
      }
    }));
    return result;
  }, [frequency]);

  const homologateSelected = useCallback((monthId, studentIds) => {
    const results = [];
    const sheet = { ...(frequency[monthId] || {}) };
    let changed = false;
    for (const studentId of studentIds) {
      const record = sheet[studentId];
      const result = homologateRecord(record);
      results.push({ studentId, ...result });
      if (result.ok) {
        sheet[studentId] = { ...record, status: result.status };
        changed = true;
      }
    }
    if (changed) {
      setFrequency((prev) => ({ ...prev, [monthId]: sheet }));
    }
    return results;
  }, [frequency]);

  const pendingCount = useCallback(
    (monthId) => countPendingHomologations(frequency, monthId),
    [frequency]
  );

  const completion = useCallback(
    (monthId) => monthCompletion(frequency, monthId),
    [frequency]
  );

  const totals = useMemo(() => {
    const byStudent = {};
    for (const student of students) {
      let total = 0;
      for (const monthId of Object.keys(frequency)) {
        total += Number(frequency[monthId]?.[student.id]?.hours) || 0;
      }
      byStudent[student.id] = total;
    }
    return byStudent;
  }, [frequency, students]);

  return { frequency, registerHours, homologate, homologateSelected, pendingCount, completion, totals };
}
