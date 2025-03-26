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
                tags: ['dommaged', 'stolen']
            },
            {
                id: 'lancaster2',
                name: 'Lancaster2',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: ['stolen']
            },
            {
                id: 'cocaine',
                name: 'Cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: ['illegal']
            }
        ] // inventaire
    }),
    actions: {
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
