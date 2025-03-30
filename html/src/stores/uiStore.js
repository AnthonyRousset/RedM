// gérer les menus (ex : menu ouvert ou fermé )
// menu : 'bank', 'character', 'inventory', 'admin', 'lore', 'vendor', 'craft' 

import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        visible: false, // hud visible
        menu: '',
        isClosing: false,
        open: false
    }),
    actions: {
        update(data) {
            console.log('update', data)
        },
        openMenu(menu) {
            console.log('openMenu', menu)
            this.menu = menu
            this.open = true
        },
        closeMenu() {
            this.menu = ''
            this.open = false
        }
    }
})  

