import { 
  StoreUnit, 
  Evaluation, 
  FollowUpAction, 
  ConfidentialDoc, 
  AccessLog, 
  UserAccount, 
  OfficialCriterion,
  AsturianoAnnualRow,
  FlashAnnualRow,
  EvidenceDocument,
  ExecutiveNote,
  UserProfile
} from '../types';

export const ASTURIANO_CRITERIA_TEMPLATE: OfficialCriterion[] = [
  { id: 'ast-1', name: 'Orden, limpieza e imagen', maxPoints: 3.00, achievedPoints: 2.80, notes: 'Fachada limpia, piso pulcro y góndolas alineadas' },
  { id: 'ast-2', name: 'Abasto', maxPoints: 2.00, achievedPoints: 1.85, notes: 'Frenteo y surtido continuo en anaqueles' },
  { id: 'ast-3', name: 'Fast food', maxPoints: 2.00, achievedPoints: 1.90, notes: 'Módulo de café y pan caliente con frescura' },
  { id: 'ast-4', name: 'Bebidas', maxPoints: 1.00, achievedPoints: 0.90, notes: 'Refrigeradores a temperatura óptima' },
  { id: 'ast-5', name: 'Astro saludo', maxPoints: 0.50, achievedPoints: 0.50, notes: 'Gesto institucional de bienvenida y calidez' },
  { id: 'ast-6', name: 'Apapacho', maxPoints: 1.00, achievedPoints: 0.90, notes: 'Trato amable, cordial y atento al cliente' },
  { id: 'ast-7', name: 'Funcionamiento equipos', maxPoints: 1.00, achievedPoints: 1.00, notes: 'Terminal TPV y cafeteras operando al 100%' },
  { id: 'ast-8', name: 'Funcionamiento y simplicidad de la app', maxPoints: 0.50, achievedPoints: 0.40, notes: 'Escaneo y registro de lealtad sin demora' },
  { id: 'ast-9', name: 'Clientes en fila', maxPoints: 2.00, achievedPoints: 1.80, notes: 'Menos de 2 personas esperando en caja' },
  { id: 'ast-10', name: 'Falla sistema para pagos, no tener cashout', maxPoints: 2.00, achievedPoints: 2.00, notes: 'Sistema estable y disponibilidad de retiro' },
];

export const FLASH_CRITERIA_TEMPLATE: OfficialCriterion[] = [
  { id: 'fls-1', name: 'Atención inmediata del lado del conductor (menos de 1 min / contacto visual)', maxPoints: 15, achievedPoints: 14, notes: 'Despachador acudió en 35 segundos con contacto visual' },
  { id: 'fls-2', name: 'Bienvenida con actitud amable, respetuosa y hospitalaria', maxPoints: 15, achievedPoints: 14, notes: 'Saludo con amabilidad y calidez' },
  { id: 'fls-3', name: 'Pregunta y promoción de la app FLASH ELITE (invitación a descargar o redimir/acumular)', maxPoints: 15, achievedPoints: 13, notes: 'Invitó a acumular puntos en Flash Elite' },
  { id: 'fls-4', name: 'Consulta sobre producto a cargar y monto (pesos o litros)', maxPoints: 5, achievedPoints: 5, notes: 'Confirmó producto y display en ceros' },
  { id: 'fls-5', name: 'Ofrecimiento de servicios complementarios (limpieza de parabrisas, llantas, armor all o niveles)', maxPoints: 5, achievedPoints: 4, notes: 'Limpió parabrisas delantero y ofreció checar aceite' },
  { id: 'fls-6', name: 'Ofrecimiento de promoción "Impacto" o promociones periféricas vigentes', maxPoints: 5, achievedPoints: 4, notes: 'Mencionó promoción de aditivo en bomba' },
  { id: 'fls-7', name: 'Cobro y pregunta sobre requerimiento de ticket o factura', maxPoints: 5, achievedPoints: 5, notes: 'Ofreció comprobante o factura electrónica' },
  { id: 'fls-8', name: 'Emisión ágil de factura (si el cliente la solicita, de 1 a 3 minutos)', maxPoints: 15, achievedPoints: 14, notes: 'Facturación en terminal móvil en 1m 20s' },
  { id: 'fls-9', name: 'Confirmación de puntos generados en la app Flash Elite', maxPoints: 5, achievedPoints: 4, notes: 'Mostró puntos acumulados en comprobante' },
  { id: 'fls-10', name: 'Despedida cordial, invitación a regresar y tiempo total de servicio (máx. 4 minutos)', maxPoints: 15, achievedPoints: 14, notes: 'Despacho completo en 3m 15s con despedida amable' },
];

