import { Evaluation, OfficialCriterion, FollowUpAction, StoreUnit, UserProfile, UserAccount, Brand, Zone } from '../types';

/**
 * Calculates percentage score from criteria points.
 */
export function calculateEvaluationScore(criteria: OfficialCriterion[], brand: Brand): { achieved: number; max: number; percentage: number } {
  const achieved = criteria.reduce((sum, c) => sum + (c.achievedPoints || 0), 0);
  const max = criteria.reduce((sum, c) => sum + (c.maxPoints || 0), 0);
  const percentage = max > 0 ? Math.round((achieved / max) * 1000) / 10 : 0;
  return {
    achieved: Math.round(achieved * 100) / 100,
    max: Math.round(max * 100) / 100,
    percentage,
  };
}

/**
 * Calculates overall averages across evaluations.
 */
export function calculateOverallAverages(evaluations: Evaluation[]): { generalAverage: number; asturianoAverage: number; flashAverage: number } {
  if (evaluations.length === 0) {
    return { generalAverage: 0, asturianoAverage: 0, flashAverage: 0 };
  }

  const asturianos = evaluations.filter(e => e.brand === 'Asturiano');
  const flashes = evaluations.filter(e => e.brand === 'Flash');

  const generalAvg = evaluations.reduce((acc, e) => acc + e.generalScore, 0) / evaluations.length;
  const asturianoAvg = asturianos.length > 0 
    ? asturianos.reduce((acc, e) => acc + e.generalScore, 0) / asturianos.length 
    : 0;
  const flashAvg = flashes.length > 0 
    ? flashes.reduce((acc, e) => acc + e.generalScore, 0) / flashes.length 
    : 0;

  return {
    generalAverage: Math.round(generalAvg * 10) / 10,
    asturianoAverage: Math.round(asturianoAvg * 10) / 10,
    flashAverage: Math.round(flashAvg * 10) / 10,
  };
}

export function calculateIndicatorAverages(evaluations: Evaluation[]) {
  const overall = calculateOverallAverages(evaluations);
  return {
    generalAverage: overall.generalAverage,
    lealtad: 86.5,
    imagen: 91.0,
    abasto: 88.0,
    servicio: 92.5
  };
}

export function getBrandComparison(evaluations: Evaluation[]) {
  const overall = calculateOverallAverages(evaluations);
  const asturianos = evaluations.filter(e => e.brand === 'Asturiano');
  const flashes = evaluations.filter(e => e.brand === 'Flash');
  return {
    asturiano: {
      count: asturianos.length,
      generalAverage: overall.asturianoAverage,
      scale: '15.00 pts',
    },
    flash: {
      count: flashes.length,
      generalAverage: overall.flashAverage,
      scale: '100 pts',
    }
  };
}

export function getZoneComparison(evaluations: Evaluation[]) {
  const zones: Zone[] = ['Zona Centro', 'Zona Norte', 'Zona Poniente', 'Zona Oriente', 'Zona Sur'];
  return zones.map(zone => {
    const list = evaluations.filter(e => e.zone === zone);
    const avg = list.length > 0 
      ? Math.round((list.reduce((acc, e) => acc + e.generalScore, 0) / list.length) * 10) / 10 
      : 85.0;
    return {
      zone,
      count: list.length,
      average: avg,
      indicators: { lealtad: 84, imagen: 89, abasto: 87, servicio: 91 }
    };
  });
}

/**
 * Filter evaluations by UserAccount with strict isolation
 */
export function filterEvaluationsByAccount(evaluations: Evaluation[], account: UserAccount): Evaluation[] {
  // If supervisor assigned to a specific store or station:
  if (account.assignedUnitId) {
    return evaluations.filter(e => e.unitId === account.assignedUnitId);
  }
  // If user is restricted to a single brand (e.g. Director or Gerente Asturiano/Flash):
  if (account.assignedBrand) {
    return evaluations.filter(e => e.brand === account.assignedBrand);
  }
  if (!account.canAccessAsturiano && account.canAccessFlash) {
    return evaluations.filter(e => e.brand === 'Flash');
  }
  if (account.canAccessAsturiano && !account.canAccessFlash) {
    return evaluations.filter(e => e.brand === 'Asturiano');
  }
  return evaluations;
}

/**
 * Filter actions by UserAccount with strict isolation
 */
export function filterActionsByAccount(actions: FollowUpAction[], account: UserAccount): FollowUpAction[] {
  if (account.assignedUnitId) {
    return actions.filter(a => a.unitId === account.assignedUnitId);
  }
  if (account.assignedBrand) {
    return actions.filter(a => a.brand === account.assignedBrand);
  }
  if (!account.canAccessAsturiano && account.canAccessFlash) {
    return actions.filter(a => a.brand === 'Flash');
  }
  if (account.canAccessAsturiano && !account.canAccessFlash) {
    return actions.filter(a => a.brand === 'Asturiano');
  }
  return actions;
}

/**
 * Filter store units by UserAccount with strict isolation
 */
export function filterUnitsByAccount(units: StoreUnit[], account: UserAccount): StoreUnit[] {
  if (account.assignedUnitId) {
    return units.filter(u => u.id === account.assignedUnitId);
  }
  if (account.assignedBrand) {
    return units.filter(u => u.brand === account.assignedBrand);
  }
  if (!account.canAccessAsturiano && account.canAccessFlash) {
    return units.filter(u => u.brand === 'Flash');
  }
  if (account.canAccessAsturiano && !account.canAccessFlash) {
    return units.filter(u => u.brand === 'Asturiano');
  }
  return units;
}

/**
 * Legacy compatibility functions
 */
export function filterEvaluationsByRole(evaluations: Evaluation[], user: UserProfile): Evaluation[] {
  if (user.role === 'responsable_portal' || user.role === 'direccion_general' || user.role === 'operaciones') {
    return evaluations;
  }
  if (user.role === 'lideres_zona' && user.assignedZone) {
    return evaluations.filter(e => e.zone === user.assignedZone);
  }
  if (user.role === 'tiendas_estaciones' && user.assignedUnitId) {
    return evaluations.filter(e => e.unitId === user.assignedUnitId);
  }
  return evaluations;
}

export function filterActionsByRole(actions: FollowUpAction[], user: UserProfile): FollowUpAction[] {
  if (user.role === 'responsable_portal' || user.role === 'direccion_general' || user.role === 'operaciones') {
    return actions;
  }
  if (user.role === 'lideres_zona' && user.assignedZone) {
    return actions.filter(a => a.zone === user.assignedZone);
  }
  if (user.role === 'tiendas_estaciones' && user.assignedUnitId) {
    return actions.filter(a => a.unitId === user.assignedUnitId);
  }
  return actions;
}

export function filterUnitsByRole(units: StoreUnit[], user: UserProfile): StoreUnit[] {
  if (user.role === 'responsable_portal' || user.role === 'direccion_general' || user.role === 'operaciones') {
    return units;
  }
  if (user.role === 'lideres_zona' && user.assignedZone) {
    return units.filter(u => u.zone === user.assignedZone);
  }
  if (user.role === 'tiendas_estaciones' && user.assignedUnitId) {
    return units.filter(u => u.id === user.assignedUnitId);
  }
  return units;
}

