// gérer les vendeurs (ex : marchand d'arme, tailleur, forgerons, general store, palfrenier, etc.)

import { defineStore } from 'pinia'

export const useVendorStore = defineStore('vendor', {
    state: () => ({
        vendors: [], // liste des vendeurs {name: '', inventory: [], price: 0, quantity: 0}
        selectedVendor: null, // vendeur selectionné
        inventory: [], // inventaire du vendeur selectionné
        price: 0, // prix du vendeur selectionné
        quantity: 0 // quantité du vendeur selectionné
    }),
    actions: {  
        setVendors(vendors) {
            this.vendors = vendors
        },
        setSelectedVendor(vendor) {
            this.selectedVendor = vendor
        },
        setInventory(inventory) {
            this.inventory = inventory
        },
        setPrice(price) {
            this.price = price
        },
        setQuantity(quantity) {
            this.quantity = quantity
        },
        addItem(item) {
            this.inventory.push(item)
        },
        removeItem(item) {
            this.inventory = this.inventory.filter(i => i !== item)
        },
        updateItem(item, quantity) {
            const index = this.inventory.findIndex(i => i.name === item.name)
            if (index !== -1) {
                this.inventory[index].quantity = quantity
            }
        }
    },
    getters: {
        getVendors: (state) => state.vendors,
        getSelectedVendor: (state) => state.selectedVendor,
        getInventory: (state) => state.inventory,
        getPrice: (state) => state.price,
        getQuantity: (state) => state.quantity
    }   
})