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
        inventory: [
            {
                id: 'lancaster',
                name: 'Lancaster',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'weapon',
                tags: ['domaged']
            },
            {
                id: 'graines-de-coca',
                name: 'Graines de coca',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'seed',
                tags: ['illegal']
            },
            {
                id: 'cocaine',
                name: 'Cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'drug',
                tags: ['illegal']
            },
            {
                id: 'pain-rustique',
                name: 'Pain rustique',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'food',
                tags: ['stolen']
            },
            {
                id: 'peau-de-cerf',
                name: 'Peau de cerf',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'neutral',             
                tags: []
            },
            {
                id: 'viande-de-cerf',
                name: 'Viande de cerf',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'food',                
                tags: []
            },
            {
                id: 'pelle',
                name: 'Pelle',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'tool',                
                tags: []
            },
            {
                id: 'rateau',
                name: 'Rateau',
                quantity: 2,
                quality: 100,
                weight: 1,
                category: 'tool',         
                tags: []
            },
            {
                id: 'hache',
                name: 'Hache',
                quantity: 2,
                quality: 100,
                weight: 1,  
                category: 'tool',                
                tags: []
            },
            {
                id: 'arc',
                name: 'Arc',
                quantity: 2,
                quality: 100,
                weight: 1,  
                category: 'weapon',                
                tags: []
            },
            {
                id: 'arrosoir',
                name: 'Arrosoir',
                quantity: 2,
                quality: 100,
                weight: 1,      
                category: 'tool',                
                tags: []
            },
            {
                id: 'graines-de-canabis',
                name: 'Graines de cannabis',
                quantity: 2,
                quality: 100,
                weight: 1,          
                category: 'seed',                
                tags: ['illegal']
            },
            {
                id: 'graines-de-canne-a-sucre',
                name: 'Graines de canne à sucre',
                quantity: 2,
                quality: 100,
                weight: 1,          
                category: 'seed',                
                tags: []
            },
            {
                id: 'graines-de-coca',
                name: 'Graines de coca',
                quantity: 2,
                quality: 100,
                weight: 1,          
                category: 'seed',                
                tags: ['illegal']
            },
            {
                id: 'fertilizer',
                name: 'Fertilizer',
                quantity: 2,
                quality: 100,
                weight: 1,              
                category: 'seed',                
                tags: []
            },
            {
                id: 'viande-de-cerf-cuite',
                name: 'Viande de cerf cuite',
                quantity: 2,
                quality: 100,
                weight: 1,              
                category: 'food',                
                tags: []
            },
            {
                id: 'lancaster',
                name: 'Lancaster',
                quantity: 2,
                quality: 100,
                weight: 1,              
                category: 'weapon',                
                tags: []
            },
            {
                id: 'pioche',
                name: 'Pioche',
                quantity: 2,
                quality: 100,
                weight: 1,              
                category: 'tool',                
                tags: []
            },
            {
                id: 'gourde',
                name: 'Gourde',
                quantity: 2,
                quality: 100,
                weight: 1,  
                category: 'drink',                
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
        getInventory: (state) => state.inventory
    },
})
