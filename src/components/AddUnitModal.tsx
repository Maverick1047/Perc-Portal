import React, { useState } from 'react';
import { StoreUnit, Zone, Brand } from '../types';
import { X, Plus, Store, Fuel, CheckCircle2 } from 'lucide-react';

export interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
  onAdd: (unit: StoreUnit) => void;
}

const ZONES: Zone[] = [
  'Zona Centro',
  'Zona Norte',
  'Zona Poniente',
  'Zona Oriente',
  'Zona Sur',
  'Sin zona'
];

export const AddUnitModal: React.FC<AddUnitModalProps> = ({
  isOpen,
  onClose,
  brand,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [zone, setZone] = useState<Zone>('Zona Centro');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [visitTarget, setVisitTarget] = useState<number>(brand === 'Flash' ? 12 : 2);
  const [visitsCount, setVisitsCount] = useState<number>(0);

  if (!isOpen) return null;

  const isAsturiano = brand === 'Asturiano';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase() || `${isAsturiano ? 'AST' : 'FLA'}-${Math.floor(Math.random() * 900 + 100)}`;
    const newId = `${isAsturiano ? 'ast' : 'fls'}-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${cleanCode.toLowerCase()}`;

    const newUnit: StoreUnit = {
      id: newId,
      code: cleanCode,
      name: name.trim(),
      brand,
      type: isAsturiano ? 'tienda' : 'estacion',
      zone,
      address: address.trim(),
      manager: manager.trim() || 'Por asignar',
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@portal.demo`,
      visitsCount: Number(visitsCount),
      visitTarget: Number(visitTarget),
      isActiveInSept2026: true,
      statusLabel: isAsturiano ? 'Activa en septiembre 2026' : (visitsCount >= visitTarget ? 'Meta cumplida' : 'En progreso'),
    };

    onAdd(newUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
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
                  Alta al Catálogo Maestro
                </span>
                <h3 className="text-xl font-black font-unbounded text-white">
                  Nueva {isAsturiano ? 'Tienda Asturiano' : 'Estación Flash'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAsturiano ? 'Ej. Zibatá Express' : 'Ej. Flash Constituyentes'}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Código</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={isAsturiano ? 'AST-235' : 'FLA-21'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Zona Operativa</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as Zone)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gerente / Encargado</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Nombre del responsable"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta de Visitas</label>
              <input
                type="number"
                min="1"
                value={visitTarget}
                onChange={(e) => setVisitTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Visitas Realizadas</label>
              <input
                type="number"
                min="0"
                value={visitsCount}
                onChange={(e) => setVisitsCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dirección Física</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. / Calle, Colonia, Municipio"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

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
              <Plus className="w-4 h-4" />
              <span>Dar de Alta en Catálogo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
