import React, { useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useVisibility } from "../providers/VisibilityProvider";
import { ReportsPage, CreateReportPage, ViewReportPage } from "./pages";
import { Rapport } from "./objects/rapports";
import { getServiceConfig } from "../config/services";
import type { ServiceKey } from "../config/services";
import {
  IconHome,
  IconRadio,
  IconUser,
  IconCar,
  IconFolder,
  IconFileText,
  IconGavel,
  IconScale,
  IconUsers,
  IconMessage,
  IconLogs,
  IconStethoscope,
  IconCalendarEvent
} from "@tabler/icons-react"; 

const STORAGE_KEY = "mdt_reports_temp";
const DELETED_KEY = "mdt_reports_deleted";

const MainApp: React.FC = () => {
  const { visible, setVisible } = useVisibility();

  // État pour le métier et grade (simulé pour tests; à remplacer par données serveur)
  const [currentJob, setCurrentJob] = useState<string>('lspd');
  const [currentGrade, setCurrentGrade] = useState<number>(4);

  // Icônes pour chaque élément de navigation
  const navigationIcons: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
    'Accueil': IconHome,
    'Dispatch': IconRadio,
    'Profile': IconUser,
    'Véhicule': IconCar,
    'Dossiers': IconFolder,
    'Rapports': IconFileText,
    'Rapport': IconFileText,
    'Mandats': IconGavel,
    'Peines': IconScale,
    'Employées': IconUsers,
    'Chat': IconMessage,
    'Logs': IconLogs,
    'Maladies': IconStethoscope,
    'Evènements': IconCalendarEvent
  };

  // Fonction qui retourne les éléments de navigation selon le métier
  const getNavigationItems = (job: string) => {
    const menus: { [key: string]: string[] } = {
      lspd: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Rapports', 'Mandats', 'Peines', 'Employées', 'Chat', 'Logs'],
      lsdph: ['Accueil', 'Dispatch', 'Dossiers', 'Rapport', 'Maladies', 'Employées', 'Chat', 'Logs'],
      fib: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Rapports', 'Mandats', 'Peines', 'Employées', 'Chat', 'Logs'],
      mairie: ['Accueil', 'Profile', 'Véhicule', 'Mandats', 'Peines', 'Employées', 'Chat', 'Logs'],
      lsfd: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Rapports', 'Mandats', 'Evènements', 'Employées', 'Chat', 'Logs'],
      doj: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Rapports', 'Mandats', 'Peines', 'Employées', 'Chat', 'Logs']
    };

    return menus[job] || []; // Retourne un tableau vide si le métier n'existe pas
  };

  // État pour l'élément actif (optionnel)
  const [activeItem, setActiveItem] = useState<string>('Accueil');

  // État pour la page actuelle
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'reports' | 'create-report' | 'view-report'>('dashboard');

  // État pour le rapport sélectionné
  const [selectedReport, setSelectedReport] = useState<Rapport | null>(null);
  const [editingReport, setEditingReport] = useState<Rapport | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock: récupérer job/grade (à remplacer par fetchNui quand dispo)
  useEffect(() => {
    setCurrentJob('lspd');
    setCurrentGrade(4); // grade 4 ou 5 autorise delete
  }, []);

  // Charger les rapports persistés côté serveur dans le cache local
  useEffect(() => {
    const loadPersisted = async () => {
      try {
        const resp = await fetchNui<{ success: boolean; reports: any[] }>("loadReports", {}, { success: true, reports: [] });
        if (resp?.success && Array.isArray(resp.reports)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resp.reports));
          setRefreshKey((prev) => prev + 1);
        }
      } catch (e) {
        console.error("Impossible de charger les rapports persistés", e);
      }
    };
    loadPersisted();
  }, []);

  const handleMenuClick = (item: string) => {
    setActiveItem(item);

    if (item === 'Rapports') {
      setCurrentPage('reports');
    } else {
      setCurrentPage('dashboard');
    }

    // Ici vous pourrez ajouter la logique de navigation plus tard
    console.log(`Navigation vers: ${item}`);
  };

  // Simple matrice de permissions par action (à affiner par job si besoin)
  const canPerform = (action: 'create' | 'edit' | 'delete') => {
    if (action === 'delete') return currentGrade >= 4;
    if (action === 'edit') return currentGrade >= 2;
    return currentGrade >= 1; // create
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleBackToReports = () => {
    setCurrentPage('reports');
  };

  const handleCreateReport = () => {
    if (!canPerform('create')) return;
    setCurrentPage('create-report');
  };

  const handleViewReport = (report: Rapport) => {
    setSelectedReport(report);
    setCurrentPage('view-report');
  };

  const handleEditReport = (report: Rapport) => {
    if (!canPerform('edit')) return;
    setEditingReport(report);
    setCurrentPage('create-report');
  };

  const handleDeleteReport = (reportId: number) => {
    if (!canPerform('delete')) return;
    // Supprimer du localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const tempReports = JSON.parse(stored);
      const filtered = tempReports.filter((r: any) => r.id !== reportId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    // Supprimer côté serveur persistant (non bloquant)
    fetchNui("deleteReport", { id: reportId }, { success: true }).catch((e) => {
      console.error("Erreur delete serveur", e);
    });

    // Marquer comme supprimé (y compris les rapports du jeu de base)
    const deletedRaw = localStorage.getItem(DELETED_KEY);
    const deletedIds: number[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(reportId)) {
      deletedIds.push(reportId);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
    }

    setRefreshKey(prev => prev + 1);
    setCurrentPage('reports');
  };

  const handleSaveReport = async (reportData: any) => {
    let persistedId = reportData.id;
    // Ne pas bloquer l'UI : on lance la persistance serveur, on continue avec l'ID reçu si dispo
    try {
      const resp = await fetchNui<{ success: boolean; reportId?: number }>("saveReport", { report: reportData }, { success: true, reportId: reportData.id });
      if (resp?.success && resp.reportId) {
        persistedId = resp.reportId;
      }
    } catch (e) {
      console.error("Erreur save serveur", e);
    }

    const tagsOnly = Array.from(new Set([...(reportData.tags || [])].filter(Boolean)));
    // Sauvegarder dans le localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const tempReports = stored ? JSON.parse(stored) : [];
    
    if (reportData.id) {
      // Mise à jour d'un rapport existant
      const index = tempReports.findIndex((r: any) => r.id === reportData.id);
      if (index !== -1) {
        tempReports[index] = {
          ...tempReports[index],
          title: reportData.title,
          description: reportData.description,
          tags: tagsOnly,
          type: reportData.type || tempReports[index].type || tempReports[index].tags?.[0] || "Type non défini",
          listImg: reportData.gallery,
          officersInvolved: reportData.officers,
          civiliansInvolved: reportData.civilians,
          criminalsInvolved: reportData.suspects,
          job: reportData.job,
          timestamp: tempReports[index].timestamp || Date.now()
        };
      }
    } else {
      // Nouveau rapport
      const newReport = {
        id: persistedId || Date.now(),
        title: reportData.title,
        description: reportData.description,
        tags: tagsOnly,
        type: reportData.type || "Type non défini",
        listImg: reportData.gallery,
        vehiculesInvolved: [],
        officersInvolved: reportData.officers,
        civiliansInvolved: reportData.civilians,
        criminalsInvolved: reportData.suspects,
        job: reportData.job,
        timestamp: Date.now()
      };
      tempReports.push(newReport);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tempReports));
    setEditingReport(null);
    setRefreshKey(prev => prev + 1);
    setCurrentPage('reports');
  };

  // Fonction pour obtenir le nom du service selon le métier
  const getServiceName = (job: string) => {
    const serviceNames: { [key: string]: string } = {
      lspd: 'Los Santos Police Department',
      lsdph: 'Los Santos Department of Public Health',
      fib: 'Federal Investigation Bureau',
      mairie: 'Mairie de Los Santos',
      lsfd: 'Los Santos Fire Department',
      doj: 'Department of Justice'
    };
    return serviceNames[job] || 'Service inconnu';
  };

  // Composant de la banderole
  const HeaderBanner = () => {
    const serviceConfig = getServiceConfig(currentJob as ServiceKey);
    const serviceLogo = serviceConfig?.logo;

    return (
      <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center border-b border-gray-300 shadow-sm">
        {/* Nom du service à gauche */}
        <div className="flex items-center gap-3">
          {serviceLogo ? (
            <img 
              src={serviceLogo} 
              alt={getServiceName(currentJob)}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                // Fallback en cas d'erreur de chargement
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <IconRadio size={24} className={serviceLogo ? "hidden text-blue-600" : "text-blue-600"} />
          <h1 className="text-xl font-bold text-gray-800">{getServiceName(currentJob)}</h1>
        </div>

        {/* Profil utilisateur à droite */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-800">Agent John Doe</div>
            <div className="text-xs text-gray-600">Badge #12345</div>
          </div>
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
            <IconUser size={20} className="text-white" />
          </div>
        </div>
      </div>
    );
  };

  // Composants de widgets pour le dashboard
  const RecentReports = () => (
    <div className="bg-white border border-gray-300 rounded p-4 min-h-full flex flex-col">
      <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
        <IconFileText size={20} className="text-gray-600" />
        Rapports récents
      </h3>
      <div className="flex-1 space-y-2">
        {/* Liste à remplir plus tard */}
      </div>
    </div>
  );

  const RecentWarrants = () => (
    <div className="bg-white border border-gray-300 rounded p-4 min-h-full flex flex-col">
      <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
        <IconGavel size={20} className="text-gray-600" />
        Mandats récents
      </h3>
      <div className="flex-1 space-y-2">
        {/* Liste à remplir plus tard */}
      </div>
    </div>
  );

  const BulletinBoard = () => (
    <div className="bg-white border border-gray-300 rounded p-4 min-h-full flex flex-col">
      <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
        <IconMessage size={20} className="text-gray-600" />
        Tableau d'affichage
      </h3>
      <div className="flex-1 space-y-2">
        {/* Liste à remplir plus tard */}
      </div>
    </div>
  );

  const ActiveUnits = () => (
    <div className="bg-white border border-gray-300 rounded p-4 min-h-full flex flex-col">
      <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
        <IconUsers size={20} className="text-gray-600" />
        Unités actives
      </h3>
      <div className="flex-1 space-y-2">
        {/* Liste à remplir plus tard */}
      </div>
    </div>
  );

  // Fonction qui retourne le layout du dashboard selon le métier
  const getDashboardLayout = (job: string) => {
    const layouts: { [key: string]: React.ReactElement } = {
      lspd: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="flex flex-col border-r border-gray-300 min-h-full">
            <div className="flex-1 min-h-0">
              <RecentReports />
            </div>
            <div className="flex-1 min-h-0 border-t border-gray-300">
              <RecentWarrants />
            </div>
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      ),
      lsdph: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="border-r border-gray-300 min-h-full">
            <RecentReports />
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      ),
      lsfd: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="border-r border-gray-300 min-h-full">
            <RecentReports />
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      ),
      mairie: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="flex flex-col border-r border-gray-300 min-h-full">
            <div className="flex-1 min-h-0">
              <RecentReports />
            </div>
            <div className="flex-1 min-h-0 border-t border-gray-300">
              <RecentWarrants />
            </div>
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      ),
      fib: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="flex flex-col border-r border-gray-300 min-h-full">
            <div className="flex-1 min-h-0">
              <RecentReports />
            </div>
            <div className="flex-1 min-h-0 border-t border-gray-300">
              <RecentWarrants />
            </div>
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      ),
      doj: (
        <div className="grid grid-cols-3 gap-0 p-0 min-h-full bg-white">
          {/* Colonne 1 */}
          <div className="flex flex-col border-r border-gray-300 min-h-full">
            <div className="flex-1 min-h-0">
              <RecentReports />
            </div>
            <div className="flex-1 min-h-0 border-t border-gray-300">
              <RecentWarrants />
            </div>
          </div>
          {/* Colonne 2 */}
          <div className="border-r border-gray-300 min-h-full">
            <BulletinBoard />
          </div>
          {/* Colonne 3 */}
          <div className="min-h-full">
            <ActiveUnits />
          </div>
        </div>
      )
    };

    return layouts[job] || (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-zinc-400">Sélectionnez un métier pour voir le dashboard</p>
      </div>
    );
  };

  useEffect(() => {
    // TEMPORAIREMENT DÉSACTIVÉ : Gestion des touches de suppression
    // const handleDeletionKeys = (e: KeyboardEvent) => {
    //   if ((e.key === "Backspace" || e.key === "Delete") && visible) {
    //     const target = e.target as HTMLElement;

    //     // Vérifier si la cible est un champ de saisie ou contenu dans un champ de saisie
    //     const isEditable = target.tagName === 'INPUT' ||
    //                       target.tagName === 'TEXTAREA' ||
    //                       target.tagName === 'SELECT' ||
    //                       target.contentEditable === 'true' ||
    //                       target.closest('input') !== null ||
    //                       target.closest('textarea') !== null ||
    //                       target.closest('[contenteditable="true"]') !== null;

    //     // Si on n'est pas dans un champ éditable, bloquer la touche
    //     if (!isEditable) {
    //       e.preventDefault();
    //       e.stopImmediatePropagation();
    //       e.returnValue = false;
    //       return false;
    //     }
    //     // Si on est dans un champ éditable, laisser le comportement normal (ne rien faire)
    //   }
    // };

    // Protection contre les erreurs JavaScript qui pourraient fermer la tablette
    const handleGlobalErrors = (event: ErrorEvent) => {
      console.error('Erreur JavaScript détectée:', event.error);
      // Empêcher la propagation de l'erreur qui pourrait fermer la tablette
      event.preventDefault();
      return true;
    };

    const handleUnhandledRejections = (event: PromiseRejectionEvent) => {
      console.error('Promise rejetée non gérée:', event.reason);
      // Empêcher la propagation
      event.preventDefault();
    };

    if (visible) {
      // TEMPORAIREMENT DÉSACTIVÉ : Gestion des touches
      // document.addEventListener("keydown", handleDeletionKeys, {
      //   capture: true,
      //   passive: false
      // });

      // Protection contre les erreurs
      window.addEventListener('error', handleGlobalErrors);
      window.addEventListener('unhandledrejection', handleUnhandledRejections);
    }

    return () => {
      // document.removeEventListener("keydown", handleDeletionKeys, { capture: true });
      window.removeEventListener('error', handleGlobalErrors);
      window.removeEventListener('unhandledrejection', handleUnhandledRejections);
    };
  }, [visible]);

  // Garder l'événement Échap séparément
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        closeMDT();
        e.preventDefault();
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleEscape, { capture: true, passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, { capture: true });
    };
  }, [visible, setVisible]);

  const closeMDT = () => {
    fetchNui("close", {}, () => setVisible(false));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative pointer-events-auto bg-black rounded-[1.5rem] shadow-2xl border-4 border-zinc-800 p-3 w-[85vw] max-w-[1200px] h-[80vh] flex flex-col transition-transform duration-300 transform hover:scale-[1.005]">
        
        {/* Caméra Frontale */}
        <div className="absolute top-4 w-3 h-3 bg-zinc-800 rounded-full left-1/2 -translate-x-1/2 z-20 opacity-50" />

        {/* ÉCRAN */}
        <div className="relative w-full h-full bg-neutral-950 rounded-[1.2rem] overflow-hidden flex flex-col shadow-inner">
            
          {/* Fond d'écran */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(49,46,129,0.5)_0%,_rgba(10,10,10,1)_80%)]" />

          {/* Contenu */}
          <div className="relative z-10 w-full h-full flex flex-col">
            
            {/* Banderole qui prend toute la largeur */}
            <div className="w-full flex-shrink-0">
              <HeaderBanner />
            </div>

            {/* Contenu de la page : Layout avec sidebar gauche - prend toute la hauteur restante */}
            <div className="w-full flex-1 flex relative z-10 overflow-hidden">
          
          {/* Barre de navigation gauche */}
          <div className="w-48 bg-white border-r border-gray-300 flex flex-col h-full">
            {/* Header de la sidebar */}
            <div className="p-4 border-b border-gray-300 flex-shrink-0">
              <h2 className="text-gray-800 font-bold text-lg">Navigation</h2>
              {/* Sélecteur de métier pour test (à supprimer plus tard) */}
              <select
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                className="mt-2 w-full bg-gray-100 text-gray-800 text-sm rounded px-2 py-1 border border-gray-300"
              >
                <option value="lspd">LSPD</option>
                <option value="lsdph">LSDPH</option>
                <option value="fib">FIB</option>
                <option value="mairie">Mairie</option>
                <option value="lsfd">LSFD</option>
                <option value="doj">Justice</option>
              </select>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {getNavigationItems(currentJob).map((item) => {
                const IconComponent = navigationIcons[item];
                return (
                  <button
                    key={item}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full text-left px-3 py-1.5 rounded transition-colors flex items-center gap-3 ${
                      activeItem === item
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {IconComponent && <IconComponent size={16} className="flex-shrink-0" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 bg-white overflow-y-auto">
            {currentPage === 'dashboard' && activeItem === 'Accueil' && (
              getDashboardLayout(currentJob)
            )}
            {currentPage === 'reports' && (
              <ReportsPage
                currentJob={currentJob}
                onBack={handleBackToDashboard}
                onCreateReport={handleCreateReport}
                onViewReport={handleViewReport}
                canCreate={canPerform('create')}
                refreshKey={refreshKey}
              />
            )}
            {currentPage === 'create-report' && (
              <CreateReportPage
                onBack={() => {
                  setEditingReport(null);
                  handleBackToReports();
                }}
                onSave={handleSaveReport}
                currentJob={currentJob as any}
                editingReport={editingReport}
              />
            )}
            {currentPage === 'view-report' && selectedReport && (
              <ViewReportPage
                report={selectedReport}
                onBack={handleBackToReports}
                onEdit={canPerform('edit') ? () => handleEditReport(selectedReport) : undefined}
                onDelete={canPerform('delete') ? () => handleDeleteReport(selectedReport.id) : undefined}
              />
            )}
            {currentPage === 'dashboard' && activeItem !== 'Accueil' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeItem}</h2>
                  <p className="text-gray-600">Cette section sera développée prochainement</p>
                </div>
              </div>
            )}
          </div>

          </div>
          
          </div>

          {/* Logo KiwIFruit */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
            <span className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase font-sans drop-shadow-md">
              KiwIFruit
            </span>
          </div>

        </div>

        {/* Boutons latéraux */}
        <div className="absolute -right-[6px] top-16 w-1 h-10 bg-zinc-800 rounded-r-md" />
        <div className="absolute -right-[6px] top-28 w-1 h-10 bg-zinc-800 rounded-r-md" />
        <div className="absolute -top-[6px] right-16 w-10 h-1 bg-zinc-800 rounded-t-md" />

      </div>
    </div>
  );
};

export default MainApp;