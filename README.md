# 📦 Installation
cd html
npm install

# 🚀 Dev mode (avec hot reload)
npm run dev

# 🛠️ Build pour RedM
npm run build

# Puis tu places le dossier dans resources/ de ton serveur RedM, et tu ajoutes ensure nui-svelte-starter dans ton server.cfg.
ensure nui-svelte-starter

# Puis en jeu, tape :
/menu




# SendNUIMessage() → envoyer des infos du jeu vers le menu.
# fetch() côté Svelte → envoyer des infos du menu vers Lua (ou C#).

# https://flowbite-svelte.com/docs/components/accordion

# 
[Svelte NUI] → fetch → [client.lua] → TriggerServerEvent → [C# server]
[C# server] → TriggerClientEvent → [client.lua] → SendNUIMessage → [Svelte NUI]
