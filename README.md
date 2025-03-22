# 📦 Installation
cd html
npm install

# 🚀 Dev mode (avec hot reload)
npm run dev

# 🛠️ Build pour RedM
npm run build

# Puis en jeu, tape :
/menu




# SendNUIMessage() → envoyer des infos du jeu vers le menu.
# fetch() côté Svelte → envoyer des infos du menu vers Lua (ou C#).

[Svelte NUI] → fetch → [client.lua] → TriggerServerEvent → [C# server]
[C# server] → TriggerClientEvent → [client.lua] → SendNUIMessage → [Svelte NUI]
