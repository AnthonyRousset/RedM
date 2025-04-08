// gérer les vendeurs (ex : marchand d'arme, tailleur, forgerons, general store, palfrenier, etc.)
// BuyPrice : prix achat par la boutique
// SellPrice : prix vente par la boutique
// BuyAmount : montant max racheté par la boutique

import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
    state: () => ({
        isLoading: true,    
        id: 'nodata',
        stock: [], // inventaire du vendeur selectionné [ {item: [], BuyPrice: 0, SellPrice: 0, BuyAmount: 0} ]
        rank: 0, // rang du joueur (0 = joueur, 1 = interimaire, 2 = employé, 3 = contremaitre, 5 = Propriétaire(s))
        account: 0, // Argent restant du vendeur

    }),
    actions: { 
        update(data) {
            console.log('update', data)
            this.id = data.id || 'nodata'
            this.stock = data.stock || []
            this.rank = data.rank || 0
            this.account = data.account || 0
        }, 
        addItem(item) {
            this.stock.push(item)
        },
        removeItem(item) {
            this.stock = this.stock.filter(i => i !== item)
        },
        updateItem(item, quantity) {
            const index = this.stock.findIndex(i => i.name === item.name)
            if (index !== -1) {
                this.stock[index].quantity = quantity
            }
        }
    },
    getters: {
        getStock: (state) => state.stock,
        getRank: (state) => state.rank,
        getAccount: (state) => state.account
    }   
})