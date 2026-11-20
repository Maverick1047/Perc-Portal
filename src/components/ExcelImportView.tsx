import React, { useState } from 'react';
import { Brand, Evaluation, UserAccount } from '../types';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import { ASTURIANO_CRITERIA_TEMPLATE, FLASH_CRITERIA_TEMPLATE } from '../data/seedData';

export interface ExcelImportViewProps {
  brand: Brand;
  account: UserAccount;
  onImportEvaluations: (newEvals: Evaluation[]) => void;
}

interface ParsedRow {
  id: string;
  unitName: string;
  unitCode: string;
  brand: Brand;
  date: string;
  auditor: string;
  generalScore: number;
  status: 'valido' | 'advertencia';
  notes: string;
}

export const ExcelImportView: React.FC<ExcelImportViewProps> = ({
  brand,
  account,
  onImportEvaluations
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load sample demo batch
  const handleLoadDemoSheet = () => {
    setSuccessMessage(null);
    if (brand === 'Asturiano') {
      setFileName('Concentrado_Octubre2026_Asturiano_Evaluaciones.xlsx');
      setParsedRows([
        {
          id: `imp-ast-1`,
          unitName: 'Constituyentes',
          unitCode: 'AST-02',
          brand: 'Asturiano',
          date: '2026-10-24',
          auditor: account.name,
          generalScore: 89.3,
          status: 'valido',
          notes: 'Cumple 10 criterios, excelente orden y abasto continuo.',
        },
        {
          id: `imp-ast-2`,
          unitName: 'Candiles',
          unitCode: 'AST-04',
          brand: 'Asturiano',
          date: '2026-10-25',
          auditor: account.name,
          generalScore: 78.5,
          status: 'valido',
          notes: 'Área de oportunidad en módulo de café y filas en caja.',
        },
        {
          id: `imp-ast-3`,
          unitName: 'Corregidora',
          unitCode: 'AST-07',
          brand: 'Asturiano',
          date: '2026-10-26',
          auditor: account.name,
          generalScore: 93.3,
          status: 'valido',
          notes: 'Auditoría sobresaliente, Astro Saludo ejecutado con calidez.',
        },
      ]);
    } else {
      setFileName('Concentrado_Octubre2026_Flash_Evaluaciones.xlsx');
      setParsedRows([
        {
          id: `imp-fls-1`,
          unitName: 'Pueblito',
          unitCode: 'FLS-06',
          brand: 'Flash',
          date: '2026-10-25',
          auditor: account.name,
          generalScore: 88.0,
          status: 'valido',
          notes: 'Excelente tiempo de atención del lado del conductor y Flash Elite.',
        },
        {
          id: `imp-fls-2`,
          unitName: 'La Noria',
          unitCode: 'FLS-08',
          brand: 'Flash',
          date: '2026-10-26',
          auditor: account.name,
          generalScore: 84.0,
          status: 'valido',
          notes: 'Despacho rápido, agilizar emisión de factura electrónica.',
        },
        {
          id: `imp-fls-3`,
          unitName: 'San Miguel de Allende 1',
          unitCode: 'FLS-10',
          brand: 'Flash',
          date: '2026-10-27',
          auditor: account.name,
          generalScore: 92.0,
          status: 'valido',
          notes: 'Full service completo, ofrecimiento impecable de aditivo en bomba.',
        },
      ]);
    }
  };

  const handleProcessImport = () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const criteriaTemplate = brand === 'Asturiano' ? ASTURIANO_CRITERIA_TEMPLATE : FLASH_CRITERIA_TEMPLATE;
      const maxPts = brand === 'Asturiano' ? 15.0 : 100.0;

      const newEvaluations: Evaluation[] = parsedRows.map((r, idx) => ({
        id: `eval-imp-${Date.now()}-${idx}`,
        unitId: r.unitCode.toLowerCase(),
        unitName: r.unitName,
        brand: r.brand,
        zone: 'Zona Centro',
        evaluationDate: r.date,
        auditorName: r.auditor,
        storeReceivedBy: 'Responsable en turno',
        generalScore: r.generalScore,
        totalPointsAchieved: Math.round((r.generalScore / 100) * maxPts * 10) / 10,
        totalPointsMax: maxPts,
        criteriaBreakdown: criteriaTemplate,
        generalComments: r.notes,
        strengths: ['Atención al cliente', 'Cumplimiento de estándares de imagen'],
        deviations: [],
        evidences: [],
        followUpActionsCount: 0,
        hasPendingActions: false,
        status: 'completada',
      }));

      onImportEvaluations(newEvaluations);
      setIsProcessing(false);
      setSuccessMessage(`Se integraron con éxito ${newEvaluations.length} evaluaciones de ${brand} al Dashboard.`);
      setParsedRows([]);
      setFileName(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider font-unbounded">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              Módulo de Importación Excel / CSV
            </div>
            <h2 className="text-2xl font-black font-unbounded text-slate-900 mt-2">
              Importar Evaluaciones • {brand}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mt-1">
              Como <strong>{account.name} ({account.roleLabel})</strong>, puedes cargar archivos consolidados para proyectar evaluaciones en el tablero ejecutivo.
            </p>
          </div>

          <button
            onClick={handleLoadDemoSheet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs shadow transition-all font-unbounded self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cargar Hoja de Demostración</span>
          </button>
        </div>

        {/* Drag and drop simulated dropzone */}
        <div 
          onClick={handleLoadDemoSheet}
          className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-amber-50/30 group"
        >
          <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-amber-500 mx-auto transition-colors" />
          <h3 className="font-bold text-slate-800 font-unbounded text-sm mt-3">
            {fileName || `Arrastra un archivo de ${brand} (.xlsx o .csv) aquí`}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compatible con la plantilla oficial de 10 criterios de {brand}. Haz clic para simular carga rápida.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Preview Table if rows loaded */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 font-unbounded text-sm">
                Vista Previa de Datos Detectados ({parsedRows.length} registros)
              </h3>
              <p className="text-xs text-slate-500">
                Verifica las columnas antes de integrar los datos a la plataforma.
              </p>
            </div>

            <button
              onClick={handleProcessImport}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs shadow-lg transition-all font-unbounded"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Procesar e Integrar al Dashboard</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Unidad</th>
                  <th className="py-3 px-3">Marca</th>
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Auditor</th>
                  <th className="py-3 px-3 text-center">Calificación</th>
                  <th className="py-3 px-3">Observaciones</th>
                  <th className="py-3 px-3 text-center">Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{r.unitCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.unitName}</td>
                    <td className="py-2.5 px-3">{r.brand}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.date}</td>
                    <td className="py-2.5 px-3">{r.auditor}</td>
                    <td className="py-2.5 px-3 text-center font-black font-unbounded text-slate-900">
                      {r.generalScore}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{r.notes}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Válido
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
