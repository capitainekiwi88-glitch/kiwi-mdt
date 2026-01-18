fx_version 'cerulean'
game 'gta5'

author 'Kiwi'
description 'Mobile Data Terminal'
version '1.0.0'

ui_page 'build/index.html'

files {
    'build/**',
    'reports_data.json'  -- Fichier de sauvegarde des rapports
}

client_script 'client/main.lua'
server_script 'server/main.lua'

lua54 'yes'