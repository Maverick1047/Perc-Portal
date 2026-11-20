import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { 
  Building2, 
  Store, 
  Fuel, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  FileText,
  Lock
} from 'lucide-react';

export const AnimatedHome: React.FC<{
  account: UserAccount;
  onNavigate: (destination: { section: 'asturiano' | 'flash' | 'family_office'; tab?: string }) => void;
}> = ({ account, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-8 bg-neutral-950 text-white relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className={`w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-14 transition-all duration-500 relative z-10 ${
        isMenuOpen ? 'md:justify-between' : 'justify-center'
      }`}>
        
        {/* Emblem Column */}
        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex flex-col items-center cursor-pointer group transition-all duration-500 ${
            isMenuOpen ? 'md:items-start' : 'items-center scale-110'
          }`}
          title={isMenuOpen ? 'Toca la gota para centrar el emblema' : 'Toca la gota para abrir el menú'}
        >
          {/* Animated PERC Emblem SVG */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
            
            {/* Spark along the ring */}
            <div className={`absolute w-3 h-3 rounded-full bg-amber-300 blur-[2px] transition-opacity duration-300 ${
              isHovered ? 'opacity-100 animate-spin' : 'opacity-70 animate-pulse'
            }`} style={{ top: '22%', right: '20%' }} />

            <svg 
              viewBox="0 0 200 200" 
              className={`w-full h-full drop-shadow-2xl transition-all duration-500 ${
                isHovered ? 'scale-105' : ''
              }`}
            >
              {/* Fine golden ring (Back arc) */}
              <path
                d="M 25 110 C 25 70, 175 70, 175 110"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="opacity-70"
              />

              {/* Minimalist Fuel/Water Droplet Outline (Gota contorno blanco/negro) */}
              <path
                d="M 100 20 C 100 20, 155 95, 155 135 C 155 168, 130 185, 100 185 C 70 185, 45 168, 45 135 C 45 95, 100 20, 100 20 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-300 ${
                  isHovered ? 'stroke-amber-300 filter drop-shadow(0 0 8px rgba(212,175,55,0.8))' : 'stroke-white'
                }`}
              />

              {/* Sharp Golden Lightning Bolt Outline (Rayo dorado definido) */}
              <polygon
                points="102,48 82,104 104,104 94,152 124,96 102,96"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinejoin="miter"
                className={`transition-all duration-300 ${
                  isHovered ? 'stroke-amber-300 fill-amber-400/20 filter drop-shadow(0 0 10px rgba(251,191,36,0.9))' : 'stroke-amber-400'
                }`}
              />

              {/* Fine golden ring (Front arc passing in front of droplet) */}
              <path
                d="M 175 110 C 175 150, 25 150, 25 110"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  isHovered ? 'stroke-amber-300 filter drop-shadow(0 0 6px rgba(212,175,55,0.9))' : 'stroke-amber-400'
                }`}
              />
            </svg>
          </div>

          <div className="text-center md:text-left mt-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-black tracking-widest uppercase text-amber-400 font-unbounded">
                Grupo PERC
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                {isMenuOpen ? 'Toca para cerrar' : 'Toca para abrir'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-unbounded mt-0.5">
              PercPortal
            </h2>
          </div>
        </div>

        {/* Right Menu: Greets user and lists ONLY what each profile is permitted to see */}
        {isMenuOpen && (
          <div className="w-full md:w-7/12 max-w-lg space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Greeting Header */}
            <div className="border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Sesión Activa
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-unbounded">
                Hola, {account.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {account.roleLabel} • Selecciona un módulo para comenzar la gestión:
              </p>
            </div>

            {/* Accessible Modules Cards */}
            <div className="space-y-3">
              
              {/* Option 1: Tiendas Asturiano */}
              {account.canAccessAsturiano && (
                <div 
                  onClick={() => onNavigate({ section: 'asturiano', tab: 'panel' })}
                  className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-neutral-900 to-neutral-900 border border-red-600/40 hover:border-red-500 hover:shadow-xl hover:shadow-red-950/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-base shadow border-2 border-yellow-400">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white font-unbounded group-hover:text-yellow-400 transition-colors">
                          Tiendas Asturiano
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                          10 Criterios (15 pts)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
                        <span>Promedio: <strong className="text-white">84.0%</strong></span>
                        <span className="text-emerald-400 font-bold flex items-center text-[11px]">
                          <TrendingUp className="w-3 h-3 mr-0.5" /> +2.0% vs mes ant.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-red-600 text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Option 2: Estaciones Flash */}
              {account.canAccessFlash && (
                <div 
                  onClick={() => onNavigate({ section: 'flash', tab: 'panel' })}
                  className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/80 via-neutral-900 to-neutral-900 border border-orange-500/40 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-950/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-orange-600 text-yellow-300 font-black flex items-center justify-center text-lg shadow border border-yellow-400">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white font-unbounded group-hover:text-yellow-400 transition-colors">
                          Estaciones Flash
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          10 Criterios (100 pts)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
                        <span>Promedio: <strong className="text-white">83.0%</strong></span>
                        <span className="text-amber-400 font-bold flex items-center text-[11px]">
                          <TrendingDown className="w-3 h-3 mr-0.5" /> 161 de 240 visitas (67%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-orange-500 group-hover:text-black text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Option 3: Family Office (Documentos Confidenciales) - ONLY Daniel, Ricardo, César */}
              {account.canAccessFamilyOffice && (
                <div 
                  onClick={() => onNavigate({ section: 'family_office', tab: 'documentos' })}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/40 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center text-base shadow border border-amber-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white font-unbounded group-hover:text-amber-400 transition-colors">
                          Family Office
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Confidencial
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {account.canUploadFamilyOffice ? 'Subida y consulta de actas, contratos y estados' : 'Consulta protegida con bitácora de accesos'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-amber-400 group-hover:text-black text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}

            </div>

            <div className="pt-2 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Presiona <strong>Esc</strong> para ocultar el menú</span>
              <span className="text-amber-400/80">Prototipo Grupo PERC 2026</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
