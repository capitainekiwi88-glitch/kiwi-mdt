import React, { useState, useEffect } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Rapport } from "../objects/rapports";

interface ReportsPageProps {
  currentJob: string;
  onBack: () => void;
  onCreateReport: () => void;
  onViewReport: (report: Rapport) => void;
  refreshKey?: number;
  canCreate?: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ currentJob, onCreateReport, onViewReport, refreshKey = 0, canCreate = true }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Rapport[]>([]);
  const [filteredReports, setFilteredReports] = useState<Rapport[]>([]);

  useEffect(() => {
    // Charger tous les rapports accessibles pour ce métier
    const allReports = Rapport.getAllReports(currentJob);
    setReports(allReports);
    setFilteredReports(allReports);
  }, [currentJob, refreshKey]);

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

  const formatDate = (timestamp: Date | string | number) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month} ${year} at ${time}`;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header avec titre et bouton créer */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={onCreateReport}
          disabled={!canCreate}
        >
          <IconPlus size={16} />
          Create
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="px-8 py-5 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Reports"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Liste des rapports */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-base">
                {searchTerm ? "No reports found for this search" : "No reports available"}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
                onClick={() => onViewReport(report)}
              >
                <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {report.job.toUpperCase()} - Report ID: {report.id}
                  </span>
                  <span className="text-gray-400">
                    {formatDate(report.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};