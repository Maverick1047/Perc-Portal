import React from 'react';
import { Brand } from '../types';
import { ASTURIANO_CRITERIA_TEMPLATE, FLASH_CRITERIA_TEMPLATE } from '../data/seedData';
import { ClipboardList, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const CriteriaBreakdownView: React.FC<{ brand: Brand }> = ({ brand }) => {
  const criteria = brand === 'Asturiano' ? ASTURIANO_CRITERIA_TEMPLATE : FLASH_CRITERIA_TEMPLATE;
  const totalMax = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden ${
        brand === 'Asturiano'
          ? 'bg-gradient-to-r from-red-700 via-red-800 to-red-900 border border-yellow-400/40'
          : 'bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 border border-yellow-400/40'
      }`}>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-yellow-300 text-xs font-bold uppercase tracking-wider font-unbounded">
            <ClipboardList className="w-3.5 h-3.5" />
            Normativa Oficial • 10 Criterios
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-unbounded text-white">
            10 Criterios Oficiales de Auditoría • {brand === 'Asturiano' ? 'Tiendas Asturiano' : 'Estaciones Flash'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 max-w-xl">
            {brand === 'Asturiano' 
              ? 'Escala oficial ponderada en 15.00 puntos con paso de 0.50 pts. Evaluaciones de Astro Servicio y Calidad Operativa.'
              : 'Escala oficial ponderada en 100 puntos. Protocolo de atención, rapidez de carga, lealtad Flash Elite y facturación.'}
          </p>
        </div>
      </div>

      {/* Criteria Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((c, idx) => (
          <div 
            key={c.id} 
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 font-unbounded">
                  Criterio #{idx + 1}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black font-unbounded ${
                  brand === 'Asturiano' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  {c.maxPoints.toFixed(brand === 'Asturiano' ? 2 : 0)} pts máx.
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug font-unbounded">
                {c.name}
              </h3>
              
              <p className="text-xs text-slate-500 mt-2">
                <strong>Estándar de verificación:</strong> {c.notes || 'Revisión minuciosa en campo y evidencia fotográfica.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ponderación oficial
              </span>
              <span>{Math.round((c.maxPoints / totalMax) * 100)}% del total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center text-lg">
            Σ
          </div>
          <div>
            <h4 className="font-bold text-white font-unbounded text-sm">
              Suma Total de la Evaluación Oficial
            </h4>
            <p className="text-xs text-slate-400">
              Todos los criterios deben ser calificados en cada visita de auditoría.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black font-unbounded text-amber-400">
            {totalMax.toFixed(brand === 'Asturiano' ? 2 : 0)} {brand === 'Asturiano' ? 'pts' : 'pts (100%)'}
          </div>
          <span className="text-xs text-slate-400">10 criterios validados</span>
        </div>
      </div>

    </div>
  );
};