import { FLASH_STATIONS_MASTER, ASTURIANO_STORES_MASTER, MASTER_CATALOG_SUMMARY } from './masterCatalog';
import { MASTER_FLASH_EVALUATIONS, MASTER_ASTURIANO_EVALUATIONS } from './masterEvaluations';

// 20 Official Flash Stations from Catálogo Maestro (Catalogo_Servicio_Perc_45cb74cd.pdf)
export const FLASH_STATIONS: StoreUnit[] = FLASH_STATIONS_MASTER;

// 234 Official Asturiano Stores from Catálogo Maestro (Catalogo_Servicio_Perc_45cb74cd.pdf)
export const ASTURIANO_STORES: StoreUnit[] = ASTURIANO_STORES_MASTER;

export const INITIAL_UNITS: StoreUnit[] = [...ASTURIANO_STORES, ...FLASH_STATIONS];
export { MASTER_CATALOG_SUMMARY };


// Official Asturiano Annual Concentrated Matrix from Attachment
export const ASTURIANO_ANNUAL_DATA: AsturianoAnnualRow[] = [
  { month: 'Septiembre 2025', storesAudited: 35, generalAverage: 72.7, loyaltyAppPct: 10.0, promosPct: 14.3, astroSaludoPct: 0, minScore: 21.4, maxScore: 96.4, ordenLimpieza: 82.5, abasto: 84.0, fastFood: 72.0, bebidas: 88.0, astroSaludo: 0, apapacho: 14.0, equipos: 86.0, appSimplicidad: 10.0, clientesFila: 81.0, pagosCashout: 84.0 },
  { month: 'Octubre 2025', storesAudited: 41, generalAverage: 79.1, loyaltyAppPct: 22.0, promosPct: 22.0, astroSaludoPct: 0, minScore: 53.6, maxScore: 100.0, ordenLimpieza: 85.0, abasto: 86.0, fastFood: 75.0, bebidas: 90.0, astroSaludo: 0, apapacho: 22.0, equipos: 88.0, appSimplicidad: 22.0, clientesFila: 84.0, pagosCashout: 87.0 },
  { month: 'Noviembre 2025', storesAudited: 41, generalAverage: 64.0, loyaltyAppPct: 0.0, promosPct: 2.4, astroSaludoPct: 0, minScore: 0.0, maxScore: 86.7, ordenLimpieza: 79.0, abasto: 81.0, fastFood: 68.0, bebidas: 85.0, astroSaludo: 0, apapacho: 2.4, equipos: 82.0, appSimplicidad: 0.0, clientesFila: 78.0, pagosCashout: 81.0 },
  { month: 'Diciembre 2025', storesAudited: 37, generalAverage: 71.0, loyaltyAppPct: 0.0, promosPct: 0.0, astroSaludoPct: 0, minScore: 53.1, maxScore: 81.3, ordenLimpieza: 83.0, abasto: 84.0, fastFood: 73.0, bebidas: 89.0, astroSaludo: 0, apapacho: 0.0, equipos: 86.0, appSimplicidad: 0.0, clientesFila: 82.0, pagosCashout: 85.0 },
  { month: 'Enero 2026', storesAudited: 58, generalAverage: 67.8, loyaltyAppPct: 0.0, promosPct: 0.0, astroSaludoPct: 0, minScore: 0.0, maxScore: 87.5, ordenLimpieza: 80.0, abasto: 82.0, fastFood: 70.0, bebidas: 86.0, astroSaludo: 0, apapacho: 0.0, equipos: 83.0, appSimplicidad: 0.0, clientesFila: 79.0, pagosCashout: 82.0 },
  { month: 'Febrero 2026', storesAudited: 55, generalAverage: 70.0, loyaltyAppPct: 3.6, promosPct: 1.8, astroSaludoPct: 6.0, minScore: 50.0, maxScore: 100.0, ordenLimpieza: 82.0, abasto: 84.0, fastFood: 72.0, bebidas: 88.0, astroSaludo: 6.0, apapacho: 1.8, equipos: 85.0, appSimplicidad: 3.6, clientesFila: 81.0, pagosCashout: 84.0 },
  { month: 'Marzo 2026', storesAudited: 55, generalAverage: 70.0, loyaltyAppPct: 3.6, promosPct: 1.8, astroSaludoPct: 6.0, minScore: 53.1, maxScore: 96.9, ordenLimpieza: 83.0, abasto: 85.0, fastFood: 73.0, bebidas: 89.0, astroSaludo: 6.0, apapacho: 1.8, equipos: 86.0, appSimplicidad: 3.6, clientesFila: 82.0, pagosCashout: 85.0 },
  { month: 'Abril 2026', storesAudited: 35, generalAverage: 71.0, loyaltyAppPct: 5.7, promosPct: 4.3, astroSaludoPct: 18.0, minScore: 50.0, maxScore: 84.4, ordenLimpieza: 83.0, abasto: 85.0, fastFood: 73.0, bebidas: 89.0, astroSaludo: 18.0, apapacho: 4.3, equipos: 86.0, appSimplicidad: 5.7, clientesFila: 82.0, pagosCashout: 85.0 },
  { month: 'Mayo 2026', storesAudited: 25, generalAverage: 78.0, loyaltyAppPct: 8.2, promosPct: 12.3, astroSaludoPct: 9.0, minScore: 0.0, maxScore: 94.8, ordenLimpieza: 84.0, abasto: 86.0, fastFood: 74.0, bebidas: 90.0, astroSaludo: 9.0, apapacho: 12.3, equipos: 87.0, appSimplicidad: 8.2, clientesFila: 83.0, pagosCashout: 86.0 },
  { month: 'Junio 2026', storesAudited: 30, generalAverage: 85.0, loyaltyAppPct: 16.7, promosPct: 33.3, astroSaludoPct: 23.0, minScore: 63.9, maxScore: 96.7, ordenLimpieza: 88.0, abasto: 89.0, fastFood: 81.0, bebidas: 93.0, astroSaludo: 23.0, apapacho: 33.3, equipos: 90.0, appSimplicidad: 16.7, clientesFila: 87.0, pagosCashout: 89.0 },
  { month: 'Julio 2026', storesAudited: 51, generalAverage: 87.0, loyaltyAppPct: 11.8, promosPct: 31.4, astroSaludoPct: 12.0, minScore: 66.7, maxScore: 96.7, ordenLimpieza: 89.0, abasto: 91.0, fastFood: 83.0, bebidas: 94.0, astroSaludo: 12.0, apapacho: 31.4, equipos: 91.0, appSimplicidad: 11.8, clientesFila: 88.0, pagosCashout: 90.0 },
  { month: 'Agosto 2026', storesAudited: 50, generalAverage: 87.0, loyaltyAppPct: 12.0, promosPct: 17.0, astroSaludoPct: 11.0, minScore: 73.0, maxScore: 93.0, ordenLimpieza: 90.0, abasto: 92.0, fastFood: 84.0, bebidas: 95.0, astroSaludo: 11.0, apapacho: 17.0, equipos: 92.0, appSimplicidad: 12.0, clientesFila: 89.0, pagosCashout: 91.0 },
  { month: 'Septiembre 2026 (Cierre)', storesAudited: 60, generalAverage: 84.0, loyaltyAppPct: 0.0, promosPct: 25.0, astroSaludoPct: 3.0, minScore: 47.0, maxScore: 93.0, ordenLimpieza: 91.0, abasto: 93.0, fastFood: 85.0, bebidas: 96.0, astroSaludo: 3.0, apapacho: 82.0, equipos: 93.0, appSimplicidad: 14.5, clientesFila: 90.0, pagosCashout: 92.0 },
];

