import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Evaluation, 
  StoreUnit, 
  FollowUpAction, 
  EvidenceDocument, 
  UserProfile, 
  Brand, 
  ExecutiveNote,
  ActionStatus,
  UserAccount,
  ConfidentialDoc,
  AccessLog
} from '../types';
import { 
  INITIAL_EVALUATIONS, 
  INITIAL_UNITS, 
  INITIAL_ACTIONS, 
  INITIAL_DOCUMENTS, 
  AVAILABLE_PROFILES,
  EXECUTIVE_NOTES,
  USER_ACCOUNTS,
  FLASH_STATIONS,
  INITIAL_CONFIDENTIAL_DOCS,
  INITIAL_ACCESS_LOGS
} from '../data/seedData';
import { 
  filterEvaluationsByAccount,
  filterActionsByAccount,
  filterUnitsByAccount,
  filterEvaluationsByRole, 
  filterActionsByRole, 
  filterUnitsByRole 
} from '../utils/metrics';

interface AppContextType {
  evaluations: Evaluation[];
  units: StoreUnit[];
  actions: FollowUpAction[];
  documents: EvidenceDocument[];
  notes: ExecutiveNote[];
  currentUser: UserProfile;
  currentAccount: UserAccount | null;
  availableProfiles: UserProfile[];
  availableAccounts: UserAccount[];
  brandFilter: 'Todas' | Brand;
  activeTab: string;
  currentZone: 'inicio' | 'asturiano' | 'flash' | 'family_office';
  currentSubTab: string;
  selectedUnitId: string | null;
  selectedEvaluationForDetail: Evaluation | null;
  filteredEvaluations: Evaluation[];
  filteredUnits: StoreUnit[];
  filteredActions: FollowUpAction[];
  flashStations: StoreUnit[];
  confidentialDocs: ConfidentialDoc[];
  accessLogs: AccessLog[];
  accounts: UserAccount[];
  isAsturianoOnly: boolean;
  isFlashOnly: boolean;
  isMultiBrand: boolean;
  addAccount: (account: UserAccount) => void;
  switchAccount: (account: UserAccount) => void;
  setCurrentUser: (profile: UserProfile) => void;
  setCurrentAccount: (account: UserAccount | null) => void;
  login: (account: UserAccount) => void;
  logout: () => void;
  setBrandFilter: (brand: 'Todas' | Brand) => void;
  setActiveTab: (tab: string) => void;
  setCurrentZone: (zone: 'inicio' | 'asturiano' | 'flash' | 'family_office') => void;
  setCurrentSubTab: (subTab: string) => void;
  setSelectedUnitId: (id: string | null) => void;
  setSelectedEvaluationForDetail: (ev: Evaluation | null) => void;
  addEvaluation: (
    evaluation: Omit<Evaluation, 'id' | 'followUpActionsCount' | 'hasPendingActions'>, 
    newActions?: Array<Omit<FollowUpAction, 'id' | 'evaluationId' | 'createdAt'>>
  ) => void;
  addEvaluationsBatch: (newEvals: Evaluation[]) => void;
  updateActionStatus: (
    actionId: string, 
    status: ActionStatus, 
    closeDate?: string, 
    postReviewComments?: string, 
    solutionEvidenceUrl?: string
  ) => void;
  addAction: (action: Omit<FollowUpAction, 'id' | 'createdAt'>) => void;
  addDocument: (doc: Omit<EvidenceDocument, 'id'>) => void;
  addExecutiveNote: (note: Omit<ExecutiveNote, 'id' | 'date'>) => void;
  updateStationTarget: (stationId: string, newTarget: number) => void;
  addStationVisit: (stationId: string) => void;
  updateUnit: (unitId: string, updates: Partial<StoreUnit>) => void;
  addUnit: (unit: StoreUnit) => void;
  updateEvaluation: (evalId: string, updates: Partial<Evaluation>) => void;
  deleteEvaluation: (evalId: string) => void;
  addConfidentialDoc: (doc: Omit<ConfidentialDoc, 'id' | 'uploadedAt'>) => void;
  addAccessLog: (log: Omit<AccessLog, 'id' | 'timestamp'>) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  evaluations: 'percportal_evaluations_v4',
  actions: 'percportal_actions_v4',
  documents: 'percportal_documents_v4',
  notes: 'percportal_notes_v4',
  units: 'percportal_units_v4',
  account: 'percportal_account_v4',
  accounts: 'percportal_accounts_v4',
  stations: 'percportal_stations_v4',
  fdocs: 'percportal_fdocs_v4',
  logs: 'percportal_logs_v4',
  zone: 'percportal_zone_v4',
  subtab: 'percportal_subtab_v4',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.accounts);
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        const emails = new Set(parsed.map(a => a.email.toLowerCase()));
        const missing = USER_ACCOUNTS.filter(a => !emails.has(a.email.toLowerCase()));
        return [...parsed, ...missing];
      } catch (e) {
        // ignore
      }
    }
    return USER_ACCOUNTS;
  });

  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.account);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = USER_ACCOUNTS.find(a => a.email.toLowerCase() === parsed.email.toLowerCase());
        if (match) return match;
      } catch (e) {
        // ignore
      }
    }
    // Default to Nick (Responsable del Portal)
    return USER_ACCOUNTS[0];
  });

  const [currentZone, setCurrentZone] = useState<'inicio' | 'asturiano' | 'flash' | 'family_office'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.zone);
    if (saved && ['inicio', 'asturiano', 'flash', 'family_office'].includes(saved)) {
      return saved as any;
    }
    return 'inicio';
  });

  const [currentSubTab, setCurrentSubTab] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.subtab);
    if (!saved || saved === 'acciones') return 'panel';
    return saved;
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.evaluations);
    return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
  });

  const [units, setUnits] = useState<StoreUnit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.units);
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [flashStations, setFlashStations] = useState<StoreUnit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.stations);
    return saved ? JSON.parse(saved) : FLASH_STATIONS;
  });

  const [actions, setActions] = useState<FollowUpAction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.actions);
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [documents, setDocuments] = useState<EvidenceDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.documents);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notes, setNotes] = useState<ExecutiveNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notes);
    return saved ? JSON.parse(saved) : EXECUTIVE_NOTES;
  });

  const [confidentialDocs, setConfidentialDocs] = useState<ConfidentialDoc[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.fdocs);
    return saved ? JSON.parse(saved) : INITIAL_CONFIDENTIAL_DOCS;
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.logs);
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_LOGS;
  });

  const [brandFilter, setBrandFilter] = useState<'Todas' | Brand>('Todas');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedEvaluationForDetail, setSelectedEvaluationForDetail] = useState<Evaluation | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem(STORAGE_KEYS.account, JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem(STORAGE_KEYS.account);
    }
  }, [currentAccount]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.zone, currentZone);
  }, [currentZone]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.subtab, currentSubTab);
  }, [currentSubTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.evaluations, JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.units, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.stations, JSON.stringify(flashStations));
  }, [flashStations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.fdocs, JSON.stringify(confidentialDocs));
  }, [confidentialDocs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(accessLogs));
  }, [accessLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
  }, [accounts]);

  // Derived legacy currentUser for backward compatibility
  const currentUser: UserProfile = {
    id: currentAccount?.email || 'nick@portal.demo',
    name: currentAccount?.name || 'Usuario',
    email: currentAccount?.email || 'demo@portal.demo',
    role: (currentAccount?.role === 'responsable_portal' || currentAccount?.role === 'responsable_portal_docs')
      ? 'responsable_portal' 
      : currentAccount?.role === 'direccion_general' 
      ? 'direccion_general' 
      : 'tiendas_estaciones',
    roleLabel: currentAccount?.roleLabel || 'Usuario',
    canUploadData: currentAccount?.canUploadEvaluations || false,
    canEditActions: currentAccount?.canEditActions || false,
    assignedUnitId: currentAccount?.assignedUnitId,
  };

  // Brand scope flags
  const isAsturianoOnly = Boolean(currentAccount?.canAccessAsturiano && !currentAccount?.canAccessFlash);
  const isFlashOnly = Boolean(!currentAccount?.canAccessAsturiano && currentAccount?.canAccessFlash);
  const isMultiBrand = Boolean(currentAccount?.canAccessAsturiano && currentAccount?.canAccessFlash);

  // Auto redirect if account lacks permission for currentZone and keep brandFilter isolated
  useEffect(() => {
    if (currentAccount) {
      if (isAsturianoOnly) {
        if (currentZone === 'flash' || currentZone === 'family_office') {
          setCurrentZone('asturiano');
          setCurrentSubTab('panel');
        }
        if (brandFilter !== 'Asturiano') {
          setBrandFilter('Asturiano');
        }
      } else if (isFlashOnly) {
        if (currentZone === 'asturiano' || currentZone === 'family_office') {
          setCurrentZone('flash');
          setCurrentSubTab('panel');
        }
        if (brandFilter !== 'Flash') {
          setBrandFilter('Flash');
        }
      }
    }
  }, [currentAccount, currentZone, isAsturianoOnly, isFlashOnly, brandFilter]);

  const login = (account: UserAccount) => {
    setCurrentAccount(account);
    if (account.canAccessAsturiano && !account.canAccessFlash) {
      setCurrentZone('asturiano');
      setCurrentSubTab('panel');
      setBrandFilter('Asturiano');
    } else if (!account.canAccessAsturiano && account.canAccessFlash) {
      setCurrentZone('flash');
      setCurrentSubTab('panel');
      setBrandFilter('Flash');
    } else {
      setCurrentZone('inicio');
      setBrandFilter('Todas');
    }
  };

  const logout = () => {
    setCurrentAccount(null);
    localStorage.removeItem(STORAGE_KEYS.account);
  };

  const handleSetCurrentZone = (zone: 'inicio' | 'asturiano' | 'flash' | 'family_office') => {
    if (isAsturianoOnly && (zone === 'flash' || zone === 'family_office')) {
      setCurrentZone('asturiano');
      return;
    }
    if (isFlashOnly && (zone === 'asturiano' || zone === 'family_office')) {
      setCurrentZone('flash');
      return;
    }
    setCurrentZone(zone);
  };

  const addAccount = (newAcc: UserAccount) => {
    setAccounts(prev => {
      const filtered = prev.filter(a => a.email.toLowerCase() !== newAcc.email.toLowerCase());
      const updated = [newAcc, ...filtered];
      return updated;
    });
  };

  const switchAccount = (account: UserAccount) => {
    login(account);
  };

  // Filter evaluations and units according to account and current zone
  const accountEvaluations = currentAccount 
    ? filterEvaluationsByAccount(evaluations, currentAccount)
    : evaluations;

  const filteredEvaluations = isAsturianoOnly
    ? accountEvaluations.filter(e => e.brand === 'Asturiano')
    : isFlashOnly
    ? accountEvaluations.filter(e => e.brand === 'Flash')
    : currentZone === 'asturiano'
    ? accountEvaluations.filter(e => e.brand === 'Asturiano')
    : currentZone === 'flash'
    ? accountEvaluations.filter(e => e.brand === 'Flash')
    : brandFilter === 'Todas'
    ? accountEvaluations
    : accountEvaluations.filter(e => e.brand === brandFilter);

  const accountUnits = currentAccount 
    ? filterUnitsByAccount(units, currentAccount)
    : units;

  const filteredUnits = isAsturianoOnly
    ? accountUnits.filter(u => u.brand === 'Asturiano')
    : isFlashOnly
    ? accountUnits.filter(u => u.brand === 'Flash')
    : currentZone === 'asturiano'
    ? accountUnits.filter(u => u.brand === 'Asturiano')
    : currentZone === 'flash'
    ? accountUnits.filter(u => u.brand === 'Flash')
    : brandFilter === 'Todas'
    ? accountUnits
    : accountUnits.filter(u => u.brand === brandFilter);

  const accountActions = currentAccount
    ? filterActionsByAccount(actions, currentAccount)
    : actions;

  const filteredActions = isAsturianoOnly
    ? accountActions.filter(a => a.brand === 'Asturiano')
    : isFlashOnly
    ? accountActions.filter(a => a.brand === 'Flash')
    : currentZone === 'asturiano'
    ? accountActions.filter(a => a.brand === 'Asturiano')
    : currentZone === 'flash'
    ? accountActions.filter(a => a.brand === 'Flash')
    : brandFilter === 'Todas'
    ? accountActions
    : accountActions.filter(a => a.brand === brandFilter);

  const addEvaluation = (
    evalData: Omit<Evaluation, 'id' | 'followUpActionsCount' | 'hasPendingActions'>,
    newActions?: Array<Omit<FollowUpAction, 'id' | 'evaluationId' | 'createdAt'>>
  ) => {
    const newEvalId = `eval-${Date.now()}`;
    const createdActions: FollowUpAction[] = [];

    if (newActions && newActions.length > 0) {
      newActions.forEach((act, idx) => {
        createdActions.push({
          ...act,
          id: `act-${Date.now()}-${idx}`,
          evaluationId: newEvalId,
          createdAt: new Date().toISOString().split('T')[0],
        });
      });
      setActions(prev => [...createdActions, ...prev]);
    }

    const completedEval: Evaluation = {
      ...evalData,
      id: newEvalId,
      followUpActionsCount: createdActions.length,
      hasPendingActions: createdActions.some(a => a.status !== 'concluido'),
    };

    setEvaluations(prev => [completedEval, ...prev]);

    // Also update flash stations visit count if Flash
    if (evalData.brand === 'Flash') {
      setFlashStations(prev => prev.map(st => {
        if (st.id === evalData.unitId || st.name.toLowerCase() === evalData.unitName.toLowerCase()) {
          return { ...st, visitsCount: (st.visitsCount || 0) + 1 };
        }
        return st;
      }));
    }
  };

  const addEvaluationsBatch = (newEvals: Evaluation[]) => {
    setEvaluations(prev => [...newEvals, ...prev]);
    // update station visit counts
    newEvals.forEach(ev => {
      if (ev.brand === 'Flash') {
        setFlashStations(prev => prev.map(st => {
          if (st.id === ev.unitId || st.name.toLowerCase() === ev.unitName.toLowerCase()) {
            return { ...st, visitsCount: (st.visitsCount || 0) + 1 };
          }
          return st;
        }));
      }
    });
  };

  const updateStationTarget = (stationId: string, newTarget: number) => {
    setFlashStations(prev => prev.map(st => {
      if (st.id === stationId) {
        return { ...st, visitTarget: newTarget };
      }
      return st;
    }));
  };

  const addStationVisit = (stationId: string) => {
    setFlashStations(prev => prev.map(st => {
      if (st.id === stationId) {
        return { ...st, visitsCount: (st.visitsCount || 0) + 1 };
      }
      return st;
    }));
    setUnits(prev => prev.map(u => {
      if (u.id === stationId) {
        return { ...u, visitsCount: (u.visitsCount || 0) + 1 };
      }
      return u;
    }));
  };

  const updateUnit = (unitId: string, updates: Partial<StoreUnit>) => {
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, ...updates } : u));
    setFlashStations(prev => prev.map(st => st.id === unitId ? { ...st, ...updates } : st));
    if (updates.name || updates.zone) {
      setEvaluations(prev => prev.map(ev => {
        if (ev.unitId === unitId) {
          return {
            ...ev,
            unitName: updates.name || ev.unitName,
            zone: updates.zone || ev.zone,
          };
        }
        return ev;
      }));
    }
  };

  const addUnit = (newUnit: StoreUnit) => {
    setUnits(prev => [newUnit, ...prev]);
    if (newUnit.brand === 'Flash') {
      setFlashStations(prev => [newUnit, ...prev]);
    }
  };

  const updateEvaluation = (evalId: string, updates: Partial<Evaluation>) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id === evalId) {
        return { ...ev, ...updates };
      }
      return ev;
    }));
  };

  const deleteEvaluation = (evalId: string) => {
    setEvaluations(prev => prev.filter(ev => ev.id !== evalId));
  };

  const addConfidentialDoc = (docData: Omit<ConfidentialDoc, 'id' | 'uploadedAt'>) => {
    const newDocId = `fdoc-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDoc: ConfidentialDoc = {
      ...docData,
      id: newDocId,
      uploadedAt: now,
    };
    setConfidentialDocs(prev => [newDoc, ...prev]);

    // Auto-record upload log
    if (currentAccount) {
      addAccessLog({
        docId: newDocId,
        docTitle: docData.title,
        userName: currentAccount.name,
        userEmail: currentAccount.email,
        action: 'Subida',
      });
    }
  };

  const addAccessLog = (logData: Omit<AccessLog, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog: AccessLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: now,
    };
    setAccessLogs(prev => [newLog, ...prev]);
  };

  const updateActionStatus = (
    actionId: string, 
    status: ActionStatus, 
    closeDate?: string, 
    postReviewComments?: string, 
    solutionEvidenceUrl?: string
  ) => {
    setActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          status,
          closeDate: status === 'concluido' ? (closeDate || new Date().toISOString().split('T')[0]) : undefined,
          postReviewComments: postReviewComments !== undefined ? postReviewComments : a.postReviewComments,
          solutionEvidenceUrl: solutionEvidenceUrl !== undefined ? solutionEvidenceUrl : a.solutionEvidenceUrl,
        };
      }
      return a;
    }));

    setEvaluations(prev => prev.map(ev => {
      const relatedActions = actions.filter(a => a.evaluationId === ev.id);
      const isPending = relatedActions.some(a => a.id === actionId ? status !== 'concluido' : a.status !== 'concluido');
      return {
        ...ev,
        hasPendingActions: isPending,
      };
    }));
  };

  const addAction = (actionData: Omit<FollowUpAction, 'id' | 'createdAt'>) => {
    const newAction: FollowUpAction = {
      ...actionData,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setActions(prev => [newAction, ...prev]);
  };

  const addDocument = (docData: Omit<EvidenceDocument, 'id'>) => {
    const newDoc: EvidenceDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const addExecutiveNote = (noteData: Omit<ExecutiveNote, 'id' | 'date'>) => {
    const newNote: ExecutiveNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setEvaluations(INITIAL_EVALUATIONS);
    setUnits(INITIAL_UNITS);
    setFlashStations(FLASH_STATIONS);
    setActions(INITIAL_ACTIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotes(EXECUTIVE_NOTES);
    setConfidentialDocs(INITIAL_CONFIDENTIAL_DOCS);
    setAccessLogs(INITIAL_ACCESS_LOGS);
    setCurrentAccount(USER_ACCOUNTS[0]);
    setCurrentZone('inicio');
    setCurrentSubTab('panel');
    setSelectedUnitId(null);
    setSelectedEvaluationForDetail(null);
  };

  return (
    <AppContext.Provider
      value={{
        evaluations,
        units,
        actions,
        documents,
        notes,
        currentUser,
        currentAccount,
        availableProfiles: AVAILABLE_PROFILES,
        availableAccounts: USER_ACCOUNTS,
        brandFilter,
        activeTab,
        currentZone,
        currentSubTab,
        selectedUnitId,
        selectedEvaluationForDetail,
        filteredEvaluations,
        filteredUnits,
        filteredActions,
        flashStations: isAsturianoOnly ? [] : flashStations,
        confidentialDocs,
        accessLogs,
        accounts,
        isAsturianoOnly,
        isFlashOnly,
        isMultiBrand,
        addAccount,
        switchAccount,
        setCurrentUser: (profile) => {
          const match = accounts.find(a => a.email === profile.id || a.name === profile.name);
          if (match) setCurrentAccount(match);
        },
        setCurrentAccount,
        login,
        logout,
        setBrandFilter,
        setActiveTab,
        setCurrentZone: handleSetCurrentZone,
        setCurrentSubTab,
        setSelectedUnitId,
        setSelectedEvaluationForDetail,
        addEvaluation,
        addEvaluationsBatch,
        updateActionStatus,
        addAction,
        addDocument,
        addExecutiveNote,
        updateStationTarget,
        addStationVisit,
        updateUnit,
        addUnit,
        updateEvaluation,
        deleteEvaluation,
        addConfidentialDoc,
        addAccessLog,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
