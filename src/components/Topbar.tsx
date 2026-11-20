import React, { useState, useMemo } from 'react';
import { UserAccount, StoreUnit, Brand } from '../types';
import { 
  Search, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Store, 
  Fuel, 
  ShieldCheck, 
  Building2,
  X
} from 'lucide-react';

export interface TopbarProps {
  account: UserAccount;
  currentZone: 'inicio' | 'asturiano' | 'flash' | 'family_office';
  currentSubTab: string;
  accessibleUnits: StoreUnit[];
  onSelectUnit: (unit: StoreUnit) => void;
  onOpenNewEval: () => void;
  onOpenProfileModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  account,
  currentZone,
  currentSubTab,
  accessibleUnits,
  onSelectUnit,
  onOpenNewEval,
  onOpenProfileModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dynamic Date string in Spanish
  const todayFormatted = useMemo(() => {
    const today = new Date();
    // Use Intl.DateTimeFormat in Spanish
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formatted = new Intl.DateTimeFormat('es-MX', options).format(today);
      // Capitalize first letter
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return '28 de octubre de 2026';
    }
  }, []);

  const isAsturianoOnly = account.canAccessAsturiano && !account.canAccessFlash;
  const isFlashOnly = !account.canAccessAsturiano && account.canAccessFlash;

  // Filter units for search bar strictly isolated by brand
  const matchingUnits = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return accessibleUnits.filter(u => {
      if (isAsturianoOnly && u.brand !== 'Asturiano') return false;
      if (isFlashOnly && u.brand !== 'Flash') return false;
      return (
        u.name.toLowerCase().includes(q) || 
        u.code.toLowerCase().includes(q) ||
        (u.zone && u.zone.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [searchQuery, accessibleUnits, isAsturianoOnly, isFlashOnly]);

  // Construct breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (currentZone === 'inicio') {
      if (isAsturianoOnly) {
        return [
          { label: 'Tiendas Asturiano', active: false },
          { label: 'Tablero', active: true }
        ];
      }
      if (isFlashOnly) {
        return [
          { label: 'Estaciones Flash', active: false },
          { label: 'Tablero', active: true }
        ];
      }
      return [
        { label: 'Grupo PERC', active: false },
        { label: 'Inicio', active: true }
      ];
    }
    if (currentZone === 'family_office') {
      const subLabels: Record<string, string> = {
        documentos: 'Documentos Confidenciales',
        bitacora: 'Bitácora de Accesos'
      };
      return [
        { label: 'Family Office', active: false },
        { label: subLabels[currentSubTab] || 'Bóveda', active: true }
      ];
    }
    const brandName = isAsturianoOnly 
      ? 'Tiendas Asturiano' 
      : isFlashOnly 
      ? 'Estaciones Flash' 
      : currentZone === 'asturiano' 
      ? 'Tiendas Asturiano' 
      : 'Estaciones Flash';

    const subLabels: Record<string, string> = {
      panel: 'Panel General',
      visitas: 'Historial de Visitas',
      proporcion: 'Proporción 20 Estaciones (Meta 12)',
      criterios: '10 Criterios Oficiales',
      historico: (currentZone === 'asturiano' || isAsturianoOnly) ? 'Concentrado Anual (13 Meses)' : 'Histórico Anual (14 Meses)',
      importar: 'Importar Excel'
    };

    if (isAsturianoOnly || isFlashOnly) {
      return [
        { label: brandName, active: false },
        { label: subLabels[currentSubTab] || currentSubTab, active: true }
      ];
    }

    return [
      { label: 'Servicio al Cliente', active: false },
      { label: brandName, active: false },
      { label: subLabels[currentSubTab] || currentSubTab, active: true }
    ];
  }, [currentZone, currentSubTab, isAsturianoOnly, isFlashOnly]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      
      {/* Left: Breadcrumbs navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
            <span className={`truncate ${crumb.active ? 'font-bold text-slate-900 font-unbounded' : 'hover:text-slate-700'}`}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Middle/Right: Search bar and actions */}
      <div className="flex items-center gap-3 ml-auto">
        
        {/* Store / Station Search Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={isAsturianoOnly ? 'Buscar tienda Asturiano...' : isFlashOnly ? 'Buscar estación Flash...' : 'Buscar tienda o estación...'}
              className="w-48 sm:w-64 pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && matchingUnits.length > 0 && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Resultados encontrados ({matchingUnits.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchingUnits.map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      onSelectUnit(unit);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${
                        unit.brand === 'Asturiano' ? 'bg-red-600' : 'bg-orange-500'
                      }`}>
                        {unit.brand === 'Asturiano' ? 'A' : '⚡'}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-amber-600">
                          {unit.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {unit.code} • {unit.zone}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600">
                      Ver visitas →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Date Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{todayFormatted}</span>
        </div>

        {/* Action Button: + Nueva Evaluación if permitted */}
        {account.canUploadEvaluations && (
          <button
            onClick={onOpenNewEval}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-sm transition-all hover:scale-102 flex-shrink-0 font-unbounded cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Evaluación</span>
          </button>
        )}

        {/* Profile Switcher & Info Button */}
        <button
          onClick={onOpenProfileModal}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all cursor-pointer group flex-shrink-0"
          title="Ver perfil o cambiar de usuario"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center font-unbounded shadow-xs">
            {account.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left text-[11px] leading-tight">
            <div className="font-bold text-slate-900 group-hover:text-amber-600 truncate max-w-[110px]">
              {account.name}
            </div>
            <div className="text-[9px] text-slate-500 truncate max-w-[110px]">
              {account.roleLabel}
            </div>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 hidden md:inline font-mono">
            ▾
          </span>
        </button>

      </div>

    </header>
  );
};
