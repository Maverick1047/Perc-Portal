import React, { useState, useMemo } from 'react';
import { UserAccount, UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Plus,
  UserCheck,
  CheckCircle2,
  X,
  Store,
  Fuel,
  FolderLock
} from 'lucide-react';

export const LoginScreen: React.FC<{
  onLogin: (account: UserAccount) => void;
}> = ({ onLogin }) => {
  const { accounts, addAccount } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Search and Category state for quick picker
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'direccion' | 'operacion' | 'marcas' | 'flash' | 'asturiano'>('todos');

  // Modal to create custom profile
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('supervisor');
  const [newBrand, setNewBrand] = useState<'Asturiano' | 'Flash' | 'Ambas'>('Ambas');
  const [newUnitName, setNewUnitName] = useState('');
  const [canUpload, setCanUpload] = useState(false);
  const [canFamilyOffice, setCanFamilyOffice] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!found) {
      setError('Correo no registrado en el directorio institucional. Elige un perfil abajo o regístralo con "+ Crear Perfil".');
      return;
    }

    if (password !== 'demo123') {
      setError('Contraseña incorrecta. La contraseña de demostración es "demo123".');
      return;
    }

    setError('');
    onLogin(found);
  };

  const handleSelectQuickAccount = (account: UserAccount) => {
    setEmail(account.email);
    setPassword('demo123');
    setError('');
    onLogin(account);
  };

  // Filter accounts for display
  const filteredAccounts = useMemo(() => {
    let list = accounts;

    if (activeCategory === 'direccion') {
      list = list.filter(a => a.role === 'direccion_general' || a.role === 'responsable_portal_docs');
    } else if (activeCategory === 'operacion') {
      list = list.filter(a => a.role === 'responsable_portal' || a.role === 'responsable_portal_docs');
    } else if (activeCategory === 'marcas') {
      list = list.filter(a => a.role === 'direccion_marca' || a.role === 'gerente_marca');
    } else if (activeCategory === 'flash') {
      list = list.filter(a => a.role === 'supervisor' && a.assignedBrand === 'Flash');
    } else if (activeCategory === 'asturiano') {
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
  }, [accounts, activeCategory, searchQuery]);

  const handleSaveNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    if (!newName.trim() || !newEmail.trim() || !newTitle.trim()) {
      setCreateError('Por favor completa Nombre, Correo y Cargo.');
      return;
    }

    const clean = newEmail.trim().toLowerCase();
    if (accounts.some(a => a.email.toLowerCase() === clean)) {
      setCreateError('Ya existe una cuenta con este correo.');
      return;
    }

    const isAsturiano = newBrand === 'Asturiano' || newBrand === 'Ambas';
    const isFlash = newBrand === 'Flash' || newBrand === 'Ambas';

    const newAcc: UserAccount = {
      email: clean,
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

    addAccount(newAcc);
    setCreateSuccess(`Perfil creado con éxito. Accediendo automáticamente...`);
    setTimeout(() => {
      setIsCreateModalOpen(false);
      onLogin(newAcc);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* LEFT COLUMN: Black with fine golden geometric lines and PERC identity */}
      <div className="w-full md:w-5/12 bg-black p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-500/30 relative overflow-hidden">
        {/* Subtle decorative golden lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#D4AF37" strokeWidth="1" strokeDasharray="6,6" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
            <circle cx="50%" cy="50%" r="300" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="4,8" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-widest uppercase font-unbounded">
            <Sparkles className="w-3.5 h-3.5" />
            Grupo PERC
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none font-unbounded">
            Perc<span className="text-amber-400">Portal</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
            Plataforma centralizada de evaluaciones de servicio al cliente, control operativo de <strong>Tiendas Asturiano</strong> y <strong>Estaciones Flash</strong>, y resguardo documental del Family Office.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1">
              <Store className="w-3 h-3 text-red-400" />
              Tiendas Asturiano (15.0 pts)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-orange-600/20 text-orange-300 border border-orange-500/30 font-semibold flex items-center gap-1">
              <Fuel className="w-3 h-3 text-orange-400" />
              Estaciones Flash (100 pts)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold flex items-center gap-1">
              <FolderLock className="w-3 h-3 text-amber-400" />
              Family Office Vault
            </span>
          </div>
        </div>

        <div className="relative z-10 pt-8 space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-amber-400/90 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Control de Acceso Basado en Roles (RBAC) • {accounts.length} Perfiles Configurados
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Aviso de confidencialidad: El acceso a la información y documentos está restringido estrictamente según el perfil de seguridad asignado.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form and Interactive Multi-Profile Explorer */}
      <div className="w-full md:w-7/12 bg-slate-950 p-6 sm:p-10 lg:p-12 flex flex-col justify-center overflow-y-auto max-h-screen">
        <div className="max-w-lg w-full mx-auto space-y-5 my-auto">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight font-unbounded">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingresa con tu correo institucional o elige tu perfil de demostración abajo.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-unbounded flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Perfil</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Correo Institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo: nick@portal.demo o daniel@portal.demo"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <span className="text-[10px] text-amber-400">demo123</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña (demo123)"
                  className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer font-unbounded"
            >
              <span>Acceder a PercPortal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Profile Selection */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider font-unbounded text-[11px] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Explorar Perfiles ({filteredAccounts.length})</span>
              </span>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar perfil o estación..."
                  className="text-[11px] pl-7 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'direccion', label: 'Dirección & Family Office' },
                { id: 'operacion', label: 'Operación Central' },
                { id: 'marcas', label: 'Dirección Marcas' },
                { id: 'flash', label: 'Flash 20 Estaciones' },
                { id: 'asturiano', label: 'Asturiano 7 Tiendas' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
              {filteredAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectQuickAccount(acc)}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-white group-hover:text-amber-400 truncate text-[11px]">
                        {acc.name}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        acc.role === 'direccion_general' || acc.role === 'responsable_portal_docs'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : acc.canUploadEvaluations 
                          ? 'bg-emerald-400/20 text-emerald-300' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {acc.canUploadEvaluations ? 'Editor' : 'Lectura'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.title}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">{acc.email}</div>
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                    <span>{acc.canAccessFamilyOffice ? 'FO Bóveda ✓' : acc.assignedBrand || 'Grupo PERC'}</span>
                    <span className="text-amber-400 font-semibold group-hover:underline">Entrar →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CREATE NEW PROFILE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold font-unbounded text-white text-sm">
                  Registrar Nuevo Perfil en PercPortal
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs">
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleSaveNewProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej. Lic. Roberto Garza"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Correo Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="roberto@portal.demo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Cargo / Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ej. Auditor Regional"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Rol
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="responsable_portal">Responsable del Portal (Editor)</option>
                    <option value="direccion_general">Dirección General (Solo Consulta)</option>
                    <option value="supervisor">Supervisor de Estación/Tienda</option>
                    <option value="direccion_marca">Dirección de Marca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Marca
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Ambas">Ambas (Asturiano & Flash)</option>
                    <option value="Asturiano">Asturiano</option>
                    <option value="Flash">Flash</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canUpload}
                    onChange={(e) => setCanUpload(e.target.checked)}
                    className="rounded text-amber-400"
                  />
                  <span>Permiso para subir evaluaciones y evidencias</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canFamilyOffice}
                    onChange={(e) => setCanFamilyOffice(e.target.checked)}
                    className="rounded text-amber-400"
                  />
                  <span>Acceso a Bóveda Family Office</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black font-unbounded"
                >
                  Guardar e Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
