// gérer les vendeurs (ex : marchand d'arme, tailleur, forgerons, general store, palfrenier, etc.)
// BuyPrice : prix achat par la boutique
// SellPrice : prix vente par la boutique
// BuyAmount : montant max racheté par la boutique
// shop-money-withdraw-{ID}	{ amount: int, shopId: string }
// shop-money-deposit-{ID}	{ amount: int, shopId: string }
// shop-catalogue-add-{ID}	{ shopId: string, itemId: string, buyPrice: int, buyAmount: int, sellPrice: int }
// shop-catalogue-update-{ID}	{ shopId: string,  itemId: string, buyPrice: int, buyAmount: int, sellPrice: int }
// shop-catalogue-remove-{ID}	{ shopId: string,itemId: string  }
// shop-catalogue-clear-{ID}	{ shopId: string,itemId: string }
// shop-employee-add-{ID}	{ shopId: string, name: string, playerId: int , rank: int }
// shop-employee-remove-{ID}	{ shopId: string, name: string, rank: int }
// shop-employee-update-{ID}	{ shopId: string, name: string , rank: int }
// shop-employee-list-{ID}	{ shopId: 515454 }
// shop-stock-add-uniq-{ID}	{ complexId: string, shopId: string }
// shop-stock-add-stack-{ID}	{ idItem: string, quantity: int, shopId: string }
// shop-stock-remove-uniq-{ID}	{complexId: string, shopId: string }
// shop-stock-remove-stack-{ID}	{ idItem: string, quantity: int, shopId: string }
// shop-buy-{ID}	{ idItem: string, quantity: int, shopId: string}
// shop-sell-{ID}	{ idItem: string, quantity: int, shopId: string}
// shop-close-{ID}	{ id: 515454}

import { defineStore } from 'pinia'
import { sendNui } from '../utils/nui'

