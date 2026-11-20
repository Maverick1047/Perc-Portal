import React, { useState } from 'react';
import { Brand, AsturianoAnnualRow, FlashAnnualRow } from '../types';
import { ASTURIANO_ANNUAL_DATA, FLASH_ANNUAL_DATA } from '../data/seedData';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  BarChart2, 
  ChevronRight,
  LineChart as LineChartIcon
} from 'lucide-react';
import { HistoricalTrendChart } from './HistoricalTrendChart';

export interface BrandAnnualHistoryViewProps {
  brand: Brand;
}

export const BrandAnnualHistoryView: React.FC<BrandAnnualHistoryViewProps> = ({ brand }) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const getSemaforoClass = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 72) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (brand === 'Asturiano') {
      csvContent += "Mes,Tiendas Auditadas,Promedio General,Lealtad App %,Promociones %,Astro Saludo %,Minimo,Maximo,Orden y Limpieza,Abasto,Fast Food,Bebidas,Astro Saludo,Apapacho,Equipos,App Simplicidad,Clientes en Fila,Pagos y Cashout\n";
      ASTURIANO_ANNUAL_DATA.forEach(row => {
        csvContent += `"${row.month}",${row.storesAudited},${row.generalAverage}%,${row.loyaltyAppPct}%,${row.promosPct}%,${row.astroSaludoPct}%,${row.minScore}%,${row.maxScore}%,${row.ordenLimpieza},${row.abasto},${row.fastFood},${row.bebidas},${row.astroSaludo},${row.apapacho},${row.equipos},${row.appSimplicidad},${row.clientesFila},${row.pagosCashout}\n`;
      });
    } else {
      csvContent += "Mes,Promedio General,Criterios Fuertes,Flash Elite,Promociones %,Full Service %,Evaluacion QR %,Facturacion %,Estaciones Visitadas\n";
      FLASH_ANNUAL_DATA.forEach(row => {
        csvContent += `"${row.month}",${row.generalAverage}%,"${row.criteriosFuertes}","${row.flashElite}",${row.promociones}%,${row.fullService}%,${row.evaluacionQr}%,${row.facturacion}%,"${row.estacionesVisitadas}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Concentrado_Anual_${brand}_GrupoPERC.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden ${
        brand === 'Asturiano'
          ? 'bg-gradient-to-r from-red-700 via-red-800 to-red-900 border border-yellow-400/40'
          : 'bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 border border-yellow-400/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-yellow-300 text-xs font-bold tracking-wider uppercase font-unbounded">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {brand === 'Asturiano' ? 'Concentrado Anual Astro Servicio (13 Meses)' : 'Histórico Anual de Servicio (14 Meses)'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-unbounded text-white">
              Histórico Consolidado • {brand === 'Asturiano' ? 'Tiendas Asturiano' : 'Estaciones Flash'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 max-w-xl">
              {brand === 'Asturiano'
                ? 'Matriz oficial de Septiembre 2025 a Septiembre 2026. Desglose mensual de los 10 criterios de evaluación (escala 15.00 pts).'
                : 'Matriz oficial de Agosto 2025 a Septiembre 2026. Seguimiento de Flash Elite, Full Service, Facturación y Promociones.'}
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all self-start sm:self-center font-unbounded cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Exportar CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Dynamic Recharts Visualization */}
      <HistoricalTrendChart 
        brand={brand} 
        title={brand === 'Asturiano' ? 'Curva Histórica de Astro Servicio' : 'Curva Histórica de Desempeño Flash'}
        subtitle={brand === 'Asturiano' 
          ? 'Evolución mensual en escala 15.0 pts (0-100%) a través de los 13 meses oficiales auditados con líneas dinámicas en paleta Rojo/Dorado.'
          : 'Evolución mensual en escala 100 pts a través de los 14 meses oficiales auditados con líneas dinámicas en paleta Naranja/Amarillo.'}
      />

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 font-unbounded text-sm flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-500" />
            <span>Matriz de Indicadores Mensuales</span>
          </h3>
          <span className="text-xs text-slate-500">
            {brand === 'Asturiano' ? '13 Periodos Auditados' : '14 Periodos Auditados'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {brand === 'Asturiano' ? (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-3">Mes</th>
                  <th className="py-3 px-3 text-center">Tiendas</th>
                  <th className="py-3 px-3 text-center">Prom. Gral</th>
                  <th className="py-3 px-3 text-center">Lealtad App</th>
                  <th className="py-3 px-3 text-center">Promos</th>
                  <th className="py-3 px-3 text-center">Astro Saludo</th>
                  <th className="py-3 px-2 text-center text-slate-400">Min/Max</th>
                  <th className="py-3 px-2 text-center">Ord/Limp (3)</th>
                  <th className="py-3 px-2 text-center">Abasto (2)</th>
                  <th className="py-3 px-2 text-center">FastFood (2)</th>
                  <th className="py-3 px-2 text-center">Bebidas (1)</th>
                  <th className="py-3 px-2 text-center">Saludo (0.5)</th>
                  <th className="py-3 px-2 text-center">Apapacho (1)</th>
                  <th className="py-3 px-2 text-center">Equipos (1)</th>
                  <th className="py-3 px-2 text-center">App (0.5)</th>
                  <th className="py-3 px-2 text-center">Filas (2)</th>
                  <th className="py-3 px-2 text-center">Pagos (2)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ASTURIANO_ANNUAL_DATA.map((row) => (
                  <tr key={row.month} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {row.month}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-600">
                      {row.storesAudited}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${getSemaforoClass(row.generalAverage)}`}>
                        {row.generalAverage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {row.loyaltyAppPct}%
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {row.promosPct}%
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {row.astroSaludoPct}%
                    </td>
                    <td className="py-3 px-2 text-center text-[10px] text-slate-400 whitespace-nowrap">
                      {row.minScore}% - {row.maxScore}%
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.ordenLimpieza.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.abasto.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.fastFood.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.bebidas.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.astroSaludo.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.apapacho.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.equipos.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.appSimplicidad.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.clientesFila.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center font-mono font-medium">{row.pagosCashout.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Mes</th>
                  <th className="py-3.5 px-4 text-center">Promedio General</th>
                  <th className="py-3.5 px-4">Criterios Fuertes</th>
                  <th className="py-3.5 px-4 text-center">Flash Elite</th>
                  <th className="py-3.5 px-4 text-center">Promociones</th>
                  <th className="py-3.5 px-4 text-center">Full Service</th>
                  <th className="py-3.5 px-4 text-center">Evaluación QR</th>
                  <th className="py-3.5 px-4 text-center">Facturación</th>
                  <th className="py-3.5 px-4">Estaciones Visitadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FLASH_ANNUAL_DATA.map((row) => (
                  <tr key={row.month} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {row.month}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getSemaforoClass(row.generalAverage)}`}>
                        {row.generalAverage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {row.criteriosFuertes}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {typeof row.flashElite === 'number' ? `${row.flashElite}%` : row.flashElite}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {row.promociones}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {row.fullService}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {row.evaluacionQr}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                      {row.facturacion}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.estacionesVisitadas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
