import React, { useMemo, useState } from "react";
import { IconArrowLeft, IconTag, IconUsers, IconUser, IconUserExclamation } from "@tabler/icons-react";
import { getServiceConfig } from "../../config/services";
import type { ServiceKey } from "../../config/services";
import { Rapport } from "../objects/rapports";

interface ViewReportPageProps {
  report: Rapport;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ViewReportPage: React.FC<ViewReportPageProps> = ({ report, onBack, onEdit, onDelete }) => {
  const reportType = report.type || report.tags[0] || "Type non défini";
  const tagsSansType = (report.tags || []).filter((tag) => tag !== reportType);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const summaryUrl = useMemo(() => {
    const service = getServiceConfig(report.job as ServiceKey) || { name: "Service inconnu", logo: "", color: "#0f172a" };
    const stampColor = service.color || "#0f172a";
    const stampText = service.name?.toUpperCase() || "SERVICE";
    const toBase64 = (input: string) => btoa(unescape(encodeURIComponent(input)));
    const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Rapport ${report.title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; margin: 0; padding: 32px; color: #0f172a; background: #f8fafc; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    .identity { display: flex; gap: 14px; align-items: center; }
    .logo { width: 56px; height: 56px; object-fit: contain; }
    h1 { margin: 0; font-size: 24px; line-height: 1.2; }
    .service { font-weight: 600; color: ${stampColor}; }
    .pill { display: inline-flex; align-items: center; padding: 8px 14px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 13px; border: 1px solid #bae6fd; }
    section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 16px; box-shadow: 0 6px 18px rgba(15,23,42,0.05); }
    section h2 { margin: 0 0 12px 0; font-size: 16px; color: #0f172a; letter-spacing: 0.01em; }
    .muted { color: #6b7280; font-size: 13px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { padding: 7px 11px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-size: 13px; color: #0f172a; }
    pre { white-space: pre-wrap; font: 13px/1.6 "Consolas", "SFMono-Regular", Menlo, monospace; color: #0f172a; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
    .thumb { width: 100%; height: 120px; object-fit: cover; border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
    .small { margin-top: 6px; font-size: 12px; color: #6b7280; word-break: break-all; }
    .meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; font-size: 13px; color: #374151; }
    .stamp { margin-top: 28px; display: flex; justify-content: flex-end; }
    .stamp span { display: inline-flex; align-items: center; justify-content: center; padding: 14px 18px; border: 2px solid ${stampColor}; color: ${stampColor}; border-radius: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; background: rgba(15,23,42,0.02); }
  </style>
</head>
<body>
  <header>
    <div class="identity">
      <div>
        <div class="service">${service.name}</div>
        <div class="muted">${new Date(report.timestamp || Date.now()).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}</div>
        <div class="muted">Dossier #${report.id}</div>
      </div>
    </div>
    <span class="pill">${reportType}</span>
  </header>

  <section>
    <h1>${report.title}</h1>
    <div class="meta">
      <span>Service : ${service.name}</span>
      <span>Créé par : ${report.job?.toUpperCase() || "N/A"}</span>
    </div>
  </section>

  <section>
    <h2>Description</h2>
    <pre>${(report.description || "").replace(/</g, "&lt;")}</pre>
  </section>

  <section>
    <h2>Étiquettes</h2>
    ${tagsSansType.length === 0 ? `<div class="muted">Aucune étiquette</div>` : `<div class="chips">${tagsSansType.map(t => `<span class="chip">${t}</span>`).join("")}</div>`}
  </section>

  <section>
    <h2>Agents impliqués</h2>
    ${report.officersInvolved.length === 0 ? `<div class="muted">Aucun agent</div>` : `<div class="chips">${report.officersInvolved.map(o => `<span class="chip">${o}</span>`).join("")}</div>`}
  </section>

  <section>
    <h2>Civils impliqués</h2>
    ${report.civiliansInvolved.length === 0 ? `<div class="muted">Aucun civil</div>` : `<div class="chips">${report.civiliansInvolved.map(o => `<span class="chip">${o}</span>`).join("")}</div>`}
  </section>

  <section>
    <h2>Suspects impliqués</h2>
    ${report.criminalsInvolved.length === 0 ? `<div class="muted">Aucun suspect</div>` : `<div class="chips">${report.criminalsInvolved.map(o => `<span class="chip">${o}</span>`).join("")}</div>`}
  </section>

  <section>
    <h2>Pièces jointes</h2>
    ${report.listImg.length === 0 ? `<div class="muted">Aucune pièce jointe</div>` : `<div class="grid">${report.listImg.map(url => `<div><img class="thumb" src="${url}" /><div class="small">${url}</div></div>`).join("")}</div>`}
  </section>

  <div class="stamp"><span>${stampText}</span></div>
</body>
</html>`;
    return "data:text/html;base64," + toBase64(html);
  }, [report, reportType, tagsSansType]);

  const copyText = async (text: string) => {
    const copyWithTextarea = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    };

    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      copied = copyWithTextarea();
    }

    if (copied) {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 1800);
    } else {
      // Dernier recours : pas d'alerte bloquante, on laisse l'utilisateur coller manuellement
      setCopiedUrl(null);
      console.warn("Copie impossible, collez manuellement :", text);
    }
  };
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-8 py-5 border-b border-gray-200 flex-shrink-0 gap-6">
        <div className="flex-shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-gray-800 truncate">{report.title}</h1>
        </div>

        <div className="flex flex-wrap justify-end gap-2 flex-shrink-0">
          <button
            onClick={() => copyText(summaryUrl)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors shadow-sm"
          >
            Copier le lien PDF
          </button>
          {onDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors shadow-sm"
            >
              Supprimer
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm"
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Corps - Deux colonnes */}
      <div className="flex-1 flex overflow-hidden">
        {/* Colonne gauche */}
        <div className="flex-1 border-r border-gray-200 overflow-y-auto p-8">
          {/* Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Type</label>
            <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
              {reportType}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
            <div className="w-full min-h-96 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
              {report.description}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="w-96 overflow-y-auto p-8 bg-gray-50">
          {/* Tags */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Étiquettes</label>
            </div>
            {tagsSansType.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUNE ÉTIQUETTE
              </div>
            ) : (
              <div className="space-y-2">
                {tagsSansType.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md">
                    <IconTag size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pièces jointes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Pièces jointes</label>
            </div>
            {report.listImg.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUNE PIÈCE JOINTE
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {report.listImg.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150?text=Image";
                      }}
                      onClick={() => setPreviewUrl(image)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agents impliqués */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Agents impliqués</label>
            </div>
            {report.officersInvolved.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN AGENT
              </div>
            ) : (
              <div className="space-y-2">
                {report.officersInvolved.map((officer, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-100 border border-blue-200 px-3 py-2 rounded-md">
                    <IconUsers size={14} className="text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">{officer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Civils impliqués */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Civils impliqués</label>
            </div>
            {report.civiliansInvolved.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN CIVIL
              </div>
            ) : (
              <div className="space-y-2">
                {report.civiliansInvolved.map((civilian, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-100 border border-green-200 px-3 py-2 rounded-md">
                    <IconUser size={14} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{civilian}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suspects impliqués */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Suspects impliqués</label>
            </div>
            {report.criminalsInvolved.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm uppercase tracking-wide">
                AUCUN SUSPECT
              </div>
            ) : (
              <div className="space-y-2">
                {report.criminalsInvolved.map((suspect, index) => (
                  <div key={index} className="flex items-center gap-2 bg-red-100 border border-red-200 px-3 py-2 rounded-md">
                    <IconUserExclamation size={14} className="text-red-600" />
                    <span className="text-sm text-red-700 font-medium">{suspect}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={(e) => { if (e.target === e.currentTarget) setPreviewUrl(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-5xl w-[90vw] max-h-[90vh] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 truncate">{previewUrl}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText(previewUrl)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                >
                  Copier URL
                </button>
                <button
                  onClick={() => window.open(previewUrl, "_blank")}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                >
                  Ouvrir dans un onglet
                </button>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center">
              <img src={previewUrl} alt="Prévisualisation" className="max-h-[70vh] max-w-full rounded-lg border border-gray-200 object-contain" />
            </div>
            {copiedUrl && <div className="text-xs text-green-600">Lien copié</div>}
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={(e) => { if (e.target === e.currentTarget) setShowConfirmDelete(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-[360px] p-6 space-y-4">
            <div className="text-lg font-semibold text-gray-900">Confirmation</div>
            <div className="text-sm text-gray-700 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est définitive.
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  onDelete?.();
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm font-semibold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
