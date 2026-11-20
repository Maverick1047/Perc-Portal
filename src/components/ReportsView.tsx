import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  Filter, 
  Sparkles,
  Eye,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { calculateOverallAverages, getBrandComparison } from '../utils/metrics';
import { Brand } from '../types';

export const ReportsView: React.FC = () => {
  const { filteredEvaluations, setSelectedEvaluationForDetail } = useApp();

  const [periodicity, setPeriodicity] = useState<'semanal' | 'mensual' | 'trimestral' | 'anual'>('mensual');
  const [selectedBrand, setSelectedBrand] = useState<'Todas' | Brand>('Todas');
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [selectedAuditor, setSelectedAuditor] = useState<string>('todos');

  const reportEvals = filteredEvaluations.filter(ev => {
    const matchesBrand = selectedBrand === 'Todas' || ev.brand === selectedBrand;
    const matchesZone = selectedZone === 'Todas' || ev.zone === selectedZone;
    const matchesAuditor = selectedAuditor === 'todos' || ev.auditorName === selectedAuditor;
    return matchesBrand && matchesZone && matchesAuditor;
  });

  const overall = calculateOverallAverages(reportEvals);
  const auditors = Array.from(new Set(filteredEvaluations.map(e => e.auditorName)));

  // Generate Excel / CSV File Download
  const handleExportCSV = () => {
    const headers = [
      'ID Evaluacion',
      'Marca',
      'Sucursal / Estacion',
      'Zona',
      'Fecha',
      'Auditor',
      'Responsable en Tienda',
      'Puntos Obtenidos',
      'Puntos Maximos',
      'Calificacion General (%)',
      'Estatus Acciones',
      'Comentarios Generales'
    ];

    const rows = reportEvals.map(ev => [
      `"${ev.id}"`,
      `"${ev.brand}"`,
      `"${ev.unitName}"`,
      `"${ev.zone}"`,
      `"${ev.evaluationDate}"`,
      `"${ev.auditorName}"`,
      `"${ev.storeReceivedBy}"`,
      ev.totalPointsAchieved,
      ev.totalPointsMax,
      ev.generalScore,
      `"${ev.hasPendingActions ? 'Acciones Pendientes' : 'Concluido'}"`,
      `"${ev.generalComments.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_PercPortal_${periodicity.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
            <span>Reportería Institucional & Proyección Directiva</span>
            <span>•</span>
            <span className="text-black font-extrabold">PercPortal</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Informes Oficiales de Calidad y Servicio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Descarga inmediata de resultados en Excel / CSV y generación de vista imprimible PDF
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
            title="Descargar archivo en formato Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel (CSV)
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
            title="Generar PDF imprimible"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          Filtros del Reporte
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Periodicidad</label>
            <select
              value={periodicity}
              onChange={(e) => setPeriodicity(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="semanal">Reporte Semanal</option>
              <option value="mensual">Reporte Mensual (Octubre 2026)</option>
              <option value="trimestral">Reporte Trimestral (Q3 2026)</option>
              <option value="anual">Reporte Anual Consolidado</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Todas">Ambas Marcas</option>
              <option value="Asturiano">Tiendas Asturiano</option>
              <option value="Flash">Estaciones Flash</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Zona Geográfica</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Todas">Todas las Zonas</option>
              <option value="Zona Centro">Zona Centro</option>
              <option value="Zona Norte">Zona Norte</option>
              <option value="Zona Poniente">Zona Poniente</option>
              <option value="Zona Oriente">Zona Oriente</option>
              <option value="Zona Sur">Zona Sur</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Auditor Responsable</label>
            <select
              value={selectedAuditor}
              onChange={(e) => setSelectedAuditor(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="todos">Todos los Auditores</option>
              {auditors.map(aud => (
                <option key={aud} value={aud}>{aud}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Printable Report Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Formal Report Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 font-black text-2xl flex items-center justify-center border border-amber-300/40">
              P
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                PercPortal • Informe Ejecutivo de Calidad y Servicio
              </h1>
              <p className="text-xs text-slate-600">
                Auditorías Oficiales • Tiendas Asturiano (15.00 pts) & Estaciones Flash (100 pts)
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div><strong>Periodo:</strong> {periodicity.toUpperCase()}</div>
            <div><strong>Filtro:</strong> {selectedBrand} • {selectedZone}</div>
            <div><strong>Registros:</strong> {reportEvals.length} evaluaciones oficiales</div>
          </div>
        </div>

        {/* Executive KPI Summary in the Report */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">Promedio General Red</span>
            <span className="text-2xl font-black text-slate-900">{overall.generalAverage}%</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">Tiendas Asturiano (15 pts)</span>
            <span className="text-2xl font-black text-red-600">{overall.asturianoAverage}%</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block text-[11px]">Estaciones Flash (100 pts)</span>
            <span className="text-2xl font-black text-orange-600">{overall.flashAverage}%</span>
          </div>
        </div>

        {/* Report Structured Table with Click-to-Drilldown */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="py-2.5 px-3">Sucursal / Estación</th>
                <th className="py-2.5 px-3">Marca</th>
                <th className="py-2.5 px-3">Zona</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Auditor</th>
                <th className="py-2.5 px-3 text-center">Puntaje Oficial</th>
                <th className="py-2.5 px-3 text-right">Porcentaje</th>
                <th className="py-2.5 px-3 text-center">Expediente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportEvals.map(ev => (
                <tr 
                  key={ev.id} 
                  onClick={() => setSelectedEvaluationForDetail(ev)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 hover:text-indigo-600">
                    {ev.unitName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.brand === 'Asturiano' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {ev.brand}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{ev.zone}</td>
                  <td className="py-2.5 px-3 text-slate-600">{ev.evaluationDate}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{ev.auditorName}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                    {ev.totalPointsAchieved} / {ev.totalPointsMax} pts
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-black text-slate-900">{ev.generalScore}%</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Ver Videos / Desglose
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formal Signatures Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 mt-8 text-center text-xs text-slate-600 border-t border-slate-200">
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <strong className="block text-slate-900">Ricardo Méndez</strong>
            <span>Responsable del Portal</span>
          </div>
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <strong className="block text-slate-900">César Morales</strong>
            <span>Auditoría & Experiencia</span>
          </div>
          <div>
            <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
            <strong className="block text-slate-900">Lic. Armando Garza</strong>
            <span>Dirección General</span>
          </div>
        </div>
      </div>
    </div>
  );
};
