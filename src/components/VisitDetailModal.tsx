import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Camera, 
  Award, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { Evaluation, OfficialCriterion, EvidenceMedia, Brand } from '../types';

export const VisitDetailModal: React.FC<{
  evaluation: Evaluation | null;
  onClose: () => void;
  brandFilter: 'Todas' | Brand;
}> = ({ evaluation, onClose, brandFilter }) => {
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'videos' | 'fotos' | 'compromisos'>('calificaciones');
  const [selectedVideo, setSelectedVideo] = useState<EvidenceMedia | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<EvidenceMedia | null>(null);

  if (!evaluation) return null;

  const isAsturiano = evaluation.brand === 'Asturiano';

  const videos = evaluation.evidences.filter(e => e.type === 'video');
  const photos = evaluation.evidences.filter(e => e.type === 'photo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Dynamic Modal Header based on Brand */}
        <div className={`p-5 sm:p-6 text-white flex items-start justify-between ${
          isAsturiano 
            ? 'bg-gradient-to-r from-red-700 via-red-600 to-blue-700' 
            : 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isAsturiano ? 'bg-yellow-400 text-slate-950 font-bold' : 'bg-black text-amber-400 font-bold'
              }`}>
                {evaluation.brand === 'Asturiano' ? 'Tienda Asturiano' : 'Estación Flash'}
              </span>
              <span className="text-white/80 text-xs font-semibold">•</span>
              <span className="text-white/90 text-xs font-medium">Auditoría Oficial</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {evaluation.unitName}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Fecha: <strong>{evaluation.evaluationDate}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Auditor: <strong>{evaluation.auditorName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {evaluation.zone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Score Big Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl text-right">
              <div className="text-[10px] uppercase font-bold text-white/80">Calificación</div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {evaluation.generalScore}%
              </div>
              <div className="text-[10px] text-white/90 font-bold">
                {evaluation.totalPointsAchieved} / {evaluation.totalPointsMax} pts
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors self-start"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('calificaciones')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'calificaciones'
                ? isAsturiano ? 'border-red-600 text-red-700 bg-white' : 'border-orange-500 text-orange-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            Desglose de Calificaciones ({evaluation.criteriaBreakdown?.length || 10} Criterios)
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'videos'
                ? isAsturiano ? 'border-red-600 text-red-700 bg-white' : 'border-orange-500 text-orange-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 text-purple-600" />
            Videos de la Visita ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('fotos')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'fotos'
                ? isAsturiano ? 'border-red-600 text-red-700 bg-white' : 'border-orange-500 text-orange-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-blue-600" />
            Fotografías ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('compromisos')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'compromisos'
                ? isAsturiano ? 'border-red-600 text-red-700 bg-white' : 'border-orange-500 text-orange-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Observaciones & Hallazgos
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          
          {/* TAB 1: Criteria Breakdown */}
          {activeTab === 'calificaciones' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isAsturiano ? 'Criterios Oficiales Tiendas Asturiano' : 'Criterios Oficiales Estaciones Flash'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAsturiano 
                      ? 'Ponderación exacta sobre 15.00 puntos totales reglamentarios'
                      : 'Ponderación exacta sobre 100 puntos totales reglamentarios'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Puntaje Total Obtenido</span>
                  <span className="text-lg font-black text-slate-900">
                    {evaluation.totalPointsAchieved} / {evaluation.totalPointsMax} pts ({evaluation.generalScore}%)
                  </span>
                </div>
              </div>

              {/* Criteria List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {evaluation.criteriaBreakdown?.map((crit, idx) => {
                  const pct = Math.round((crit.achievedPoints / crit.maxPoints) * 100);
                  const isPerfect = crit.achievedPoints >= crit.maxPoints;

                  return (
                    <div key={crit.id || idx} className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {crit.name}
                            </h4>
                            {isPerfect && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                100%
                              </span>
                            )}
                          </div>
                          {crit.notes && (
                            <p className="text-xs text-slate-600 mt-0.5">
                              {crit.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${
                              isAsturiano 
                                ? pct >= 90 ? 'bg-red-600' : 'bg-blue-600' 
                                : pct >= 90 ? 'bg-orange-500' : 'bg-amber-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-right min-w-[70px]">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {crit.achievedPoints} / {crit.maxPoints} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General Comments Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Dictamen General del Auditor
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{evaluation.generalComments}"
                </p>
                <div className="text-[11px] text-slate-500 mt-2">
                  Atendió en sucursal: <strong>{evaluation.storeReceivedBy}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Videos */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              {selectedVideo ? (
                <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">{selectedVideo.title}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedVideo(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cerrar Reproductor
                    </button>
                  </div>
                  <video 
                    controls 
                    autoPlay 
                    src={selectedVideo.url} 
                    className="w-full rounded-xl max-h-[380px] bg-black"
                  >
                    Tu navegador no soporta video HTML5.
                  </video>
                  <p className="text-xs text-slate-300">
                    {selectedVideo.notes}
                  </p>
                </div>
              ) : null}

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map(vid => (
                    <div 
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className="group cursor-pointer rounded-2xl border border-slate-200 p-3 bg-white hover:border-purple-300 hover:shadow-lg transition-all space-y-2"
                    >
                      <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-purple-600/90 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                        {vid.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {vid.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Video className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    No se grabaron videos en esta visita. Las evidencias se documentaron mediante fotografías.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Photos */}
          {activeTab === 'fotos' && (
            <div className="space-y-4">
              {selectedPhoto && (
                <div className="bg-slate-900 p-3 rounded-2xl text-white space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">{selectedPhoto.title}</span>
                    <button onClick={() => setSelectedPhoto(null)} className="text-slate-400 hover:text-white">Cerrar</button>
                  </div>
                  <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full max-h-[400px] object-contain rounded-xl bg-black" />
                  <p className="text-xs text-slate-300">{selectedPhoto.notes}</p>
                </div>
              )}

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map(photo => (
                    <div 
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer group rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-all"
                    >
                      <div className="h-32 bg-slate-100 overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={photo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div className="p-2 text-xs">
                        <div className="font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                          {photo.title}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {photo.criterionName || 'Evidencia fotográfica'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    No hay fotografías adjuntas para esta visita.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Compromisos / Fortalezas */}
          {activeTab === 'compromisos' && (
            <div className="space-y-4">
              {/* Fortalezas */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Fortalezas Reconocidas en la Visita
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desviaciones */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Desviaciones y Oportunidades Registradas
                </span>
                {evaluation.deviations.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-700">
                    {evaluation.deviations.map((dev, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {dev}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-800 font-semibold">
                    Cero desviaciones críticas detectadas en esta auditoría.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ID de Auditoría: <strong className="text-slate-700">{evaluation.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
};
