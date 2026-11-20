import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderArchive, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileSpreadsheet, 
  Presentation, 
  Download, 
  Upload, 
  Plus, 
  Search, 
  Tag, 
  Calendar, 
  User, 
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';
import { EvidenceDocument, Brand } from '../types';

export const EvidenceRepoView: React.FC = () => {
  const { documents, addDocument, currentUser, brandFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFileType, setSelectedFileType] = useState<string>('todos');
  const [previewDoc, setPreviewDoc] = useState<EvidenceDocument | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceDocument['category']>('reporte_anual');
  const [docBrand, setDocBrand] = useState<Brand | 'Ambas'>('Ambas');
  const [fileType, setFileType] = useState<EvidenceDocument['fileType']>('pdf');
  const [description, setDescription] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.unitName && doc.unitName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'todos' || doc.category === selectedCategory;
    const matchesType = selectedFileType === 'todos' || doc.fileType === selectedFileType;
    const matchesBrand = brandFilter === 'Todas' || doc.brand === 'Ambas' || doc.brand === brandFilter;

    return matchesSearch && matchesCat && matchesType && matchesBrand;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      title: title.trim(),
      category,
      brand: docBrand,
      date: new Date().toISOString().split('T')[0],
      fileType,
      fileSize: '3.4 MB',
      uploader: currentUser.name,
      url: '#',
      description: description.trim() || 'Documento oficial cargado a la plataforma corporativa.',
    });

    setTitle('');
    setDescription('');
    setShowUploadModal(false);
  };

  const getFileIcon = (type: EvidenceDocument['fileType']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Repositorio Central de Documentación</span>
            <span>•</span>
            <span className="text-red-600 font-bold">Asturiano & Flash</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Evidencias, Presentaciones y Documentos
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Sustituye correos y carpetas dispersas por un acervo institucional organizado y seguro
          </p>
        </div>

        {currentUser.canCreateEvaluations && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow transition-all self-start md:self-auto"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            + Cargar Documento / Evidencia
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, manual o contenido..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="todos">Todas las Categorías</option>
            <option value="reporte_anual">Reportes Anuales</option>
            <option value="presentacion">Presentaciones</option>
            <option value="manual_operativo">Manuales Operativos</option>
            <option value="seguimiento">Archivos de Seguimiento</option>
            <option value="buena_practica">Buenas Prácticas</option>
            <option value="evidencia_visita">Evidencias de Visitas</option>
          </select>

          {/* File Type Dropdown */}
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="todos">Todos los Formatos</option>
            <option value="pdf">Documentos PDF</option>
            <option value="excel">Hojas Excel</option>
            <option value="pptx">Presentaciones PowerPoint</option>
            <option value="image">Fotografías</option>
            <option value="video">Videos</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {filteredDocs.length} archivos encontrados
        </span>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200/80 transition-colors">
                  {getFileIcon(doc.fileType)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    doc.brand === 'Asturiano' 
                      ? 'bg-red-100 text-red-800' 
                      : doc.brand === 'Flash' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {doc.brand || 'Ambas'}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {doc.fileSize}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                {doc.title}
              </h4>

              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="truncate pr-2">
                <span className="block truncate">Por: <strong className="text-slate-700">{doc.uploader}</strong></span>
                <span className="text-[10px]">{doc.date}</span>
              </div>

              <button
                onClick={() => setPreviewDoc(doc)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-300 transition-colors flex items-center gap-1 shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                Abrir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100">
                  {getFileIcon(previewDoc.fileType)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {previewDoc.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {(previewDoc.fileType || 'PDF').toUpperCase()} • {previewDoc.fileSize} • Subido por {previewDoc.uploader}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 mb-4">
              <p><strong>Descripción:</strong> {previewDoc.description}</p>
              <p><strong>Marca:</strong> {previewDoc.brand || 'Asturiano & Flash'}</p>
              <p><strong>Fecha de carga:</strong> {previewDoc.date}</p>
              <p className="text-[11px] text-slate-500">
                Archivo resguardado con cifrado institucional para auditorías y presentaciones al consejo.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cerrar
              </button>
              <a
                href={previewDoc.url}
                download
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Descargando "${previewDoc.title}" (${previewDoc.fileSize})...`);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Documento
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Cargar Nuevo Documento al Repositorio
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Centraliza reportes, presentaciones o evidencias oficiales
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Documento *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Reporte Trimestral de Calidad Q4"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="reporte_anual">Reporte Anual</option>
                    <option value="presentacion">Presentación Directiva</option>
                    <option value="manual_operativo">Manual Operativo</option>
                    <option value="seguimiento">Archivo de Seguimiento</option>
                    <option value="buena_practica">Buena Práctica</option>
                    <option value="evidencia_visita">Evidencia de Visita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marca Relacionada *
                  </label>
                  <select
                    value={docBrand}
                    onChange={(e) => setDocBrand(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="Ambas">Ambas Marcas</option>
                    <option value="Asturiano">Tiendas Asturiano</option>
                    <option value="Flash">Estaciones Flash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Archivo *
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option value="pdf">Documento PDF (.pdf)</option>
                  <option value="excel">Libro de Excel (.xlsx)</option>
                  <option value="pptx">Presentación PowerPoint (.pptx)</option>
                  <option value="image">Fotografía de Evidencia (.jpg / .png)</option>
                  <option value="video">Video de Recorrido (.mp4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción o Resumen *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explica qué contiene este archivo y su relevancia para la operación..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                >
                  Confirmar y Cargar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
