import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Camera, 
  Video,
  Play,
  Clock, 
  ShieldAlert,
  ChevronRight,
  Filter,
  Eye,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Download,
  Share2,
  Award,
  Sparkles,
  Edit3,
  Plus,
  Store,
  Fuel,
  Info,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { Brand, Evaluation, StoreUnit } from '../types';
import { downloadHistoryExcel, printHistoryReport } from '../utils/reportExporter';
import { ReportPreviewModal } from './ReportPreviewModal';
import { EditUnitModal } from './EditUnitModal';
import { EditEvaluationModal } from './EditEvaluationModal';
import { AddUnitModal } from './AddUnitModal';
import { MASTER_CATALOG_SUMMARY } from '../data/masterCatalog';

export const HistoryView: React.FC<{
  initialUnitId?: string | null;
  onOpenNewEval: () => void;
  onOpenVisitDetail: (evaluation: Evaluation) => void;
}> = ({ initialUnitId, onOpenNewEval, onOpenVisitDetail }) => {
  const { 
    filteredUnits, 
    filteredEvaluations, 
    filteredActions, 
    selectedUnitId, 
    setSelectedUnitId,
    currentUser,
    currentAccount,
    brandFilter,
    isAsturianoOnly,
    isFlashOnly,
    isMultiBrand,
    updateUnit,
    addUnit,
    updateEvaluation,
    deleteEvaluation
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<'Todas' | Brand>(() => {
    if (isAsturianoOnly) return 'Asturiano';
    if (isFlashOnly) return 'Flash';
    return 'Todas';
  });

  // Directory filter pills
  const [asturianoStatusFilter, setAsturianoStatusFilter] = useState<'todas' | 'activas' | 'historicas'>('todas');
  const [flashStatusFilter, setFlashStatusFilter] = useState<'todas' | 'cumplida' | 'progreso'>('todas');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [editingEval, setEditingEval] = useState<Evaluation | null>(null);

  const activeUnitId = selectedUnitId || initialUnitId || filteredUnits[0]?.id;
  const currentUnit = filteredUnits.find(u => u.id === activeUnitId) || filteredUnits[0];

  const unitEvaluations = useMemo(() => {
    if (!currentUnit) return [];
    return filteredEvaluations
      .filter(e => e.unitId === currentUnit.id)
      .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
  }, [filteredEvaluations, currentUnit]);

  const unitActions = useMemo(() => {
    if (!currentUnit) return [];
    return filteredActions.filter(a => a.unitId === currentUnit.id);
  }, [filteredActions, currentUnit]);

  const latestEval = unitEvaluations[0];
  const previousEval = unitEvaluations[1];

  const averageScore = useMemo(() => {
    if (unitEvaluations.length === 0) return 0;
    const sum = unitEvaluations.reduce((acc, curr) => acc + curr.generalScore, 0);
    return Math.round((sum / unitEvaluations.length) * 10) / 10;
  }, [unitEvaluations]);

  const improvements = useMemo(() => {
    if (!latestEval || !previousEval) return null;
    return {
      generalDiff: Math.round((latestEval.generalScore - previousEval.generalScore) * 10) / 10,
      pointsDiff: Math.round((latestEval.totalPointsAchieved - previousEval.totalPointsAchieved) * 100) / 100,
    };
  }, [latestEval, previousEval]);

  // Filtered unit list with search, brand and status filter
  const visibleUnits = useMemo(() => {
    return filteredUnits.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        u.name.toLowerCase().includes(q) ||
        (u.address && u.address.toLowerCase().includes(q)) ||
        u.code.toLowerCase().includes(q) ||
        u.zone.toLowerCase().includes(q) ||
        (u.variants && u.variants.toLowerCase().includes(q)) ||
        (u.manager && u.manager.toLowerCase().includes(q))
      );
      
      if (isAsturianoOnly) {
        if (!matchesSearch || u.brand !== 'Asturiano') return false;
        if (asturianoStatusFilter === 'activas') return u.isActiveInSept2026 === true;
        if (asturianoStatusFilter === 'historicas') return u.isActiveInSept2026 === false;
        return true;
      }

      if (isFlashOnly) {
        if (!matchesSearch || u.brand !== 'Flash') return false;
        if (flashStatusFilter === 'cumplida') return (u.visitsCount ?? 0) >= (u.visitTarget ?? 12);
        if (flashStatusFilter === 'progreso') return (u.visitsCount ?? 0) < (u.visitTarget ?? 12);
        return true;
      }

      const matchesBrand = selectedBrandFilter === 'Todas' || u.brand === selectedBrandFilter;
      if (!matchesSearch || !matchesBrand) return false;

      if (u.brand === 'Asturiano') {
        if (asturianoStatusFilter === 'activas') return u.isActiveInSept2026 === true;
        if (asturianoStatusFilter === 'historicas') return u.isActiveInSept2026 === false;
      } else if (u.brand === 'Flash') {
        if (flashStatusFilter === 'cumplida') return (u.visitsCount ?? 0) >= (u.visitTarget ?? 12);
        if (flashStatusFilter === 'progreso') return (u.visitsCount ?? 0) < (u.visitTarget ?? 12);
      }

      return true;
    });
  }, [filteredUnits, searchQuery, selectedBrandFilter, asturianoStatusFilter, flashStatusFilter, isAsturianoOnly, isFlashOnly]);

  if (!currentUnit) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-unbounded">No se encontraron sucursales disponibles</h3>
        <p className="text-xs text-slate-500 mt-1">Verifica tus permisos de acceso o los filtros activos.</p>
      </div>
    );
  }

  const isAsturiano = currentUnit.brand === 'Asturiano';
  const totalVideos = unitEvaluations.reduce((acc, curr) => acc + curr.evidences.filter(e => e.type === 'video').length, 0);
  const totalPhotos = unitEvaluations.reduce((acc, curr) => acc + curr.evidences.filter(e => e.type === 'photo').length, 0);

  return (
    <>
      <div className="space-y-6">

        {/* Master Catalog Summary Banner (Catalogo Maestro PERC) */}
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm relative overflow-hidden text-white ${
          isAsturiano 
            ? 'bg-gradient-to-r from-red-800 via-red-900 to-slate-950 border-red-700/50' 
            : 'bg-gradient-to-r from-orange-700 via-amber-700 to-slate-950 border-orange-600/50'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider font-unbounded">
                  Catálogo Maestro Grupo PERC
                </span>
                <span className="text-xs text-white/60">·</span>
                <span className="text-xs font-semibold text-white/90">
                  {isAsturiano ? '234 Sucursales Unificadas' : '20 Estaciones Oficiales'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-unbounded">
                {isAsturiano ? 'Historial & Red de Tiendas Asturiano' : 'Historial & Red de Estaciones Flash'}
              </h2>
              <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
                {isAsturiano 
                  ? 'Base maestra de 234 sucursales unificadas, 60 tiendas evaluadas con dictamen en septiembre 2026, 460 visitas anuales asignadas y 382 variantes analizadas.'
                  : 'Red operativa de 20 estaciones Flash, 181 visitas acumuladas en el periodo, meta institucional de 12 visitas (total 240 meta) y 75% proporción global.'}
              </p>
            </div>

            {/* Quick KPI pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isAsturiano ? (
                <>
                  <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">Total Red</span>
                    <span className="text-lg font-black font-mono">234</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Activas Sep '26</span>
                    <span className="text-lg font-black font-mono">60</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-white/80 block">Históricas</span>
                    <span className="text-lg font-black font-mono">174</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-amber-400/20 backdrop-blur-xs border border-amber-300/30 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">Visitas Anuales</span>
                    <span className="text-lg font-black font-mono">460</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">Estaciones</span>
                    <span className="text-lg font-black font-mono">20</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Visitas</span>
                    <span className="text-lg font-black font-mono">181</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-white/80 block">Meta Anual</span>
                    <span className="text-lg font-black font-mono">240</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-amber-400/20 backdrop-blur-xs border border-amber-300/30 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">Proporción</span>
                    <span className="text-lg font-black font-mono">75%</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar: Search, Filters & Unit Directory */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 font-unbounded">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  {isAsturianoOnly ? 'Directorio Asturiano' : isFlashOnly ? 'Directorio Flash' : 'Directorio de Unidades'}
                </h3>
                
                {/* Button to add new unit */}
                {currentUser.canUploadData && (
                  <button
                    onClick={() => setIsAddUnitOpen(true)}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Dar de alta una nueva sucursal o estación en el catálogo"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Alta</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAsturianoOnly ? 'Buscar tienda, código, variante...' : isFlashOnly ? 'Buscar estación Flash, código...' : 'Buscar por nombre, código o zona...'}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/80 transition-all placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              {/* Multi-Brand Switcher (Only if multi-brand user) */}
              {isMultiBrand && (
                <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setSelectedBrandFilter('Todas')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedBrandFilter === 'Todas' ? 'bg-white shadow-xs text-slate-900 font-unbounded' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedBrandFilter('Asturiano')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedBrandFilter === 'Asturiano' ? 'bg-red-600 text-white shadow-xs font-unbounded' : 'text-slate-600 hover:text-red-700'
                    }`}
                  >
                    Asturiano
                  </button>
                  <button
                    onClick={() => setSelectedBrandFilter('Flash')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedBrandFilter === 'Flash' ? 'bg-orange-500 text-amber-950 shadow-xs font-unbounded' : 'text-slate-600 hover:text-orange-700'
                    }`}
                  >
                    Flash
                  </button>
                </div>
              )}

              {/* Status Filter Pills for Asturiano */}
              {(isAsturianoOnly || selectedBrandFilter === 'Asturiano') && (
                <div className="flex gap-1 bg-slate-100/90 p-1 rounded-xl text-[11px]">
                  <button
                    onClick={() => setAsturianoStatusFilter('todas')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      asturianoStatusFilter === 'todas' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas (234)
                  </button>
                  <button
                    onClick={() => setAsturianoStatusFilter('activas')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      asturianoStatusFilter === 'activas' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-red-700'
                    }`}
                  >
                    Activas (60)
                  </button>
                  <button
                    onClick={() => setAsturianoStatusFilter('historicas')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      asturianoStatusFilter === 'historicas' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Histórico (174)
                  </button>
                </div>
              )}

              {/* Status Filter Pills for Flash */}
              {(isFlashOnly || selectedBrandFilter === 'Flash') && (
                <div className="flex gap-1 bg-slate-100/90 p-1 rounded-xl text-[11px]">
                  <button
                    onClick={() => setFlashStatusFilter('todas')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      flashStatusFilter === 'todas' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas (20)
                  </button>
                  <button
                    onClick={() => setFlashStatusFilter('cumplida')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      flashStatusFilter === 'cumplida' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    Meta Cumplida (≥12)
                  </button>
                  <button
                    onClick={() => setFlashStatusFilter('progreso')}
                    className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                      flashStatusFilter === 'progreso' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-amber-700'
                    }`}
                  >
                    En Progreso (&lt;12)
                  </button>
                </div>
              )}

              {/* Counter */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span>Mostrando:</span>
                <span className="font-bold text-slate-700">{visibleUnits.length} sucursales</span>
              </div>

              {/* Unit List */}
              <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
                {visibleUnits.map(unit => {
                  const isSelected = unit.id === currentUnit.id;
                  const unitEvals = filteredEvaluations.filter(e => e.unitId === unit.id);
                  const latestScore = unitEvals[0]?.generalScore;

                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? unit.brand === 'Asturiano'
                            ? 'bg-slate-950 text-white border-red-600 shadow-md ring-1 ring-red-500/30'
                            : 'bg-slate-950 text-white border-orange-500 shadow-md ring-1 ring-orange-500/30'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Active accent strip */}
                      {isSelected && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          unit.brand === 'Asturiano' ? 'bg-red-600' : 'bg-orange-500'
                        }`} />
                      )}

                      <div className="min-w-0 pr-2 pl-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            unit.brand === 'Asturiano' ? 'bg-red-500' : 'bg-orange-400'
                          }`} />
                          <span className="text-xs font-black truncate group-hover:text-amber-500 transition-colors">
                            {unit.name}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                          {unit.code} · {unit.zone}
                        </p>
                        
                        {/* Status tag */}
                        {unit.brand === 'Asturiano' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                            unit.isActiveInSept2026
                              ? isSelected ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-red-50 text-red-700'
                              : isSelected ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {unit.isActiveInSept2026 ? 'Activa Sep \'26' : 'Solo histórico'}
                          </span>
                        )}

                        {unit.brand === 'Flash' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                            (unit.visitsCount ?? 0) >= (unit.visitTarget ?? 12)
                              ? isSelected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700'
                              : isSelected ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {unit.visitsCount ?? 0}/{unit.visitTarget ?? 12} visitas
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {latestScore !== undefined ? (
                          <div className={`text-xs font-black px-2 py-0.5 rounded-lg font-mono ${
                            isSelected 
                              ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                              : latestScore >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {latestScore}%
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Sin visitas</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Historical File & Technical Dossier */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Unit Technical Dossier Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
              
              {/* Brand Accent Glow */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                isAsturiano ? 'bg-gradient-to-r from-red-600 via-amber-400 to-blue-600' : 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400'
              }`} />

              {/* Dossier Header & Corporate Export Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4 pt-1">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      isAsturiano 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-orange-50 text-orange-800 border border-orange-200'
                    }`}>
                      {isAsturiano ? 'Tiendas Asturiano (Escala 15.00 pts)' : 'Estaciones Flash (Escala 100 pts)'}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600 font-mono">{currentUnit.code}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{currentUnit.zone}</span>
                    
                    {currentUnit.statusLabel && (
                      <>
                        <span className="text-xs text-slate-400">·</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          currentUnit.statusLabel.includes('cumplida') || currentUnit.statusLabel.includes('Activa')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {currentUnit.statusLabel}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-unbounded">
                    {currentUnit.name}
                  </h2>
                </div>

                {/* ACTION TOOLBAR: Edit Unit, PDF, Excel, New Audit */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                  {/* Edit Unit Button */}
                  {currentUser.canUploadData && (
                    <button
                      onClick={() => setIsEditUnitOpen(true)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:border-slate-400"
                      title="Modificar nombre, metas de visitas, estatus y datos generales"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Modificar Unidad</span>
                    </button>
                  )}

                  {/* Print / PDF Modal Button */}
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border ${
                      isAsturiano
                        ? 'bg-red-700 hover:bg-red-800 text-white border-red-800 hover:shadow-red-900/20'
                        : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-700 hover:shadow-orange-900/20'
                    }`}
                    title="Generar y previsualizar reporte para impresión o descarga PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Reporte PDF</span>
                  </button>

                  {/* Direct Excel Download Button */}
                  <button
                    onClick={() => downloadHistoryExcel(currentUnit, unitEvaluations)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:border-slate-400"
                    title="Exportar archivo CSV / Excel estructurado con UTF-8 BOM"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>Exportar Excel</span>
                  </button>

                  {/* New Evaluation Button if permitted */}
                  {currentUser.canUploadData && (
                    <button
                      onClick={onOpenNewEval}
                      className="px-3.5 py-2 text-xs font-bold text-amber-400 bg-slate-950 hover:bg-slate-900 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-unbounded"
                    >
                      + Nueva Auditoría
                    </button>
                  )}
                </div>
              </div>

              {/* Branch Technical Info Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-xs">
                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">Ubicación</span>
                    <span className="text-slate-800 font-semibold leading-snug block">{currentUnit.address || 'Ubicación registrada en catálogo'}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{currentUnit.zone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <User className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">Responsable / Contacto</span>
                    <span className="text-slate-900 font-bold leading-snug block">{currentUnit.manager || 'Supervisor Asignado'}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{currentUnit.email || currentUnit.phone || 'contacto@portal.demo'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">Meta y Visitas Registradas</span>
                    <span className="text-slate-800 font-semibold leading-snug block">
                      {currentUnit.visitsCount ?? unitEvaluations.length} realizadas / {currentUnit.visitTarget ?? (isAsturiano ? 2 : 12)} meta
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {unitEvaluations.length} auditorías con dictamen
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra catalog info: variants or shared location */}
              {isAsturiano && currentUnit.variants && (
                <div className="mt-3 p-3 bg-red-50/50 rounded-2xl border border-red-100 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-900">Variantes de nombre analizadas: </strong>
                    <span className="text-red-800 font-mono text-[11px]">{currentUnit.variants}</span>
                  </div>
                </div>
              )}

              {!isAsturiano && currentUnit.sharedWith && (
                <div className="mt-3 p-3 bg-orange-50/60 rounded-2xl border border-orange-100 text-xs flex items-start gap-2">
                  <Store className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-orange-950">Tiendas vinculadas a esta estación Flash: </strong>
                    <span className="text-orange-850 font-bold">{currentUnit.sharedWith}</span>
                  </div>
                </div>
              )}

              {/* Quick KPI Stat Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Promedio Histórico</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-black text-slate-900 font-unbounded">{averageScore}%</span>
                    <span className="text-[10px] font-bold text-slate-400">({unitEvaluations.length} ev.)</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Última Calificación</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className={`text-xl font-black font-unbounded ${
                      (latestEval?.generalScore ?? 0) >= 85 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {latestEval ? `${latestEval.generalScore}%` : 'N/A'}
                    </span>
                    {latestEval && (
                      <span className="text-[10px] font-medium text-slate-500">
                        {latestEval.totalPointsAchieved}/{latestEval.totalPointsMax}p
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tendencia vs Previa</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {improvements ? (
                      improvements.generalDiff >= 0 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{improvements.generalDiff}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                          <TrendingDown className="w-4 h-4" />
                          <span>{improvements.generalDiff}%</span>
                        </div>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">1 sola auditoría</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidencias en Bóveda</span>
                  <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1 text-purple-700">
                      <Video className="w-3.5 h-3.5" /> {totalVideos}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-blue-700">
                      <Camera className="w-3.5 h-3.5" /> {totalPhotos}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Chronological List of Historical Visits */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-unbounded">
                    <Clock className="w-4 h-4 text-slate-600" />
                    Historial Cronológico de Auditorías
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Haz clic en cualquier auditoría para ver el desglose o editar calificaciones y criterios
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    {unitEvaluations.length} auditorías registradas
                  </span>
                </div>
              </div>

              {unitEvaluations.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-slate-600">No hay auditorías registradas para esta sucursal</p>
                  {currentUser.canUploadData && (
                    <button
                      onClick={onOpenNewEval}
                      className="mt-3 px-4 py-2 bg-slate-900 text-amber-400 rounded-xl text-xs font-bold cursor-pointer font-unbounded"
                    >
                      + Registrar Primera Auditoría
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {unitEvaluations.map((ev, index) => {
                    const videosCount = ev.evidences?.filter(e => e.type === 'video').length || 0;
                    const photosCount = ev.evidences?.filter(e => e.type === 'photo').length || 0;
                    const isSuccess = ev.generalScore >= 85;

                    return (
                      <div
                        key={ev.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:bg-slate-50/70 transition-all space-y-3 group card-hover-effect"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                              {unitEvaluations.length - index}
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                  Auditoría del {ev.evaluationDate}
                                </h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {isSuccess ? 'Meta Lograda' : 'Oportunidad'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Auditor: <strong className="text-slate-700">{ev.auditorName}</strong>
                                {ev.storeReceivedBy && (
                                  <span> · Recibió: <strong className="text-slate-700">{ev.storeReceivedBy}</strong></span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
                            <div className="text-right">
                              <span className="text-base font-black text-slate-900 font-unbounded">
                                {ev.generalScore}%
                              </span>
                              <span className="text-[10px] text-slate-500 block font-mono">
                                {ev.totalPointsAchieved} / {ev.totalPointsMax} pts
                              </span>
                            </div>

                            {/* Edit Evaluation button */}
                            {currentUser.canUploadData && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEval(ev);
                                }}
                                className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
                                title="Editar calificaciones y criterios de esta auditoría"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}

                            {/* View Breakdown button */}
                            <button
                              onClick={() => onOpenVisitDetail(ev)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors font-unbounded cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver Desglose</span>
                            </button>
                          </div>
                        </div>

                        {ev.generalComments && (
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "{ev.generalComments}"
                          </p>
                        )}

                        {/* Evidence & criteria breakdown summary */}
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-3">
                            {videosCount > 0 && (
                              <span className="text-purple-700 font-bold flex items-center gap-1">
                                <Video className="w-3.5 h-3.5" />
                                {videosCount} Video(s)
                              </span>
                            )}
                            {photosCount > 0 && (
                              <span className="text-blue-700 font-bold flex items-center gap-1">
                                <Camera className="w-3.5 h-3.5" />
                                {photosCount} Fotografías
                              </span>
                            )}
                            <span className="text-slate-600 font-medium">
                              {ev.criteriaBreakdown?.length || 10} Criterios evaluados
                            </span>
                          </div>

                          <button
                            onClick={() => onOpenVisitDetail(ev)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            Explorar criterios y evidencias →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={isEditUnitOpen}
        onClose={() => setIsEditUnitOpen(false)}
        unit={currentUnit}
        onSave={(unitId, updates) => {
          updateUnit(unitId, updates);
        }}
      />

      {/* Edit Evaluation Modal */}
      <EditEvaluationModal
        isOpen={Boolean(editingEval)}
        onClose={() => setEditingEval(null)}
        evaluation={editingEval}
        onSave={(evalId, updates) => {
          updateEvaluation(evalId, updates);
        }}
        onDelete={(evalId) => {
          deleteEvaluation(evalId);
        }}
      />

      {/* Add New Unit Modal */}
      <AddUnitModal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        brand={currentUnit.brand}
        onAdd={(newUnit) => {
          addUnit(newUnit);
          setSelectedUnitId(newUnit.id);
        }}
      />

      {/* Corporate Report Preview & Print/PDF Modal */}
      <ReportPreviewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        unit={currentUnit}
        evaluations={unitEvaluations}
      />
    </>
  );
};
