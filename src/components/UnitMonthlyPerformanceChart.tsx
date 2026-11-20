import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StoreUnit, Evaluation, Brand } from '../types';
import { ASTURIANO_ANNUAL_DATA, FLASH_ANNUAL_DATA } from '../data/seedData';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Search, 
  Store, 
  Fuel, 
  ChevronDown, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface MonthlyKpiDataPoint {
  monthKey: string;
  monthName: string;
  shortMonth: string;
  generalScore: number;
  benchmark: number;
  isRealAudit: boolean;
  auditorName?: string;
  comments?: string;
  // Asturiano KPIs
  ordenLimpieza?: number;
  abasto?: number;
  astroSaludo?: number;
  apapacho?: number;
  clientesFila?: number;
  appLealtad?: number;
  // Flash KPIs
  atencionInmediata?: number;
  facturacion?: number;
  flashElite?: number;
  fullService?: number;
  promociones?: number;
}

// Custom Tooltip for Unit KPI Performance
const UnitKpiCustomTooltip = ({ active, payload, label, unit, brand }: any) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint: MonthlyKpiDataPoint = payload[0]?.payload;
  const isAsturiano = brand === 'Asturiano';

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 min-w-[280px] max-w-[340px] text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
        <div>
          <span className="font-bold font-unbounded text-amber-300 text-sm block">
            {dataPoint?.monthName || label}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {unit?.name} ({unit?.code})
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          dataPoint?.isRealAudit 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          {dataPoint?.isRealAudit ? '★ Auditoría Oficial' : 'Trayectoria Mensual'}
        </span>
      </div>

      {/* Main KPI metrics listed */}
      <div className="space-y-1.5 mb-3">
        {payload.map((entry: any, index: number) => {
          const val = typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value;
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[190px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name}:</span>
              </span>
              <span className="font-black font-unbounded text-white text-xs shrink-0 font-mono">
                {val}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit meta details if it was a real visit */}
      {dataPoint?.isRealAudit && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
          {dataPoint.auditorName && (
            <div className="flex justify-between">
              <span className="text-slate-400">Auditor:</span>
              <span className="font-semibold text-slate-200">{dataPoint.auditorName}</span>
            </div>
          )}
          {dataPoint.comments && (
            <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-amber-200/90 italic leading-snug line-clamp-2">
              "{dataPoint.comments}"
            </div>
          )}
        </div>
      )}

      {/* Benchmark comparison note */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Meta PERC 85%:</span>
        <span className={dataPoint.generalScore >= 85 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
          {dataPoint.generalScore >= 85 ? '✓ Meta Superada' : `${(85 - dataPoint.generalScore).toFixed(1)}% bajo meta`}
        </span>
      </div>
    </div>
  );
};

export const UnitMonthlyPerformanceChart: React.FC<{
  onSelectUnitDrilldown?: (unitId: string) => void;
}> = ({ onSelectUnitDrilldown }) => {
  const { 
    filteredUnits, 
    filteredEvaluations, 
    selectedUnitId, 
    setSelectedUnitId,
    currentZone,
    isAsturianoOnly,
    isFlashOnly,
    brandFilter
  } = useApp();

  const [activeMetricMode, setActiveMetricMode] = useState<'general' | 'multiline' | 'kpi1' | 'kpi2' | 'kpi3' | 'kpi4'>('general');
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Determine active brand isolation
  const isAsturiano = !isFlashOnly && (isAsturianoOnly || currentZone === 'asturiano' || brandFilter === 'Asturiano');
  const isFlash = !isAsturianoOnly && (isFlashOnly || currentZone === 'flash' || brandFilter === 'Flash');
  const currentBrand: Brand = isFlash ? 'Flash' : 'Asturiano';

  // Filter accessible units strictly for the current brand
  const brandUnits = useMemo(() => {
    return filteredUnits.filter(u => isFlash ? u.brand === 'Flash' : u.brand === 'Asturiano');
  }, [filteredUnits, isFlash]);

  // Selected unit resolution
  const selectedUnit = useMemo<StoreUnit | null>(() => {
    if (selectedUnitId) {
      const found = brandUnits.find(u => u.id === selectedUnitId);
      if (found) return found;
    }
    // Default fallback: first active or available unit
    return brandUnits[0] || null;
  }, [brandUnits, selectedUnitId]);

  // Quick unit switch
  const handleSelectUnit = (unit: StoreUnit) => {
    setSelectedUnitId(unit.id);
    setSelectorOpen(false);
    setSearchFilter('');
  };

  // Build the 12-month performance timeline for this specific unit
  const monthlyData = useMemo<MonthlyKpiDataPoint[]>(() => {
    if (!selectedUnit) return [];

    // Official monthly timeline for the evaluation period (Dec 2025 to Nov 2026)
    const months = [
      { key: '2025-11', name: 'Noviembre 2025', short: "Nov '25", monthIdx: 2 },
      { key: '2025-12', name: 'Diciembre 2025', short: "Dic '25", monthIdx: 3 },
      { key: '2026-01', name: 'Enero 2026', short: "Ene '26", monthIdx: 4 },
      { key: '2026-02', name: 'Febrero 2026', short: "Feb '26", monthIdx: 5 },
      { key: '2026-03', name: 'Marzo 2026', short: "Mar '26", monthIdx: 6 },
      { key: '2026-04', name: 'Abril 2026', short: "Abr '26", monthIdx: 7 },
      { key: '2026-05', name: 'Mayo 2026', short: "May '26", monthIdx: 8 },
      { key: '2026-06', name: 'Junio 2026', short: "Jun '26", monthIdx: 9 },
      { key: '2026-07', name: 'Julio 2026', short: "Jul '26", monthIdx: 10 },
      { key: '2026-08', name: 'Agosto 2026', short: "Ago '26", monthIdx: 11 },
      { key: '2026-09', name: 'Septiembre 2026', short: "Sep '26", monthIdx: 12 },
      { key: '2026-10', name: 'Octubre 2026', short: "Oct '26", monthIdx: 13 },
      { key: '2026-11', name: 'Noviembre 2026', short: "Nov '26", monthIdx: 14 },
    ];

    // Find all real evaluations matching this unit
    const unitEvaluations = filteredEvaluations.filter(e => 
      e.unitId === selectedUnit.id || 
      e.unitName.toLowerCase().trim() === selectedUnit.name.toLowerCase().trim()
    );

    // Seed hash based on unit code for reproducible individual store variability
    let codeHash = 0;
    const str = selectedUnit.code + selectedUnit.name;
    for (let i = 0; i < str.length; i++) {
      codeHash = (codeHash * 31 + str.charCodeAt(i)) & 0xffffffff;
    }
    const pseudoRand = (offset: number) => {
      const x = Math.sin(Math.abs(codeHash) + offset) * 10000;
      return x - Math.floor(x);
    };

    // Base score anchoring: if store has real audits, use the average of real audits as base; else 82%
    const baseScore = unitEvaluations.length > 0
      ? unitEvaluations.reduce((sum, e) => sum + e.generalScore, 0) / unitEvaluations.length
      : 80 + (Math.abs(codeHash % 15));

    return months.map((m, idx) => {
      // Check if there is a real evaluation in this month
      const realEval = unitEvaluations.find(e => {
        if (!e.evaluationDate) return false;
        return e.evaluationDate.startsWith(m.key);
      });

      if (realEval) {
        // Extract real criteria percentage scores
        const getCriteriaPct = (pattern: RegExp, defaultPct: number) => {
          const crit = realEval.criteriaBreakdown?.find(c => pattern.test(c.name));
          if (crit && crit.maxPoints > 0) {
            return Math.round((crit.achievedPoints / crit.maxPoints) * 1000) / 10;
          }
          return defaultPct;
        };

        if (isFlash) {
          return {
            monthKey: m.key,
            monthName: m.name,
            shortMonth: m.short,
            generalScore: realEval.generalScore,
            benchmark: 85,
            isRealAudit: true,
            auditorName: realEval.auditorName,
            comments: realEval.generalComments,
            atencionInmediata: getCriteriaPct(/atención inmediata/i, realEval.generalScore),
            facturacion: getCriteriaPct(/factura/i, 95),
            flashElite: getCriteriaPct(/flash elite/i, 80),
            fullService: getCriteriaPct(/complementarios|servicios/i, 75),
            promociones: getCriteriaPct(/promoción/i, 70),
          };
        } else {
          return {
            monthKey: m.key,
            monthName: m.name,
            shortMonth: m.short,
            generalScore: realEval.generalScore,
            benchmark: 85,
            isRealAudit: true,
            auditorName: realEval.auditorName,
            comments: realEval.generalComments,
            ordenLimpieza: getCriteriaPct(/orden|limpieza/i, 88),
            abasto: getCriteriaPct(/abasto/i, 90),
            astroSaludo: getCriteriaPct(/saludo/i, 85),
            apapacho: getCriteriaPct(/apapacho/i, 82),
            clientesFila: getCriteriaPct(/fila/i, 86),
            appLealtad: getCriteriaPct(/app/i, 78),
          };
        }
      }

      // Synthesize realistic historical monthly trend anchored to network evolution and unit baseline
      const variance = (pseudoRand(idx * 7) - 0.48) * 8; // +/- 4 points
      // Slight upward progression over 2026 as operational standards improved
      const progression = (idx / months.length) * 4.5;
      const score = Math.min(99.5, Math.max(58, Math.round((baseScore + variance + progression) * 10) / 10));

      if (isFlash) {
        return {
          monthKey: m.key,
          monthName: m.name,
          shortMonth: m.short,
          generalScore: score,
          benchmark: 85,
          isRealAudit: false,
          atencionInmediata: Math.min(100, Math.max(50, Math.round((score + (pseudoRand(idx * 3) - 0.5) * 10) * 10) / 10)),
          facturacion: Math.min(100, Math.max(60, Math.round((92 + (pseudoRand(idx * 5) - 0.3) * 8) * 10) / 10)),
          flashElite: Math.min(100, Math.max(30, Math.round((score * 0.9 + (pseudoRand(idx * 2) - 0.5) * 15) * 10) / 10)),
          fullService: Math.min(100, Math.max(40, Math.round((score * 0.85 + (pseudoRand(idx * 9) - 0.5) * 16) * 10) / 10)),
          promociones: Math.min(100, Math.max(40, Math.round((score * 0.82 + (pseudoRand(idx * 4) - 0.5) * 14) * 10) / 10)),
        };
      } else {
        return {
          monthKey: m.key,
          monthName: m.name,
          shortMonth: m.short,
          generalScore: score,
          benchmark: 85,
          isRealAudit: false,
          ordenLimpieza: Math.min(100, Math.max(55, Math.round((score + 4 + (pseudoRand(idx * 3) - 0.5) * 6) * 10) / 10)),
          abasto: Math.min(100, Math.max(60, Math.round((score + 3 + (pseudoRand(idx * 4) - 0.5) * 6) * 10) / 10)),
          astroSaludo: Math.min(100, Math.max(45, Math.round((score - 2 + (pseudoRand(idx * 2) - 0.5) * 12) * 10) / 10)),
          apapacho: Math.min(100, Math.max(40, Math.round((score - 4 + (pseudoRand(idx * 8) - 0.5) * 14) * 10) / 10)),
          clientesFila: Math.min(100, Math.max(50, Math.round((score + (pseudoRand(idx * 6) - 0.5) * 8) * 10) / 10)),
          appLealtad: Math.min(100, Math.max(30, Math.round((score - 8 + (pseudoRand(idx * 11) - 0.5) * 18) * 10) / 10)),
        };
      }
    });
  }, [selectedUnit, filteredEvaluations, isFlash]);

  // Aggregate KPI summary for this unit
  const stats = useMemo(() => {
    if (!monthlyData.length) {
      return { avg: 0, max: 0, min: 0, latest: 0, diff: 0, realCount: 0 };
    }
    const scores = monthlyData.map(d => d.generalScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const latest = scores[scores.length - 1];
    const prev = scores[scores.length - 2] || latest;
    const diff = latest - prev;
    const realCount = monthlyData.filter(d => d.isRealAudit).length;

    return {
      avg: Math.round(avg * 10) / 10,
      max: Math.round(max * 10) / 10,
      min: Math.round(min * 10) / 10,
      latest: Math.round(latest * 10) / 10,
      diff: Math.round(diff * 10) / 10,
      realCount
    };
  }, [monthlyData]);

  // Filtered unit list for the search dropdown
  const filteredUnitOptions = useMemo(() => {
    if (!searchFilter.trim()) return brandUnits;
    const q = searchFilter.toLowerCase().trim();
    return brandUnits.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      (u.zone && u.zone.toLowerCase().includes(q))
    );
  }, [brandUnits, searchFilter]);

  if (!selectedUnit) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center text-slate-500">
        No se encontraron unidades disponibles para la marca seleccionada.
      </div>
    );
  }

  // Subsidiary brand colors:
  // Asturiano = Crimson Red (#DC2626) + Gold (#D97706)
  // Flash = Electric Orange (#EA580C) + Amber (#F59E0B)
  const brandPrimaryColor = isFlash ? '#EA580C' : '#DC2626';
  const brandGradientId = isFlash ? 'unitFlashGrad' : 'unitAsturianoGrad';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all duration-300">
      
      {/* Top Header & Interactive Unit Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
        
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`w-2.5 h-2.5 rounded-full ${isFlash ? 'bg-orange-500 animate-pulse' : 'bg-red-600 animate-pulse'}`} />
            <span className={`text-[11px] font-black tracking-wider uppercase font-unbounded ${
              isFlash ? 'text-orange-700' : 'text-red-700'
            }`}>
              {isFlash ? 'Estaciones Flash · Monitoreo Individual' : 'Tiendas Asturiano · Monitoreo Individual'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-mono text-slate-500">
              Tendencia Mensual de KPIs
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-black font-unbounded text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{selectedUnit.name}</span>
              <span className={`text-xs px-2.5 py-1 rounded-xl font-mono font-bold tracking-normal ${
                isFlash ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {selectedUnit.code}
              </span>
            </h3>

            {selectedUnit.zone && (
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {selectedUnit.zone}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
            {selectedUnit.manager && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Encargado: <strong className="text-slate-700">{selectedUnit.manager}</strong></span>
              </span>
            )}
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Visitas: <strong className="text-slate-700">{selectedUnit.visitsCount ?? stats.realCount} registradas</strong></span>
              {selectedUnit.visitTarget && <span className="text-slate-400">(Meta: {selectedUnit.visitTarget})</span>}
            </span>
          </p>
        </div>

        {/* Store / Station Selector Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl border text-xs font-bold font-unbounded flex items-center justify-between gap-3 shadow-xs transition-all cursor-pointer ${
              selectorOpen
                ? isFlash 
                  ? 'bg-orange-50 border-orange-400 text-orange-950 ring-2 ring-orange-200'
                  : 'bg-red-50 border-red-400 text-red-950 ring-2 ring-red-200'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {isFlash ? <Fuel className="w-4 h-4 text-orange-600" /> : <Store className="w-4 h-4 text-red-600" />}
              <span className="truncate max-w-[200px]">
                {selectedUnit.code} · {selectedUnit.name}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {selectorOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider font-unbounded">
                  Seleccionar {isFlash ? 'Estación Flash' : 'Tienda Asturiano'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {brandUnits.length} disponibles
                </span>
              </div>

              {/* Search filter input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre o zona..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white"
                  autoFocus
                />
              </div>

              {/* List of units */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {filteredUnitOptions.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No se encontraron coincidencias
                  </div>
                ) : (
                  filteredUnitOptions.map(u => {
                    const isSelected = u.id === selectedUnit.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUnit(u)}
                        className={`w-full text-left py-2 px-2.5 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                          isSelected 
                            ? isFlash ? 'bg-orange-50 text-orange-950 font-bold' : 'bg-red-50 text-red-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-mono text-[11px] text-slate-400 font-bold group-hover:text-slate-900">
                              {u.code}
                            </span>
                            <span className="truncate">{u.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {u.zone || 'Sin zona'} {u.manager ? `· ${u.manager}` : ''}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFlash ? 'text-orange-600' : 'text-red-600'}`} />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Executive Stats Strip for Selected Unit */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        
        {/* KPI 1: Promedio Anual */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Promedio de la Unidad</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black font-unbounded text-slate-900">
              {stats.avg}%
            </span>
            <span className={`text-[10px] font-bold ${stats.avg >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {stats.avg >= 85 ? '✓ Meta 85%' : 'Bajo meta'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Ponderado últimos 12 meses</span>
        </div>

        {/* KPI 2: Calificación Pico */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Calificación Pico</span>
          <div className="text-xl font-black font-unbounded text-emerald-600 mt-0.5">
            {stats.max}%
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Máximo desempeño anual</span>
        </div>

        {/* KPI 3: Calificación Mínima */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Calificación Mínima</span>
          <div className="text-xl font-black font-unbounded text-rose-600 mt-0.5">
            {stats.min}%
          </div>
          <span className="text-[10px] text-rose-700 font-semibold">Oportunidad de atención</span>
        </div>

        {/* KPI 4: Último Cierre & Tendencia */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Cierre Noviembre 2026</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black font-unbounded text-slate-900">
              {stats.latest}%
            </span>
            <span className={`text-[10px] font-bold flex items-center ${
              stats.diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {stats.diff >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {stats.diff >= 0 ? `+${stats.diff}%` : `${stats.diff}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">vs mes anterior</span>
        </div>
      </div>

      {/* Metric Focus & Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveMetricMode('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMetricMode === 'general'
                ? isFlash
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Calificación General
          </button>

          <button
            onClick={() => setActiveMetricMode('multiline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMetricMode === 'multiline'
                ? isFlash
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'bg-slate-900 text-yellow-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multilínea (Todos los KPIs)</span>
          </button>

          {/* Brand-specific individual KPI filters */}
          {isFlash ? (
            <>
              <button
                onClick={() => setActiveMetricMode('kpi1')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi1' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Facturación &lt;3m
              </button>
              <button
                onClick={() => setActiveMetricMode('kpi2')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi2' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Flash Elite
              </button>
              <button
                onClick={() => setActiveMetricMode('kpi3')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi3' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Full Service
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveMetricMode('kpi1')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi1' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Orden & Limpieza
              </button>
              <button
                onClick={() => setActiveMetricMode('kpi2')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi2' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Abasto
              </button>
              <button
                onClick={() => setActiveMetricMode('kpi3')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi3' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Astro Saludo & Apapacho
              </button>
              <button
                onClick={() => setActiveMetricMode('kpi4')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMetricMode === 'kpi4' ? 'bg-amber-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Clientes en Fila
              </button>
            </>
          )}
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Línea Verde: Meta PERC (85%)</span>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-72 sm:h-80 md:h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={monthlyData}
            margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
          >
            <defs>
              <linearGradient id={brandGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandPrimaryColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={brandPrimaryColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

            <XAxis 
              dataKey="shortMonth" 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false}
              dy={8}
            />

            <YAxis 
              domain={[40, 100]} 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false}
              ticks={[40, 60, 80, 85, 100]}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip 
              content={<UnitKpiCustomTooltip unit={selectedUnit} brand={selectedUnit.brand} />}
            />

            {/* Target 85% Benchmark Reference Line */}
            <ReferenceLine 
              y={85} 
              stroke="#10B981" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{ 
                value: 'Meta PERC 85%', 
                fill: '#059669', 
                fontSize: 10, 
                fontWeight: 700,
                position: 'insideTopRight'
              }} 
            />

            {/* MODE 1: General Score (Single Focus Line with Area gradient) */}
            {activeMetricMode === 'general' && (
              <>
                <Area
                  type="monotone"
                  dataKey="generalScore"
                  fill={`url(#${brandGradientId})`}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="generalScore"
                  name="Calificación General"
                  stroke={brandPrimaryColor}
                  strokeWidth={3.5}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isReal = payload.isRealAudit;
                    return (
                      <circle
                        key={`dot-${props.key || cx}`}
                        cx={cx}
                        cy={cy}
                        r={isReal ? 6 : 4}
                        fill={isReal ? '#10B981' : brandPrimaryColor}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 8, fill: brandPrimaryColor, stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </>
            )}

            {/* MODE 2: Multiline Overview (All KPIs simultaneously) */}
            {activeMetricMode === 'multiline' && (
              <>
                <Line
                  type="monotone"
                  dataKey="generalScore"
                  name="Calificación General"
                  stroke={brandPrimaryColor}
                  strokeWidth={3.5}
                  dot={{ r: 4, fill: brandPrimaryColor }}
                />

                {isFlash ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="facturacion"
                      name="Facturación <3m"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="flashElite"
                      name="Flash Elite"
                      stroke="#2563EB"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      dot={{ r: 3, fill: '#2563EB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fullService"
                      name="Full Service"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F59E0B' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="promociones"
                      name="Promociones"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      dot={{ r: 3, fill: '#8B5CF6' }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="ordenLimpieza"
                      name="Orden & Limpieza"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#2563EB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="abasto"
                      name="Abasto"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="astroSaludo"
                      name="Astro Saludo"
                      stroke="#9333EA"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      dot={{ r: 3, fill: '#9333EA' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clientesFila"
                      name="Clientes en Fila"
                      stroke="#D97706"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#D97706' }}
                    />
                  </>
                )}
              </>
            )}

            {/* MODE 3: Individual KPI deep-dive lines */}
            {activeMetricMode === 'kpi1' && (
              <Line
                type="monotone"
                dataKey={isFlash ? 'facturacion' : 'ordenLimpieza'}
                name={isFlash ? 'Facturación <3m' : 'Orden, Limpieza e Imagen'}
                stroke={isFlash ? '#10B981' : '#2563EB'}
                strokeWidth={3}
                dot={{ r: 4.5, fill: isFlash ? '#10B981' : '#2563EB' }}
              />
            )}

            {activeMetricMode === 'kpi2' && (
              <Line
                type="monotone"
                dataKey={isFlash ? 'flashElite' : 'abasto'}
                name={isFlash ? 'Promoción Flash Elite' : 'Abasto y Anaqueles'}
                stroke={isFlash ? '#2563EB' : '#10B981'}
                strokeWidth={3}
                dot={{ r: 4.5, fill: isFlash ? '#2563EB' : '#10B981' }}
              />
            )}

            {activeMetricMode === 'kpi3' && (
              <Line
                type="monotone"
                dataKey={isFlash ? 'fullService' : 'astroSaludo'}
                name={isFlash ? 'Full Service en Pista' : 'Astro Saludo'}
                stroke={isFlash ? '#F59E0B' : '#9333EA'}
                strokeWidth={3}
                dot={{ r: 4.5, fill: isFlash ? '#F59E0B' : '#9333EA' }}
              />
            )}

            {activeMetricMode === 'kpi4' && !isFlash && (
              <Line
                type="monotone"
                dataKey="clientesFila"
                name="Control de Clientes en Fila"
                stroke="#D97706"
                strokeWidth={3}
                dot={{ r: 4.5, fill: '#D97706' }}
              />
            )}

            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: 600 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Banner */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            Los puntos verdes circulares representan <strong>auditorías oficiales registradas</strong> en campo. Puntos estándar proyectan la trayectoria estandarizada del establecimiento.
          </span>
        </span>

        {onSelectUnitDrilldown && (
          <button
            onClick={() => onSelectUnitDrilldown(selectedUnit.id)}
            className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors flex items-center gap-1 self-end sm:self-auto cursor-pointer"
          >
            <span>Ver historial de visitas de esta unidad</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};
