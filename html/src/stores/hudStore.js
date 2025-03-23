// gérer le hud (ex : barre de vie, barre de soif, barre de faim, dollars, ville, raccourcis 1 a 4, etc.)      

import { defineStore } from 'pinia'

export const useHudStore = defineStore('hud', {
    state: () => ({
        health: 0,
        thirst: 0,
        hunger: 0,
        money: 0,
        city: '',
        shortcuts: []   
    }),
    actions: {
        setHudData(data) {
            this.health = data.health ?? this.health
            this.thirst = data.thirst ?? this.thirst
            this.hunger = data.hunger ?? this.hunger
            this.money = data.money ?? this.money
            this.city = data.city ?? this.city
            this.shortcuts = data.shortcuts ?? this.shortcuts
        }   
    },
    getters: {
        getHealth: (state) => state.health,
        getThirst: (state) => state.thirst,
        getHunger: (state) => state.hunger,
        getMoney: (state) => state.money,
        getCity: (state) => state.city,
        getShortcuts: (state) => state.shortcuts    
    },
})
