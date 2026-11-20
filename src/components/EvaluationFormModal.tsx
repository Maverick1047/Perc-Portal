import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Camera, 
  Video, 
  CheckCircle, 
  AlertCircle, 
  Building2,
  Calendar,
  User,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  StoreUnit, 
  Brand, 
  OfficialCriterion, 
  EvidenceMedia, 
  FollowUpAction, 
  ActionPriority 
} from '../types';
import { ASTURIANO_CRITERIA_TEMPLATE, FLASH_CRITERIA_TEMPLATE } from '../data/seedData';
import { calculateEvaluationScore } from '../utils/metrics';

export const EvaluationFormModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { filteredUnits, addEvaluation, currentUser, isAsturianoOnly, isFlashOnly } = useApp();

  const availableUnitsForEval = useMemo(() => {
    if (isAsturianoOnly) return filteredUnits.filter((u: StoreUnit) => u.brand === 'Asturiano');
    if (isFlashOnly) return filteredUnits.filter((u: StoreUnit) => u.brand === 'Flash');
    return filteredUnits;
  }, [filteredUnits, isAsturianoOnly, isFlashOnly]);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(availableUnitsForEval[0]?.id || '');
  const currentUnit = availableUnitsForEval.find((u: StoreUnit) => u.id === selectedUnitId) || availableUnitsForEval[0];
  const isAsturiano = currentUnit?.brand === 'Asturiano';

  const [evaluationDate, setEvaluationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [auditorName, setAuditorName] = useState<string>(currentUser.name || 'Ricardo Méndez');
  const [storeReceivedBy, setStoreReceivedBy] = useState<string>('');

  // Criteria list matching the store's brand
  const [criteria, setCriteria] = useState<OfficialCriterion[]>(() => {
    return isAsturiano 
      ? JSON.parse(JSON.stringify(ASTURIANO_CRITERIA_TEMPLATE))
      : JSON.parse(JSON.stringify(FLASH_CRITERIA_TEMPLATE));
  });

  // Switch criteria template when selected unit changes brand
  useEffect(() => {
    if (currentUnit) {
      if (currentUnit.brand === 'Asturiano') {
        setCriteria(JSON.parse(JSON.stringify(ASTURIANO_CRITERIA_TEMPLATE)));
      } else {
        setCriteria(JSON.parse(JSON.stringify(FLASH_CRITERIA_TEMPLATE)));
      }
      setStoreReceivedBy(currentUnit.manager || '');
    }
  }, [selectedUnitId, currentUnit]);

  const [generalComments, setGeneralComments] = useState<string>('');
  const [strengthsList, setStrengthsList] = useState<string[]>([
    'Excelente atención y apego al protocolo de servicio',
    'Limpieza e imagen institucional sobresaliente'
  ]);
  const [strengthInput, setStrengthInput] = useState('');

  const [deviationsList, setDeviationsList] = useState<string[]>([
    'Reforzar invitación a registrar compras en la app'
  ]);
  const [deviationInput, setDeviationInput] = useState('');

  // Evidences: photos and videos
  const [evidences, setEvidences] = useState<EvidenceMedia[]>([
    {
      id: 'photo-1',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
      title: 'Vista general del piso de venta y góndolas',
      criterionName: 'Orden, limpieza e imagen',
      timestamp: new Date().toISOString().split('T')[0],
      notes: 'Piso pulcro y anaqueles frenteados.'
    },
    {
      id: 'video-1',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Video de recorrido y atención en caja / bomba',
      criterionName: 'Atención y bienvenida',
      timestamp: new Date().toISOString().split('T')[0],
      duration: '0:45 min',
      notes: 'Grabación de auditoría en video sobre tiempos de atención.'
    }
  ]);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaNotes, setNewMediaNotes] = useState('');

  // Commitments
  const [actionProblem, setActionProblem] = useState('');
  const [actionArea, setActionArea] = useState<'Operaciones' | 'Mantenimiento' | 'Sistemas / TI' | 'Capacitación' | 'Abasto / Compras' | 'Calidad y Servicio'>('Capacitación');
  const [actionAssigned, setActionAssigned] = useState('');
  const [actionDate, setActionDate] = useState('');
  const [actionProposed, setActionProposed] = useState('');
  const [actionsList, setActionsList] = useState<Array<{
    problemDetected: string;
    areaResponsible: any;
    assignedPerson: string;
    commitmentDate: string;
    proposedAction: string;
    priority: ActionPriority;
  }>>([]);

  // Calculate live score
  const scoreCalc = calculateEvaluationScore(criteria, currentUnit?.brand || 'Asturiano');

  const handleCriterionScoreChange = (id: string, newPoints: number) => {
    setCriteria(prev => prev.map(c => {
      if (c.id === id) {
        const capped = Math.min(c.maxPoints, Math.max(0, newPoints));
        return { ...c, achievedPoints: Math.round(capped * 100) / 100 };
      }
      return c;
    }));
  };

  const handleAddMedia = () => {
    if (!newMediaTitle.trim()) return;
    const defaultPhoto = 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80';
    const defaultVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
    
    setEvidences(prev => [
      ...prev,
      {
        id: `media-${Date.now()}`,
        type: newMediaType,
        url: newMediaUrl.trim() || (newMediaType === 'video' ? defaultVideo : defaultPhoto),
        title: newMediaTitle.trim(),
        timestamp: new Date().toISOString().split('T')[0],
        notes: newMediaNotes.trim() || 'Evidencia levantada en auditoría oficial.',
        duration: newMediaType === 'video' ? '1:00 min' : undefined,
      }
    ]);

    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaNotes('');
  };

  const handleAddAction = () => {
    if (!actionProblem.trim() || !actionProposed.trim()) return;
    setActionsList(prev => [
      ...prev,
      {
        problemDetected: actionProblem.trim(),
        areaResponsible: actionArea,
        assignedPerson: actionAssigned.trim() || currentUnit.manager || 'Responsable en turno',
        commitmentDate: actionDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        proposedAction: actionProposed.trim(),
        priority: 'media' as const,
      }
    ]);
    setActionProblem('');
    setActionProposed('');
    setActionAssigned('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit) return;

    addEvaluation(
      {
        unitId: currentUnit.id,
        unitName: currentUnit.name,
        brand: currentUnit.brand,
        zone: currentUnit.zone,
        evaluationDate,
        auditorName: auditorName || currentUser.name,
        storeReceivedBy: storeReceivedBy || currentUnit.manager || 'Responsable en turno',
        generalScore: scoreCalc.percentage,
        totalPointsAchieved: scoreCalc.achieved,
        totalPointsMax: scoreCalc.max,
        criteriaBreakdown: criteria,
        generalComments: generalComments || 'Auditoría completada conforme a los estándares de PercPortal.',
        strengths: strengthsList,
        deviations: deviationsList,
        evidences,
        status: actionsList.length > 0 ? 'con_observaciones' : 'completada',
      },
      actionsList.map(a => ({
        unitId: currentUnit.id,
        unitName: currentUnit.name,
        brand: currentUnit.brand,
        zone: currentUnit.zone,
        problemDetected: a.problemDetected,
        areaResponsible: a.areaResponsible,
        assignedPerson: a.assignedPerson,
        commitmentDate: a.commitmentDate,
        proposedAction: a.proposedAction,
        status: 'pendiente' as const,
        priority: a.priority,
      }))
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          isAsturiano ? 'bg-red-700' : 'bg-orange-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-black font-black flex items-center justify-center text-lg shadow-md">
              P
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                PercPortal • Cargar Evaluación de Datos
              </h2>
              <p className="text-xs text-white/80">
                Proyecta directamente al dashboard de Dirección General y Operaciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white bg-black/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Section 1: Store & Auditor */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              1. Datos de la Visita y Sucursal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sucursal o Estación *
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {availableUnitsForEval.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Responsable del Portal (Auditor) *
                </label>
                <input
                  type="text"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Personal que Atendió
                </label>
                <input
                  type="text"
                  value={storeReceivedBy}
                  onChange={(e) => setStoreReceivedBy(e.target.value)}
                  placeholder={currentUnit?.manager}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Exact Criteria Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  2. Criterios Oficiales: {isAsturiano ? 'Tiendas Asturiano (Escala 15.00 pts)' : 'Estaciones Flash (Escala 100 pts)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ingresa el puntaje obtenido por criterio para proyectar el resultado en tiempo real
                </p>
              </div>

              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 shadow-sm flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Total Proyectado:</span>
                <span className="text-base font-black text-slate-900">
                  {scoreCalc.achieved} / {scoreCalc.max} pts ({scoreCalc.percentage}%)
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {criteria.map((c, idx) => (
                <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        (Máx: {c.maxPoints} pts)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step={isAsturiano ? '0.05' : '1'}
                        min="0"
                        max={c.maxPoints}
                        value={c.achievedPoints}
                        onChange={(e) => handleCriterionScoreChange(c.id, parseFloat(e.target.value) || 0)}
                        className="w-20 p-1.5 text-xs text-center font-bold rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                      />
                      <span className="text-xs font-bold text-slate-500">/ {c.maxPoints} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Observaciones y Hallazgos */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Observaciones y Comentarios Generales
            </h3>
            <textarea
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              placeholder="Detalla el diagnóstico cualitativo de la visita..."
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              required
            />
          </div>

          {/* Section 4: Fotos y Videos */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-600" />
                4. Cargar Videos y Fotografías de la Visita ({evidences.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {evidences.map((ev, i) => (
                <div key={ev.id || i} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {ev.type === 'video' ? <Video className="w-4 h-4 text-purple-600 shrink-0" /> : <Camera className="w-4 h-4 text-blue-600 shrink-0" />}
                    <span className="font-bold truncate">{ev.title}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEvidences(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Media */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <select
                value={newMediaType}
                onChange={(e) => setNewMediaType(e.target.value as any)}
                className="p-1.5 rounded-lg border border-slate-300"
              >
                <option value="photo">Fotografía</option>
                <option value="video">Video de Visita</option>
              </select>
              <input
                type="text"
                value={newMediaTitle}
                onChange={(e) => setNewMediaTitle(e.target.value)}
                placeholder="Título del video o foto"
                className="p-1.5 rounded-lg border border-slate-300 sm:col-span-2"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="bg-slate-900 text-white font-bold p-1.5 rounded-lg hover:bg-slate-800"
              >
                + Adjuntar Evidencia
              </button>
            </div>
          </div>

          {/* Section 5: Compromisos */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              5. Compromisos Correctivos (Seguimiento de Oportunidades)
            </h3>

            {actionsList.length > 0 && (
              <div className="space-y-1.5">
                {actionsList.map((a, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs flex justify-between">
                    <div>
                      <strong>{a.problemDetected}</strong> ({a.areaResponsible} • {a.commitmentDate})
                    </div>
                    <button type="button" onClick={() => setActionsList(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                value={actionProblem}
                onChange={(e) => setActionProblem(e.target.value)}
                placeholder="Desviación detectada..."
                className="p-2 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                value={actionProposed}
                onChange={(e) => setActionProposed(e.target.value)}
                placeholder="Acción propuesta..."
                className="p-2 rounded-lg border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={handleAddAction}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold p-2 rounded-lg"
              >
                + Registrar Compromiso
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-xs sm:text-sm font-black text-white rounded-xl shadow-lg hover:scale-105 transition-all ${
                isAsturiano ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              Guardar y Proyectar al Dashboard
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
