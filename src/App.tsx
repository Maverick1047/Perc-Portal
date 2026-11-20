import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginScreen } from './components/LoginScreen';
import { AnimatedHome } from './components/AnimatedHome';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { CriteriaBreakdownView } from './components/CriteriaBreakdownView';
import { BrandAnnualHistoryView } from './components/BrandAnnualHistoryView';
import { FlashProportionView } from './components/FlashProportionView';
import { ExcelImportView } from './components/ExcelImportView';
import { FamilyOfficeView } from './components/FamilyOfficeView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { EvaluationFormModal } from './components/EvaluationFormModal';
import { VisitDetailModal } from './components/VisitDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Evaluation, StoreUnit } from './types';

const MainLayout: React.FC = () => {
  const {
    currentAccount,
    currentZone,
    currentSubTab,
    setCurrentZone,
    setCurrentSubTab,
    login,
    logout,
    filteredUnits,
    selectedUnitId,
    setSelectedUnitId,
    selectedEvaluationForDetail,
    setSelectedEvaluationForDetail,
    flashStations,
    updateStationTarget,
    addStationVisit,
    confidentialDocs,
    accessLogs,
    addConfidentialDoc,
    addAccessLog,
    addEvaluationsBatch,
    isAsturianoOnly,
    isFlashOnly,
  } = useApp();

  const [isNewEvalModalOpen, setIsNewEvalModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // If not logged in, render the login screen
  if (!currentAccount) {
    return <LoginScreen onLogin={login} />;
  }

  const handleSelectUnit = (unitIdOrUnit: string | StoreUnit) => {
    const id = typeof unitIdOrUnit === 'string' ? unitIdOrUnit : unitIdOrUnit.id;
    setSelectedUnitId(id);
    setCurrentSubTab('visitas');
  };

  const handleOpenVisitDetail = (ev: Evaluation) => {
    setSelectedEvaluationForDetail(ev);
  };

  // Outer container styling based on currentZone:
  // Inicio & Family Office: Blanco, negro y dorado
  // Asturiano: Rojo, blanco, amarillo y azul
  // Flash: Naranja y amarillo
  const getMainBackground = () => {
    switch (currentZone) {
      case 'asturiano':
        return 'bg-slate-100/90 text-slate-900 selection:bg-red-600 selection:text-white';
      case 'flash':
        return 'bg-amber-50/70 text-slate-900 selection:bg-orange-500 selection:text-white';
      case 'family_office':
        return 'bg-neutral-950 text-slate-100 selection:bg-amber-400 selection:text-black';
      case 'inicio':
      default:
        return 'bg-neutral-950 text-white selection:bg-amber-400 selection:text-black';
    }
  };

  return (
    <div className={`min-h-screen flex ${getMainBackground()} font-sans antialiased transition-colors duration-300`}>
      
      {/* Dynamic Themed Sidebar */}
      <Sidebar
        account={currentAccount}
        currentZone={currentZone}
        currentSubTab={currentSubTab}
        onSelectZone={(zone, subTab) => {
          setCurrentZone(zone);
          if (subTab) setCurrentSubTab(subTab);
        }}
        onSelectSubTab={(subTab) => setCurrentSubTab(subTab)}
        onLogout={logout}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Topbar with breadcrumb, store search & date */}
        <Topbar
          account={currentAccount}
          currentZone={currentZone}
          currentSubTab={currentSubTab}
          accessibleUnits={filteredUnits}
          onSelectUnit={(unit) => handleSelectUnit(unit)}
          onOpenNewEval={() => setIsNewEvalModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* ZONE 1: INICIO (Animated PERC Emblem & interactive menu) */}
          {currentZone === 'inicio' && (
            <AnimatedHome
              account={currentAccount}
              onNavigate={({ section, tab }) => {
                setCurrentZone(section);
                if (tab) setCurrentSubTab(tab);
              }}
            />
          )}

          {/* ZONE 2: TIENDAS ASTURIANO */}
          {currentZone === 'asturiano' && currentAccount.canAccessAsturiano && (
            <div className="space-y-6">
              {currentSubTab === 'panel' && (
                <DashboardView
                  onSelectUnit={handleSelectUnit}
                  onOpenNewEval={() => setIsNewEvalModalOpen(true)}
                  onOpenVisitDetail={handleOpenVisitDetail}
                />
              )}

              {currentSubTab === 'visitas' && (
                <HistoryView
                  initialUnitId={selectedUnitId}
                  onOpenNewEval={() => setIsNewEvalModalOpen(true)}
                  onOpenVisitDetail={handleOpenVisitDetail}
                />
              )}

              {currentSubTab === 'criterios' && (
                <CriteriaBreakdownView brand="Asturiano" />
              )}

              {currentSubTab === 'historico' && currentAccount.canViewAnnualHistory && (
                <BrandAnnualHistoryView brand="Asturiano" />
              )}

              {currentSubTab === 'importar' && currentAccount.canImportExcel && (
                <ExcelImportView
                  brand="Asturiano"
                  account={currentAccount}
                  onImportEvaluations={addEvaluationsBatch}
                />
              )}
            </div>
          )}

          {/* ZONE 3: ESTACIONES FLASH */}
          {currentZone === 'flash' && currentAccount.canAccessFlash && (
            <div className="space-y-6">
              {currentSubTab === 'panel' && (
                <DashboardView
                  onSelectUnit={handleSelectUnit}
                  onOpenNewEval={() => setIsNewEvalModalOpen(true)}
                  onOpenVisitDetail={handleOpenVisitDetail}
                />
              )}

              {currentSubTab === 'visitas' && (
                <HistoryView
                  initialUnitId={selectedUnitId}
                  onOpenNewEval={() => setIsNewEvalModalOpen(true)}
                  onOpenVisitDetail={handleOpenVisitDetail}
                />
              )}

              {currentSubTab === 'proporcion' && (
                <FlashProportionView
                  stations={flashStations}
                  account={currentAccount}
                  onUpdateStationTarget={updateStationTarget}
                  onAddStationVisit={addStationVisit}
                  onSelectStation={(stId) => {
                    setSelectedUnitId(stId);
                    setCurrentSubTab('visitas');
                  }}
                />
              )}

              {currentSubTab === 'criterios' && (
                <CriteriaBreakdownView brand="Flash" />
              )}

              {currentSubTab === 'historico' && currentAccount.canViewAnnualHistory && (
                <BrandAnnualHistoryView brand="Flash" />
              )}

              {currentSubTab === 'importar' && currentAccount.canImportExcel && (
                <ExcelImportView
                  brand="Flash"
                  account={currentAccount}
                  onImportEvaluations={addEvaluationsBatch}
                />
              )}
            </div>
          )}

          {/* ZONE 4: FAMILY OFFICE (Documentos Confidenciales & Bitácora) */}
          {currentZone === 'family_office' && currentAccount.canAccessFamilyOffice && (
            <FamilyOfficeView
              account={currentAccount}
              activeSubTab={currentSubTab}
              docs={confidentialDocs}
              accessLogs={accessLogs}
              onUploadDoc={addConfidentialDoc}
              onRecordAccessLog={addAccessLog}
            />
          )}

        </main>

        {/* Global Footer */}
        <footer className={`py-4 px-6 border-t text-xs transition-colors duration-300 ${
          currentZone === 'inicio' || currentZone === 'family_office'
            ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
            : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-white tracking-wide font-unbounded">
                PercPortal
              </strong>
              <span>•</span>
              <span>
                {isFlashOnly || currentAccount.assignedBrand === 'Flash'
                  ? 'Grupo PERC • Red Estaciones Flash'
                  : isAsturianoOnly || currentAccount.assignedBrand === 'Asturiano'
                  ? 'Grupo PERC • Red Tiendas Asturiano'
                  : 'Grupo PERC • Tiendas Asturiano, Estaciones Flash & Family Office'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Sesión: <strong className="text-amber-400">{currentAccount.name}</strong></span>
              <span>•</span>
              <span className="font-medium">{currentAccount.title || currentAccount.roleLabel}</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      <EvaluationFormModal
        isOpen={isNewEvalModalOpen}
        onClose={() => setIsNewEvalModalOpen(false)}
      />

      <VisitDetailModal
        evaluation={selectedEvaluationForDetail}
        onClose={() => setSelectedEvaluationForDetail(null)}
        brandFilter={currentZone === 'asturiano' ? 'Asturiano' : currentZone === 'flash' ? 'Flash' : 'Todas'}
      />

      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
