import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  Camera, 
  MessageSquare,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FollowUpAction, ActionStatus, ActionPriority } from '../types';

export const OpportunitiesView: React.FC<{
  onSelectUnit: (unitId: string) => void;
}> = ({ onSelectUnit }) => {
  const { 
    filteredActions, 
    updateActionStatus, 
    addAction, 
    filteredUnits, 
    currentUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState<'todos' | ActionStatus>('todos');
  const [areaFilter, setAreaFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Closing action modal state
  const [closingAction, setClosingAction] = useState<FollowUpAction | null>(null);
  const [closeComments, setCloseComments] = useState('');
  const [solutionUrl, setSolutionUrl] = useState('');

  // New standalone action modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newUnitId, setNewUnitId] = useState(filteredUnits[0]?.id || '');
  const [newProblem, setNewProblem] = useState('');
  const [newArea, setNewArea] = useState<'Operaciones' | 'Mantenimiento' | 'Sistemas / TI' | 'Capacitación' | 'Abasto / Compras' | 'Calidad y Servicio'>('Operaciones');
  const [newAssigned, setNewAssigned] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newProposed, setNewProposed] = useState('');
  const [newPriority, setNewPriority] = useState<ActionPriority>('media');

  // Filter actions
  const displayedActions = filteredActions.filter(action => {
    const matchesStatus = statusFilter === 'todos' || action.status === statusFilter;
    const matchesArea = areaFilter === 'todas' || action.areaResponsible === areaFilter;
    const matchesSearch = 
      action.problemDetected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesArea && matchesSearch;
  });

  const handleOpenCloseModal = (action: FollowUpAction) => {
    setClosingAction(action);
    setCloseComments('');
    setSolutionUrl('https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80');
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingAction) return;

    updateActionStatus(
      closingAction.id,
      'concluido',
      new Date().toISOString().split('T')[0],
      closeComments || 'Acción verificada y concluida conforme al estándar operativo.',
      solutionUrl || undefined
    );
    setClosingAction(null);
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = filteredUnits.find(u => u.id === newUnitId) || filteredUnits[0];
    if (!targetUnit || !newProblem.trim()) return;

    addAction({
      evaluationId: 'manual',
      unitId: targetUnit.id,
      unitName: targetUnit.name,
      brand: targetUnit.brand,
      zone: targetUnit.zone,
      problemDetected: newProblem.trim(),
      areaResponsible: newArea,
      assignedPerson: newAssigned.trim() || 'Responsable de Operaciones',
      commitmentDate: newDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      proposedAction: newProposed.trim() || 'Seguimiento preventivo inmediato.',
      status: 'pendiente',
      priority: newPriority,
    });

    setShowNewModal(false);
    setNewProblem('');
    setNewProposed('');
    setNewAssigned('');
  };

  const pendingList = displayedActions.filter(a => a.status === 'pendiente');
  const inProgressList = displayedActions.filter(a => a.status === 'en_proceso');
  const completedList = displayedActions.filter(a => a.status === 'concluido');

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Gestión del Plan de Mejora Continua</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{filteredActions.length} Compromisos Registrados</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Seguimiento de Oportunidades y Compromisos
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Convierte desviaciones detectadas en campo en soluciones efectivas con responsable y fecha límite
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'kanban' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Tablero Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Lista Detallada
            </button>
          </div>

          {currentUser.canEditActions && (
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              + Nuevo Compromiso
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por problema, sucursal o responsable..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Area Filter */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="todas">Todas las Áreas</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Abasto / Compras">Abasto / Compras</option>
            <option value="Capacitación">Capacitación</option>
            <option value="Calidad y Servicio">Calidad y Servicio</option>
            <option value="Sistemas / TI">Sistemas / TI</option>
          </select>
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1 text-[11px]">Estatus:</span>
          {(['todos', 'pendiente', 'en_proceso', 'concluido'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: Pendiente */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pendientes por Atender
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                {pendingList.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {pendingList.map(action => (
                <div key={action.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {action.areaResponsible}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      action.priority === 'alta' ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {action.priority} prioridad
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">
                    {action.problemDetected}
                  </h4>

                  <button
                    onClick={() => onSelectUnit(action.unitId)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {action.unitName}
                  </button>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <strong>Compromiso:</strong> {action.proposedAction}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {action.assignedPerson}
                    </span>
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {action.commitmentDate}
                    </span>
                  </div>

                  {currentUser.canEditActions && (
                    <div className="pt-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateActionStatus(action.id, 'en_proceso')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Iniciar Atención →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: En Proceso */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  En Proceso de Corrección
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-200 text-blue-900">
                {inProgressList.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressList.map(action => (
                <div key={action.id} className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {action.areaResponsible}
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold animate-pulse">
                      En Curso
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">
                    {action.problemDetected}
                  </h4>

                  <button
                    onClick={() => onSelectUnit(action.unitId)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {action.unitName}
                  </button>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <strong>Acción:</strong> {action.proposedAction}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {action.assignedPerson}
                    </span>
                    <span className="text-blue-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {action.commitmentDate}
                    </span>
                  </div>

                  {currentUser.canEditActions && (
                    <div className="pt-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenCloseModal(action)}
                        className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
                      >
                        ✓ Concluir con Evidencia
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Concluido */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Concluidos y Resueltos
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                {completedList.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedList.map(action => (
                <div key={action.id} className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm space-y-2 opacity-95">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {action.areaResponsible}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {action.closeDate}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-through text-slate-600">
                    {action.problemDetected}
                  </h4>

                  <button
                    onClick={() => onSelectUnit(action.unitId)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {action.unitName}
                  </button>

                  {action.postReviewComments && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                      <strong>Revisión posterior:</strong> {action.postReviewComments}
                    </p>
                  )}

                  {action.solutionEvidenceUrl && (
                    <div className="pt-1">
                      <a
                        href={action.solutionEvidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Ver Evidencia de Solución
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Estatus</th>
                  <th className="py-3 px-4">Sucursal / Estación</th>
                  <th className="py-3 px-4">Problema Detectado</th>
                  <th className="py-3 px-4">Acción Propuesta</th>
                  <th className="py-3 px-4">Área / Asignado</th>
                  <th className="py-3 px-4">Fecha Compromiso</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedActions.map(action => (
                  <tr key={action.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        action.status === 'concluido'
                          ? 'bg-emerald-100 text-emerald-800'
                          : action.status === 'en_proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {action.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button onClick={() => onSelectUnit(action.unitId)} className="hover:text-indigo-600">
                        {action.unitName}
                      </button>
                    </td>
                    <td className="py-3 px-4 max-w-xs">{action.problemDetected}</td>
                    <td className="py-3 px-4 max-w-xs text-slate-600">{action.proposedAction}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{action.areaResponsible}</div>
                      <div className="text-[11px] text-slate-500">{action.assignedPerson}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-800">{action.commitmentDate}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {action.status !== 'concluido' && currentUser.canEditActions && (
                        <button
                          onClick={() => handleOpenCloseModal(action)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                        >
                          Concluir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal to complete action with evidence */}
      {closingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Concluir Compromiso con Evidencia
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {closingAction.problemDetected} ({closingAction.unitName})
            </p>

            <form onSubmit={handleConfirmClose} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comentarios de Revisión Posterior *
                </label>
                <textarea
                  value={closeComments}
                  onChange={(e) => setCloseComments(e.target.value)}
                  placeholder="Detalla cómo se resolvió la desviación (ej. Luminaria sustituida y probada)..."
                  rows={3}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL de Evidencia Fotográfica o Documental
                </label>
                <input
                  type="text"
                  value={solutionUrl}
                  onChange={(e) => setSolutionUrl(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClosingAction(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow"
                >
                  Confirmar Cierre de Acción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to create new action */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Crear Nuevo Compromiso de Seguimiento
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Asigna una acción correctiva directa a una tienda o estación
            </p>

            <form onSubmit={handleCreateAction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unidad Asignada *
                </label>
                <select
                  value={newUnitId}
                  onChange={(e) => setNewUnitId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {filteredUnits.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problema o Desviación Detectada *
                </label>
                <input
                  type="text"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Ej. Falta de uniforme en turno nocturno"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Acción Propuesta *
                </label>
                <input
                  type="text"
                  value={newProposed}
                  onChange={(e) => setNewProposed(e.target.value)}
                  placeholder="Ej. Entrega de dotación y amonestación verbal"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Área Responsable *
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="Operaciones">Operaciones</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Abasto / Compras">Abasto / Compras</option>
                    <option value="Capacitación">Capacitación</option>
                    <option value="Calidad y Servicio">Calidad y Servicio</option>
                    <option value="Sistemas / TI">Sistemas / TI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prioridad *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Persona Asignada *
                  </label>
                  <input
                    type="text"
                    value={newAssigned}
                    onChange={(e) => setNewAssigned(e.target.value)}
                    placeholder="Nombre del responsable"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha Compromiso *
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                >
                  Guardar Compromiso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
