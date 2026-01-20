import React, { useState } from "react";
import { IconArrowLeft, IconPlus, IconX, IconTag, IconUser, IconUsers, IconUserExclamation } from "@tabler/icons-react";
import { getAvailableTags } from "../../config/services";
import type { ServiceKey } from "../../config/services";
import { Rapport } from "../objects/rapports";

interface CreateReportPageProps {
  onBack: () => void;
  onSave: (reportData: any) => void;
  currentJob?: ServiceKey;
  editingReport?: Rapport | null;
}

export const CreateReportPage: React.FC<CreateReportPageProps> = ({ onBack, onSave, currentJob = "lspd", editingReport = null }) => {
  const defaultTitle = "Nouveau rapport";
  const initialTitle = editingReport?.title || defaultTitle;
  const typeTemplates: Record<string, string> = {
    "Rapport d'enquête": `Résumé de l'enquête :

Date et heure :
Lieu :
Enquêteur(s) :

Faits constatés :
Éléments recueillis :
Témoins :

Analyse / conclusions :
Actions à suivre :`,
    "Rapport d'arrestation": `Résumé de l'arrestation :

Date et heure :
Lieu :
Agent(s) impliqué(s) :
Suspect :
Motif de l'arrestation :

Circonstances :
Preuves / saisies :
Mesures prises :

Transmission au DOJ / Procureur :`,
    "Rapport de plainte": `Résumé de la plainte :

Date et heure :
Plaignant :
Contact :
Contre :

Faits rapportés :
Preuves fournies :
Témoins :

Suite donnée / numéro de dossier :`,
    "Rapport d'incident": `Résumé de l'incident :

Date et heure :
Lieu :
Intervenant(s) :

Déroulé des faits :
Personnes impliquées :
Dommages / blessures :

Actions entreprises :
Recommandations / suivis :`,
  };
  const defaultType = editingReport?.tags[0] && typeTemplates[editingReport.tags[0]]
    ? editingReport.tags[0]
    : "Rapport d'enquête";
  const defaultDescription = editingReport?.description ?? typeTemplates[defaultType];
  // États
  const [title, setTitle] = useState(initialTitle);
  const [reportType, setReportType] = useState(defaultType);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [description, setDescription] = useState(defaultDescription);
  const [tags, setTags] = useState<string[]>(editingReport?.tags || []);
  const [gallery, setGallery] = useState<string[]>(editingReport?.listImg || []);
  const [officers, setOfficers] = useState<string[]>(editingReport?.officersInvolved || []);
  const [civilians, setCivilians] = useState<string[]>(editingReport?.civiliansInvolved || []);
  const [suspects, setSuspects] = useState<string[]>(editingReport?.criminalsInvolved || []);

  // Popups
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [showGalleryPopup, setShowGalleryPopup] = useState(false);
  const [showOfficerPopup, setShowOfficerPopup] = useState(false);
  const [showCivilianPopup, setShowCivilianPopup] = useState(false);
  const [showSuspectPopup, setShowSuspectPopup] = useState(false);

  // Valeurs temporaires pour les popups
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newOfficer, setNewOfficer] = useState("");
  const [newCivilian, setNewCivilian] = useState("");
  const [newSuspect, setNewSuspect] = useState("");

  // Récupérer les tags disponibles pour le service actuel
  const availableTags = getAvailableTags(currentJob);

  const reportTypes = [
    "Rapport d'enquête",
    "Rapport d'arrestation",
    "Rapport de plainte",
    "Rapport d'incident",
  ];

  const handleSave = () => {
    const reportData = {
      id: editingReport?.id,
      title,
      type: reportType,
      description,
      tags,
      gallery,
      officers,
      civilians,
      suspects,
      job: currentJob
    };
    onSave(reportData);
  };

  const titreSaisi = title.trim();
  const isDefaultTitle = !editingReport && (titreSaisi === "" || titreSaisi === defaultTitle);
  const canSave = titreSaisi.length > 0 && !isDefaultTitle;

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setGallery([...gallery, newImageUrl.trim()]);
      setNewImageUrl("");
      setShowGalleryPopup(false);
    }
  };

  const removeImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const addOfficer = () => {
    if (newOfficer.trim() && !officers.includes(newOfficer.trim())) {
      setOfficers([...officers, newOfficer.trim()]);
      setNewOfficer("");
      setShowOfficerPopup(false);
    }
  };

  const removeOfficer = (index: number) => {
    setOfficers(officers.filter((_, i) => i !== index));
  };

  const addCivilian = () => {
    if (newCivilian.trim() && !civilians.includes(newCivilian.trim())) {
      setCivilians([...civilians, newCivilian.trim()]);
      setNewCivilian("");
      setShowCivilianPopup(false);
    }
  };

  const removeCivilian = (index: number) => {
    setCivilians(civilians.filter((_, i) => i !== index));
  };

  const addSuspect = () => {
    if (newSuspect.trim() && !suspects.includes(newSuspect.trim())) {
      setSuspects([...suspects, newSuspect.trim()]);
      setNewSuspect("");
      setShowSuspectPopup(false);
    }
  };

  const removeSuspect = (index: number) => {
    setSuspects(suspects.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header style proche de la ref */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-100 flex-shrink-0 relative">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <IconArrowLeft size={20} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {/* Titre toujours éditable */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Saisir le titre du rapport"
            className="w-full text-center text-xl font-semibold text-gray-800 px-3 py-2 bg-transparent border border-transparent focus:border-transparent focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors shadow-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm ${canSave ? "hover:bg-blue-600" : "opacity-60 cursor-not-allowed"}`}
          >
            {editingReport ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Corps - Deux colonnes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne gauche */}
        <div className="flex-1 border-r border-gray-200 overflow-y-auto p-6">
          {/* Type + puce sélectionnée */}
          <div className="mb-5 flex flex-col gap-3">
            <label className="block text-sm font-semibold text-gray-800">Type de rapport</label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 border border-blue-200">
                {reportType}
              </span>
              {!editingReport && (
                <button
                  onClick={() => setTypePickerOpen(!typePickerOpen)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  {typePickerOpen ? "Fermer le choix" : "Changer de type"}
                </button>
              )}
              {editingReport && (
                <span className="text-xs text-gray-500">Type verrouillé en édition</span>
              )}
            </div>
            {!editingReport && typePickerOpen && (
              <div className="flex flex-wrap gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setReportType(type);
                      setDescription(typeTemplates[type]);
                      setTypePickerOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      reportType === type
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[420px] px-4 py-3 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-800 resize-none focus:outline-none focus:border-gray-400 transition-colors font-sans leading-relaxed"
              placeholder="Saisir les détails du rapport..."
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className="w-[360px] overflow-y-auto p-6 bg-white">
          {/* Tags */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Étiquettes</label>
              <button
                onClick={() => setShowTagPopup(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            {tags.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm uppercase tracking-wide">
                AUCUNE ÉTIQUETTE
              </div>
            ) : (
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconTag size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </div>
                    <button
                      onClick={() => removeTag(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pièces jointes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Pièces jointes</label>
              <button
                onClick={() => setShowGalleryPopup(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            {gallery.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm uppercase tracking-wide">
                AUCUNE PIÈCE JOINTE
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((image, index) => (
                  <div key={index} className="relative group h-[70px] w-[70px]">
                    <img
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/80?text=Image";
                      }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agents impliqués */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Agents impliqués</label>
              <button
                onClick={() => setShowOfficerPopup(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            {officers.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN AGENT
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {officers.map((officer, index) => (
                  <span key={index} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
                    <IconUsers size={14} />
                    {officer}
                    <button onClick={() => removeOfficer(index)} className="text-blue-700 hover:text-blue-900">
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Civils impliqués */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Civils impliqués</label>
              <button
                onClick={() => setShowCivilianPopup(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            {civilians.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN CIVIL
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {civilians.map((civilian, index) => (
                  <span key={index} className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                    <IconUser size={14} />
                    {civilian}
                    <button onClick={() => removeCivilian(index)} className="text-green-700 hover:text-green-900">
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Suspects impliqués */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Suspects impliqués</label>
              <button
                onClick={() => setShowSuspectPopup(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            {suspects.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN SUSPECT
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {suspects.map((suspect, index) => (
                  <span key={index} className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full">
                    <IconUserExclamation size={14} />
                    {suspect}
                    <button onClick={() => removeSuspect(index)} className="text-red-700 hover:text-red-900">
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup pour ajouter un tag */}
      {showTagPopup && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTagPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-[500px] max-h-[600px] overflow-y-auto shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sélectionner des étiquettes</h3>
            <div className="space-y-2 mb-4">
              {availableTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium">{tag}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTagPopup(false)}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter une image */}
      {showGalleryPopup && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGalleryPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une image</h3>
            <input
              type="url"
              placeholder="Saisir l'URL de l'image..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGalleryPopup(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addImage}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un officer */}
      {showOfficerPopup && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOfficerPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter un agent</h3>
            <input
              type="text"
              placeholder="Nom de l'agent..."
              value={newOfficer}
              onChange={(e) => setNewOfficer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOfficer()}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOfficerPopup(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addOfficer}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un civilian */}
      {showCivilianPopup && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCivilianPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter un civil</h3>
            <input
              type="text"
              placeholder="Nom du civil..."
              value={newCivilian}
              onChange={(e) => setNewCivilian(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCivilian()}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCivilianPopup(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addCivilian}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un suspect */}
      {showSuspectPopup && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuspectPopup(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter un suspect</h3>
            <input
              type="text"
              placeholder="Nom du suspect..."
              value={newSuspect}
              onChange={(e) => setNewSuspect(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSuspect()}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSuspectPopup(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addSuspect}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
