-- Serveur MDT - Gestion des rapports
-- Sauvegarde les rapports dans un fichier JSON

local REPORTS_FILE = 'reports_data.json'
local RESOURCE_NAME = GetCurrentResourceName()

-- Fonction pour charger les rapports depuis le fichier JSON
local function LoadReports()
    local content = LoadResourceFile(RESOURCE_NAME, REPORTS_FILE)
    if content then
        local ok, data = pcall(json.decode, content)
        if ok and data then return data end
    end
    return {}
end

-- Fonction pour sauvegarder les rapports dans le fichier JSON
local function SaveReports(reports)
    local ok, encoded = pcall(json.encode, reports)
    if not ok then
        print("Erreur: Impossible d'encoder les rapports")
        return false
    end
    SaveResourceFile(RESOURCE_NAME, REPORTS_FILE, encoded, -1)
    print('Rapports sauvegardés dans ' .. REPORTS_FILE)
    return true
end

-- Sauvegarder un rapport (appel côté client, réponse renvoyée au client)
RegisterNetEvent('kiwi-mdt:saveReport', function(requestId, report)
    local src = source
    if not report then
        TriggerClientEvent('kiwi-mdt:saveReport:resp', src, requestId, { success = false, error = 'Données du rapport manquantes' })
        return
    end

    local reports = LoadReports()

    local reportId = tonumber(report.id)
    if reportId then
        -- Mise à jour
        local updated = false
        for i, rpt in ipairs(reports) do
            if rpt.id == reportId then
                reports[i] = report
                updated = true
                break
            end
        end
        if not updated then
            table.insert(reports, report)
        end
    else
        -- Nouveau
        local newId = 1
        for _, rpt in pairs(reports) do
            if rpt.id and rpt.id >= newId then
                newId = rpt.id + 1
            end
        end
        report.id = newId
        reportId = newId
        table.insert(reports, report)
    end

    local success = SaveReports(reports)

    if success then
        TriggerClientEvent('kiwi-mdt:saveReport:resp', src, requestId, { success = true, reportId = reportId })
        print('Rapport sauvegardé - ID: ' .. reportId)
    else
        TriggerClientEvent('kiwi-mdt:saveReport:resp', src, requestId, { success = false, error = 'Erreur lors de la sauvegarde' })
    end
end)

-- Charger les rapports
RegisterNetEvent('kiwi-mdt:loadReports', function(requestId)
    local src = source
    local reports = LoadReports()
    TriggerClientEvent('kiwi-mdt:loadReports:resp', src, requestId, { success = true, reports = reports })
end)

-- Supprimer un rapport
RegisterNetEvent('kiwi-mdt:deleteReport', function(requestId, reportId)
    local src = source
    reportId = tonumber(reportId)
    if not reportId then
        TriggerClientEvent('kiwi-mdt:deleteReport:resp', src, requestId, { success = false, error = 'ID invalide' })
        return
    end
    local reports = LoadReports()
    local filtered = {}
    for _, rpt in ipairs(reports) do
        if rpt.id ~= reportId then
            table.insert(filtered, rpt)
        end
    end
    local success = SaveReports(filtered)
    TriggerClientEvent('kiwi-mdt:deleteReport:resp', src, requestId, { success = success })
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