export const useShopStore = defineStore('shop', {
    state: () => ({
        isLoading: true,    
        id: 'nodata',
        stock: [
            
            {
                id: 'weapon_lancaster_rifle',
                quantity: 2000,
                quality: 100,
                weight: 3000,
                tags: [0],
                category: 1,
                durability: 12
              },
              {
                id: 'plant_seeds_coca',
                quantity: Math.floor(Math.random() * 1000),
                quality: 1012120,
                weight: 10,
                tags: [],
                category: 0
              },
              {
                id: 'drug_cocaine',
                quantity: Math.floor(Math.random() * 1000),
                quality: 104450,
                weight: 200,
                tags: [2],
                category: 0
              },
              {
                id: 'food_bread',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 500,
                category: 0
              },
              {
                id: 'animal_deer_skin',
                quantity: Math.floor(Math.random() * 1000),
                quality: 1045450,
                weight: 500,
                tags: [],
                category: 0
              },
              {
                id: 'animal_deer_meat_cooked',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 1000,
                tags: [],
                category: 0
              },
              {
                id: 'tool_pickaxe',
                quantity: Math.floor(Math.random() * 1000),
                quality: 1045450,
                weight: 2000,
                tags: [],
                category: 4,
                durability: 75
              },
              {
                id: 'tool_rake',
                quantity: Math.floor(Math.random() * 1000),
                quality: 1454500,
                weight: 1500,
                tags: [],
                category: 4,
                durability: 45
              },
              {
                id: 'tool_axe',
                quantity: Math.floor(Math.random() * 1000),
                quality: 25,
                weight: 2000,
                tags: [],
                category: 4,
                durability: 100
              },
              {
                id: 'weapon_bow',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 2000,
                tags: [],
                category: 1,
                durability: 80
              },
              {
                id: 'tool_watering_can',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 1000,
                tags: [],
                category: 8,
                durability: 100
              },
              {
                id: 'plant_seeds_hemp',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 10,
                category: 0
              },
              {
                id: 'plant_seeds_sugarcane',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 100,
                tags: [],
                category: 0
              },
              {
                id: 'plant_seeds_coca',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 10,
                tags: [2],
                category: 0
              },
              {
                id: 'plant_fertilizer',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 500,
                tags: [],
                category: 0
              },
              {
                id: 'animal_deer_meat_cooked',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 1000,
                tags: []
              },
              {
                id: 'weapon_lancaster_rifle',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 3000,
                tags: [],
                category: 1,
                durability: 100
              },
              {
                id: 'tool_shovel',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 2000,
                category: 4,
                tags: [0],
                durability: 100
              },
              {
                id: 'item_water_bottle',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 1000,
                category: 8,
                tags: []
              },
              {
                id: 'weapon_lancaster_rifle',
                quantity: Math.floor(Math.random() * 1000),
                quality: 100,
                weight: 3000,
                tags: [],
                category: 1,
                durability: 100
              },
        ], // inventaire du vendeur selectionné [ {item: [], BuyPrice: 0, SellPrice: 0, BuyAmount: 0} ]
        catalogue: [
            {
                id: 'weapon_lancaster_rifle',
                buyPrice: 0, // prix d'achat par la boutique
                sellPrice: Math.floor(Math.random() * 10000), // prix de vente
                buyAmount: 0 // quantité max racheté par la boutique
            },
            {
                id: 'plant_seeds_coca',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: 0,
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'food_bread',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'animal_deer_skin',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'animal_deer_meat_cooked',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'tool_pickaxe',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'tool_rake',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'tool_axe',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'weapon_bow',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'tool_watering_can',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },
            {
                id: 'plant_seeds_hemp',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
                buyAmount: Math.floor(Math.random() * 100)
            },

        ],
        itemToSell: [], // en vente par la boutique
        itemToBuy: [], // racheté par la boutique
        rank: 0, // rang du joueur (0 = joueur, 1 = interimaire, 2 = employé, 3 = contremaitre, 5 = Propriétaire(s))
        account: 0, // Argent restant du vendeur
        lastActiveTab: 'magasin', // dernier onglet actif

    }),
    actions: { 
        update(data) {
            console.log('shopStore > update()', data)
            this.id = data.id || this.id    
            this.stock = data.stock || this.stock
            this.rank = data.rank || this.rank
            this.account = data.account || this.account
            this.catalogue = data.catalogue || this.catalogue
            this.itemToSell = this.itemToSell(data.catalogue)
            this.itemToBuy = this.itemToBuy(data.catalogue)
        }, 
        addItem(item) {
            console.log('shopStore > addItem()', item)
            this.stock.push(item)
        },
        removeItem(item) {
            console.log('shopStore > removeItem()', item)
            this.stock = this.stock.filter(i => i !== item)
        },
        updateItem(item, quantity) {
            console.log('shopStore > updateItem()', item, quantity)
            const index = this.stock.findIndex(i => i.name === item.name)
            if (index !== -1) {
                this.stock[index].quantity = quantity
            }
        },
        sendNuiBuy(data) {
            sendNui('shop-buy-'+this.id, { idItem: data.idItem, quantity: data.quantity, shopId: this.id })
        },
        sendNuiSell(data) {
            sendNui('shop-sell-'+this.id, { idItem: data.idItem, quantity: data.quantity, shopId: this.id })
        },
        sendNuiClose(data) {
            sendNui('shop-close-'+this.id, { id: this.id })
        },
        
        sendNuiAddCatalogue(data) {
            sendNui('shop-catalogue-add-'+this.id, { shopId: this.id, itemId: data.idItem, buyPrice: data.buyPrice, buyAmount: data.buyAmount, sellPrice: data.sellPrice })
        },
        sendNuiUpdateCatalogue(data) {
            sendNui('shop-catalogue-update-'+this.id, { shopId: this.id, itemId: data.idItem, buyPrice: data.buyPrice, buyAmount: data.buyAmount, sellPrice: data.sellPrice })
        },  
        sendNuiRemoveCatalogue(data) {  
            sendNui('shop-catalogue-remove-'+this.id, { shopId: this.id, itemId: data.idItem })
        },
        sendNuiClearCatalogue(data) {
            sendNui('shop-catalogue-clear-'+this.id, { shopId: this.id })
        },  

        sendNuiAddEmployee(data) {
            sendNui('shop-employee-add-'+this.id, { shopId: this.id, name: data.name, playerId: data.playerId, rank: data.rank })
        },
        sendNuiRemoveEmployee(data) {    
            sendNui('shop-employee-remove-'+this.id, { shopId: this.id, name: data.name, rank: data.rank })
        },
        sendNuiUpdateEmployee(data) {
            sendNui('shop-employee-update-'+this.id, { shopId: this.id, name: data.name, rank: data.rank })
        },  
        sendNuiListEmployee(data) {
            sendNui('shop-employee-list-'+this.id, { shopId: this.id })
        },  

        sendNuiMoneyWithdraw(data) {
            sendNui('shop-money-withdraw-'+this.id, { shopId: this.id, amount: data.amount })
        },
        sendNuiMoneyDeposit(data) {  
            sendNui('shop-money-deposit-'+this.id, { shopId: this.id, amount: data.amount })
        },

        sendNuiAddStockUniq(data) {
            sendNui('shop-stock-add-uniq-'+this.id, { shopId: this.id, complexId: data.complexId })
        },
        sendNuiRemoveStockUniq(data) {
            sendNui('shop-stock-remove-uniq-'+this.id, { shopId: this.id, complexId: data.complexId })
        },
        sendNuiAddStockStack(data) {
            sendNui('shop-stock-add-stack-'+this.id, { shopId: this.id, idItem: data.idItem, quantity: data.quantity })
        },  
        sendNuiRemoveStockStack(data) {
            sendNui('shop-stock-remove-stack-'+this.id, { shopId: this.id, idItem: data.idItem, quantity: data.quantity })
        },
        

    },
    getters: {
        getStock: (state) => state.stock,
        getRank: (state) => state.rank,
        getItemCatalogue: (state) => {

        },
        getAccount: (state) => state.account,
        /*
        getBuyPrice: (state) => (item) => {
            console.log('shopStore > getBuyPrice()', item)
            let id = item.id
            let catalogue = state.catalogue.find(i => i.id === id)
            console.log('shopStore > catalogue()', catalogue)
            let buyPrice = catalogue.buyPrice
            if (!buyPrice) { return 0 }
            return buyPrice
        },
        getBuyQuantity: (state) => (item) => {
            console.log('shopStore > item()', item)
            let id = item.id
            console.log('shopStore >  state.catalogue()',  state.catalogue)
            let catalogue = state.catalogue.find(i => i.id === id)
            console.log('shopStore > catalogue()', catalogue)
            let buyQuantity = catalogue.buyAmount
            if (!buyQuantity) { return 0 }
            return buyQuantity
        },*/
        itemToSell: (state) => {
            let items = []            
            state.catalogue.forEach(item => {
                let stockItem = state.stock.find(i => i.id === item.id).quantity
                item.sellAmount = stockItem
                if (item.sellPrice > 0) {
                    items.push(item)
                }
            })
            return items
        },
        itemToBuy: (state) => {
            let items = []
            state.catalogue.forEach(item => {
                if (item.buyAmount > 0 && item.buyPrice > 0) {
                    items.push(item)
                }
            })
            return items
        }
    }   
})