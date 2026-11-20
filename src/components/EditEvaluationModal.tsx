import React, { useState, useEffect } from 'react';
import { Evaluation, OfficialCriterion } from '../types';
import { 
  X, 
  Save, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  User,
  Award,
  FileText
} from 'lucide-react';

export interface EditEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
  onSave: (evalId: string, updates: Partial<Evaluation>) => void;
  onDelete?: (evalId: string) => void;
}

export const EditEvaluationModal: React.FC<EditEvaluationModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  onSave,
  onDelete
}) => {
  const [generalScore, setGeneralScore] = useState<number>(evaluation?.generalScore ?? 85);
  const [evaluationDate, setEvaluationDate] = useState<string>(evaluation?.evaluationDate ?? '');
  const [auditorName, setAuditorName] = useState<string>(evaluation?.auditorName ?? '');
  const [storeReceivedBy, setStoreReceivedBy] = useState<string>(evaluation?.storeReceivedBy ?? '');
  const [generalComments, setGeneralComments] = useState<string>(evaluation?.generalComments ?? '');
  const [criteria, setCriteria] = useState<OfficialCriterion[]>(evaluation?.criteriaBreakdown ?? []);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (evaluation) {
      setGeneralScore(evaluation.generalScore);
      setEvaluationDate(evaluation.evaluationDate);
      setAuditorName(evaluation.auditorName);
      setStoreReceivedBy(evaluation.storeReceivedBy || '');
      setGeneralComments(evaluation.generalComments || '');
      setCriteria(evaluation.criteriaBreakdown ? JSON.parse(JSON.stringify(evaluation.criteriaBreakdown)) : []);
      setSuccessMsg('');
    }
  }, [evaluation, isOpen]);

  if (!isOpen || !evaluation) return null;

  const isAsturiano = evaluation.brand === 'Asturiano';

  const handleCriterionChange = (index: number, newAchieved: number) => {
    const updated = [...criteria];
    const max = updated[index].maxPoints;
    const clamped = Math.max(0, Math.min(max, newAchieved));
    updated[index] = { ...updated[index], achievedPoints: clamped };
    setCriteria(updated);

    // Auto recalculate total points and general score
    const totalAchieved = updated.reduce((acc, c) => acc + c.achievedPoints, 0);
    const totalMax = updated.reduce((acc, c) => acc + c.maxPoints, 0);
    const scorePct = totalMax > 0 ? Math.round((totalAchieved / totalMax) * 1000) / 10 : 0;
    setGeneralScore(scorePct);
  };

  const handleNotesChange = (index: number, newNotes: string) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], notes: newNotes };
    setCriteria(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalAchieved = criteria.reduce((acc, c) => acc + c.achievedPoints, 0);
    const totalMax = criteria.reduce((acc, c) => acc + c.maxPoints, 0);

    onSave(evaluation.id, {
      generalScore: Number(generalScore),
      evaluationDate,
      auditorName: auditorName.trim(),
      storeReceivedBy: storeReceivedBy.trim(),
      generalComments: generalComments.trim(),
      criteriaBreakdown: criteria,
      totalPointsAchieved: Math.round(totalAchieved * 100) / 100,
      totalPointsMax: totalMax,
    });

    setSuccessMsg('¡Auditoría actualizada con éxito!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  const handleDelete = () => {
    if (window.confirm('¿Confirmas que deseas eliminar esta auditoría del historial?')) {
      if (onDelete) {
        onDelete(evaluation.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 text-white relative ${
          isAsturiano 
            ? 'bg-gradient-to-r from-red-700 via-red-800 to-slate-900' 
            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Modificar Auditoría · {evaluation.brand}
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80 font-mono font-bold">{evaluation.unitName}</span>
              </div>
              <h3 className="text-xl font-black font-unbounded text-white">
                Editar Resultados de Auditoría
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Stats & Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Calificación General (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={generalScore}
                onChange={(e) => setGeneralScore(Number(e.target.value))}
                required
                className="w-full text-sm font-black text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de Auditoría
              </label>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Auditor Responsable
              </label>
              <input
                type="text"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Personal de Sucursal que Recibió la Auditoría
            </label>
            <input
              type="text"
              value={storeReceivedBy}
              onChange={(e) => setStoreReceivedBy(e.target.value)}
              placeholder="Ej. Raúl Sánchez Gómez (Gerente de Turno)"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observaciones y Comentarios Generales
            </label>
            <textarea
              rows={2}
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              placeholder="Dictamen general sobre orden, protocolo, lealtad y atención..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Criteria Breakdown Editor */}
          {criteria.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 font-unbounded flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Desglose de los 10 Criterios Oficiales
                </h4>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  Total: {criteria.reduce((a, b) => a + b.achievedPoints, 0).toFixed(2)} / {criteria.reduce((a, b) => a + b.maxPoints, 0)} pts
                </span>
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {criteria.map((c, idx) => (
                  <div key={c.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-800 leading-snug flex-1">
                        {idx + 1}. {c.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max={c.maxPoints}
                          value={c.achievedPoints}
                          onChange={(e) => handleCriterionChange(idx, Number(e.target.value))}
                          className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-slate-400 font-mono">/ {c.maxPoints} pts</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={c.notes || ''}
                      onChange={(e) => handleNotesChange(idx, e.target.value)}
                      placeholder="Nota de cumplimiento o hallazgo en campo..."
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Auditoría</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                  isAsturiano 
                    ? 'bg-red-700 hover:bg-red-800 shadow-red-900/20' 
                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
