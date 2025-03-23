// gérer les menus (ex : menu ouvert ou fermé )
// menu : 'bank', 'character', 'inventory', 'admin', 'lore', 'vendor', 'craft' 

import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        menu: 'admin',
        open: false
    }),
    actions: {
        openMenu(menu) {
            this.menu = menu
            this.open = true
        },
        closeMenu() {
            this.menu = ''
            this.open = false
        }
    }
})  

