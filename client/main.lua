local isVisible = false

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

-- Bonus : fermeture par touche ESC (natif FiveM)
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        SetNuiFocus(false, false)
    end
end)