// Official Flash Annual Matrix from Attachment
export const FLASH_ANNUAL_DATA: FlashAnnualRow[] = [
  { month: 'Agosto 2025', generalAverage: 87, criteriosFuertes: 'LIMPIEZA, ATENCION AL CLIENTE, FLASH ELITE, EVALUACION QR', flashElite: '>90%', promociones: 90, fullService: 0, evaluacionQr: 90, facturacion: 100, estacionesVisitadas: 'HUIMILPAN, PUNTA ESMERALDA, PUEBLITO, ANGELES' },
  { month: 'Octubre 2025', generalAverage: 68, criteriosFuertes: 'LIMPIEZA', flashElite: 25, promociones: 0, fullService: 25, evaluacionQr: 0, facturacion: 100, estacionesVisitadas: 'Sin registro detallado' },
  { month: 'Noviembre 2025', generalAverage: 78, criteriosFuertes: 'LIMPIEZA, ATENCION AMABLE', flashElite: 10, promociones: 10, fullService: 50, evaluacionQr: 10, facturacion: 99, estacionesVisitadas: 'SAN MIGUEL DE ALLENDE 1, SOMBRA VERDE, SAN MIGUEL DE ALLENDE 3, SAN MIGUEL DE ALLENDE 2, LOS RODRIGUEZ, JURIQUILLA' },
  { month: 'Diciembre 2025', generalAverage: 88, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 0, evaluacionQr: 0, facturacion: 99, estacionesVisitadas: 'JURIQUILLA, TECNOLÓGICO' },
  { month: 'Enero 2026', generalAverage: 85, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 25, evaluacionQr: 0, facturacion: 95, estacionesVisitadas: 'JUNIPERO, ANGELES, HUIMILPAN, PUNTA ESMERALDA, PUEBLITO' },
  { month: 'Febrero 2026', generalAverage: 74, criteriosFuertes: 'LIMPIEZA, ATENCION AMABLE', flashElite: 30, promociones: 50, fullService: 25, evaluacionQr: 30, facturacion: 90, estacionesVisitadas: 'Sin registro detallado' },
  { month: 'Marzo 2026', generalAverage: 88, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 50, evaluacionQr: 0, facturacion: 95, estacionesVisitadas: 'TECNOLOGICO, JUNIPERO, ANGELES, PUEBLITO, PUNTA ESMERALDA' },
  { month: 'Abril 2026', generalAverage: 81, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 75, evaluacionQr: 0, facturacion: 99, estacionesVisitadas: 'JURIQUILLA, TECNOLOGICO, UNIVERSIDAD' },
  { month: 'Mayo 2026', generalAverage: 89, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 75, evaluacionQr: 0, facturacion: 100, estacionesVisitadas: 'HUICHAPAN 1, HUICHAPAN 2, HUICHAPAN 3, IZCALLI, JAVA, ESTADIO, PALMILLAS' },
  { month: 'Junio 2026', generalAverage: 82, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 50, evaluacionQr: 0, facturacion: 95, estacionesVisitadas: 'NORIA, SAN JUAN DEL RIO, TOCOPARI, JAVA, PUNTA ESMERALDA, SOMBRA VERDE, SMA 3, SMA 2' },
  { month: 'Julio 2026', generalAverage: 87, criteriosFuertes: 'LIMPIEZA', flashElite: 0, promociones: 0, fullService: 50, evaluacionQr: 0, facturacion: 95, estacionesVisitadas: 'ANGELES, HUIMILPAN, PUNTA ESMERALDA, PUEBLITO' },
  { month: 'Agosto 2026', generalAverage: 87, criteriosFuertes: 'LIMPIEZA, ATENCION AL CLIENTE', flashElite: 50, promociones: 50, fullService: 35, evaluacionQr: 50, facturacion: 90, estacionesVisitadas: 'SAN JUAN DEL RIO, SAN MIGUEL DE ALLENDE 1, SAN MIGUEL DE ALLENDE 3' },
  { month: 'Septiembre 2026', generalAverage: 83, criteriosFuertes: 'LIMPIEZA', flashElite: 50, promociones: 40, fullService: 25, evaluacionQr: 25, facturacion: 100, estacionesVisitadas: 'Palmillas' },
];

