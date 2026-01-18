import React, { useEffect, useState } from "react";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { useVisibility } from "../providers/VisibilityProvider";
import { TabletLayout } from "./TabletLayout"; 
import MainApp from "./App";

// Debug data
debugData([{ action: "setVisible", data: true }]);

const Register: React.FC = () => {
  const { visible, setVisible } = useVisibility();

  // --- ÉTATS ---
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Envoi Lua :", formData);
    setSubmitted(true);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        closeMDT();
        e.preventDefault();
      }
    };
    if (visible) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [visible, setVisible]);

  const closeMDT = () => {
    fetchNui("close", {}, () => setVisible(false));
  };

  if (!visible) return null;

  if (submitted) {
    return <MainApp />;
  }

  return (
    <TabletLayout>
      
      {/* Contenu de la page : Centré verticalement dans la tablette */}
      <div className="min-h-full flex flex-col items-center justify-center py-8">
        
        {/* Titre */}
        <div className="w-full max-w-md text-center space-y-2 mb-8 relative z-10">
          <div className="mdt-divider w-2/3 mx-auto" />
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            Mobile Data Terminal
          </h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Connexion Sécurisée</p>
          <div className="mdt-divider w-full mx-auto" />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 relative z-10">
          
          <div className="group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nom d'utilisateur"
              className="mdt-input"
            />
          </div>

          <div className="group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Adresse email"
              className="mdt-input"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mot de passe"
              className="mdt-input"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Répétez"
              className="mdt-input"
            />
          </div>

          <div className="relative">
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              className="mdt-select"
            >
              <option value="" disabled>Choisissez le type de compte</option>
              <option value="police">LSPD</option>
              <option value="police">LSFD</option>
              <option value="ems">LSDPH</option>
              <option value="doj">Justice</option>
              <option value="fib">FIB</option>
              <option value="mayor">Mairie</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">▼</div>
          </div>

          <button type="submit" className="mdt-btn mt-6 shadow-lg shadow-black/40">
            Soumettre une demande
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 relative z-10">
          <button type="button" className="text-xs font-bold text-zinc-500 uppercase hover:text-white transition-colors">
            Se connecter
          </button>
        </div>

      </div>
    </TabletLayout>
  );
};

export default Register;