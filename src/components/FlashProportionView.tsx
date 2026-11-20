import React, { useState } from 'react';
import { StoreUnit, UserAccount } from '../types';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  Edit3, 
  Eye, 
  Plus, 
  Sparkles,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export interface FlashProportionViewProps {
  stations: StoreUnit[];
  account: UserAccount;
  onUpdateStationTarget?: (stationId: string, newTarget: number) => void;
  onAddStationVisit?: (stationId: string) => void;
  onSelectStation: (stationId: string) => void;
}

export const FlashProportionView: React.FC<FlashProportionViewProps> = ({
  stations,
  account,
  onUpdateStationTarget,
  onAddStationVisit,
  onSelectStation
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'cumplida' | 'progreso' | 'debajo'>('all');
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [editTargetValue, setEditTargetValue] = useState<number>(12);

  // Calculate totals
  const totalVisits = stations.reduce((acc, s) => acc + (s.visitsCount || 0), 0);
  const totalTarget = stations.reduce((acc, s) => acc + (s.visitTarget || 12), 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalVisits / totalTarget) * 1000) / 10 : 0;

  const cumplidasCount = stations.filter(s => (s.visitsCount || 0) >= (s.visitTarget || 12)).length;
  const enProgresoCount = stations.filter(s => {
    const visits = s.visitsCount || 0;
    const target = s.visitTarget || 12;
    return visits < target && visits >= 6;
  }).length;
  const porDebajoCount = stations.filter(s => (s.visitsCount || 0) < 6).length;

  const getStatusBadge = (visits: number, target: number) => {
    if (visits >= target) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Meta cumplida
        </span>
      );
    }
    if (visits >= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> En progreso
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
        <AlertCircle className="w-3 h-3 text-rose-600" /> Por debajo
      </span>
    );
  };

  const filteredStations = stations.filter(s => {
    const visits = s.visitsCount || 0;
    const target = s.visitTarget || 12;
    if (filterStatus === 'cumplida') return visits >= target;
    if (filterStatus === 'progreso') return visits < target && visits >= 6;
    if (filterStatus === 'debajo') return visits < 6;
    return true;
  });

  const handleStartEdit = (station: StoreUnit) => {
    setEditingStationId(station.id);
    setEditTargetValue(station.visitTarget || 12);
  };

  const handleSaveTarget = (stationId: string) => {
    if (onUpdateStationTarget && editTargetValue > 0) {
      onUpdateStationTarget(stationId, editTargetValue);
    }
    setEditingStationId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Context Card */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-yellow-200 text-xs font-bold tracking-wider uppercase font-unbounded">
            <Target className="w-3.5 h-3.5" />
            Meta Anual: 12 Visitas por Estación
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-unbounded tracking-tight text-white">
            Proporción de Visitas • 20 Estaciones Flash
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Monitoreo en tiempo real del cumplimiento de evaluaciones de servicio en las 20 estaciones de la red Flash.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] uppercase tracking-wider text-orange-100 block">Total Visitas</span>
            <div className="text-2xl sm:text-3xl font-black font-unbounded text-white mt-1">
              {totalVisits} <span className="text-sm font-normal text-orange-200">/ {totalTarget}</span>
            </div>
            <div className="text-xs font-bold text-yellow-300 mt-1">
              {overallPercentage}% avance global
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 block">Meta Cumplida (≥12)</span>
            <div className="text-2xl sm:text-3xl font-black font-unbounded text-white mt-1">
              {cumplidasCount} <span className="text-sm font-normal text-orange-200">/ 20</span>
            </div>
            <div className="text-xs text-emerald-200 font-bold mt-1">
              {Math.round((cumplidasCount / 20) * 100)}% de la red
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] uppercase tracking-wider text-amber-200 block">En Progreso (6 - 11)</span>
            <div className="text-2xl sm:text-3xl font-black font-unbounded text-white mt-1">
              {enProgresoCount} <span className="text-sm font-normal text-orange-200">/ 20</span>
            </div>
            <div className="text-xs text-amber-200 font-bold mt-1">
              {Math.round((enProgresoCount / 20) * 100)}% de la red
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] uppercase tracking-wider text-rose-200 block">Por Debajo (&lt;6)</span>
            <div className="text-2xl sm:text-3xl font-black font-unbounded text-white mt-1">
              {porDebajoCount} <span className="text-sm font-normal text-orange-200">/ 20</span>
            </div>
            <div className="text-xs text-rose-200 font-bold mt-1">
              {Math.round((porDebajoCount / 20) * 100)}% de la red
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas las Estaciones ({stations.length})
          </button>
          <button
            onClick={() => setFilterStatus('cumplida')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'cumplida'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Meta Cumplida ({cumplidasCount})
          </button>
          <button
            onClick={() => setFilterStatus('progreso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'progreso'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            En Progreso ({enProgresoCount})
          </button>
          <button
            onClick={() => setFilterStatus('debajo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'debajo'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Por Debajo ({porDebajoCount})
          </button>
        </div>

        {account.canUploadEvaluations && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-amber-500" />
            Responsable puede editar metas o registrar visitas rápidas
          </span>
        )}
      </div>

      {/* 20 Stations Ranking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Estación Flash</th>
                <th className="py-3.5 px-4 text-center">Visitas Realizadas</th>
                <th className="py-3.5 px-4 text-center">Meta Anual</th>
                <th className="py-3.5 px-4 text-center">Avance (%)</th>
                <th className="py-3.5 px-4">Estatus</th>
                <th className="py-3.5 px-4 min-w-[140px]">Progreso Visual</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStations.map((station, index) => {
                const visits = station.visitsCount || 0;
                const target = station.visitTarget || 12;
                const pct = Math.round((visits / target) * 100);

                return (
                  <tr key={station.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-unbounded text-xs">
                        {station.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        <span className="font-mono font-bold text-orange-700">{station.code}</span> · {station.zone}
                        {station.sharedWith ? <span className="text-slate-600 block text-[9px] mt-0.5">Tienda compartida: {station.sharedWith}</span> : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-slate-900 text-sm font-unbounded">
                        {visits}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {editingStationId === station.id ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={editTargetValue}
                            onChange={(e) => setEditTargetValue(parseInt(e.target.value) || 12)}
                            className="w-14 px-1.5 py-0.5 text-xs text-center border border-amber-400 rounded-md focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveTarget(station.id)}
                            className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-600">
                          <span className="font-medium">{target}</span>
                          {account.canUploadEvaluations && (
                            <button
                              onClick={() => handleStartEdit(station)}
                              className="text-slate-400 hover:text-amber-600 p-0.5"
                              title="Editar meta"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {pct}%
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(visits, target)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            visits >= target 
                              ? 'bg-emerald-500' 
                              : visits >= 6 
                              ? 'bg-amber-500' 
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {account.canUploadEvaluations && onAddStationVisit && (
                          <button
                            onClick={() => onAddStationVisit(station.id)}
                            className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors"
                            title="Añadir visita rápida"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectStation(station.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
