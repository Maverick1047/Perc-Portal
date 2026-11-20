import React, { useState } from 'react';
import { UserAccount, Brand } from '../types';
import { 
  Home, 
  Store, 
  Fuel, 
  Lock, 
  LayoutDashboard, 
  History, 
  FileSpreadsheet, 
  Target, 
  CheckSquare, 
  UploadCloud, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ClipboardList,
  Eye,
  FileText
} from 'lucide-react';

export interface SidebarProps {
  account: UserAccount;
  currentZone: 'inicio' | 'asturiano' | 'flash' | 'family_office';
  currentSubTab: string;
  onSelectZone: (zone: 'inicio' | 'asturiano' | 'flash' | 'family_office', subTab?: string) => void;
  onSelectSubTab: (subTab: string) => void;
  onLogout: () => void;
  onOpenProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  account,
  currentZone,
  currentSubTab,
  onSelectZone,
  onSelectSubTab,
  onLogout,
  onOpenProfileModal
}) => {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(true);
  const [isFamilyOfficeOpen, setIsFamilyOfficeOpen] = useState(true);

  // Dynamic theme styling per zone
  const getSidebarBg = () => {
    switch (currentZone) {
      case 'asturiano':
        return 'bg-red-800 border-red-900 text-red-50';
      case 'flash':
        return 'bg-orange-700 border-orange-800 text-orange-50';
      case 'family_office':
        return 'bg-neutral-950 border-amber-500/30 text-amber-200';
      case 'inicio':
      default:
        return 'bg-neutral-950 border-neutral-800 text-neutral-300';
    }
  };

  const getActiveTabStyle = () => {
    switch (currentZone) {
      case 'asturiano':
        return 'bg-red-900/90 text-yellow-300 border-l-4 border-yellow-400 font-bold shadow-inner';
      case 'flash':
        return 'bg-orange-800/90 text-yellow-300 border-l-4 border-yellow-300 font-bold shadow-inner';
      case 'family_office':
        return 'bg-amber-950/50 text-amber-300 border-l-4 border-amber-400 font-bold shadow-inner';
      case 'inicio':
      default:
        return 'bg-neutral-800 text-amber-400 border-l-4 border-amber-400 font-bold shadow-inner';
    }
  };

  const getSubItemHover = () => {
    switch (currentZone) {
      case 'asturiano':
        return 'hover:bg-red-700/60 hover:text-white';
      case 'flash':
        return 'hover:bg-orange-600/60 hover:text-white';
      case 'family_office':
        return 'hover:bg-amber-950/40 hover:text-amber-200';
      case 'inicio':
      default:
        return 'hover:bg-neutral-900 hover:text-white';
    }
  };

  const isAsturianoOnly = account.canAccessAsturiano && !account.canAccessFlash;
  const isFlashOnly = !account.canAccessAsturiano && account.canAccessFlash;

  return (
    <aside className={`w-64 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-300 select-none ${getSidebarBg()} z-30 min-h-screen`}>
      
      {/* Top Header & Navigation Links */}
      <div className="p-4 space-y-6">
        
        {/* Brand Identity Header */}
        <div 
          onClick={() => {
            if (isAsturianoOnly) {
              onSelectZone('asturiano', 'panel');
            } else if (isFlashOnly) {
              onSelectZone('flash', 'panel');
            } else {
              onSelectZone('inicio');
            }
          }}
          className="cursor-pointer group flex items-center justify-between pb-3 border-b border-white/10"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-amber-400 font-unbounded">
              <Sparkles className="w-3 h-3" /> {isAsturianoOnly ? 'Tiendas Asturiano' : isFlashOnly ? 'Estaciones Flash' : 'Grupo PERC'}
            </div>
            <h1 className="text-xl font-black tracking-tight text-white font-unbounded group-hover:text-amber-300 transition-colors">
              Perc<span className="text-amber-400">Portal</span>
            </h1>
          </div>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
            isAsturianoOnly
              ? 'bg-red-600 text-white border border-yellow-400 font-unbounded'
              : isFlashOnly
              ? 'bg-orange-500 text-yellow-300 border border-yellow-300'
              : 'bg-white/10 text-white/80 group-hover:bg-amber-400 group-hover:text-black'
          }`}>
            {isAsturianoOnly ? 'A' : isFlashOnly ? '⚡' : '★'}
          </div>
        </div>

        {/* Global Inicio Link - only shown if multi-brand or redirected */}
        <div>
          <button
            onClick={() => {
              if (isAsturianoOnly) {
                onSelectZone('asturiano', 'panel');
              } else if (isFlashOnly) {
                onSelectZone('flash', 'panel');
              } else {
                onSelectZone('inicio');
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
              currentZone === 'inicio' ? getActiveTabStyle() : getSubItemHover()
            }`}
          >
            <Home className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">
              {isAsturianoOnly ? 'Tablero Asturiano' : isFlashOnly ? 'Tablero Flash' : 'Inicio / Emblema PERC'}
            </span>
          </button>
        </div>

        {/* Section 1: Servicio al Cliente (Asturiano & Flash) */}
        {(account.canAccessAsturiano || account.canAccessFlash) && (
          <div className="space-y-2">
            <div 
              onClick={() => setIsCustomerServiceOpen(!isCustomerServiceOpen)}
              className="flex items-center justify-between px-2 text-[11px] font-bold tracking-wider uppercase opacity-75 cursor-pointer hover:opacity-100 transition-opacity"
            >
              <span>{isAsturianoOnly ? 'Auditorías Asturiano' : isFlashOnly ? 'Auditorías Flash' : 'Servicio al Cliente'}</span>
              {isCustomerServiceOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>

            {isCustomerServiceOpen && (
              <div className="space-y-3 pt-1">
                
                {/* Asturiano Section */}
                {account.canAccessAsturiano && (
                  <div className="space-y-1">
                    <button
                      onClick={() => onSelectZone('asturiano', 'panel')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        currentZone === 'asturiano' 
                          ? 'bg-white/15 text-white font-black' 
                          : getSubItemHover()
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-red-600 border border-yellow-400 text-white font-black flex items-center justify-center text-xs shadow-sm">
                          A
                        </span>
                        <span>Tiendas Asturiano</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-yellow-300">
                        15 pts
                      </span>
                    </button>

                    {/* Subtabs for Asturiano when active */}
                    {currentZone === 'asturiano' && (
                      <div className="ml-5 pl-2 border-l border-white/20 space-y-1 pt-1 animate-in fade-in duration-200">
                        <button
                          onClick={() => onSelectSubTab('panel')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'panel' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Panel General</span>
                        </button>

                        <button
                          onClick={() => onSelectSubTab('visitas')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'visitas' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Historial de Visitas</span>
                        </button>

                        <button
                          onClick={() => onSelectSubTab('criterios')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'criterios' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>10 Criterios Oficiales</span>
                        </button>

                        {account.canViewAnnualHistory && (
                          <button
                            onClick={() => onSelectSubTab('historico')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                              currentSubTab === 'historico' ? getActiveTabStyle() : getSubItemHover()
                            }`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Concentrado Anual (13m)</span>
                          </button>
                        )}


                        {account.canImportExcel && (
                          <button
                            onClick={() => onSelectSubTab('importar')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                              currentSubTab === 'importar' ? getActiveTabStyle() : getSubItemHover()
                            }`}
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Importar Excel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Flash Section */}
                {account.canAccessFlash && (
                  <div className="space-y-1">
                    <button
                      onClick={() => onSelectZone('flash', 'panel')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        currentZone === 'flash' 
                          ? 'bg-white/15 text-white font-black' 
                          : getSubItemHover()
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-orange-600 border border-yellow-300 text-yellow-300 font-black flex items-center justify-center text-xs shadow-sm">
                          ⚡
                        </span>
                        <span>Estaciones Flash</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-yellow-300">
                        100 pts
                      </span>
                    </button>

                    {/* Subtabs for Flash when active */}
                    {currentZone === 'flash' && (
                      <div className="ml-5 pl-2 border-l border-white/20 space-y-1 pt-1 animate-in fade-in duration-200">
                        <button
                          onClick={() => onSelectSubTab('panel')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'panel' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Panel General</span>
                        </button>

                        <button
                          onClick={() => onSelectSubTab('visitas')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'visitas' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Historial de Visitas</span>
                        </button>

                        <button
                          onClick={() => onSelectSubTab('proporcion')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'proporcion' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <Target className="w-3.5 h-3.5 text-yellow-300" />
                          <span>20 Estaciones (Meta 12)</span>
                        </button>

                        <button
                          onClick={() => onSelectSubTab('criterios')}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                            currentSubTab === 'criterios' ? getActiveTabStyle() : getSubItemHover()
                          }`}
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>10 Criterios Oficiales</span>
                        </button>

                        {account.canViewAnnualHistory && (
                          <button
                            onClick={() => onSelectSubTab('historico')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                              currentSubTab === 'historico' ? getActiveTabStyle() : getSubItemHover()
                            }`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Histórico Anual (14m)</span>
                          </button>
                        )}


                        {account.canImportExcel && (
                          <button
                            onClick={() => onSelectSubTab('importar')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                              currentSubTab === 'importar' ? getActiveTabStyle() : getSubItemHover()
                            }`}
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Importar Excel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* Section 2: Family Office (Strictly isolated: only Daniel, Ricardo, Cesar) */}
        {account.canAccessFamilyOffice && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div 
              onClick={() => setIsFamilyOfficeOpen(!isFamilyOfficeOpen)}
              className="flex items-center justify-between px-2 text-[11px] font-bold tracking-wider uppercase opacity-75 cursor-pointer hover:opacity-100 transition-opacity"
            >
              <span className="flex items-center gap-1.5 text-amber-400">
                <Lock className="w-3 h-3" /> Family Office
              </span>
              {isFamilyOfficeOpen ? <ChevronDown className="w-3 h-3 text-amber-400" /> : <ChevronRight className="w-3 h-3 text-amber-400" />}
            </div>

            {isFamilyOfficeOpen && (
              <div className="space-y-1">
                <button
                  onClick={() => onSelectZone('family_office', 'documentos')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    currentZone === 'family_office'
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                      : getSubItemHover()
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Bóveda Confidencial</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    PERC
                  </span>
                </button>

                {currentZone === 'family_office' && (
                  <div className="ml-5 pl-2 border-l border-amber-500/30 space-y-1 pt-1 animate-in fade-in duration-200">
                    <button
                      onClick={() => onSelectSubTab('documentos')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                        currentSubTab === 'documentos' ? getActiveTabStyle() : getSubItemHover()
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Documentos Confidenciales</span>
                    </button>

                    <button
                      onClick={() => onSelectSubTab('bitacora')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                        currentSubTab === 'bitacora' ? getActiveTabStyle() : getSubItemHover()
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Bitácora de Accesos</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer: User Identity & Log Out Action */}
      <div className="p-3.5 border-t border-white/10 bg-black/30 space-y-2.5">
        <div 
          onClick={onOpenProfileModal}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all group"
          title="Ver permisos o cambiar de usuario"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center text-xs shadow font-unbounded">
            {account.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black truncate text-white group-hover:text-amber-300">
                {account.name}
              </h4>
              <span className="text-[9px] text-amber-400/80 font-bold group-hover:text-amber-300">
                Perfil ▾
              </span>
            </div>
            <p className="text-[10px] opacity-75 truncate text-slate-300" title={account.roleLabel}>
              {account.title || account.roleLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenProfileModal}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-amber-400 hover:text-black text-amber-300 transition-all font-unbounded cursor-pointer"
          >
            <span>Cambiar</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-red-500/80 text-white transition-all cursor-pointer font-unbounded"
          >
            <LogOut className="w-3 h-3" />
            <span>Salir</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
