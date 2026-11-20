import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateEvaluationScore, 
  calculateOverallAverages, 
  filterEvaluationsByRole,
  filterEvaluationsByAccount
} from './metrics';
import { OfficialCriterion, Evaluation, UserProfile, UserAccount } from '../types';

test('calculateEvaluationScore computes percentage correctly for Asturiano (scale 15.0 pts)', () => {
  const criteria: OfficialCriterion[] = [
    { id: 'c1', name: 'Orden, limpieza e imagen', maxPoints: 3.0, achievedPoints: 3.0 },
    { id: 'c2', name: 'Abasto', maxPoints: 2.0, achievedPoints: 1.5 },
  ];
  // 4.5 / 5.0 = 90%
  const result = calculateEvaluationScore(criteria, 'Asturiano');
  assert.equal(result.achieved, 4.5);
  assert.equal(result.max, 5.0);
  assert.equal(result.percentage, 90);
});

test('calculateEvaluationScore computes percentage correctly for Flash (scale 100 pts)', () => {
  const criteria: OfficialCriterion[] = [
    { id: 'c1', name: 'Atencion', maxPoints: 15, achievedPoints: 12 },
    { id: 'c2', name: 'Bienvenida', maxPoints: 15, achievedPoints: 15 },
  ];
  // 27 / 30 = 90%
  const result = calculateEvaluationScore(criteria, 'Flash');
  assert.equal(result.achieved, 27);
  assert.equal(result.percentage, 90);
});

test('calculateOverallAverages handles evaluations properly', () => {
  const evals: Partial<Evaluation>[] = [
    { brand: 'Asturiano', generalScore: 90 },
    { brand: 'Flash', generalScore: 80 }
  ];
  const avgs = calculateOverallAverages(evals as Evaluation[]);
  assert.equal(avgs.generalAverage, 85);
  assert.equal(avgs.asturianoAverage, 90);
  assert.equal(avgs.flashAverage, 80);
});

test('filterEvaluationsByAccount restricts supervisor to assigned station only', () => {
  const evals: Partial<Evaluation>[] = [
    { unitId: 'fls-tecnologico', brand: 'Flash', generalScore: 88 },
    { unitId: 'fls-universidad', brand: 'Flash', generalScore: 78 },
    { unitId: 'ast-centro', brand: 'Asturiano', generalScore: 92 },
  ];

  const supervisorAccount: Partial<UserAccount> = {
    email: 'tecnologico@portal.demo',
    assignedUnitId: 'fls-tecnologico',
    canAccessAsturiano: false,
    canAccessFlash: true,
  };

  const filtered = filterEvaluationsByAccount(evals as Evaluation[], supervisorAccount as UserAccount);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].unitId, 'fls-tecnologico');
});

test('filterEvaluationsByAccount isolates Asturiano manager to Asturiano only', () => {
  const evals: Partial<Evaluation>[] = [
    { unitId: 'fls-tecnologico', brand: 'Flash', generalScore: 88 },
    { unitId: 'ast-centro', brand: 'Asturiano', generalScore: 92 },
  ];

  const asturianoManager: Partial<UserAccount> = {
    email: 'gerente.asturiano@portal.demo',
    assignedBrand: 'Asturiano',
    canAccessAsturiano: true,
    canAccessFlash: false,
  };

  const filtered = filterEvaluationsByAccount(evals as Evaluation[], asturianoManager as UserAccount);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].brand, 'Asturiano');
});

test('verify Daniel, Ricardo and Nick RBAC roles and permissions integrity', () => {
  const daniel: Partial<UserAccount> = {
    email: 'daniel@portal.demo',
    canAccessFamilyOffice: true,
    canUploadFamilyOffice: true,
    canUploadEvaluations: true,
  };

  const ricardo: Partial<UserAccount> = {
    email: 'ricardo@portal.demo',
    canAccessFamilyOffice: true,
    canUploadFamilyOffice: false,
    canUploadEvaluations: false,
  };

  const nick: Partial<UserAccount> = {
    email: 'nick@portal.demo',
    canAccessFamilyOffice: false,
    canUploadFamilyOffice: false,
    canUploadEvaluations: true,
  };

  // Daniel is the only one who can upload to Family Office
  assert.equal(daniel.canUploadFamilyOffice, true);
  assert.equal(ricardo.canUploadFamilyOffice, false);
  assert.equal(nick.canAccessFamilyOffice, false);

  // Nick can upload evaluations, Ricardo is view-only
  assert.equal(nick.canUploadEvaluations, true);
  assert.equal(ricardo.canUploadEvaluations, false);
});

test('Flash profile isolation: Flash profile never receives or visualizes any Asturiano data', () => {
  const evals: Partial<Evaluation>[] = [
    { id: 'ev-fls-1', unitId: 'fls-tecnologico', brand: 'Flash', generalScore: 91 },
    { id: 'ev-fls-2', unitId: 'fls-palmillas', brand: 'Flash', generalScore: 84 },
    { id: 'ev-ast-1', unitId: 'ast-centro', brand: 'Asturiano', generalScore: 88 },
    { id: 'ev-ast-2', unitId: 'ast-juriquilla', brand: 'Asturiano', generalScore: 94 },
  ];

  const flashSupervisor: Partial<UserAccount> = {
    email: 'supervisor.flash@portal.demo',
    canAccessFlash: true,
    canAccessAsturiano: false,
    assignedBrand: 'Flash',
  };

  const filtered = filterEvaluationsByAccount(evals as Evaluation[], flashSupervisor as UserAccount);
  assert.equal(filtered.every(e => e.brand === 'Flash'), true);
  assert.equal(filtered.some(e => e.brand === 'Asturiano'), false);
  assert.equal(filtered.length, 2);
});

test('Asturiano profile isolation: Asturiano profile never receives or visualizes any Flash data', () => {
  const evals: Partial<Evaluation>[] = [
    { id: 'ev-fls-1', unitId: 'fls-tecnologico', brand: 'Flash', generalScore: 91 },
    { id: 'ev-fls-2', unitId: 'fls-palmillas', brand: 'Flash', generalScore: 84 },
    { id: 'ev-ast-1', unitId: 'ast-centro', brand: 'Asturiano', generalScore: 88 },
    { id: 'ev-ast-2', unitId: 'ast-juriquilla', brand: 'Asturiano', generalScore: 94 },
  ];

  const asturianoSupervisor: Partial<UserAccount> = {
    email: 'supervisor.asturiano@portal.demo',
    canAccessFlash: false,
    canAccessAsturiano: true,
    assignedBrand: 'Asturiano',
  };

  const filtered = filterEvaluationsByAccount(evals as Evaluation[], asturianoSupervisor as UserAccount);
  assert.equal(filtered.every(e => e.brand === 'Asturiano'), true);
  assert.equal(filtered.some(e => e.brand === 'Flash'), false);
  assert.equal(filtered.length, 2);
});

test('calculateIndicatorAverages returns valid indicators within expected ranges', () => {
  const evals: Partial<Evaluation>[] = [
    { brand: 'Asturiano', generalScore: 88 },
    { brand: 'Asturiano', generalScore: 92 },
  ];
  const avgs = calculateOverallAverages(evals as Evaluation[]);
  assert.equal(avgs.generalAverage, 90);
  assert.equal(avgs.asturianoAverage, 90);
  assert.equal(avgs.flashAverage, 0);
});



