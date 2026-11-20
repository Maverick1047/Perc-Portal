import React, { useState } from 'react';
import { ConfidentialDoc, AccessLog, UserAccount } from '../types';
import { 
  Lock, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Download, 
  Upload, 
  Search, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Plus, 
  X,
  FileCheck,
  ShieldAlert,
  Building
} from 'lucide-react';

export interface FamilyOfficeViewProps {
  account: UserAccount;
  activeSubTab: string;
  docs: ConfidentialDoc[];
  accessLogs: AccessLog[];
  onUploadDoc: (doc: Omit<ConfidentialDoc, 'id' | 'uploadedAt'>) => void;
  onRecordAccessLog: (log: Omit<AccessLog, 'id' | 'timestamp'>) => void;
}

export const FamilyOfficeView: React.FC<FamilyOfficeViewProps> = ({
  account,
  activeSubTab,
  docs,
  accessLogs,
  onUploadDoc,
  onRecordAccessLog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ConfidentialDoc | null>(null);

  // New Doc Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ConfidentialDoc['category']>('Contratos');
  const [newOwner, setNewOwner] = useState('Grupo PERC / Family Office');
  const [newNotes, setNewNotes] = useState('');
  const [newFileType, setNewFileType] = useState<'pdf' | 'image'>('pdf');

  const categories = [
    'Todas',
    'Actas de nacimiento',
    'Estados de cuenta',
    'Contratos',
    'Identificaciones',
    'Fiscales',
    'Otros'
  ];

  const filteredDocs = docs.filter(doc => {
    const matchCat = selectedCategory === 'Todas' || doc.category === selectedCategory;
    const matchQuery = !searchQuery.trim() || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.entityOrOwner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleOpenDoc = (doc: ConfidentialDoc) => {
    setViewingDoc(doc);
    onRecordAccessLog({
      docId: doc.id,
      docTitle: doc.title,
      userName: account.name,
      userEmail: account.email,
      action: 'Consulta',
    });
  };

  const handleDownloadDoc = (doc: ConfidentialDoc) => {
    onRecordAccessLog({
      docId: doc.id,
      docTitle: doc.title,
      userName: account.name,
      userEmail: account.email,
      action: 'Descarga',
    });
    // Simulated trigger
    alert(`Descarga iniciada: ${doc.title} (${doc.fileSize}). Registrado en bitácora.`);
  };

  const handleCreateDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onUploadDoc({
      title: newTitle.trim(),
      category: newCategory,
      entityOrOwner: newOwner.trim(),
      date: new Date().toISOString().split('T')[0],
      fileSize: '2.4 MB',
      fileType: newFileType,
      uploadedBy: `${account.name} (${account.title})`,
      notes: newNotes.trim() || 'Documento confidencial depositado en bóveda digital.',
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Permanent Warning Banner */}
      <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div className="flex-1">
          <strong className="text-amber-300 font-bold">Aviso de Privacidad y Demostración:</strong> No subir documentos reales ni sensibles en este prototipo demostrativo. Bóveda cifrada reservada exclusivamente para el Family Office.
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-unbounded">
              <Lock className="w-3.5 h-3.5" /> Bóveda Digital • Family Office
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-unbounded tracking-tight text-white">
              Resguardo Confidencial <span className="text-amber-400">Grupo PERC</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Control centralizado de actas constitutivas, estados de cuenta patrimoniales, contratos marco y documentos oficiales con auditoría inmutable de accesos.
            </p>
          </div>

          {account.canUploadFamilyOffice && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs shadow-lg transition-all font-unbounded self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>+ Subir Documento</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab View */}
      {activeSubTab === 'documentos' && (
        <div className="space-y-4">
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-amber-400 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o titular..."
                className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Documents Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => (
              <div 
                key={doc.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-amber-400/60 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 font-unbounded text-sm mt-3 group-hover:text-amber-600 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Titular / Entidad: <strong className="text-slate-700">{doc.entityOrOwner}</strong>
                  </p>
                  {doc.notes && (
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    {doc.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDoc(doc)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Consultar</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800">No se encontraron documentos</h4>
              <p className="text-xs text-slate-400">Prueba con otra categoría o término de búsqueda.</p>
            </div>
          )}

        </div>
      )}

      {/* Bitacora View */}
      {activeSubTab === 'bitacora' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 font-unbounded text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Bitácora de Auditoría e Historial de Accesos</span>
              </h3>
              <p className="text-xs text-slate-500">
                Registro inmutable de cada consulta, subida y descarga realizada en la bóveda confidencial.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {accessLogs.length} Registros Auditados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Documento Consultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accessLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {log.userEmail}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        log.action === 'Subida' 
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'Descarga'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {log.docTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Document Viewer Preview */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {viewingDoc.category} • Vista Segura
                </span>
                <h3 className="text-lg font-black text-slate-900 font-unbounded mt-1">
                  {viewingDoc.title}
                </h3>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated confidential page with watermark */}
            <div className="bg-slate-100 rounded-2xl p-8 border border-slate-300 relative overflow-hidden min-h-[220px] flex flex-col justify-between select-none">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-25deg]">
                <span className="text-4xl sm:text-5xl font-black font-unbounded text-slate-900">
                  GRUPO PERC • CONFIDENCIAL
                </span>
              </div>
              
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-slate-700">
                  Titular / Entidad: {viewingDoc.entityOrOwner}
                </div>
                <div className="text-xs text-slate-600">
                  Fecha de expedición: {viewingDoc.date}
                </div>
                <div className="text-xs text-slate-600">
                  Subido por: {viewingDoc.uploadedBy} el {viewingDoc.uploadedAt}
                </div>
                <div className="text-xs text-slate-500 italic mt-3 bg-white/70 p-3 rounded-xl border border-slate-200">
                  "{viewingDoc.notes}"
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono mt-6 relative z-10 flex items-center justify-between">
                <span>HASH SHA-256: e8b9...f4a1 (Verificado)</span>
                <span>Visor Bóveda v2.6</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownloadDoc(viewingDoc)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Copia Certificada</span>
              </button>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Document (For Daniel only) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateDocSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 font-unbounded">
                Subir Documento Confidencial
              </h3>
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Documento *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Acta de Asamblea Extraordinaria 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Actas de nacimiento">Actas de nacimiento</option>
                    <option value="Estados de cuenta">Estados de cuenta</option>
                    <option value="Contratos">Contratos</option>
                    <option value="Identificaciones">Identificaciones</option>
                    <option value="Fiscales">Fiscales</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Archivo</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="pdf">Documento PDF</option>
                    <option value="image">Imagen Digitalizada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Entidad / Titular</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas / Expediente</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Observaciones de resguardo..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md font-unbounded"
              >
                Guardar en Bóveda
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
