import { useUiStore } from '../stores/uiStore' // est le store qui gère le menu (ex : menu ouvert ou fermé )
import { useCaracterStore } from '../stores/caracterStore' // est le store qui gère le personnage (ex : nom, vie, force, etc.)
import { useHudStore } from '../stores/hudStore' // est le store qui gère le hud (ex : barre de vie, barre de soif, barre de faim, etc.) 
import { useInventoryStore } from '../stores/inventoryStore' // est le store qui gère l'inventaire (ex : inventaire ouvert ou fermé )
import { useAdminStore } from '../stores/adminStore' // est le store qui gère les actions admin (ex : spawn, location, etc.)


const handlers = {
  // character
  'character:open': () => {
    const ui = useUiStore()
    ui.openMenu('character')
  },

  // inventory
  'inventory:open': () => {
    const ui = useUiStore()
    ui.openMenu('inventory')
  },
  'inventory:update': (data) => {
    const inventory = useInventoryStore()
    inventory.setInventory(data)
  },

  // admin
  'admin:open': () => {
    console.log('admin:open')
    const ui = useUiStore()
    ui.openMenu('admin')
  },
  'admin:pos': (data) => {
    const admin = useAdminStore()
    admin.position = data.info  
    admin.positionVisible = true
  },

  // bank
  'bank:open': () => {
    const ui = useUiStore()
    ui.openMenu('bank')
  },
  'bank:update': (data) => {
    const bank = useBankStore()
    bank.update(data)
  },

  // hud
  'hud:update': (data) => {
    const hud = useHudStore()
    hud.update(data)
  },
  'metabolism:update': (data) => {
    const metabolism = useMetabolismStore()
    metabolism.update(data)
  },  
  'wallet:balance': (data) => {
    const wallet = useWalletStore()
    wallet.update(data)
  },    
  'player:update': (data) => {
    const player = usePlayerStore()
    player.update(data)
  },  
  'buffs:update': (data) => {
    const buffs = useBuffsStore()
    buffs.update(data)
  },  
  'weather:update': (data) => {
    const weather = useWeatherStore()
    weather.update(data)
  },    
  'location:update': (data) => {
    const location = useLocationStore()
    location.update(data)
  },  

  // notify
  'notify:message': (data) => {
    const notify = useNotifyStore()
    notify.update(data)
  },  

}





export function handleNuiEvent(event) {
  //if (event.origin !== 'https://nui-game-internal') return
  console.log('handleNuiEvent') 
  console.log(event.origin)

  if (!event.data || !event.data.type) return

  const { type, data } = event.data
  const handler = handlers[type]

  if (handler) {
    handler(data)
  } else {
    console.warn(`[NUI] Aucun handler pour le type: ${type}`)
  }
}
