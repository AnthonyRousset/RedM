// gérer l'inventaire (ex : ajouter, retirer, modifier, etc.) 

import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: []
    }),
    actions: {
        update(data) {
            console.log('update', data)
            this.items = data.items ?? this.items
        },
        addItem(item) {
            this.items.push(item)
        },
        removeItem(item) {
            this.items = this.items.filter(i => i !== item)
        },
        updateItem(item, quantity) {
            const index = this.items.findIndex(i => i.name === item.name)
            if (index !== -1) {
                this.items[index].quantity = quantity
            }
        },
        setInventory(items) {
            this.items = Array(20).fill(null)
        
            items.forEach(item => {
              if (item.slot >= 0 && item.slot < this.items.length) {
                this.items[item.slot] = item
              }
            })
        },  
    },
    getters: {
        getItemQuantity(state) {
            return (itemName) => {
                const item = state.items.find(i => i.name === itemName)
                return item ? item.quantity : 0
            }
        }
    },
})
