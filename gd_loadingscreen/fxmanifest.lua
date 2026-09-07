fx_version "cerulean"
game "gta5"

author "Ghost Developments"
description "Advanced media loading screen with FiveMManage media, and staff branding"
version "1.0.16"

loadscreen "html/ui.html"
loadscreen_manual_shutdown "yes"

files {
    "html/ui.html",
    "html/style.css",
    "html/script.js",
    "html/config.js",
    "html/logo.png"
}

client_script "client/main.lua"
server_script "server/main.lua"
