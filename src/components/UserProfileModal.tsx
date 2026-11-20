import React, { useState, useMemo } from 'react';
import { UserAccount, Brand, UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Mail, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Plus, 
  Search, 
  Sparkles, 
  Building2, 
  FileSpreadsheet, 
  Store, 
  Fuel, 
  FolderLock,
  UserCheck,
  Briefcase
} from 'lucide-react';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentAccount, accounts, switchAccount, addAccount, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'perfil' | 'cambiar' | 'nuevo'>('perfil');
  
  // Search & category filter for switcher
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todas' | 'direccion' | 'operacion' | 'marcas' | 'flash' | 'asturiano'>('todas');

  const isAsturianoOnly = Boolean(currentAccount?.canAccessAsturiano && !currentAccount?.canAccessFlash);
  const isFlashOnly = Boolean(!currentAccount?.canAccessAsturiano && currentAccount?.canAccessFlash);

  // Form state for creating a new profile
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('supervisor');
  const [newBrand, setNewBrand] = useState<'Asturiano' | 'Flash' | 'Ambas'>(
    isFlashOnly ? 'Flash' : isAsturianoOnly ? 'Asturiano' : 'Ambas'
  );
  const [newUnitName, setNewUnitName] = useState('');
  const [canUpload, setCanUpload] = useState(false);
  const [canFamilyOffice, setCanFamilyOffice] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Filter accounts for switcher strictly isolated by brand
  const filteredAccounts = useMemo(() => {
    let list = accounts;

    if (isAsturianoOnly) {
      list = list.filter(a => a.canAccessAsturiano && !a.canAccessFlash);
    } else if (isFlashOnly) {
      list = list.filter(a => a.canAccessFlash && !a.canAccessAsturiano);
    }

    if (categoryFilter === 'direccion') {
      list = list.filter(a => a.role === 'direccion_general' || a.role === 'responsable_portal_docs');
    } else if (categoryFilter === 'operacion') {
      list = list.filter(a => a.role === 'responsable_portal' || a.role === 'responsable_portal_docs');
    } else if (categoryFilter === 'marcas') {
      list = list.filter(a => a.role === 'direccion_marca' || a.role === 'gerente_marca');
    } else if (categoryFilter === 'flash') {
      list = list.filter(a => a.role === 'supervisor' && a.assignedBrand === 'Flash');
    } else if (categoryFilter === 'asturiano') {
      list = list.filter(a => a.role === 'supervisor' && a.assignedBrand === 'Asturiano');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        (a.assignedUnitName && a.assignedUnitName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [accounts, categoryFilter, searchQuery, isAsturianoOnly, isFlashOnly]);

  if (!isOpen || !currentAccount) return null;

  const handleSwitch = (acc: UserAccount) => {
    switchAccount(acc);
    onClose();
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newName.trim() || !newEmail.trim() || !newTitle.trim()) {
      setFormError('Por favor completa los campos obligatorios (Nombre, Correo y Cargo).');
      return;
    }

    const emailClean = newEmail.trim().toLowerCase();
    const existing = accounts.find(a => a.email.toLowerCase() === emailClean);
    if (existing) {
      setFormError('Ya existe una cuenta registrada con este correo institucional.');
      return;
    }

    const isAsturiano = newBrand === 'Asturiano' || newBrand === 'Ambas';
    const isFlash = newBrand === 'Flash' || newBrand === 'Ambas';

    const newAccount: UserAccount = {
      email: emailClean,
      passwordHash: 'demo123',
      name: newName.trim(),
      title: newTitle.trim(),
      role: newRole,
      roleLabel: newTitle.trim(),
      canAccessAsturiano: isAsturiano,
      canAccessFlash: isFlash,
      canAccessFamilyOffice: canFamilyOffice,
      canUploadEvaluations: canUpload,
      canImportExcel: canUpload,
      canEditActions: canUpload,
      canUploadFamilyOffice: canFamilyOffice && (newRole === 'responsable_portal_docs'),
      canViewAnnualHistory: newRole !== 'supervisor',
      assignedBrand: newBrand === 'Ambas' ? undefined : newBrand,
      assignedUnitName: newUnitName.trim() || undefined,
    };

    addAccount(newAccount);
    setFormSuccess(`¡Perfil de ${newAccount.name} creado exitosamente! Ahora puedes iniciar sesión o cambiar a este perfil.`);
    
    // Reset form fields
    setNewName('');
    setNewEmail('');
    setNewTitle('');
    setNewUnitName('');
    setCanUpload(false);
    setCanFamilyOffice(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-black/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md font-unbounded">
              {currentAccount.name.charAt(0)}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-unbounded flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Gestión de Perfiles y Accesos • Grupo PERC
              </div>
              <h3 className="text-base sm:text-lg font-black font-unbounded text-white">
                {currentAccount.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-2 text-xs font-bold font-unbounded">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'perfil'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mi Perfil Activo</span>
          </button>

          <button
            onClick={() => setActiveTab('cambiar')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cambiar'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cambiar de Perfil ({filteredAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('nuevo')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'nuevo'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Crear Nuevo Perfil</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: MI PERFIL ACTIVO */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              
              {/* Profile Card Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-black border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg font-unbounded">
                    {currentAccount.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black font-unbounded text-white">
                      {currentAccount.name}
                    </h4>
                    <p className="text-xs text-amber-300 font-semibold">
                      {currentAccount.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      {currentAccount.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30 font-unbounded">
                    {currentAccount.roleLabel}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sesión iniciada • Grupo PERC
                  </span>
                </div>
              </div>

              {/* Permissions & Security Matrix */}
              <div>
                <h5 className="text-xs font-bold font-unbounded uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Matriz de Autorizaciones y Permisos en PercPortal</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Asturiano - Hidden if user is Flash-only */}
                  {!isFlashOnly && (
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      currentAccount.canAccessAsturiano 
                        ? 'bg-red-950/30 border-red-800/60 text-red-200' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <Store className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="font-bold text-white">Tiendas Asturiano</div>
                          <div className="text-[10px] text-slate-400">Escala 15.0 pts • 10 Criterios</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentAccount.canAccessAsturiano ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {currentAccount.canAccessAsturiano ? '✓ Autorizado' : 'Sin Acceso'}
                      </span>
                    </div>
                  )}

                  {/* Flash - Hidden if user is Asturiano-only */}
                  {!isAsturianoOnly && (
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      currentAccount.canAccessFlash 
                        ? 'bg-orange-950/30 border-orange-800/60 text-orange-200' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <Fuel className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="font-bold text-white">Estaciones Flash</div>
                          <div className="text-[10px] text-slate-400">Escala 100 pts • 20 Estaciones</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentAccount.canAccessFlash ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {currentAccount.canAccessFlash ? '✓ Autorizado' : 'Sin Acceso'}
                      </span>
                    </div>
                  )}

                  {/* Family Office */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    currentAccount.canAccessFamilyOffice 
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <FolderLock className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">Family Office</div>
                        <div className="text-[10px] text-slate-400">Bóveda de Documentos Confidenciales</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentAccount.canAccessFamilyOffice ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentAccount.canAccessFamilyOffice ? '✓ Consulta Registrada' : 'Restringido'}
                    </span>
                  </div>

                  {/* Sube Evaluaciones */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    currentAccount.canUploadEvaluations 
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-bold text-white">Carga de Evaluaciones</div>
                        <div className="text-[10px] text-slate-400">Responsable de Visitas y Evidencias</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentAccount.canUploadEvaluations ? 'bg-emerald-400/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentAccount.canUploadEvaluations ? '✓ Editor Activo' : 'Solo Lectura'}
                    </span>
                  </div>

                  {/* Importación Excel */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    currentAccount.canImportExcel 
                      ? 'bg-blue-950/30 border-blue-800/60 text-blue-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-bold text-white">Importar Archivos Excel</div>
                        <div className="text-[10px] text-slate-400">Procesamiento de Concentrados Masivos</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentAccount.canImportExcel ? 'bg-blue-400/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentAccount.canImportExcel ? '✓ Habilitado' : 'No Permitido'}
                    </span>
                  </div>

                  {/* Histórico Anual */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    currentAccount.canViewAnnualHistory 
                      ? 'bg-purple-950/30 border-purple-800/60 text-purple-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-bold text-white">Histórico Anual (13/14m)</div>
                        <div className="text-[10px] text-slate-400">Evolución de Matrices y Recharts</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentAccount.canViewAnnualHistory ? 'bg-purple-400/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentAccount.canViewAnnualHistory ? '✓ Visible' : 'No Visible'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Station or Unit Assignment if Supervisor */}
              {currentAccount.assignedUnitName && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="font-bold font-unbounded text-amber-300 mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Unidad de Campo Asignada</span>
                  </div>
                  <p className="text-slate-300">
                    Este perfil está vinculado exclusivamente a <strong>{currentAccount.assignedUnitName}</strong> ({currentAccount.assignedBrand}). Las vistas de tablero y auditorías se restringen automáticamente a esta unidad.
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('cambiar')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-unbounded flex items-center gap-2 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Cambiar a Otro Perfil</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs font-unbounded transition-all ml-auto"
                >
                  Cerrar Sesión
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: CAMBIAR DE PERFIL */}
          {activeTab === 'cambiar' && (
            <div className="space-y-4">
              
              {/* Category Filter Pills & Search */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar perfil por nombre, cargo, correo o estación..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {(isFlashOnly
                    ? [
                        { id: 'todas', label: 'Perfiles Flash' },
                        { id: 'marcas', label: 'Dirección Flash' },
                        { id: 'flash', label: 'Supervisores Flash (20)' },
                      ]
                    : isAsturianoOnly
                    ? [
                        { id: 'todas', label: 'Perfiles Asturiano' },
                        { id: 'marcas', label: 'Dirección Asturiano' },
                        { id: 'asturiano', label: 'Supervisores Asturiano (7)' },
                      ]
                    : [
                        { id: 'todas', label: 'Todos los Perfiles' },
                        { id: 'direccion', label: 'Dirección & Family Office' },
                        { id: 'operacion', label: 'Operación Central' },
                        { id: 'marcas', label: 'Dirección Marcas' },
                        { id: 'flash', label: 'Supervisores Flash (20)' },
                        { id: 'asturiano', label: 'Supervisores Asturiano (7)' },
                      ]
                  ).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        categoryFilter === cat.id
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profiles List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredAccounts.map((acc) => {
                  const isCurrent = acc.email.toLowerCase() === currentAccount.email.toLowerCase();

                  return (
                    <div
                      key={acc.email}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/40'
                          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-white text-xs font-unbounded truncate">
                            {acc.name}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                            acc.role === 'direccion_general' || acc.role === 'responsable_portal_docs'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : acc.canUploadEvaluations
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {acc.canUploadEvaluations ? 'Editor' : 'Consulta'}
                          </span>
                        </div>

                        <div className="text-[11px] text-amber-300 font-semibold truncate">
                          {acc.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          {acc.email}
                        </div>

                        {acc.assignedUnitName && (
                          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{acc.assignedBrand === 'Flash' ? '⚡' : '🏪'}</span>
                            <span className="font-bold text-slate-300">{acc.assignedUnitName}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">
                          {acc.canAccessFamilyOffice ? 'Bóveda FO ✓' : 'Operativo'}
                        </span>

                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-amber-400 font-unbounded flex items-center gap-1">
                            <span>Perfil Actual</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSwitch(acc)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black font-unbounded transition-all flex items-center gap-1"
                          >
                            <span>Cambiar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: CREAR NUEVO PERFIL */}
          {activeTab === 'nuevo' && (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              
              <div>
                <h4 className="text-sm font-black font-unbounded text-white">
                  Registrar Nuevo Perfil y Credenciales
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crea un nuevo usuario para directivos, auditores de campo o supervisores de tienda. Las cuentas se guardan automáticamente.
                </p>
              </div>

              {formSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ej. Ing. Carlos Vega"
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Correo Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="ej. carlos.vega@portal.demo"
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Cargo o Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ej. Supervisor Regional Bajío"
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Rol en la Plataforma
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="responsable_portal">Responsable del Portal (Editor)</option>
                    <option value="responsable_portal_docs">Responsable del Portal y Documentos FO</option>
                    <option value="direccion_general">Dirección General (Solo Consulta)</option>
                    <option value="direccion_marca">Dirección de Marca</option>
                    <option value="gerente_marca">Gerencia de Marca</option>
                    <option value="supervisor">Supervisor de Tienda o Estación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Marca Asignada
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    {isFlashOnly ? (
                      <option value="Flash">Solo Estaciones Flash</option>
                    ) : isAsturianoOnly ? (
                      <option value="Asturiano">Solo Tiendas Asturiano</option>
                    ) : (
                      <>
                        <option value="Ambas">Ambas Marcas (Asturiano & Flash)</option>
                        <option value="Asturiano">Solo Tiendas Asturiano</option>
                        <option value="Flash">Solo Estaciones Flash</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Unidad / Estación Asignada (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                    placeholder="ej. Tecnológico, Juriquilla, etc."
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Permisos Especiales de Seguridad
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canUpload}
                      onChange={(e) => setCanUpload(e.target.checked)}
                      className="rounded text-amber-400 focus:ring-amber-400"
                    />
                    <div>
                      <div className="font-bold text-white">Puede Subir Auditorías</div>
                      <div className="text-[10px] text-slate-400">Permite registrar evaluaciones en campo y fotos</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={canFamilyOffice}
                      onChange={(e) => setCanFamilyOffice(e.target.checked)}
                      className="rounded text-amber-400 focus:ring-amber-400"
                    />
                    <div>
                      <div className="font-bold text-white">Acceso a Family Office</div>
                      <div className="text-[10px] text-slate-400">Bóveda confidencial patrimonial</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('perfil')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs font-unbounded shadow-lg transition-all"
                >
                  Guardar Perfil
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