export const INITIAL_ACTIONS: FollowUpAction[] = [
  {
    id: 'act-001',
    evaluationId: 'eval-ast-01',
    unitId: 'ast-centro-ast052',
    unitName: 'Centro',
    brand: 'Asturiano',
    zone: 'Zona Centro',
    criterionName: 'Funcionamiento y simplicidad de la app',
    problemDetected: 'Baja mención de beneficios y simplicidad de la app en horas de alta afluencia.',
    areaResponsible: 'Capacitación',
    assignedPerson: 'Raúl Sánchez Gómez (Gerente)',
    commitmentDate: '2026-11-04',
    proposedAction: 'Reforzar el Astro saludo y el ofrecimiento de escaneo de app antes del cobro final.',
    status: 'en_proceso',
    priority: 'media',
    createdAt: '2026-10-22',
  },
  {
    id: 'act-002',
    evaluationId: 'eval-fls-01',
    unitId: 'fls-tecnologico',
    unitName: 'Tecnológico',
    brand: 'Flash',
    zone: 'Sin zona',
    criterionName: 'Ofrecimiento de servicios complementarios',
    problemDetected: 'Falta de ofrecimiento sistemático de servicios complementarios (limpieza parabrisas/niveles).',
    areaResponsible: 'Calidad y Servicio',
    assignedPerson: 'Supervisor Tecnológico',
    commitmentDate: '2026-10-31',
    proposedAction: 'Checklist obligatorio en bomba para verificar limpiaparabrisas y aditivos.',
    status: 'en_proceso',
    priority: 'alta',
    createdAt: '2026-10-18',
  },
  {
    id: 'act-003',
    evaluationId: 'eval-fls-02',
    unitId: 'fls-palmillas',
    unitName: 'Palmillas',
    brand: 'Flash',
    zone: 'Sin zona',
    criterionName: 'Emisión ágil de factura',
    problemDetected: 'Demora en emisión de facturas electrónicas durante cambio de turno.',
    areaResponsible: 'Sistemas / TI',
    assignedPerson: 'Ing. Javier Solís',
    commitmentDate: '2026-10-25',
    proposedAction: 'Actualización del software de facturación móvil para emitir en menos de 90 segundos.',
    status: 'concluido',
    priority: 'alta',
    closeDate: '2026-10-24',
    postReviewComments: 'Terminal POS actualizada con emisión en 45 segundos.',
    solutionEvidenceUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-15',
  }
];

