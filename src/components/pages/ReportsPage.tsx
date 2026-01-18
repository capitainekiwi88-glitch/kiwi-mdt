import React, { useState, useEffect } from "react";
import { IconPlus, IconSearch, IconTag, IconClock } from "@tabler/icons-react";
import { Rapport } from "../objects/rapports";

interface ReportsPageProps {
  currentJob: string;
  onBack: () => void;
  onCreateReport: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ currentJob, onBack, onCreateReport }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Rapport[]>([]);
  const [filteredReports, setFilteredReports] = useState<Rapport[]>([]);

  useEffect(() => {
    // Charger tous les rapports accessibles pour ce métier
    const allReports = Rapport.getAllReports(currentJob);
    setReports(allReports);
    setFilteredReports(allReports);
  }, [currentJob]);

  useEffect(() => {
    // Filtrer les rapports selon le terme de recherche
    if (searchTerm.trim() === "") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, reports]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderTags = (tags: string[]) => {
    const maxTags = 3;
    const visibleTags = tags.slice(0, maxTags);
    const hasMore = tags.length > maxTags;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            <IconTag size={10} className="mr-1" />
            {tag}
          </span>
        ))}
        {hasMore && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{tags.length - maxTags}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header avec titre et bouton créer */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Rapports</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={onCreateReport}>
          <IconPlus size={18} />
          Créer
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un rapport par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des rapports */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "Aucun rapport trouvé pour cette recherche" : "Aucun rapport disponible"}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {truncateText(report.description, 150)}
                    </p>
                    {renderTags(report.tags)}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm ml-4">
                    <IconClock size={14} className="mr-1" />
                    <span>Il y a 2h</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};