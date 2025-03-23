// gérer le hud (ex : barre de vie, barre de soif, barre de faim, dollars, ville, raccourcis 1 a 4, etc.)      

import { defineStore } from 'pinia'

export const useHudStore = defineStore('hud', {
    state: () => ({
        name: 'Player', // nom du joueur
        hunger: 0, // faim
        thirst: 0, // soif
        tiredness: 0, // fatigue
        recovery: 0, // récupération
        drugs:[], // drogues
        sick: [], // maladies
        activeBuffs: [], // buffs actifs
        money: 0, // dollars sur soi   
        zone: 'Valentine', // ville en cours
        weather: 'Soleil', // temps
        temperature: 20, // température
        currentTime: '12:00', // heure
        shortcuts: [], // raccourcis 1 a 4
        notification: [] // notifications
    }),
    actions: {
        update(data) {
            this.hunger = data.hunger ?? this.hunger
            this.thirst = data.thirst ?? this.thirst
            this.tiredness = data.tiredness ?? this.tiredness
            this.recovery = data.recovery ?? this.recovery
            this.drugs = data.drugs ?? this.drugs
            this.sick = data.sick ?? this.sick
            this.activeBuffs = data.activeBuffs ?? this.activeBuffs
            this.money = data.balance ?? this.money
            this.city = data.city ?? this.city
            this.shortcuts = data.shortcuts ?? this.shortcuts
            this.notification = data.notification ?? this.notification
        }
    },
    getters: {
        getHunger: (state) => state.hunger,
        getThirst: (state) => state.thirst,
        getTiredness: (state) => state.tiredness,
        getRecovery: (state) => state.recovery,
        getDrugs: (state) => state.drugs,
        getSick: (state) => state.sick,
        getActiveBuffs: (state) => state.activeBuffs,
        getMoney: (state) => state.money,
        getCity: (state) => state.city,
        getShortcuts: (state) => state.shortcuts    
    },
})