export const BENCHMARK_DETAILED_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-ast-01',
    unitId: 'ast-centro-ast052',
    unitName: 'Centro',
    brand: 'Asturiano',
    zone: 'Zona Centro',
    evaluationDate: '2026-10-22',
    auditorName: 'Nick (Responsable)',
    storeReceivedBy: 'Raúl Sánchez Gómez',
    generalScore: 88.3,
    totalPointsAchieved: 13.25,
    totalPointsMax: 15.00,
    criteriaBreakdown: ASTURIANO_CRITERIA_TEMPLATE,
    generalComments: 'Excelente orden y limpieza general. Muy buen Astro saludo y trato cálido al cliente (apapacho). Oportunidad en agilizar clientes en fila en horas pico.',
    strengths: [
      'Orden, limpieza e imagen impecable (2.8/3.0 pts)',
      'Astro saludo inmediato y trato cálido al cliente',
      'Cero fallas en sistema de cobro ni en cashout'
    ],
    deviations: [
      'Promoción de la app con oportunidad de mejora (0.4/0.5 pts)',
      'Clientes en fila superaron los 2 minutos en turno matutino'
    ],
    evidences: [
      {
        id: 'ev-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
        title: 'Fachada y piso de venta Centro Querétaro',
        criterionName: 'Orden, limpieza e imagen',
        timestamp: '2026-10-22 14:15',
        notes: 'Piso pulcro, góndolas alineadas y señalética completa.'
      },
      {
        id: 'ev-2',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Recorrido en video de visita y módulo Fast Food',
        criterionName: 'Fast food',
        timestamp: '2026-10-22 14:22',
        duration: '0:45 min',
        notes: 'Video de recorrido mostrando área de café caliente y vitrinas.'
      }
    ],
    followUpActionsCount: 1,
    hasPendingActions: true,
    status: 'con_observaciones'
  },
  {
    id: 'eval-ast-02',
    unitId: 'ast-corporativoblanco-ast073',
    unitName: 'Corporativo Blanco',
    brand: 'Asturiano',
    zone: 'Zona Centro',
    evaluationDate: '2026-10-15',
    auditorName: 'Daniel (Responsable)',
    storeReceivedBy: 'Patricia Ledesma',
    generalScore: 94.7,
    totalPointsAchieved: 14.20,
    totalPointsMax: 15.00,
    criteriaBreakdown: ASTURIANO_CRITERIA_TEMPLATE.map(c => ({ ...c, achievedPoints: c.maxPoints })),
    generalComments: 'Sucursal insignia. Cumplimiento prácticamente perfecto en todos los 10 criterios de evaluación Asturiano.',
    strengths: [
      'Puntuación máxima en Orden, limpieza e imagen (3.0/3.0 pts)',
      'Fast food y cafetería en estado estelar (2.0/2.0 pts)',
      'Excelente empatía y apapacho al cliente'
    ],
    deviations: [],
    evidences: [
      {
        id: 'ev-3',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        title: 'Módulo de cafetería, pan caliente y vitrina',
        criterionName: 'Fast food',
        timestamp: '2026-10-15 09:30',
        notes: 'Ejemplar orden y pulcritud en alimentos.'
      }
    ],
    followUpActionsCount: 0,
    hasPendingActions: false,
    status: 'completada'
  },
  {
    id: 'eval-fls-01',
    unitId: 'fls-tecnologico',
    unitName: 'Tecnológico',
    brand: 'Flash',
    zone: 'Sin zona',
    evaluationDate: '2026-10-18',
    auditorName: 'Nick (Responsable)',
    storeReceivedBy: 'Supervisor Tecnológico',
    generalScore: 91.0,
    totalPointsAchieved: 91,
    totalPointsMax: 100,
    criteriaBreakdown: FLASH_CRITERIA_TEMPLATE,
    generalComments: 'Desempeño sobresaliente en atención inmediata y bienvenida Flash. Despacho ágil en menos de 3.5 minutos y correcta emisión de factura.',
    strengths: [
      'Atención en menos de 1 minuto con contacto visual pleno (14/15 pts)',
      'Emisión ágil de factura en terminal móvil (14/15 pts)',
      'Despedida cordial e invitación a regresar (14/15 pts)'
    ],
    deviations: [
      'Reforzar ofrecimiento de servicios complementarios como limpieza de parabrisas (4/5 pts)'
    ],
    evidences: [
      {
        id: 'ev-4',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
        title: 'Isla de despacho y atención del despachador Flash',
        criterionName: 'Atención inmediata del lado del conductor',
        timestamp: '2026-10-18 10:25',
        notes: 'Despachador uniformado atendiendo inmediatamente.'
      },
      {
        id: 'ev-5',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Video de protocolo de servicio y escaneo Flash Elite',
        criterionName: 'Pregunta y promoción de la app FLASH ELITE',
        timestamp: '2026-10-18 10:30',
        duration: '1:10 min',
        notes: 'Auditoría en video de protocolo de bienvenida y confirmación de puntos.'
      }
    ],
    followUpActionsCount: 1,
    hasPendingActions: true,
    status: 'con_observaciones'
  },
  {
    id: 'eval-fls-02',
    unitId: 'fls-palmillas',
    unitName: 'Palmillas',
    brand: 'Flash',
    zone: 'Sin zona',
    evaluationDate: '2026-10-25',
    auditorName: 'Daniel (Responsable)',
    storeReceivedBy: 'Supervisor Palmillas',
    generalScore: 84.0,
    totalPointsAchieved: 84,
    totalPointsMax: 100,
    criteriaBreakdown: FLASH_CRITERIA_TEMPLATE.map((c, i) => i === 7 ? { ...c, achievedPoints: 10 } : c),
    generalComments: 'Buena actitud del personal; se resolvió la lentitud previa en facturación con nueva terminal.',
    strengths: [
      'Bienvenida hospitalaria y respeto en todo momento',
      'Confirmación transparente de producto y ceros en display'
    ],
    deviations: [
      'Tiempos de facturación requirieron actualización'
    ],
    evidences: [
      {
        id: 'ev-6',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1527018607616-0526648e861c?auto=format&fit=crop&w=800&q=80',
        title: 'Tótem y marquesina de Estación Flash Palmillas',
        criterionName: 'Bienvenida con actitud amable, respetuosa y hospitalaria',
        timestamp: '2026-10-25 11:20',
        notes: 'Precios actualizados y señalética operativa.'
      }
    ],
    followUpActionsCount: 1,
    hasPendingActions: false,
    status: 'completada'
  }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  ...BENCHMARK_DETAILED_EVALUATIONS,
  ...MASTER_FLASH_EVALUATIONS,
  ...MASTER_ASTURIANO_EVALUATIONS,
];

