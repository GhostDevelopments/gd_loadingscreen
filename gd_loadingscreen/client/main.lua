local shutdownStarted = false

--- Shut down the manual loading screen after the client has joined the session
--- @return nil
local function shutdownLoadingScreen()
    if shutdownStarted then
        return
    end

    shutdownStarted = true
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
end

CreateThread(function()
    while not NetworkIsSessionStarted() do
        Wait(250)
    end

    Wait(1000)
    shutdownLoadingScreen()
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        shutdownLoadingScreen()
    end
end)
