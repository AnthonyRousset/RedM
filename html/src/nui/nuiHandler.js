import { useUiStore } from '../stores/uiStore' // est le store qui gère le menu (ex : menu ouvert ou fermé )
import { useCaracterStore } from '../stores/caracterStore' // est le store qui gère le personnage (ex : nom, vie, force, etc.)
import { useHudStore } from '../stores/hudStore' // est le store qui gère le hud (ex : barre de vie, barre de soif, barre de faim, etc.) 
import { usePlayerStore } from '../stores/playerStore' // est le store qui gère le joueur (ex : nom, vie, force, etc.)
import { useAdminStore } from '../stores/adminStore' // est le store qui gère les actions admin (ex : spawn, location, etc.)
import { useBankStore } from '../stores/bankStore' // est le store qui gère les actions bancaires (ex : dépot, retrait, coffre, assurance, etc.)  

const handlers = {
  'start:show': () => {
    const ui = useUiStore()
    ui.visible = true
  },
  'start:hide': () => {
    const ui = useUiStore()
    ui.visible = false
  },

  // character
  'character:open': () => {
    const ui = useUiStore()
    ui.openMenu('character')
  },
  'character:close': () => {
    const ui = useUiStore()
    ui.closeMenu()
  },


  // inventory
  'inventory:open': () => {
    const ui = useUiStore()
    ui.openMenu('inventory')
  },  
  'inventory:close': () => {
    const ui = useUiStore()
    ui.closeMenu()
  },
  'inventory:update': (data) => {
    const inventory = usePlayerStore()
    inventory.updateInventory(data.info)
  },
  'inventory:update': (data) => {
    const inventory = usePlayerStore()
    inventory.setInventory(data.info) 
  },
  'inventory:near:users': (data) => {
    const inventory = usePlayerStore()
    inventory.setNearUsers(data.info)
  },
  'inventory:weapon:equip': (data) => {
    const inventory = usePlayerStore()
    inventory.setWeaponEquiped(data.info)
  },
  'inventory:weapon:unequip': (data) => {
    const inventory = usePlayerStore()
    inventory.setWeaponEquiped(null)
  },

  // admin
  'admin:open': () => {
    const ui = useUiStore()
    ui.openMenu('admin')
  },
  'admin:close': () => {
    const ui = useUiStore()
    ui.closeMenu()
  },  
  'admin:pos': (data) => {
    const admin = useAdminStore()
    admin.position = data.info  
    admin.positionVisible = true
  },

  // bank
  'bank:open': (data) => {
    const ui = useUiStore()
    const bank = useBankStore()
    bank.isLoading = true
    ui.openMenu('bank')
    bank.update(data.info)

  },
  'bank:info': (data) => {
    const bank = useBankStore()
    bank.update(data.info)
  },
  'bank:createSuccess': (data) => {
    const bank = useBankStore()
    bank.createSuccess(data.info)
  },

  // hud
  'hud:update': (data) => {
    const hud = useHudStore()
    hud.update(data.info)
  },
  'metabolism:update': (data) => {
    const metabolism = usePlayerStore()
    metabolism.update(data.info)
  },  
  'wallet:balance': (data) => {
    const wallet = usePlayerStore()
    wallet.update(data.info)
  },    
  'player:update': (data) => {
    //const player = usePlayerStore()
    //player.update(data.info)
  },  
  'buffs:update': (data) => {
    //const buffs = useBuffsStore()
    //buffs.update(data.info)
  },  
  'weather:update': (data) => {
    //const weather = useWeatherStore()
    //weather.update(data.info)
  },    
  'location:update': (data) => {
    //const location = useLocationStore()
    //location.update(data.info)
  },  

  // notify
  'notify:message': (data) => {
    //const notify = useNotifyStore()
    //notify.update(data.info)
  }

}





export function handleNuiEvent(event) {
  //if (event.origin !== 'https://nui-game-internal') return // sécurité pour ne pas accepter les messages de nui venant d'un autre site (ex : https://www.google.com) 

  const data = event.data;
  console.log(`[NUI envoie sur vue.js] [${data.action}]`, data)
  if (!event.data || !event.data.action) console.warn(`[NUI] ATTENTION : event.data.action n'existe pas`)
  if (!event.data || !event.data.info) console.warn(`[NUI] ATTENTION : data.INFO n'existe pas`)

  const action = event.data.action;
  const handler = handlers[action]

  if (handler) { 
    handler(data) // appelle la fonction handler avec les données
  } else {
    console.warn(`[NUI] Aucun handler pour le type: ${action}`)
  }
}