// Family Office Confidential Documents
export const INITIAL_CONFIDENTIAL_DOCS: ConfidentialDoc[] = [
  {
    id: 'fdoc-01',
    title: 'Acta Constitutiva Consolidada - Grupo PERC Holding',
    category: 'Contratos',
    entityOrOwner: 'Grupo PERC S.A. de C.V.',
    date: '2026-01-15',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    uploadedBy: 'Daniel (Responsable)',
    uploadedAt: '2026-02-01 10:15',
    notes: 'Documento notarial estatutario con poderes de representación y administración.',
  },
  {
    id: 'fdoc-02',
    title: 'Estado de Cuenta Patrimonial Q3 2026',
    category: 'Estados de cuenta',
    entityOrOwner: 'Family Office PERC',
    date: '2026-09-30',
    fileSize: '2.8 MB',
    fileType: 'pdf',
    uploadedBy: 'Daniel (Responsable)',
    uploadedAt: '2026-10-05 16:40',
    notes: 'Consolidado bancario de inversiones de capital, cuentas corporativas y rendimientos.',
  },
  {
    id: 'fdoc-03',
    title: 'Contrato Marco de Arrendamiento Terrenos Estaciones Flash',
    category: 'Contratos',
    entityOrOwner: 'Inmobiliaria Flash Bajío',
    date: '2026-05-10',
    fileSize: '8.1 MB',
    fileType: 'pdf',
    uploadedBy: 'Daniel (Responsable)',
    uploadedAt: '2026-06-01 11:00',
    notes: 'Contratos de arrendamiento a largo plazo con derechos de vía y servidumbre.',
  },
  {
    id: 'fdoc-04',
    title: 'Dictamen Fiscal y Cumplimiento SAT Ejercicio 2025-2026',
    category: 'Fiscales',
    entityOrOwner: 'Tiendas Asturiano / Flash',
    date: '2026-04-20',
    fileSize: '3.6 MB',
    fileType: 'pdf',
    uploadedBy: 'Daniel (Responsable)',
    uploadedAt: '2026-05-02 09:30',
    notes: 'Opinión positiva 32-D y dictamen de estados financieros de auditoría externa.',
  },
  {
    id: 'fdoc-05',
    title: 'Identificaciones y Cédulas de Accionistas Principales',
    category: 'Identificaciones',
    entityOrOwner: 'Consejo de Administración PERC',
    date: '2026-01-10',
    fileSize: '5.5 MB',
    fileType: 'image',
    uploadedBy: 'Daniel (Responsable)',
    uploadedAt: '2026-01-20 14:10',
    notes: 'Expediente digital de identificación oficial de apoderados legales.',
  }
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  { id: 'log-01', docId: 'fdoc-01', docTitle: 'Acta Constitutiva Consolidada', userName: 'Daniel', userEmail: 'daniel@portal.demo', action: 'Subida', timestamp: '2026-02-01 10:15' },
  { id: 'log-02', docId: 'fdoc-02', docTitle: 'Estado de Cuenta Patrimonial Q3 2026', userName: 'Daniel', userEmail: 'daniel@portal.demo', action: 'Subida', timestamp: '2026-10-05 16:40' },
  { id: 'log-03', docId: 'fdoc-02', docTitle: 'Estado de Cuenta Patrimonial Q3 2026', userName: 'Ricardo', userEmail: 'ricardo@portal.demo', action: 'Consulta', timestamp: '2026-10-10 11:22' },
  { id: 'log-04', docId: 'fdoc-03', docTitle: 'Contrato Marco de Arrendamiento', userName: 'César', userEmail: 'cesar@portal.demo', action: 'Consulta', timestamp: '2026-10-18 17:05' },
];

