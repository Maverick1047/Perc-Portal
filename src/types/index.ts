export type Brand = 'Asturiano' | 'Flash';

export type Zone = 
  | 'Zona Centro' 
  | 'Zona Norte' 
  | 'Zona Poniente' 
  | 'Zona Oriente' 
  | 'Zona Sur'
  | 'Bajío'
  | 'Corregidora'
  | 'San Juan del Río'
  | 'San Miguel de Allende'
  | 'CDMX'
  | 'Estado de México'
  | 'Sin zona'
  | (string & {});

export type UnitType = 'tienda' | 'estacion';

export interface StoreUnit {
  id: string;
  code: string;
  name: string;
  brand: Brand;
  type: UnitType;
  zone: Zone;
  address?: string;
  city?: string;
  manager?: string;
  phone?: string;
  evaluatorAssigned?: string;
  visitsCount?: number;
  visitTarget?: number;
  statusLabel?: string;
  variants?: string;
  email?: string;
  sharedWith?: string;
  isActiveInSept2026?: boolean;
}

export interface OfficialCriterion {
  id: string;
  name: string;
  maxPoints: number;
  achievedPoints: number;
  notes?: string;
  videoOrPhotoEvidence?: string;
}

export interface EvidenceMedia {
  id: string;
  type: 'photo' | 'video' | 'doc';
  url: string;
  title: string;
  criterionName?: string;
  timestamp: string;
  tags?: string[];
  notes?: string;
  duration?: string;
}

export type ActionStatus = 'pendiente' | 'en_proceso' | 'concluido';
export type ActionPriority = 'alta' | 'media' | 'baja';

export interface FollowUpAction {
  id: string;
  evaluationId: string;
  unitId: string;
  unitName: string;
  brand: Brand;
  zone: Zone;
  criterionName?: string;
  problemDetected: string;
  areaResponsible: 'Operaciones' | 'Mantenimiento' | 'Sistemas / TI' | 'Capacitación' | 'Abasto / Compras' | 'Calidad y Servicio';
  assignedPerson: string;
  commitmentDate: string;
  proposedAction: string;
  status: ActionStatus;
  priority: ActionPriority;
  solutionEvidenceUrl?: string;
  closeDate?: string;
  postReviewComments?: string;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  unitId: string;
  unitName: string;
  brand: Brand;
  zone: Zone;
  evaluationDate: string;
  auditorName: string;
  storeReceivedBy: string;
  generalScore: number; // 0 - 100 percentage
  totalPointsAchieved: number;
  totalPointsMax: number;
  criteriaBreakdown: OfficialCriterion[];
  generalComments: string;
  strengths: string[];
  deviations: string[];
  evidences: EvidenceMedia[];
  followUpActionsCount: number;
  hasPendingActions: boolean;
  status: 'completada' | 'en_revision' | 'con_observaciones';
}

export interface ConfidentialDoc {
  id: string;
  title: string;
  category: 'Actas de nacimiento' | 'Estados de cuenta' | 'Contratos' | 'Identificaciones' | 'Fiscales' | 'Otros';
  entityOrOwner: string;
  date: string;
  fileSize: string;
  fileType: 'pdf' | 'image';
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
  url?: string;
}

export interface AccessLog {
  id: string;
  docId: string;
  docTitle: string;
  userName: string;
  userEmail: string;
  action: 'Subida' | 'Consulta' | 'Descarga';
  timestamp: string;
}

export type UserRole = 
  | 'responsable_portal' 
  | 'responsable_portal_docs'
  | 'direccion_general' 
  | 'direccion_marca' 
  | 'gerente_marca' 
  | 'supervisor';

export interface UserAccount {
  email: string;
  passwordHash: string; // demo123
  name: string;
  title: string;
  role: UserRole;
  roleLabel: string;
  canAccessAsturiano: boolean;
  canAccessFlash: boolean;
  canAccessFamilyOffice: boolean;
  canUploadEvaluations: boolean;
  canImportExcel: boolean;
  canEditActions: boolean;
  canUploadFamilyOffice: boolean;
  canViewAnnualHistory: boolean;
  assignedUnitId?: string;
  assignedUnitName?: string;
  assignedBrand?: Brand;
  avatarUrl?: string;
  department?: string;
}

export interface AsturianoAnnualRow {
  month: string;
  storesAudited: number;
  generalAverage: number;
  loyaltyAppPct: number;
  promosPct: number;
  astroSaludoPct: number;
  minScore: number;
  maxScore: number;
  // 10 Indicators:
  ordenLimpieza: number;
  abasto: number;
  fastFood: number;
  bebidas: number;
  astroSaludo: number;
  apapacho: number;
  equipos: number;
  appSimplicidad: number;
  clientesFila: number;
  pagosCashout: number;
}

export interface FlashAnnualRow {
  month: string;
  generalAverage: number;
  criteriosFuertes: string;
  flashElite: number | string;
  promociones: number;
  fullService: number;
  evaluacionQr: number;
  facturacion: number;
  estacionesVisitadas: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'responsable_portal' | 'direccion_general' | 'operaciones' | 'lideres_zona' | 'tiendas_estaciones';
  roleLabel: string;
  canUploadData: boolean;
  canCreateEvaluations?: boolean;
  canEditActions: boolean;
  assignedZone?: Zone;
  assignedUnitId?: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  category: string;
  description?: string;
  unitName?: string;
  brand?: Brand | 'Corporativo' | 'Ambas';
  uploadedBy?: string;
  uploader?: string;
  uploadDate?: string;
  date?: string;
  fileSize?: string;
  fileType?: string;
  tags?: string[];
  url?: string;
}

export interface ExecutiveNote {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority?: 'alta' | 'media' | 'baja';
  type?: string;
  period?: string;
  brand?: Brand | 'Ambas' | 'Corporativo';
}



