-- Serveur MDT - Gestion des rapports
-- Sauvegarde les rapports dans un fichier JSON

-- Chemin vers le fichier des rapports
local REPORTS_FILE = 'reports_data.json'

-- Fonction pour charger les rapports depuis le fichier JSON
local function LoadReports()
    local file = io.open(REPORTS_FILE, 'r')
    if file then
        local content = file:read('*all')
        file:close()
        return json.decode(content) or {}
    end
    return {}
end

-- Fonction pour sauvegarder les rapports dans le fichier JSON
local function SaveReports(reports)
    local file = io.open(REPORTS_FILE, 'w')
    if file then
        file:write(json.encode(reports, { indent = true }))
        file:close()
        print('Rapports sauvegardés dans ' .. REPORTS_FILE)
        return true
    end
    print('Erreur: Impossible de sauvegarder les rapports')
    return false
end

-- Événement NUI pour sauvegarder un rapport
RegisterNUICallback('saveReport', function(data, cb)
    if not data.report then
        cb({ success = false, error = 'Données du rapport manquantes' })
        return
    end

    -- Charger les rapports existants
    local reports = LoadReports()

    -- Générer un nouvel ID si nécessaire
    local newId = 1
    for _, report in pairs(reports) do
        if report.id and report.id >= newId then
            newId = report.id + 1
        end
    end

    -- Assigner l'ID au rapport
    data.report.id = newId

    -- Ajouter le rapport à la liste
    table.insert(reports, data.report)

    -- Sauvegarder dans le fichier
    local success = SaveReports(reports)

    if success then
        cb({ success = true, reportId = newId })
        print('Nouveau rapport sauvegardé - ID: ' .. newId)
    else
        cb({ success = false, error = 'Erreur lors de la sauvegarde' })
    end
end)

-- Événement NUI pour charger les rapports
RegisterNUICallback('loadReports', function(data, cb)
    local reports = LoadReports()
    cb({ success = true, reports = reports })
end)

-- Commande de debug pour voir les rapports
RegisterCommand('mdt_debug_reports', function()
    local reports = LoadReports()
    print('Nombre de rapports: ' .. #reports)
    for i, report in ipairs(reports) do
        print(string.format('Rapport %d: %s (ID: %d)', i, report.title, report.id))
    end
end, false)

print('Serveur MDT chargé - Sauvegarde JSON activée')