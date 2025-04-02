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
                tags: ['domaged'],
                category: 0
            },
            {
                id: 'coca_seeds',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: ['illegal'],
                category: 0
            },
            {
                id: 'cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: ['illegal'],
                category: 0
            },
            {
                id: 'rustic_bread',
                quantity: 2,
                quality: 100,
                weight: 1,  
                tags: ['stolen'],
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
                tags: ['illegal']
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
                tags: ['illegal'],
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
                    tags: []
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
