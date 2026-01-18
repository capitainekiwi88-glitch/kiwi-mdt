import React, { useState } from "react";
import { IconArrowLeft, IconPlus, IconX, IconTag, IconCar, IconUsers, IconUser, IconTerminal } from "@tabler/icons-react";
import { MDTUsersManager, type MDTUser } from "../objects/users";

interface CreateReportPageProps {
  onBack: () => void;
  onSave: (reportData: any) => void;
}

export const CreateReportPage: React.FC<CreateReportPageProps> = ({ onBack, onSave }) => {
  const [title, setTitle] = useState("Nouveau Rapport");
  const [description, setDescription] = useState("Template rapport \n\n Date d'ouverture: \n Rempli par: (Nom et matricule) \n\n Détails de l'incident: \n Preuves: \n\n Etat de l'investigation: \n\n Notes additionnelles: ");
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [officers, setOfficers] = useState<string[]>([]);
  const [civilians, setCivilians] = useState<string[]>([]);
  const [criminals, setCriminals] = useState<string[]>([]);

  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [showOfficerPopup, setShowOfficerPopup] = useState(false);
  const [showTextInputPopup, setShowTextInputPopup] = useState(false);
  const [textInputType, setTextInputType] = useState<'vehicle' | 'civilian' | 'criminal'>('vehicle');
  const [textInputValue, setTextInputValue] = useState('');
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [officerSearch, setOfficerSearch] = useState("");
  const [availableOfficers, setAvailableOfficers] = useState<MDTUser[]>([]);

  const addImage = () => {
    try {
      if (newImageUrl.trim()) {
        setImages([...images, newImageUrl.trim()]);
        setNewImageUrl("");
        setShowImagePopup(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error);
    }
  };

  const removeImage = (index: number) => {
    try {
      if (index >= 0 && index < images.length) {
        setImages(images.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagPopup(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    try {
      setTags(tags.filter(tag => tag !== tagToRemove));
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
    }
  };

  const addVehicle = () => {
    setTextInputType('vehicle');
    setTextInputValue('');
    setShowTextInputPopup(true);
  };

  const removeVehicle = (index: number) => {
    try {
      if (index >= 0 && index < vehicles.length) {
        setVehicles(vehicles.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du véhicule:', error);
    }
  };

  const addOfficer = () => {
    // Charger tous les utilisateurs disponibles
    const allUsers = MDTUsersManager.getAllUsers();
    setAvailableOfficers(allUsers);
    setOfficerSearch("");
    setShowOfficerPopup(true);
  };

  const removeOfficer = (index: number) => {
    try {
      if (index >= 0 && index < officers.length) {
        setOfficers(officers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'officier:', error);
    }
  };

  const addCivilian = () => {
    setTextInputType('civilian');
    setTextInputValue('');
    setShowTextInputPopup(true);
  };

  const removeCivilian = (index: number) => {
    try {
      if (index >= 0 && index < civilians.length) {
        setCivilians(civilians.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du civil:', error);
    }
  };

  const addCriminal = () => {
    setTextInputType('criminal');
    setTextInputValue('');
    setShowTextInputPopup(true);
  };

  const selectOfficer = (officer: MDTUser) => {
    const officerInfo = `${officer.name} (${officer.badge || 'N/A'})`;
    if (!officers.includes(officerInfo)) {
      setOfficers([...officers, officerInfo]);
    }
    setShowOfficerPopup(false);
  };

  const removeCriminal = (index: number) => {
    try {
      if (index >= 0 && index < criminals.length) {
        setCriminals(criminals.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du criminel:', error);
    }
  };

  const handleSaveTextItem = () => {
    try {
      if (textInputValue.trim()) {
        if (textInputType === 'vehicle') {
          setVehicles([...vehicles, textInputValue.trim()]);
        } else if (textInputType === 'civilian') {
          setCivilians([...civilians, textInputValue.trim()]);
        } else if (textInputType === 'criminal') {
          setCriminals([...criminals, textInputValue.trim()]);
        }
      }
      setShowTextInputPopup(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément texte:', error);
      setShowTextInputPopup(false);
    }
  };

  const filteredOfficers = availableOfficers.filter(officer =>
    officer.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
    officer.badge?.toLowerCase().includes(officerSearch.toLowerCase()) ||
    officer.job.toLowerCase().includes(officerSearch.toLowerCase())
  );

  const handleSave = () => {
    const reportData = {
      title,
      description,
      images,
      tags,
      vehicles,
      officers,
      civilians,
      criminals
    };
    onSave(reportData);
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header avec navigation et titre */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <IconArrowLeft size={20} />
            Retour
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-gray-800 bg-transparent border-none outline-none text-center flex-1 mx-4"
            placeholder="Titre du rapport"
          />



          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* Corps du formulaire */}
      <div className="flex flex-1 min-h-0">
        {/* Colonne gauche */}
        <div className="flex-1 p-6 border-r border-gray-200">
          {/* Section Preuves */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Preuves</h3>
              <button
                onClick={() => setShowImagePopup(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preuve ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png";
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
          </div>

          {/* Section Tags */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
              <button
                onClick={() => setShowTagPopup(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                <IconPlus size={14} />
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  <IconTag size={12} />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <IconX size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section Description */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              <button
                onClick={() => setDescription("")}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Effacer la description"
              >
                <IconX size={16} />
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez l'incident..."
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className="w-80 p-6">
          {/* Section Véhicules impliqués */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <IconCar size={16} />
                Véhicules impliqués
              </h3>
              <button
                onClick={addVehicle}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {vehicles.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{vehicle}</span>
                  <button
                    onClick={() => removeVehicle(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Agents impliqués */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <IconUsers size={16} />
                Agents impliqués
              </h3>
              <button
                onClick={addOfficer}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {officers.map((officer, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{officer}</span>
                  <button
                    onClick={() => removeOfficer(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Civils impliqués */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <IconUser size={16} />
                Civils impliqués
              </h3>
              <button
                onClick={addCivilian}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {civilians.map((civilian, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{civilian}</span>
                  <button
                    onClick={() => removeCivilian(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Criminels impliqués */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <IconTerminal size={16} />
                Criminels impliqués
              </h3>
              <button
                onClick={addCriminal}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {criminals.map((criminal, index) => (
                <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                  <span className="text-sm text-red-700">{criminal}</span>
                  <button
                    onClick={() => removeCriminal(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup pour ajouter une image */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ajouter une preuve</h3>
            <input
              type="url"
              placeholder="Entrez l'URL de l'image..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImagePopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un tag */}
      {showTagPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ajouter un tag</h3>
            <input
              type="text"
              placeholder="Entrez le tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTagPopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un agent */}
      {showOfficerPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-96 flex flex-col shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sélectionner un agent</h3>

            {/* Barre de recherche */}
            <input
              type="text"
              placeholder="Rechercher un agent..."
              value={officerSearch}
              onChange={(e) => setOfficerSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Liste des agents */}
            <div className="flex-1 overflow-y-auto">
              {filteredOfficers.map((officer) => (
                <button
                  key={officer.id}
                  onClick={() => selectOfficer(officer)}
                  className="w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">{officer.name}</div>
                  <div className="text-sm text-gray-600">
                    Badge: {officer.badge || 'N/A'} • {officer.job.toUpperCase()}
                  </div>
                </button>
              ))}
              {filteredOfficers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucun agent trouvé
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowOfficerPopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un élément texte (véhicule, civil, criminel) */}
      {showTextInputPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {textInputType === 'vehicle' && 'Ajouter un véhicule'}
              {textInputType === 'civilian' && 'Ajouter un civil'}
              {textInputType === 'criminal' && 'Ajouter un criminel'}
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={
                  textInputType === 'vehicle' ? 'Entrez la plaque du véhicule...' :
                  textInputType === 'civilian' ? 'Entrez le nom du civil...' :
                  'Entrez le nom du criminel...'
                }
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTextItem();
                  }
                }}
              />
              {textInputValue && (
                <button
                  onClick={() => setTextInputValue('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Effacer"
                >
                  <IconX size={16} />
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTextInputPopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTextItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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