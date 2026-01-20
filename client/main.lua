local isVisible = false
local requestCounter = 0
local pending = {}

local function nextRequestId()
    requestCounter = requestCounter + 1
    return requestCounter
end

RegisterCommand('mdt', function()
    if isVisible then return end
    
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "setVisible", data = true })
    isVisible = true
end, false)

RegisterKeyMapping('mdt', 'Ouvrir le MDT', 'keyboard', 'F10')

-- Callback fermeture depuis React
RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "setVisible", data = false })
    isVisible = false
    cb('ok')
end)

-- NUI callbacks côté client qui relaient au serveur (persistence JSON)
RegisterNUICallback('saveReport', function(data, cb)
    local reqId = nextRequestId()
    pending[reqId] = cb or function() end
    TriggerServerEvent('kiwi-mdt:saveReport', reqId, data and data.report)
end)

RegisterNUICallback('loadReports', function(_, cb)
    local reqId = nextRequestId()
    pending[reqId] = cb or function() end
    TriggerServerEvent('kiwi-mdt:loadReports', reqId)
end)

RegisterNUICallback('deleteReport', function(data, cb)
    local reqId = nextRequestId()
    pending[reqId] = cb or function() end
    TriggerServerEvent('kiwi-mdt:deleteReport', reqId, data and data.id)
end)

-- Réponses serveur pour compléter les callbacks NUI
RegisterNetEvent('kiwi-mdt:saveReport:resp', function(requestId, payload)
    local cb = pending[requestId]
    if cb then
        cb(payload)
        pending[requestId] = nil
    end
end)

RegisterNetEvent('kiwi-mdt:loadReports:resp', function(requestId, payload)
    local cb = pending[requestId]
    if cb then
        cb(payload)
        pending[requestId] = nil
    end
end)

RegisterNetEvent('kiwi-mdt:deleteReport:resp', function(requestId, payload)
    local cb = pending[requestId]
    if cb then
        cb(payload)
        pending[requestId] = nil
    end
end)

-- Bonus : fermeture par touche ESC (natif FiveM)
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        SetNuiFocus(false, false)
    end
end)