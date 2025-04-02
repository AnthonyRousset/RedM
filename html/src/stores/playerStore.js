// gérer l'inventaire (ex : ajouter, retirer, modifier, etc.) 

import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        name: 'Player', // nom du joueur
        wallet: 9999, // cents sur soi (100 = 1$)
        hunger: 0, // faim
        thirst: 0, // soif
        tiredness: 0, // fatigue
        recovery: 0, // récupération
        drugs:[], // drogues
        sick: [], // maladies
        activeBuffs: [], // buffs actifs
        nearUsers: [], // joueurs proches
        itemEquipedId: null, // item équipé
        inventory: [
            {
                id: 'lancaster_rifle',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [0],
                category: 0
            },
            {
                id: 'coca_seeds',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [],
                category: 0
            },
            {
                id: 'cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [2],
                category: 0
            },
            {
                id: 'rustic_bread',
                quantity: 2,
                quality: 100,
                weight: 1,  
                tags: [1],
                category: 0
            },
            {
                id: 'deer_hide',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [],
                category: 0
            },
            {
                id: 'raw_deer_meat',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [],
                category: 0
            },
            {
                id: 'pickaxe',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [],
                category: 0
            },
            {
                id: 'rake',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [],
                category: 0
            },
            {
                id: 'axe',
                quantity: 2,
                quality: 100,
                weight: 1,  
                tags: [],
                category: 0
            },
            {
                id: 'weapon_bow',
                quantity: 2,
                quality: 100,
                weight: 1,  
                    tags: [],
                category: 0
            },
            {
                id: 'watering_can',
                quantity: 2,
                quality: 100,
                weight: 1,      
                tags: [],
                category: 0 
            },
            {
                id: 'cannabis_seeds',
                quantity: 2,
                quality: 100,
                weight: 1,          
                tags: [1],
                category: 0
            },
            {
                id: 'sugarcane_seeds',
                quantity: 2,
                quality: 100,
                weight: 1,          
                tags: [],
                category: 0
            },
            {
                id: 'coca_seeds',
                quantity: 2,
                quality: 100,
                weight: 1,          
                tags: [2],
                category: 0
            },
            {
                id: 'fertilizer',
                quantity: 2,
                quality: 100,
                weight: 1,              
                tags: [],
                category: 0
            },
            {
                id: 'cooked_deer_meat',
                quantity: 2,
                quality: 100,
                weight: 1,              
                tags: []
            },
            {
                id: 'lancaster_rifle',
                quantity: 2,
                quality: 100,
                weight: 1,              
                tags: [],
                category: 0
            },
            {
                id: 'shovel',
                quantity: 2,
                quality: 100,
                weight: 1,              
                category: 0,
                    tags: [0]
            },
            {
                id: 'water_bottle',
                quantity: 2,
                quality: 100,
                weight: 1, 
                category: 0,
                tags: []
            }
        ] // inventaire
    }),
    actions: {
        setInventory(data) {
            this.inventory = data
            console.log('setInventory-xaypho', this.inventory)
        },
        update(data) {
            console.log('update', data)
            this.name = data.name ?? this.name
            this.wallet = data.balance ?? this.wallet
            this.hunger = data.hunger ?? this.hunger
            this.thirst = data.thirst ?? this.thirst
            this.tiredness = data.tiredness ?? this.tiredness
            this.recovery = data.recovery ?? this.recovery
            this.drugs = data.drugs ?? this.drugs
            this.sick = data.sick ?? this.sick
            this.activeBuffs = data.activeBuffs ?? this.activeBuffs
            this.inventory = data.inventory ?? this.inventory
            this.nearUsers = data.nearUsers ?? this.nearUsers
        },
        setNearUsers(data) {
            this.nearUsers = data
        },
        setWeaponEquiped(data) {
            this.itemEquipedId = data.id
        },  
        useItem(id) {
            const item = this.inventory.find(item => item.id === id)
            if (item) {
                item.quantity -= 1 
            }
        },
        updateInventory(data) {
            console.log('=== Mise à jour de l\'inventaire ===')
            console.log('Nouvelles données:', JSON.stringify(data, null, 2))
            
            // Créer un Map pour stocker les items uniques
            const uniqueItems = new Map()
            
            // Parcourir les nouveaux items
            data.forEach(newItem => {
                // Si l'item existe déjà, fusionner les propriétés
                if (uniqueItems.has(newItem.id)) {
                    const existingItem = uniqueItems.get(newItem.id)
                    uniqueItems.set(newItem.id, {
                        ...existingItem,
                        ...newItem
                    })
                } else {
                    uniqueItems.set(newItem.id, newItem)
                }
            })
            
            // Convertir le Map en tableau
            const newInventory = Array.from(uniqueItems.values())
            console.log('Inventaire après fusion:', JSON.stringify(newInventory, null, 2))
            
            // Mettre à jour l'inventaire
            this.inventory = newInventory
            console.log('=== Fin de la mise à jour ===')
        },
        updatePosition(data) {
            console.log('updatePosition', data)
        }
    },
    getters: {
        getWallet: (state) => (state.wallet / 100).toFixed(2),
        getHunger: (state) => state.hunger,
        getThirst: (state) => state.thirst,
        getTiredness: (state) => state.tiredness,
        getRecovery: (state) => state.recovery,
        getDrugs: (state) => state.drugs,
        getSick: (state) => state.sick,
        getActiveBuffs: (state) => state.activeBuffs,
        getInventory: (state) => state.inventory,
        getNearUsers: (state) => state.nearUsers
    },
})