// Accounts Definition per Section 4 of Spec
export const USER_ACCOUNTS: UserAccount[] = [
  {
    email: 'nick@portal.demo',
    passwordHash: 'demo123',
    name: 'Nick',
    title: 'Responsable del Portal',
    role: 'responsable_portal',
    roleLabel: 'Responsable del Portal',
    canAccessAsturiano: true,
    canAccessFlash: true,
    canAccessFamilyOffice: false, // Nick NO ve Family Office
    canUploadEvaluations: true,
    canImportExcel: true,
    canEditActions: true,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
  },
  {
    email: 'daniel@portal.demo',
    passwordHash: 'demo123',
    name: 'Daniel',
    title: 'Responsable del Portal y Documentos',
    role: 'responsable_portal_docs',
    roleLabel: 'Responsable del Portal y Documentos',
    canAccessAsturiano: true,
    canAccessFlash: true,
    canAccessFamilyOffice: true, // Daniel es el ÚNICO que sube y consulta docs
    canUploadEvaluations: true,
    canImportExcel: true,
    canEditActions: true,
    canUploadFamilyOffice: true,
    canViewAnnualHistory: true,
  },
  {
    email: 'ricardo@portal.demo',
    passwordHash: 'demo123',
    name: 'Ricardo',
    title: 'Dirección General',
    role: 'direccion_general',
    roleLabel: 'Dirección General (Solo Consulta)',
    canAccessAsturiano: true,
    canAccessFlash: true,
    canAccessFamilyOffice: true, // Ricardo consulta docs pero NO sube
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
  },
  {
    email: 'cesar@portal.demo',
    passwordHash: 'demo123',
    name: 'César',
    title: 'Dirección General',
    role: 'direccion_general',
    roleLabel: 'Dirección General (Solo Consulta)',
    canAccessAsturiano: true,
    canAccessFlash: true,
    canAccessFamilyOffice: true, // César consulta docs pero NO sube
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
  },
  {
    email: 'asturiano@portal.demo',
    passwordHash: 'demo123',
    name: 'Dirección Asturiano',
    title: 'Dirección de Marca Asturiano',
    role: 'direccion_marca',
    roleLabel: 'Dirección Asturiano',
    canAccessAsturiano: true,
    canAccessFlash: false,
    canAccessFamilyOffice: false,
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
    assignedBrand: 'Asturiano',
  },
  {
    email: 'flash@portal.demo',
    passwordHash: 'demo123',
    name: 'Dirección Flash',
    title: 'Dirección de Marca Flash',
    role: 'direccion_marca',
    roleLabel: 'Dirección Flash',
    canAccessAsturiano: false,
    canAccessFlash: true,
    canAccessFamilyOffice: false,
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
    assignedBrand: 'Flash',
  },
  {
    email: 'gerente.asturiano@portal.demo',
    passwordHash: 'demo123',
    name: 'Gerente Asturiano',
    title: 'Gerencia Operativa Asturiano',
    role: 'gerente_marca',
    roleLabel: 'Gerente Asturiano',
    canAccessAsturiano: true,
    canAccessFlash: false,
    canAccessFamilyOffice: false,
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
    assignedBrand: 'Asturiano',
  },
  {
    email: 'gerente.flash@portal.demo',
    passwordHash: 'demo123',
    name: 'Gerente Flash',
    title: 'Gerencia Operativa Flash',
    role: 'gerente_marca',
    roleLabel: 'Gerente Flash',
    canAccessAsturiano: false,
    canAccessFlash: true,
    canAccessFamilyOffice: false,
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
    assignedBrand: 'Flash',
  },
  {
    email: 'auditor@portal.demo',
    passwordHash: 'demo123',
    name: 'Luis Mendoza',
    title: 'Auditor de Calidad en Ruta',
    role: 'responsable_portal',
    roleLabel: 'Auditor de Campo (Asturiano & Flash)',
    canAccessAsturiano: true,
    canAccessFlash: true,
    canAccessFamilyOffice: false,
    canUploadEvaluations: true,
    canImportExcel: false,
    canEditActions: true,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: true,
    department: 'Auditoría Operativa',
  },
  {
    email: 'auditor.family@portal.demo',
    passwordHash: 'demo123',
    name: 'Lic. Sofía Morales',
    title: 'Oficial de Cumplimiento & Gobierno Familiar',
    role: 'direccion_general',
    roleLabel: 'Auditoría Family Office (Consulta)',
    canAccessAsturiano: false,
    canAccessFlash: false,
    canAccessFamilyOffice: true,
    canUploadEvaluations: false,
    canImportExcel: false,
    canEditActions: false,
    canUploadFamilyOffice: false,
    canViewAnnualHistory: false,
    department: 'Gobernanza & Cumplimiento',
  },
  // 20 Flash Stations Supervisors
  ...FLASH_STATIONS.map(st => {
    const rawName = st.name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '');
    return {
      email: `${rawName}@portal.demo`,
      passwordHash: 'demo123',
      name: `Supervisor ${st.name}`,
      title: `Supervisor Estación Flash ${st.name}`,
      role: 'supervisor' as const,
      roleLabel: `Supervisor - ${st.name}`,
      canAccessAsturiano: false,
      canAccessFlash: true,
      canAccessFamilyOffice: false,
      canUploadEvaluations: false,
      canImportExcel: false,
      canEditActions: false,
      canUploadFamilyOffice: false,
      canViewAnnualHistory: false, // Supervisor NO ve histórico anual
      assignedUnitId: st.id,
      assignedUnitName: st.name,
      assignedBrand: 'Flash' as const,
    };
  }),
  // Asturiano Stores Supervisors (Active stores in Sept 2026 & representative stores)
  ...ASTURIANO_STORES.filter(st => st.isActiveInSept2026 || ['AST-001', 'AST-052', 'AST-073', 'AST-234'].includes(st.code)).map(st => {
    const cleanCode = st.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = st.email || `supervisor.${cleanCode}@portal.demo`;
    return {
      email,
      passwordHash: 'demo123',
      name: `Supervisor ${st.name} (${st.code})`,
      title: `Supervisor Tienda Asturiano ${st.name}`,
      role: 'supervisor' as const,
      roleLabel: `Supervisor - ${st.name} (${st.code})`,
      canAccessAsturiano: true,
      canAccessFlash: false,
      canAccessFamilyOffice: false,
      canUploadEvaluations: false,
      canImportExcel: false,
      canEditActions: false,
      canUploadFamilyOffice: false,
      canViewAnnualHistory: false, // Supervisor NO ve histórico anual
      assignedUnitId: st.id,
      assignedUnitName: st.name,
      assignedBrand: 'Asturiano' as const,
    };
  })
];


