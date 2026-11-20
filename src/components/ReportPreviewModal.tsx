import React from 'react';
import { StoreUnit, Evaluation } from '../types';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  User, 
  Award,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { printHistoryReport, downloadHistoryExcel } from '../utils/reportExporter';

export interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: StoreUnit;
  evaluations: Evaluation[];
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  unit,
  evaluations,
}) => {
  if (!isOpen) return null;

  const isAsturiano = unit.brand === 'Asturiano';
  const brandName = isAsturiano ? 'Tiendas Asturiano' : 'Estaciones Flash';
  const brandScale = isAsturiano ? '15.00 Puntos' : '100 Puntos';

  const todayStr = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const avgScore = evaluations.length > 0
    ? Math.round((evaluations.reduce((acc, curr) => acc + curr.generalScore, 0) / evaluations.length) * 10) / 10
    : 0;

  const latestScore = evaluations[0]?.generalScore ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shadow font-unbounded ${
              isAsturiano ? 'bg-red-600' : 'bg-orange-500'
            }`}>
              {isAsturiano ? 'A' : '⚡'}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-unbounded flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Vista Previa del Reporte Oficial • Grupo PERC</span>
              </div>
              <h3 className="text-base font-black font-unbounded text-white">
                {unit.name} ({unit.code})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadHistoryExcel(unit, evaluations)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-unbounded transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
              title="Descargar archivo CSV compatible con Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Excel (.csv)</span>
            </button>

            <button
              onClick={() => printHistoryReport(unit, evaluations)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black font-unbounded transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                isAsturiano
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950'
              }`}
              title="Abrir diálogo de impresión o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formatted Document Paper View */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50 flex-1 space-y-6">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Document Header Banner */}
            <div className={`p-6 rounded-2xl text-white relative overflow-hidden shadow-sm ${
              isAsturiano
                ? 'bg-gradient-to-r from-red-800 via-red-900 to-black border-b-4 border-amber-400'
                : 'bg-gradient-to-r from-orange-600 via-orange-700 to-black border-b-4 border-amber-400'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-amber-300 font-unbounded mb-1">
                <span>Grupo PERC • Auditoría de Calidad y Servicio</span>
                <span className="font-mono text-slate-300">FOLIO: PERC-{unit.code}-2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-unbounded text-white tracking-tight">
                {unit.name}
              </h2>
              <p className="text-xs text-slate-200 mt-1">
                Reporte Consolidado de Desempeño Operativo • {brandName} • Escala Oficial: {brandScale}
              </p>
            </div>

            {/* Technical Metadata Dossier */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Marca & Zona</span>
                <span className="font-semibold text-slate-900">{brandName} · {unit.zone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Dirección</span>
                <span className="font-semibold text-slate-900">{unit.address || 'Ubicación Registrada'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Encargado / Gerente</span>
                <span className="font-semibold text-slate-900">{unit.manager || 'No asignado'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Auditor en Ruta</span>
                <span className="font-semibold text-slate-900">{unit.evaluatorAssigned || 'Auditoría Central'}</span>
              </div>
            </div>

            {/* KPI Performance Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Promedio Histórico</span>
                <div className={`text-2xl font-black font-unbounded mt-0.5 ${
                  isAsturiano ? 'text-red-700' : 'text-orange-600'
                }`}>
                  {avgScore}%
                </div>
                <span className="text-[10px] text-slate-600 font-medium">{evaluations.length} auditoría(s)</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Última Calificación</span>
                <div className="text-2xl font-black font-unbounded text-slate-900 mt-0.5">
                  {latestScore}%
                </div>
                <span className="text-[10px] text-slate-600 font-medium">{evaluations[0]?.evaluationDate || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Meta Institucional</span>
                <div className="text-2xl font-black font-unbounded text-emerald-700 mt-0.5">
                  85.0%
                </div>
                <span className="text-[10px] text-emerald-800 font-bold">Grupo PERC</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-center">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Estatus de Calidad</span>
                <div className={`text-base font-black font-unbounded mt-1.5 ${
                  latestScore >= 85 ? 'text-emerald-700' : 'text-amber-600'
                }`}>
                  {latestScore >= 85 ? 'Meta Cumplida' : 'En Oportunidad'}
                </div>
                <span className="text-[10px] text-slate-600 font-medium">vs Ciclo Operativo 2026</span>
              </div>
            </div>

            {/* Historical Visits Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-sm font-black font-unbounded text-slate-900">
                  Registro Cronológico de Visitas
                </h4>
                <span className="text-xs text-slate-600 font-semibold">{evaluations.length} auditorías realizadas</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Auditor</th>
                      <th className="py-2.5 px-3 text-center">Calificación</th>
                      <th className="py-2.5 px-3 text-center">Puntos</th>
                      <th className="py-2.5 px-3">Observaciones del Informe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evaluations.map(ev => {
                      const isHigh = ev.generalScore >= 85;
                      const isMid = ev.generalScore >= 72 && ev.generalScore < 85;

                      return (
                        <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {ev.evaluationDate}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {ev.auditorName}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                              isHigh 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : isMid 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}>
                              {ev.generalScore}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600 text-[11px]">
                            {ev.totalPointsAchieved} / {ev.totalPointsMax}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 italic text-[11px]">
                            "{ev.generalComments}"
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Criteria Breakdown (Latest Evaluation) */}
            {evaluations[0]?.criteriaBreakdown && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-black font-unbounded text-slate-900">
                    Desglose de los 10 Criterios Oficiales (Última Visita: {evaluations[0].evaluationDate})
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold">{isAsturiano ? 'Escala 15.00 pts' : 'Escala 100 pts'}</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                      <tr>
                        <th className="py-2 px-3 w-8">#</th>
                        <th className="py-2 px-3">Criterio Institucional</th>
                        <th className="py-2 px-3 text-center">Máx</th>
                        <th className="py-2 px-3 text-center">Logrado</th>
                        <th className="py-2 px-3 text-center">% Cumplimiento</th>
                        <th className="py-2 px-3">Notas / Hallazgos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {evaluations[0].criteriaBreakdown.map((c, i) => {
                        const pct = c.maxPoints > 0 ? Math.round((c.achievedPoints / c.maxPoints) * 100) : 0;
                        const isHigh = pct >= 85;

                        return (
                          <tr key={c.id}>
                            <td className="py-2 px-3 font-bold text-slate-600">{i + 1}</td>
                            <td className="py-2 px-3 font-semibold text-slate-800">{c.name}</td>
                            <td className="py-2 px-3 text-center font-mono text-slate-600">{c.maxPoints}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{c.achievedPoints}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {pct}%
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[11px] text-slate-600">{c.notes || 'En cumplimiento regular.'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Document Footer Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="h-10"></div>
                <div className="border-t border-slate-300 pt-2 font-bold text-slate-800">
                  {evaluations[0]?.auditorName || 'Auditor de Calidad en Ruta'}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Auditoría Operativa · Grupo PERC</div>
              </div>

              <div className="space-y-1">
                <div className="h-10"></div>
                <div className="border-t border-slate-300 pt-2 font-bold text-slate-800">
                  {unit.manager || 'Gerente / Encargado de Unidad'}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Acuse y Compromiso Operativo · {unit.name}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-600 font-medium flex justify-between border-t border-slate-100 pt-3">
              <span>PercPortal · Sistema de Evaluación de Servicio Grupo PERC</span>
              <span>Emisión: {todayStr} · Documento para uso interno</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
