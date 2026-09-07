AddEventHandler("onResourceStart", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then
        return
    end

    print("[advanced-loadscreen] Resource started. Configure media and staff in html/config.js")
end)

RegisterCommand("loadscreeninfo", function(source)
    if source == 0 then
        print("[advanced-loadscreen] Media and staff settings are located in html/config.js")
        return
    end

    if not IsPlayerAceAllowed(source, "advanced-loadscreen.info") then
        return
    end

    TriggerClientEvent("chat:addMessage", source, {
        color = { 90, 220, 255 },
        args = { "Loadscreen", "Media and staff settings are configured in html/config.js" }
    })
end, false)