export const AVAILABLE_PROFILES: UserProfile[] = USER_ACCOUNTS.map(a => ({
  id: a.email,
  name: a.name,
  email: a.email,
  role: (a.role === 'responsable_portal' || a.role === 'responsable_portal_docs')
    ? 'responsable_portal' 
    : a.role === 'direccion_general' 
    ? 'direccion_general' 
    : 'tiendas_estaciones',
  roleLabel: a.roleLabel,
  canUploadData: a.canUploadEvaluations,
  canEditActions: a.canEditActions,
  assignedUnitId: a.assignedUnitId
}));

export const INITIAL_DOCUMENTS: EvidenceDocument[] = [
  {
    id: 'doc-01',
    title: 'Manual de Estándares Astro Servicio Asturiano 2026',
    category: 'Procedimiento',
    uploadedBy: 'Daniel (Responsable)',
    uploadDate: '2026-01-10',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    tags: ['Astro Servicio', 'Normativa', 'Imagen']
  },
  {
    id: 'doc-02',
    title: 'Guía Operativa de Estaciones Flash y Flash Elite',
    category: 'Procedimiento',
    uploadedBy: 'Nick (Responsable)',
    uploadDate: '2026-02-15',
    fileSize: '6.2 MB',
    fileType: 'pdf',
    tags: ['Flash', 'Protocolo', 'Flash Elite']
  }
];

export const EXECUTIVE_NOTES: ExecutiveNote[] = [
  {
    id: 'note-01',
    title: 'Reforzamiento de Tiempo de Atención en Bomba',
    content: 'Se acordó priorizar contacto visual inmediato en menos de 1 minuto en todas las 20 estaciones Flash.',
    author: 'Nick',
    date: '2026-10-20',
    priority: 'alta'
  }
];

