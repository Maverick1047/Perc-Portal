import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  History, 
  TrendingUp, 
  FolderArchive, 
  CheckSquare, 
  FileText, 
  UserCheck, 
  ChevronDown,
  Building2,
  Fuel,
  Store,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import { Brand } from '../types';

export const Navbar: React.FC<{ onOpenNewEval: () => void }> = ({ onOpenNewEval }) => {
  const { 
    currentUser, 
    availableProfiles, 
    setCurrentUser, 
    brandFilter, 
    setBrandFilter, 
    activeTab, 
    setActiveTab, 
    filteredActions,
    resetToDefaults
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const pendingCount = filteredActions.filter(a => a.status !== 'concluido').length;

  const navItems = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    ...(currentUser.canUploadData ? [{ id: 'registro', label: 'Captura de Datos', icon: ClipboardCheck }] : []),
    { id: 'historial', label: 'Consulta Histórica', icon: History },
    { id: 'analisis', label: 'Análisis y Tendencias', icon: TrendingUp },
    { id: 'evidencias', label: 'Evidencias y Docs', icon: FolderArchive },
    { 
      id: 'seguimiento', 
      label: 'Seguimiento', 
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined 
    },
    { id: 'reportes', label: 'Reportes', icon: FileText },
  ];

  // Dynamic Theme Colors based on active brand:
  // General: Blanco, Negro y Dorado
  // Asturiano: Rojo, Blanco, Amarillo y Azul
  // Flash: Naranja y Amarillo
  const headerBgClass = 
    brandFilter === 'Asturiano'
      ? 'bg-gradient-to-r from-red-950 via-red-900 to-blue-950 border-red-600'
      : brandFilter === 'Flash'
      ? 'bg-gradient-to-r from-stone-950 via-orange-950 to-amber-950 border-orange-500'
      : 'bg-black border-amber-500/40'; // General: Negro y Dorado

  const navBgClass =
    brandFilter === 'Asturiano'
      ? 'bg-red-950/90 border-red-700/60'
      : brandFilter === 'Flash'
      ? 'bg-orange-950/90 border-orange-600/60'
      : 'bg-neutral-950 border-neutral-800';

  return (
    <header className={`sticky top-0 z-40 text-white shadow-2xl border-b transition-colors duration-300 ${headerBgClass}`}>
      {/* Top bar: Corporate Header & User Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Corporate Identity: PercPortal */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {brandFilter === 'Todas' ? (
                // Blanco, Negro y Dorado
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-xl shadow-lg border border-amber-300/40">
                  P
                </div>
              ) : brandFilter === 'Asturiano' ? (
                // Rojo, Blanco, Amarillo y Azul
                <div className="flex items-center gap-1">
                  <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-black text-lg flex items-center justify-center shadow border-2 border-yellow-400">
                    A
                  </span>
                  <span className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow border border-white">
                    AST
                  </span>
                </div>
              ) : (
                // Naranja y Amarillo
                <div className="flex items-center gap-1">
                  <span className="w-9 h-9 rounded-lg bg-orange-600 text-yellow-300 font-black text-xl flex items-center justify-center shadow border border-yellow-400">
                    ⚡
                  </span>
                  <span className="w-9 h-9 rounded-lg bg-yellow-400 text-stone-950 font-black text-xs flex items-center justify-center shadow">
                    FLASH
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                  PercPortal
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${
                    brandFilter === 'Todas'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : brandFilter === 'Asturiano'
                      ? 'bg-yellow-400 text-slate-950 border border-white font-extrabold'
                      : 'bg-orange-500 text-yellow-300 border border-yellow-400 font-extrabold'
                  }`}>
                    {brandFilter === 'Todas' ? 'Control General' : brandFilter}
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-white/70 hidden sm:block">
                Evaluaciones de Calidad y Servicio • Tiendas Asturiano & Estaciones Flash
              </p>
            </div>
          </div>

          {/* Center Brand Switcher Pill */}
          <div className={`hidden lg:flex items-center p-1 rounded-xl border ${
            brandFilter === 'Todas'
              ? 'bg-neutral-900 border-amber-500/30'
              : brandFilter === 'Asturiano'
              ? 'bg-red-950 border-red-500/60'
              : 'bg-orange-950 border-orange-500/60'
          }`}>
            <button
              onClick={() => setBrandFilter('Todas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                brandFilter === 'Todas'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md font-extrabold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Vista General (Dorado & Negro)
            </button>
            <button
              onClick={() => setBrandFilter('Asturiano')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                brandFilter === 'Asturiano'
                  ? 'bg-red-600 text-white shadow-md font-black border border-yellow-400'
                  : 'text-white/70 hover:text-red-400 hover:bg-white/10'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Asturiano (Rojo, Amarillo, Azul)
            </button>
            <button
              onClick={() => setBrandFilter('Flash')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                brandFilter === 'Flash'
                  ? 'bg-orange-500 text-yellow-300 shadow-md font-black border border-yellow-400'
                  : 'text-white/70 hover:text-orange-400 hover:bg-white/10'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              Flash (Naranja & Amarillo)
            </button>
          </div>

          {/* Right Action: Subir Datos (ONLY for Responsable del Portal) + Profile Switcher */}
          <div className="flex items-center gap-3">
            {currentUser.canUploadData ? (
              <button
                onClick={onOpenNewEval}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg transition-all hover:scale-105 ${
                  brandFilter === 'Asturiano'
                    ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300'
                    : brandFilter === 'Flash'
                    ? 'bg-yellow-400 text-orange-950 hover:bg-yellow-300'
                    : 'bg-amber-400 text-black hover:bg-amber-300'
                }`}
                title="Cargar nuevos datos o registrar visita para proyectar al dashboard"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Subir Datos</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 text-xs font-semibold border border-white/20">
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Modo Solo Visualización</span>
              </div>
            )}

            {/* User Profile / Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm text-left transition-all ${
                  brandFilter === 'Todas'
                    ? 'bg-neutral-900 border-amber-500/40 hover:bg-neutral-800'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                title="Cambiar perfil de usuario para comprobar permisos"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  currentUser.canUploadData ? 'bg-amber-400 text-black' : 'bg-slate-700 text-white'
                }`}>
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">
                    {currentUser.roleLabel}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <p className="text-xs font-bold text-amber-400">
                      Selector de Permisos PercPortal
                    </p>
                    <p className="text-[11px] text-white/70">
                      Prueba cómo interactúa el Responsable del Portal (sube datos) vs Dirección General (solo visualiza):
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-neutral-800">
                    {availableProfiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentUser(p);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-neutral-800 transition-colors ${
                          currentUser.id === p.id ? 'bg-neutral-800 text-amber-400 font-bold' : 'text-white/80'
                        }`}
                      >
                        <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${p.canUploadData ? 'text-amber-400' : 'text-slate-500'}`} />
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className={`text-[11px] ${p.canUploadData ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}>
                            {p.roleLabel}
                          </div>
                          <div className="text-[10px] text-white/50">
                            {p.canUploadData ? '✓ Puede subir datos y proyectar al dashboard' : '👁️ Solamente visualización'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-neutral-800 bg-black/60">
                    <button
                      onClick={() => {
                        resetToDefaults();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-white/60 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restablecer datos originales
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Brand Switcher */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-white/10 gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBrandFilter('Todas')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                brandFilter === 'Todas' ? 'bg-amber-400 text-black' : 'text-white/70'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setBrandFilter('Asturiano')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                brandFilter === 'Asturiano' ? 'bg-red-600 text-white' : 'text-white/70'
              }`}
            >
              Asturiano
            </button>
            <button
              onClick={() => setBrandFilter('Flash')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                brandFilter === 'Flash' ? 'bg-orange-500 text-yellow-300' : 'text-white/70'
              }`}
            >
              Flash
            </button>
          </div>
          <span className="text-[11px] text-white/70">
            {currentUser.canUploadData ? '✍️ Editor' : '👁️ Solo Lectura'}
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className={`border-t overflow-x-auto no-scrollbar ${navBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              const activeTabStyle = 
                brandFilter === 'Asturiano'
                  ? 'bg-red-800 text-white border-yellow-400 shadow-md font-bold'
                  : brandFilter === 'Flash'
                  ? 'bg-orange-700 text-yellow-300 border-yellow-400 shadow-md font-bold'
                  : 'bg-neutral-800 text-amber-400 border-amber-400/50 shadow-md font-bold';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                    isActive
                      ? activeTabStyle
                      : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
