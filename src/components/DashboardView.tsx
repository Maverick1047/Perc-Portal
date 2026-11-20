import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateOverallAverages } from '../utils/metrics';
import { 
  TrendingUp, 
  Store, 
  Fuel, 
  Award, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  AlertTriangle, 
  Play, 
  Camera, 
  Layers, 
  ArrowRight, 
  ShieldCheck,
  Target,
  FileCheck
} from 'lucide-react';
import { Brand, Evaluation } from '../types';
import { HistoricalTrendChart } from './HistoricalTrendChart';
import { UnitMonthlyPerformanceChart } from './UnitMonthlyPerformanceChart';

export const DashboardView: React.FC<{
  onSelectUnit: (unitId: string) => void;
  onOpenNewEval: () => void;
  onOpenVisitDetail: (evaluation: Evaluation) => void;
}> = ({ onSelectUnit, onOpenNewEval, onOpenVisitDetail }) => {
  const { 
    filteredEvaluations, 
    filteredUnits, 
    filteredActions, 
    brandFilter, 
    currentUser,
    currentAccount,
    currentZone,
    isAsturianoOnly,
    isFlashOnly,
    setSelectedUnitId
  } = useApp();

  const averages = calculateOverallAverages(filteredEvaluations);
  const pendingActions = filteredActions.filter(a => a.status !== 'concluido');

  // Strict brand isolation:
  // Flash-only accounts can NEVER evaluate isAsturiano to true.
  // Asturiano-only accounts can NEVER evaluate isFlash to true.
  const isAsturiano = !isFlashOnly && (isAsturianoOnly || currentZone === 'asturiano' || brandFilter === 'Asturiano');
  const isFlash = !isAsturianoOnly && (isFlashOnly || currentZone === 'flash' || brandFilter === 'Flash');
  const isGeneral = !isAsturianoOnly && !isFlashOnly && !isAsturiano && !isFlash && Boolean(currentAccount?.canAccessAsturiano && currentAccount?.canAccessFlash);

  return (
    <div className="space-y-6">
      
      {/* Executive Welcome & Mode Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all duration-300 relative overflow-hidden ${
        isGeneral 
          ? 'bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white border-amber-500/40 glow-gold' 
          : isAsturiano
          ? 'bg-gradient-to-r from-red-900 via-red-800 to-slate-950 text-white border-red-500/60 shadow-red-950/20'
          : 'bg-gradient-to-r from-orange-950 via-orange-900 to-neutral-950 text-white border-orange-500/60 shadow-orange-950/20'
      }`}>
        {/* Subtle accent bar at top */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          isGeneral 
            ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500' 
            : isAsturiano
            ? 'bg-gradient-to-r from-red-600 via-amber-400 to-blue-600'
            : 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-1">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase mb-1.5 font-unbounded">
              <span className={isGeneral ? 'text-amber-400' : isAsturiano ? 'text-yellow-300' : 'text-amber-300'}>
                {isAsturiano ? 'Tiendas Asturiano · Calidad y Servicio' : isFlash ? 'Estaciones Flash · Calidad y Servicio' : 'Grupo PERC · Tablero General'}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-mono text-[11px]">
                {isAsturiano ? 'Escala Oficial 15.00 Puntos' : isFlash ? 'Escala Oficial 100 Puntos' : 'Consolidado Multimarca'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-unbounded">
              {isAsturiano 
                ? 'Tablero Central · Tiendas Asturiano' 
                : isFlash 
                ? 'Tablero Central · Estaciones Flash' 
                : 'Tablero Central de Calidad y Rendimiento'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              {isAsturiano
                ? 'Monitoreo de 10 criterios oficiales de Astro Servicio, abasto, orden, limpieza y experiencia de compra.'
                : isFlash
                ? 'Monitoreo de 10 criterios oficiales en pista: protocolo de atención, rapidez de carga, lealtad Flash Elite y facturación.'
                : 'Consolidado directivo para el seguimiento uniforme de servicio en campo.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser.canUploadData ? (
              <button
                onClick={onOpenNewEval}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all hover:scale-102 flex items-center gap-2 font-unbounded cursor-pointer ${
                  isAsturiano 
                    ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' 
                    : isFlash
                    ? 'bg-amber-400 text-orange-950 hover:bg-amber-300'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 border border-amber-300'
                }`}
              >
                <span>+ Subir Datos de Visita</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 flex items-center gap-2 font-unbounded">
                <Eye className="w-4 h-4" />
                <span>Modo Visualización</span>
              </div>
            )}
          </div>
        </div>

        {/* Tip banner */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Aviso operativo:</strong> Haz clic sobre cualquier visita o sucursal para consultar el desglose oficial de los 10 criterios y descargar su reporte.</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            {filteredEvaluations.length} auditorías en el sistema
          </span>
        </div>
      </div>

      {/* KPI Cards Grid - Strictly Isolated per Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Promedio General de la Marca */}
        <div className={`p-5 rounded-3xl border transition-all card-hover-effect ${
          isAsturiano
            ? 'bg-white border-red-200/90 shadow-sm'
            : isFlash
            ? 'bg-white border-orange-200/90 shadow-sm'
            : 'bg-white border-amber-400/40 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isAsturiano ? 'Promedio Asturiano' : isFlash ? 'Promedio Flash' : 'Promedio General'}
            </span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
              isAsturiano ? 'bg-red-600 text-white' : isFlash ? 'bg-orange-500 text-amber-950' : 'bg-slate-900 text-amber-400'
            }`}>
              ★
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-unbounded">
              {isAsturiano ? averages.asturianoAverage : isFlash ? averages.flashAverage : averages.generalAverage}%
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              Meta 85%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isAsturiano ? 'bg-red-600' : isFlash ? 'bg-orange-500' : 'bg-amber-500'
              }`}
              style={{ width: `${isAsturiano ? averages.asturianoAverage : isFlash ? averages.flashAverage : averages.generalAverage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            {isAsturiano ? 'Ponderación en escala oficial de 15.00 pts' : isFlash ? 'Ponderación en escala oficial de 100 pts' : 'Cálculo ponderado en los 10 criterios'}
          </p>
        </div>

        {/* KPI 2: Unidades / Red de Sucursales */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isAsturiano ? 'text-red-700' : isFlash ? 'text-orange-700' : 'text-slate-600'
            }`}>
              {isAsturiano ? 'Tiendas en Red' : isFlash ? 'Red de Estaciones' : 'Total Unidades'}
            </span>
            {isAsturiano ? <Store className="w-4 h-4 text-red-600" /> : isFlash ? <Fuel className="w-4 h-4 text-orange-600" /> : <Award className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-unbounded">
              {filteredUnits.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold font-mono">
              {isAsturiano ? 'tiendas activas' : isFlash ? 'estaciones Flash' : 'unidades'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <span className={`w-2 h-2 rounded-full ${isAsturiano ? 'bg-red-600' : isFlash ? 'bg-orange-500' : 'bg-amber-400'}`} />
            {isAsturiano ? 'Evaluación continua de servicio' : isFlash ? 'Meta institucional de 12 visitas' : 'Cobertura integral Grupo PERC'}
          </div>
        </div>

        {/* KPI 3: Total Auditorías Realizadas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Auditorías Realizadas</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-unbounded">
              {filteredEvaluations.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold font-mono">
              expedientes
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Con evidencia multimedia y desglose oficial
          </div>
        </div>

        {/* KPI 4: Catálogo Maestro / Cumplimiento Global */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {isAsturiano ? 'Variantes Estandarizadas' : isFlash ? 'Proporción Global' : 'Catálogo Maestro'}
            </span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-unbounded">
              {isAsturiano ? '382' : isFlash ? '75%' : '254'}
            </span>
            <span className="text-xs text-amber-700 font-bold">
              {isAsturiano ? 'nombres auditados' : isFlash ? '181 de 240 visitas' : 'unidades registradas'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            {isAsturiano ? '460 visitas anuales en matriz concentrada' : isFlash ? 'Meta institucional de 12 visitas por estación' : 'Base oficial de Tiendas y Estaciones'}
          </p>
        </div>
      </div>

      {/* Unit Monthly KPI Performance Trend Line Chart using Recharts */}
      <div id="unit-monthly-kpi-chart">
        <UnitMonthlyPerformanceChart onSelectUnitDrilldown={onSelectUnit} />
      </div>

      {/* Historical Trend Chart with Recharts - Isolated to Brand */}
      <HistoricalTrendChart 
        brand={isAsturiano ? 'Asturiano' : isFlash ? 'Flash' : 'Todas'}
        title={isAsturiano 
          ? 'Evolución Histórica de Servicio · Red Asturiano' 
          : isFlash 
          ? 'Evolución Histórica de Servicio · Red Flash' 
          : 'Evolución Histórica de Servicio · Grupo PERC'}
        subtitle={isAsturiano
          ? 'Líneas suaves Monotone en paleta Rojo/Dorado institucional con desglose de lealtad, promociones y saludo.'
          : isFlash
          ? 'Líneas suaves Monotone en paleta Naranja/Amarillo institucional con métricas de facturación y full service.'
          : 'Comparativa de desempeño en el tiempo entre Tiendas Asturiano y Estaciones Flash.'}
      />

      {/* Main Interactive Table of Visits with Click-to-Drilldown */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 font-unbounded">
                Registro Central de Visitas Realizadas
              </h3>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                · {filteredEvaluations.length} auditorías
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic sobre cualquier fila para consultar el desglose de los 10 criterios, reproducir videos o ver fotos
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Clic para ver expediente
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredEvaluations.map((ev) => {
            const isAst = ev.brand === 'Asturiano';
            const videosCount = ev.evidences.filter(e => e.type === 'video').length;
            const photosCount = ev.evidences.filter(e => e.type === 'photo').length;

            return (
              <div
                key={ev.id}
                onClick={() => onOpenVisitDetail(ev)}
                className="py-4 px-3 sm:px-4 rounded-2xl hover:bg-slate-50/90 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group border border-transparent hover:border-slate-200"
              >
                <div className="flex items-start gap-3.5">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs font-unbounded ${
                    isAst 
                      ? 'bg-red-600 text-white border-2 border-yellow-400' 
                      : 'bg-orange-500 text-yellow-300 border-2 border-yellow-400'
                  }`}>
                    {isAst ? 'AST' : 'FLS'}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                        {ev.unitName}
                      </h4>
                      <span className="text-xs text-slate-400 font-semibold font-mono">
                        {ev.zone}
                      </span>
                      {ev.hasPendingActions && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          Con Observaciones
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                      "{ev.generalComments}"
                    </p>

                    <div className="flex items-center gap-2.5 text-[11px] text-slate-500 mt-1.5 flex-wrap">
                      <span>Fecha: <strong className="text-slate-700">{ev.evaluationDate}</strong></span>
                      <span className="text-slate-300">·</span>
                      <span>Auditor: <strong className="text-slate-700">{ev.auditorName}</strong></span>
                      <span className="text-slate-300">·</span>
                      {videosCount > 0 && (
                        <span className="text-purple-700 font-bold flex items-center gap-0.5">
                          <Play className="w-3 h-3 fill-purple-600 text-purple-600" />
                          {videosCount} Video(s)
                        </span>
                      )}
                      {photosCount > 0 && (
                        <span className="text-blue-700 font-bold flex items-center gap-0.5">
                          <Camera className="w-3 h-3" />
                          {photosCount} Fotos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score & Action CTA */}
                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-medium font-mono">
                      {ev.totalPointsAchieved} / {ev.totalPointsMax} pts
                    </div>
                    <div className={`text-base font-black px-3 py-1 rounded-xl font-mono ${
                      ev.generalScore >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {ev.generalScore}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUnitId(ev.unitId);
                        document.getElementById('unit-monthly-kpi-chart')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                      title="Graficar tendencia mensual de esta unidad"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Tendencia</span>
                    </button>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1 transition-colors shadow-xs font-unbounded">
                      <span>Ver Desglose</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Criterias Reference Box - Strictly Isolated per Brand */}
      <div className={`grid gap-5 ${isGeneral ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Asturiano 10 Criteria Reference - ONLY shown for Asturiano or Corporate */}
        {(isAsturiano || isGeneral) && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <span className="w-3 h-3 rounded bg-red-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-unbounded">
                10 Criterios Oficiales: Tiendas Asturiano (15.00 Puntos)
              </h4>
            </div>
            <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 font-medium leading-relaxed">
              <li>Orden, limpieza e imagen <strong className="text-red-700">(3.00 pts)</strong></li>
              <li>Abasto <strong className="text-red-700">(2.00 pts)</strong></li>
              <li>Fast food <strong className="text-red-700">(2.00 pts)</strong></li>
              <li>Bebidas <strong className="text-red-700">(1.00 pts)</strong></li>
              <li>Astro saludo <strong className="text-red-700">(0.50 pts)</strong></li>
              <li>Apapacho <strong className="text-red-700">(1.00 pts)</strong></li>
              <li>Funcionamiento equipos <strong className="text-red-700">(1.00 pts)</strong></li>
              <li>Funcionamiento y simplicidad de la app <strong className="text-red-700">(0.50 pts)</strong></li>
              <li>Clientes en fila <strong className="text-red-700">(2.00 pts)</strong></li>
              <li>Falla sistema para pagos, no tener cashout <strong className="text-red-700">(2.00 pts)</strong></li>
            </ol>
          </div>
        )}

        {/* Flash 10 Criteria Reference - ONLY shown for Flash or Corporate */}
        {(isFlash || isGeneral) && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <span className="w-3 h-3 rounded bg-orange-500" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-unbounded">
                10 Criterios Oficiales: Estaciones Flash (100 Puntos)
              </h4>
            </div>
            <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 font-medium leading-relaxed">
              <li>Atención inmediata del lado del conductor (&lt;1 min) <strong className="text-orange-700">(15 pts)</strong></li>
              <li>Bienvenida con actitud amable y respetuosa <strong className="text-orange-700">(15 pts)</strong></li>
              <li>Promoción de la app FLASH ELITE <strong className="text-orange-700">(15 pts)</strong></li>
              <li>Consulta sobre producto a cargar y monto <strong className="text-orange-700">(5 pts)</strong></li>
              <li>Ofrecimiento de servicios complementarios <strong className="text-orange-700">(5 pts)</strong></li>
              <li>Ofrecimiento de promoción "Impacto" <strong className="text-orange-700">(5 pts)</strong></li>
              <li>Cobro y pregunta sobre ticket o factura <strong className="text-orange-700">(5 pts)</strong></li>
              <li>Emisión ágil de factura (1 a 3 min) <strong className="text-orange-700">(15 pts)</strong></li>
              <li>Confirmación de puntos en app Flash Elite <strong className="text-orange-700">(5 pts)</strong></li>
              <li>Despedida cordial y tiempo total máx. 4 min <strong className="text-orange-700">(15 pts)</strong></li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
