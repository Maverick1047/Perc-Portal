import React, { useState, useEffect } from 'react';
import { StoreUnit, Zone, Brand } from '../types';
import { 
  Building2, 
  X, 
  Save, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Target, 
  CheckCircle2, 
  Flame, 
  Store,
  Fuel,
  Sparkles
} from 'lucide-react';

export interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: StoreUnit;
  onSave: (unitId: string, updates: Partial<StoreUnit>) => void;
}

const ZONES: Zone[] = [
  'Zona Centro',
  'Zona Norte',
  'Zona Poniente',
  'Zona Oriente',
  'Zona Sur',
  'Sin zona'
];

export const EditUnitModal: React.FC<EditUnitModalProps> = ({
  isOpen,
  onClose,
  unit,
  onSave
}) => {
  const [name, setName] = useState(unit.name);
  const [code, setCode] = useState(unit.code);
  const [zone, setZone] = useState<Zone>(unit.zone);
  const [address, setAddress] = useState(unit.address || '');
  const [manager, setManager] = useState(unit.manager || '');
  const [phone, setPhone] = useState(unit.phone || '');
  const [email, setEmail] = useState(unit.email || '');
  const [visitsCount, setVisitsCount] = useState<number>(unit.visitsCount ?? 0);
  const [visitTarget, setVisitTarget] = useState<number>(unit.visitTarget ?? 12);
  const [statusLabel, setStatusLabel] = useState(unit.statusLabel || '');
  const [isActiveInSept2026, setIsActiveInSept2026] = useState<boolean>(unit.isActiveInSept2026 ?? true);
  const [sharedWith, setSharedWith] = useState(unit.sharedWith || '');
  const [variants, setVariants] = useState(unit.variants || '');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setName(unit.name);
    setCode(unit.code);
    setZone(unit.zone);
    setAddress(unit.address || '');
    setManager(unit.manager || '');
    setPhone(unit.phone || '');
    setEmail(unit.email || '');
    setVisitsCount(unit.visitsCount ?? 0);
    setVisitTarget(unit.visitTarget ?? (unit.brand === 'Flash' ? 12 : 2));
    setStatusLabel(unit.statusLabel || '');
    setIsActiveInSept2026(unit.isActiveInSept2026 ?? true);
    setSharedWith(unit.sharedWith || '');
    setVariants(unit.variants || '');
    setSuccessMsg('');
  }, [unit, isOpen]);

  if (!isOpen) return null;

  const isAsturiano = unit.brand === 'Asturiano';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto determine statusLabel if not custom
    let computedStatus = statusLabel;
    if (unit.brand === 'Flash') {
      if (visitsCount >= visitTarget) {
        computedStatus = 'Meta cumplida';
      } else if (visitsCount >= Math.floor(visitTarget * 0.5)) {
        computedStatus = 'En progreso';
      } else {
        computedStatus = 'Por debajo de meta';
      }
    } else {
      computedStatus = isActiveInSept2026 ? 'Activa en septiembre 2026' : 'Solo histórico';
    }

    onSave(unit.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      zone,
      address: address.trim(),
      manager: manager.trim(),
      phone: phone.trim(),
      email: email.trim(),
      visitsCount: Number(visitsCount),
      visitTarget: Number(visitTarget),
      statusLabel: computedStatus,
      isActiveInSept2026,
      sharedWith: sharedWith.trim(),
      variants: variants.trim()
    });

    setSuccessMsg('¡Información y metas actualizadas exitosamente!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 text-white relative ${
          isAsturiano 
            ? 'bg-gradient-to-r from-red-700 via-red-800 to-slate-900' 
            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                {isAsturiano ? <Store className="w-5 h-5 text-amber-300" /> : <Fuel className="w-5 h-5 text-amber-300" />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Modificar Catálogo Maestro · {unit.brand}
                </span>
                <h3 className="text-xl font-black font-unbounded text-white">
                  Editar {unit.name} ({unit.code})
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Oficial</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Código */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Código de Unidad</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Zona */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Zona Operativa</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as Zone)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {ZONES.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            {/* Encargado / Gerente */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gerente / Supervisor</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Nombre del responsable"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Email corporativo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sucursal@portal.demo"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="442-000-0000"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Visitas Realizadas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Visitas Realizadas en el Periodo
              </label>
              <input
                type="number"
                min="0"
                value={visitsCount}
                onChange={(e) => setVisitsCount(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Meta de Visitas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta de Visitas Proyectadas
              </label>
              <input
                type="number"
                min="1"
                value={visitTarget}
                onChange={(e) => setVisitTarget(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dirección / Ubicación Física</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. / Calle, Colonia, Municipio"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Brand-Specific Metadata */}
          {isAsturiano ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block font-unbounded">
                    Estatus en Septiembre 2026 (60 Activas)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Determina si la sucursal fue incluida en la auditoría activa de cierre de periodo.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActiveInSept2026}
                    onChange={(e) => setIsActiveInSept2026(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Variantes de Nombre Analizadas (Separadas por punto y coma)
                </label>
                <input
                  type="text"
                  value={variants}
                  onChange={(e) => setVariants(e.target.value)}
                  placeholder="Ej. Centro; Centro Qro; CENTRO"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-950 block font-unbounded">
                Tiendas Compartidas / Ubicación Vinculada Flash
              </span>
              <input
                type="text"
                value={sharedWith}
                onChange={(e) => setSharedWith(e.target.value)}
                placeholder="Ej. Tecnológico, Universidad 2"
                className="w-full text-xs px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
              <p className="text-[11px] text-amber-800">
                Registra si esta estación Flash comparte predio o punto de venta con tiendas de conveniencia de la red.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                isAsturiano 
                  ? 'bg-red-700 hover:bg-red-800 shadow-red-900/20' 
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
