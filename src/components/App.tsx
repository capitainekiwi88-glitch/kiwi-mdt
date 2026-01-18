import React, { useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useVisibility } from "../providers/VisibilityProvider";
import { TabletLayout } from "./TabletLayout";
import { ReportsPage, CreateReportPage } from "./pages";
import { Rapport } from "./objects/rapports";
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

const MainApp: React.FC = () => {
  const { visible, setVisible } = useVisibility();

  // État pour le métier actuel (à remplacer par la récupération depuis le serveur)
  const [currentJob, setCurrentJob] = useState<string>('lspd'); // Valeur par défaut pour test

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
      lsfd: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Mandats', 'Evènements', 'Employées', 'Chat', 'Logs'],
      doj: ['Accueil', 'Dispatch', 'Profile', 'Véhicule', 'Dossiers', 'Rapports', 'Mandats', 'Peines', 'Employées', 'Chat', 'Logs']
    };

    return menus[job] || []; // Retourne un tableau vide si le métier n'existe pas
  };

  // État pour l'élément actif (optionnel)
  const [activeItem, setActiveItem] = useState<string>('Accueil');

  // État pour la page actuelle
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'reports' | 'create-report'>('dashboard');

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

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleCreateReport = () => {
    setCurrentPage('create-report');
  };

  const handleSaveReport = async (reportData: any) => {
    try {
      // Créer le rapport via la classe Rapport
      const newRapport = await Rapport.createReport(reportData, currentJob);

      // Envoyer les données au serveur FiveM pour sauvegarde dans le fichier JSON
      const response = await fetchNui('saveReport', {
        report: newRapport.toJSON()
      });

      if (response.success) {
        console.log('Rapport sauvegardé avec succès côté serveur - ID:', response.reportId);
        setCurrentPage('reports');
      } else {
        console.error('Erreur serveur:', response.error);
        // Fallback: sauvegarde temporaire dans localStorage
        console.log('Fallback: sauvegarde temporaire activée');
        const existingReports = JSON.parse(localStorage.getItem('mdt_reports_temp') || '[]');
        existingReports.push(newRapport.toJSON());
        localStorage.setItem('mdt_reports_temp', JSON.stringify(existingReports));
        setCurrentPage('reports');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du rapport:', error);
      // Fallback en cas d'erreur
      console.log('Fallback: sauvegarde temporaire activée');
      const newRapport = await Rapport.createReport(reportData, currentJob);
      const existingReports = JSON.parse(localStorage.getItem('mdt_reports_temp') || '[]');
      existingReports.push(newRapport.toJSON());
      localStorage.setItem('mdt_reports_temp', JSON.stringify(existingReports));
      setCurrentPage('reports');
    }
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
  const HeaderBanner = () => (
    <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center border-b border-gray-300 shadow-sm">
      {/* Nom du service à gauche */}
      <div className="flex items-center gap-3">
        <IconRadio size={24} className="text-blue-600" />
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
    // APPROCHE FINALE : Désactiver complètement backspace quand tablette visible
    const blockBackspace = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && visible) {
        console.log('🚫 BACKSPACE COMPLETELY BLOCKED');
        e.preventDefault();
        e.stopImmediatePropagation();
        e.returnValue = false;
        return false;
      }
    };

    if (visible) {
      // Ajouter l'événement avec la plus haute priorité possible
      document.addEventListener("keydown", blockBackspace, {
        capture: true,
        passive: false,
        once: false
      });
      document.addEventListener("keyup", blockBackspace, {
        capture: true,
        passive: false,
        once: false
      });
      document.addEventListener("keypress", blockBackspace, {
        capture: true,
        passive: false,
        once: false
      });
    }

    return () => {
      document.removeEventListener("keydown", blockBackspace, { capture: true });
      document.removeEventListener("keyup", blockBackspace, { capture: true });
      document.removeEventListener("keypress", blockBackspace, { capture: true });
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
    <TabletLayout noPadding={true}>
      {/* Banderole qui prend toute la largeur */}
      <div className="w-full">
        <HeaderBanner />
      </div>

      {/* Contenu de la page : Layout avec sidebar gauche - prend toute la hauteur restante */}
      <div className="w-full flex-1 flex relative z-10 min-h-full">
        
        {/* Barre de navigation gauche */}
        <div className="w-48 bg-white border-r border-gray-300 flex flex-col min-h-full">
          {/* Header de la sidebar */}
          <div className="p-4 border-b border-gray-300">
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
          <div className="flex-1 p-4 space-y-2">
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
        <div className="flex-1 bg-white min-h-full">
          {currentPage === 'dashboard' && activeItem === 'Accueil' && (
            getDashboardLayout(currentJob)
          )}
          {currentPage === 'reports' && (
            <ReportsPage
              currentJob={currentJob}
              onBack={handleBackToDashboard}
              onCreateReport={handleCreateReport}
            />
          )}
          {currentPage === 'create-report' && (
            <CreateReportPage
              onBack={() => setCurrentPage('reports')}
              onSave={handleSaveReport}
            />
          )}
          {currentPage === 'dashboard' && activeItem !== 'Accueil' && (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeItem}</h2>
                <p className="text-gray-600">Cette section sera développée prochainement</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </TabletLayout>
  );
};

export default MainApp;