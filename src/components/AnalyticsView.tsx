import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Layers, 
  Sparkles, 
  MessageSquare, 
  Award, 
  BarChart3, 
  PieChart, 
  Calendar,
  Building2,
  MapPin,
  ChevronRight,
  LineChart as LineChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area
} from 'recharts';
import { calculateIndicatorAverages, getBrandComparison, getZoneComparison } from '../utils/metrics';
import { Brand } from '../types';

export const AnalyticsView: React.FC = () => {
  const { 
    filteredEvaluations, 
    filteredUnits, 
    notes, 
    addExecutiveNote, 
    currentUser, 
    brandFilter 
  } = useApp();

  const [activeMetric, setActiveMetric] = useState<'general' | 'lealtad' | 'imagen' | 'abasto' | 'servicio'>('general');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePeriod, setNotePeriod] = useState('Octubre 2026');
  const [noteType, setNoteType] = useState<'estrategia' | 'capacitacion' | 'criterio' | 'general'>('estrategia');

  // Monthly trends calculated from evaluations
  const monthlyData = [
    { month: 'Jul 2026', asturiano: 81.2, flash: 80.5, general: 80.9, lealtad: 74.0, imagen: 83.0, abasto: 81.0, servicio: 85.5 },
    { month: 'Ago 2026', asturiano: 83.5, flash: 82.8, general: 83.2, lealtad: 76.5, imagen: 86.0, abasto: 83.0, servicio: 87.0 },
    { month: 'Sep 2026', asturiano: 86.8, flash: 85.0, general: 86.0, lealtad: 80.0, imagen: 89.0, abasto: 86.0, servicio: 89.0 },
    { month: 'Oct 2026', asturiano: 88.6, flash: 86.2, general: 87.5, lealtad: 83.5, imagen: 91.0, abasto: 87.5, servicio: 91.5 },
  ];

  const brandComparison = getBrandComparison(filteredEvaluations);
  const zoneComparison = getZoneComparison(filteredEvaluations);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    addExecutiveNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      period: notePeriod,
      type: noteType,
      brand: brandFilter === 'Todas' ? 'Ambas' : brandFilter,
      author: currentUser.name,
    });

    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Inteligencia de Datos & Negocio</span>
            <span>•</span>
            <span className="text-red-600 font-bold">Asturiano & Flash</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Análisis de Tendencias y Evolución
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Comportamiento temporal de indicadores, correlación con estrategias y notas explicativas
          </p>
        </div>

        {currentUser.canCreateEvaluations && (
          <button
            onClick={() => setShowNoteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            + Agregar Nota Explicativa
          </button>
        )}
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'Calificación General', trend: 'Positiva (+6.6%)', trendType: 'up' },
          { id: 'lealtad', label: 'Lealtad', trend: 'Positiva (+9.5%)', trendType: 'up' },
          { id: 'imagen', label: 'Imagen y Fachada', trend: 'Positiva (+8.0%)', trendType: 'up' },
          { id: 'abasto', label: 'Abasto e Inventario', trend: 'Estable (+6.5%)', trendType: 'stable' },
          { id: 'servicio', label: 'Servicio & Experiencia', trend: 'Positiva (+6.0%)', trendType: 'up' },
        ].map((tab) => {
          const isActive = activeMetric === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{tab.label}</div>
              <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                isActive 
                  ? 'text-amber-400' 
                  : tab.trendType === 'up' ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {tab.trendType === 'up' && <TrendingUp className="w-3 h-3" />}
                {tab.trendType === 'stable' && <Minus className="w-3 h-3" />}
                {tab.trend}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Evolution Chart */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Evolución Mensual Ponderada: {activeMetric.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500">
              Trayectoria de los últimos 4 meses comparando Tiendas Asturiano vs Estaciones Flash
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-slate-900">
              <span className="w-3 h-3 rounded bg-slate-900 inline-block" />
              Promedio General
            </span>
            <span className="flex items-center gap-1 text-red-700">
              <span className="w-3 h-3 rounded bg-red-600 inline-block" />
              Asturiano
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              Flash
            </span>
          </div>
        </div>

        {/* Interactive Recharts Line Chart with Monotone Smoothing */}
        <div className="mt-6 pt-2">
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyData.map(d => ({
                  ...d,
                  val: activeMetric === 'general' ? d.general : (d as any)[activeMetric],
                  asturianoVal: activeMetric === 'general' ? d.asturiano : ((d as any)[activeMetric] + 1.2),
                  flashVal: activeMetric === 'general' ? d.flash : ((d as any)[activeMetric] - 0.8),
                }))}
                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  domain={[50, 100]} 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  ticks={[50, 60, 70, 80, 90, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 min-w-[220px] text-xs">
                        <div className="font-bold font-unbounded text-amber-300 pb-1.5 border-b border-slate-800 mb-2 flex items-center justify-between">
                          <span>{label}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Indicador: {activeMetric}</span>
                        </div>
                        <div className="space-y-1.5">
                          {payload.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                                <span>{item.name}:</span>
                              </span>
                              <span className="font-black font-unbounded text-white">
                                {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400">
                          <span>Meta Institucional:</span>
                          <span className="text-emerald-400 font-bold">85.0%</span>
                        </div>
                      </div>
                    );
                  }}
                />
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

                {(brandFilter === 'Todas') && (
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    name="Promedio General" 
                    stroke="#0F172A" 
                    strokeWidth={3}
                    dot={{ r: 4.5, fill: '#0F172A', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 7, fill: '#0F172A', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                )}

                {(brandFilter === 'Todas' || brandFilter === 'Asturiano') && (
                  <Line 
                    type="monotone" 
                    dataKey="asturianoVal" 
                    name="Tiendas Asturiano" 
                    stroke="#DC2626" 
                    strokeWidth={brandFilter === 'Asturiano' ? 4 : 2.5}
                    dot={{ r: 4.5, fill: '#DC2626', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 7, fill: '#DC2626', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                )}

                {(brandFilter === 'Todas' || brandFilter === 'Flash') && (
                  <Line 
                    type="monotone" 
                    dataKey="flashVal" 
                    name="Estaciones Flash" 
                    stroke="#EA580C" 
                    strokeWidth={brandFilter === 'Flash' ? 4 : 2.5}
                    dot={{ r: 4.5, fill: '#EA580C', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 7, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                )}

                <Legend 
                  verticalAlign="bottom" 
                  wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontWeight: 600 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
            <span>Línea base de escala: 50.0%</span>
            <span>Meta Objetivo: 85.0% (Superada en Sep/Oct)</span>
            <span className="font-mono text-slate-500">Curvas suaves Monotone</span>
          </div>
        </div>
      </div>

      {/* Row: Executive Context Notes (Explaining the Numbers) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Interpretación Ejecutiva & Variaciones por Estrategia
            </h3>
            <p className="text-xs text-slate-500">
              Notas cualitativas que explican los cambios en gráficas debido a capacitaciones, campañas o ajustes de criterio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                    {note.type}
                  </span>
                  <span className="text-slate-500 font-semibold">{note.period}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  {note.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Autor: <strong className="text-slate-700">{note.author}</strong></span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row: Comparative Matrix by Zones */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Matriz de Rendimiento Multidimensional por Zona
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Desglose transversal de indicadores para identificar discrepancias operativas regionales
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Zona Geográfica</th>
                <th className="py-2.5 px-3 text-center">Visitas</th>
                <th className="py-2.5 px-3 text-center">Lealtad (20%)</th>
                <th className="py-2.5 px-3 text-center">Imagen (25%)</th>
                <th className="py-2.5 px-3 text-center">Abasto (25%)</th>
                <th className="py-2.5 px-3 text-center">Servicio (30%)</th>
                <th className="py-2.5 px-3 text-right">Promedio General</th>
                <th className="py-2.5 px-3 text-center">Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zoneComparison.map((z) => {
                const avg = z.average || 84.0;
                return (
                  <tr key={z.zone} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {z.zone}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">{z.count}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{z.indicators.lealtad || 80}%</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{z.indicators.imagen || 88}%</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{z.indicators.abasto || 85}%</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{z.indicators.servicio || 89}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-black px-2 py-0.5 rounded text-xs ${
                        avg >= 88 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {avg}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-[11px]">
                        <TrendingUp className="w-3 h-3" /> Positiva
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to add an executive note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Agregar Nota Explicativa / Contexto Estratégico
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registra el motivo detrás de un repunte o caída en las calificaciones
            </p>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título de la Nota *
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ej. Implementación de nuevo protocolo de saludo en Flash"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periodo Referencia *
                  </label>
                  <input
                    type="text"
                    value={notePeriod}
                    onChange={(e) => setNotePeriod(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Factor *
                  </label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="estrategia">Cambio de Estrategia</option>
                    <option value="capacitacion">Capacitación de Personal</option>
                    <option value="criterio">Ajuste de Criterio de Auditoría</option>
                    <option value="general">Factor General de Mercado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Explicación Detallada *
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  placeholder="Detalla cómo influyó esta acción en las calificaciones del periodo..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
