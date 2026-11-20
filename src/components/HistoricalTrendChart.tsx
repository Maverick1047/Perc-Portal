import React, { useState } from 'react';
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
import { Brand } from '../types';
import { ASTURIANO_ANNUAL_DATA, FLASH_ANNUAL_DATA } from '../data/seedData';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Calendar, 
  Sparkles, 
  Filter, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export interface HistoricalTrendChartProps {
  brand?: Brand | 'Todas';
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

// Custom Tooltip component with high-fidelity formatting and contextual insights
const CustomTooltip = ({ active, payload, label, brand }: any) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0]?.payload;
  const isAsturiano = brand === 'Asturiano' || dataPoint?.storesAudited !== undefined;
  const isFlash = brand === 'Flash' || dataPoint?.criteriosFuertes !== undefined;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 min-w-[260px] text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
        <div className="font-bold font-unbounded text-amber-300 text-sm">
          {label}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          isAsturiano ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
        }`}>
          {isAsturiano ? 'Asturiano' : 'Flash'}
        </span>
      </div>

      {/* Main Score & Audit Counts */}
      <div className="space-y-1.5 mb-3">
        {payload.map((entry: any, index: number) => {
          const val = typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value;
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-black font-unbounded text-white text-xs">
                {val}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Brand Specific Insights */}
      {isAsturiano && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Tiendas Auditadas:</span>
            <span className="font-bold text-white">{dataPoint.storesAudited} unidades</span>
          </div>
          {dataPoint.minScore !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-400">Rango Calificaciones:</span>
              <span className="font-mono text-amber-300">{dataPoint.minScore}% - {dataPoint.maxScore}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Meta Grupo PERC (85%):</span>
            <span className={dataPoint.generalAverage >= 85 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {dataPoint.generalAverage >= 85 ? '✓ Cumplida' : 'Oportunidad de Mejora'}
            </span>
          </div>
        </div>
      )}

      {isFlash && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Facturación:</span>
            <span className="font-bold text-emerald-400">{dataPoint.facturacion}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Full Service:</span>
            <span className="font-bold text-yellow-400">{dataPoint.fullService}%</span>
          </div>
          {dataPoint.criteriosFuertes && (
            <div className="mt-1 pt-1 border-t border-slate-800">
              <span className="text-slate-400 block text-[10px]">Fortalezas destacadas:</span>
              <span className="text-amber-300 font-semibold text-[10px] leading-tight block">
                {dataPoint.criteriosFuertes}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({
  brand = 'Asturiano',
  title,
  subtitle,
  compact = false
}) => {
  const [activeMetric, setActiveMetric] = useState<string>('general');
  const [showMultiLines, setShowMultiLines] = useState<boolean>(false);

  // Pick dataset according to brand
  const isAsturiano = brand === 'Asturiano';
  const isFlash = brand === 'Flash';
  const isCombined = brand === 'Todas';

  // Format month labels for clean axis display (e.g. "Septiembre 2025" -> "Sep 25")
  const formatMonthShort = (str: string) => {
    if (!str) return '';
    const parts = str.replace(' (Cierre)', '').split(' ');
    if (parts.length >= 2) {
      const monthPrefix = parts[0].substring(0, 3);
      const yearShort = parts[1].slice(-2);
      return `${monthPrefix} '${yearShort}`;
    }
    return str;
  };

  const asturianoChartData = ASTURIANO_ANNUAL_DATA.map(d => ({
    ...d,
    shortMonth: formatMonthShort(d.month),
    benchmark: 85,
    score: d.generalAverage,
  }));

  const parseFlashEliteVal = (val: string | number) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace('>', '').replace('%', '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const flashChartData = FLASH_ANNUAL_DATA.map(d => ({
    ...d,
    shortMonth: formatMonthShort(d.month),
    benchmark: 85,
    score: d.generalAverage,
    flashEliteNumeric: parseFlashEliteVal(d.flashElite)
  }));

  // Combined data for corporate/comparison mode
  const combinedChartData = [
    { month: 'Sep 25', asturiano: 72.7, flash: 75.0, benchmark: 85 },
    { month: 'Oct 25', asturiano: 79.1, flash: 68.0, benchmark: 85 },
    { month: 'Nov 25', asturiano: 64.0, flash: 78.0, benchmark: 85 },
    { month: 'Dic 25', asturiano: 71.0, flash: 88.0, benchmark: 85 },
    { month: 'Ene 26', asturiano: 67.8, flash: 85.0, benchmark: 85 },
    { month: 'Feb 26', asturiano: 70.0, flash: 74.0, benchmark: 85 },
    { month: 'Mar 26', asturiano: 70.0, flash: 88.0, benchmark: 85 },
    { month: 'Abr 26', asturiano: 71.0, flash: 81.0, benchmark: 85 },
    { month: 'May 26', asturiano: 78.0, flash: 89.0, benchmark: 85 },
    { month: 'Jun 26', asturiano: 85.0, flash: 82.0, benchmark: 85 },
    { month: 'Jul 26', asturiano: 87.0, flash: 87.0, benchmark: 85 },
    { month: 'Ago 26', asturiano: 87.0, flash: 87.0, benchmark: 85 },
    { month: 'Sep 26', asturiano: 84.0, flash: 83.0, benchmark: 85 },
  ];

  const currentDataset: any[] = isAsturiano 
    ? asturianoChartData 
    : isFlash 
    ? flashChartData 
    : combinedChartData;

  // Dynamic brand colors:
  // Asturiano = Red (#DC2626) primary, Gold (#D97706) secondary, Blue (#2563EB) tertiary
  // Flash = Orange (#EA580C) primary, Amber (#F59E0B) secondary, Emerald (#10B981) tertiary
  const brandPrimaryColor = isAsturiano ? '#DC2626' : isFlash ? '#EA580C' : '#D97706';
  const brandSecondaryColor = isAsturiano ? '#D97706' : isFlash ? '#F59E0B' : '#2563EB';
  const brandGradientStart = isAsturiano ? '#DC2626' : isFlash ? '#EA580C' : '#D97706';
  const brandGradientId = isAsturiano ? 'asturianoGradient' : isFlash ? 'flashGradient' : 'combinedGradient';

  // Stats calculation
  const scoresArray = isAsturiano 
    ? asturianoChartData.map(d => d.generalAverage) 
    : isFlash 
    ? flashChartData.map(d => d.generalAverage) 
    : combinedChartData.map(d => (d.asturiano + d.flash) / 2);

  const avgAnnual = scoresArray.reduce((acc, curr) => acc + curr, 0) / scoresArray.length;
  const maxAnnual = Math.max(...scoresArray);
  const minAnnual = Math.min(...scoresArray);
  const latestScore = scoresArray[scoresArray.length - 1];
  const previousScore = scoresArray[scoresArray.length - 2];
  const diffFromPrevious = latestScore - previousScore;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* Header with Title and Brand Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              isAsturiano ? 'bg-red-600' : isFlash ? 'bg-orange-500' : 'bg-amber-500'
            }`} />
            <span className={`text-[11px] font-black tracking-wider uppercase font-unbounded ${
              isAsturiano ? 'text-red-700' : isFlash ? 'text-orange-700' : 'text-amber-700'
            }`}>
              {isAsturiano 
                ? 'Tiendas Asturiano • Tendencia Histórica (13 Meses)' 
                : isFlash 
                ? 'Estaciones Flash • Tendencia Histórica (14 Meses)' 
                : 'Grupo PERC • Comparativo Consolidado de Marcas'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black font-unbounded text-slate-900 tracking-tight">
            {title || (isAsturiano 
              ? 'Evolución de Astro Servicio y Calidad' 
              : isFlash 
              ? 'Evolución de Servicio y Flash Elite' 
              : 'Evolución Comparativa Asturiano vs Flash')}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle || (isAsturiano 
              ? 'Curvas suavizadas con modelo Recharts Monotone en escala oficial 15.0 pts (0-100%).' 
              : isFlash 
              ? 'Trayectoria mensual en escala oficial 100 pts con metas de Full Service y Facturación.' 
              : 'Análisis temporal cruzado con umbral institucional de excelencia.')}
          </p>
        </div>

        {/* View Controls & Toggles */}
        {!isCombined && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMultiLines(!showMultiLines)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-unbounded transition-all flex items-center gap-1.5 border ${
                showMultiLines
                  ? isAsturiano
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showMultiLines ? 'Ocultar Criterios' : 'Comparar Criterios'}</span>
            </button>

            {!showMultiLines && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveMetric('general')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeMetric === 'general'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Promedio
                </button>
                {isAsturiano ? (
                  <>
                    <button
                      onClick={() => setActiveMetric('lealtad')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'lealtad'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lealtad
                    </button>
                    <button
                      onClick={() => setActiveMetric('promos')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'promos'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Promos
                    </button>
                    <button
                      onClick={() => setActiveMetric('saludo')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'saludo'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Astro Saludo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveMetric('fullService')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'fullService'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Full Service
                    </button>
                    <button
                      onClick={() => setActiveMetric('facturacion')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'facturacion'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Facturación
                    </button>
                    <button
                      onClick={() => setActiveMetric('promociones')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === 'promociones'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Promos
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mini Executive Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Promedio del Periodo</span>
          <div className="text-xl font-black font-unbounded text-slate-900 mt-0.5">
            {avgAnnual.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-500">Histórico completo</span>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Calificación Más Alta</span>
          <div className="text-xl font-black font-unbounded text-emerald-600 mt-0.5">
            {maxAnnual.toFixed(1)}%
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Pico de desempeño</span>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Calificación Más Baja</span>
          <div className="text-xl font-black font-unbounded text-rose-600 mt-0.5">
            {minAnnual.toFixed(1)}%
          </div>
          <span className="text-[10px] text-rose-700 font-semibold">Mínimo registrado</span>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Cierre Septiembre 2026</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black font-unbounded text-slate-900">
              {latestScore.toFixed(1)}%
            </span>
            <span className={`text-[10px] font-bold flex items-center ${
              diffFromPrevious >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {diffFromPrevious >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {diffFromPrevious >= 0 ? `+${diffFromPrevious.toFixed(1)}%` : `${diffFromPrevious.toFixed(1)}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">vs periodo anterior</span>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-72 sm:h-80 md:h-96 mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentDataset}
            margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
          >
            <defs>
              <linearGradient id={brandGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandGradientStart} stopOpacity={0.25} />
                <stop offset="95%" stopColor={brandGradientStart} stopOpacity={0.0} />
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
              domain={[0, 100]} 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip 
              content={<CustomTooltip brand={brand} />}
            />

            {/* Reference benchmark line for Grupo PERC target */}
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

            {/* Combined Brand Comparison Mode */}
            {isCombined && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="asturiano" 
                  name="Tiendas Asturiano" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#DC2626', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, fill: '#DC2626', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="flash" 
                  name="Estaciones Flash" 
                  stroke="#EA580C" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#EA580C', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </>
            )}

            {/* Asturiano Mode */}
            {isAsturiano && (
              <>
                {!showMultiLines ? (
                  <>
                    <Area
                      type="monotone"
                      dataKey={
                        activeMetric === 'general' ? 'generalAverage' :
                        activeMetric === 'lealtad' ? 'loyaltyAppPct' :
                        activeMetric === 'promos' ? 'promosPct' : 'astroSaludoPct'
                      }
                      fill={`url(#${brandGradientId})`}
                      stroke="none"
                    />
                    <Line
                      type="monotone"
                      dataKey={
                        activeMetric === 'general' ? 'generalAverage' :
                        activeMetric === 'lealtad' ? 'loyaltyAppPct' :
                        activeMetric === 'promos' ? 'promosPct' : 'astroSaludoPct'
                      }
                      name={
                        activeMetric === 'general' ? 'Promedio General' :
                        activeMetric === 'lealtad' ? 'Lealtad App %' :
                        activeMetric === 'promos' ? 'Promociones %' : 'Astro Saludo %'
                      }
                      stroke={brandPrimaryColor}
                      strokeWidth={3.5}
                      dot={{ r: 4.5, fill: brandPrimaryColor, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 7, fill: brandPrimaryColor, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="generalAverage"
                      name="Promedio General"
                      stroke="#DC2626"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: '#DC2626' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="loyaltyAppPct"
                      name="Lealtad App %"
                      stroke="#2563EB"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      dot={{ r: 3, fill: '#2563EB' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="promosPct"
                      name="Promociones %"
                      stroke="#D97706"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#D97706' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="astroSaludoPct"
                      name="Astro Saludo %"
                      stroke="#9333EA"
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      dot={{ r: 3, fill: '#9333EA' }}
                    />
                  </>
                )}
              </>
            )}

            {/* Flash Mode */}
            {isFlash && (
              <>
                {!showMultiLines ? (
                  <>
                    <Area
                      type="monotone"
                      dataKey={
                        activeMetric === 'general' ? 'generalAverage' :
                        activeMetric === 'facturacion' ? 'facturacion' :
                        activeMetric === 'fullService' ? 'fullService' : 'promociones'
                      }
                      fill={`url(#${brandGradientId})`}
                      stroke="none"
                    />
                    <Line
                      type="monotone"
                      dataKey={
                        activeMetric === 'general' ? 'generalAverage' :
                        activeMetric === 'facturacion' ? 'facturacion' :
                        activeMetric === 'fullService' ? 'fullService' : 'promociones'
                      }
                      name={
                        activeMetric === 'general' ? 'Promedio General' :
                        activeMetric === 'facturacion' ? 'Facturación %' :
                        activeMetric === 'fullService' ? 'Full Service %' : 'Promociones %'
                      }
                      stroke={brandPrimaryColor}
                      strokeWidth={3.5}
                      dot={{ r: 4.5, fill: brandPrimaryColor, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 7, fill: brandPrimaryColor, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="generalAverage"
                      name="Promedio General"
                      stroke="#EA580C"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: '#EA580C' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="facturacion"
                      name="Facturación %"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fullService"
                      name="Full Service %"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      dot={{ r: 3, fill: '#F59E0B' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="promociones"
                      name="Promociones %"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#8B5CF6' }}
                    />
                  </>
                )}
              </>
            )}

            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: 600 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Qualitative Benchmark Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Línea verde discontinua: <strong>Meta de Calidad Grupo PERC (85%)</strong>. Puntos con brillo indican valores interactivos.</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Recharts Monotone Engine • Grupo PERC
        </span>
      </div>
    </div>
  );
};
