// gérer les vendeurs (ex : marchand d'arme, tailleur, forgerons, general store, palfrenier, etc.)
// BuyPrice : prix achat par la boutique
// SellPrice : prix vente par la boutique
// BuyAmount : montant max racheté par la boutique

import { defineStore } from 'pinia'

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
                buyPrice: Math.floor(Math.random() * 10000), // prix d'achat par la boutique
                sellPrice: Math.floor(Math.random() * 10000), // prix de vente
                buyAmount: Math.floor(Math.random() * 100) // quantité max racheté par la boutique
            },
            {
                id: 'plant_seeds_coca',
                buyPrice: Math.floor(Math.random() * 10000),
                sellPrice: Math.floor(Math.random() * 10000),
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
        rank: 0, // rang du joueur (0 = joueur, 1 = interimaire, 2 = employé, 3 = contremaitre, 5 = Propriétaire(s))
        account: 0, // Argent restant du vendeur
        lastActiveTab: 'magasin', // dernier onglet actif

    }),
    actions: { 
        update(data) {
            console.log('shopStore > update()', data)
            this.id = data.id || this.id    
            //this.stock = data.stock || this.stock
            this.rank = data.rank || this.rank
            this.account = data.account || this.account
            //this.catalogue = data.catalogue || this.catalogue
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
        }
    },
    getters: {
        getStock: (state) => state.stock,
        getRank: (state) => state.rank,
        getItemCatalogue: (state) => {

        },
        getAccount: (state) => state.account,
        getBuyPrice: (state) => (item) => {
            let id = item.id
            let buyPrice = state.catalogue.find(i => i.id === id).buyPrice
            return buyPrice
        },
        getBuyQuantity: (state) => (item) => {
            let id = item.id
            let buyQuantity = state.catalogue.find(i => i.id === id).buyQuantity
            return buyQuantity
        },
        inItemCatalogue: (state) => (item) => {
            console.log('shopStore > inItemCatalogue()', item)
            let id = item.id
            console.log('shopStore > inItemCatalogue()', id)
            let inCatalogue = state.catalogue.find(i => i.id === id)
            console.log('shopStore > inItemCatalogue()', id, inCatalogue)
            return inCatalogue ? true : false
        }
    }   
})