// gérer le hud (ex : barre de vie, barre de soif, barre de faim, dollars, ville, raccourcis 1 a 4, etc.)      

import { defineStore } from 'pinia'

export const useHudStore = defineStore('hud', {
    state: () => ({
        zone: 'Valentine', // zone en cours
        weather: 'Soleil', // temps
        temperature: 20, // température
        currentTime: '12:00', // heure
        shortcuts: [], // raccourcis 1 a 4
        notification: [] // notifications
    }),
    actions: {
        update(data) {
            console.log('update', data)
            this.zone = data.zone ?? this.zone
            this.weather = data.weather ?? this.weather
            this.temperature = data.temperature ?? this.temperature
            this.currentTime = data.currentTime ?? this.currentTime
            this.shortcuts = data.shortcuts ?? this.shortcuts
            this.notification = data.notification ?? this.notification
        }
    },
    getters: {
        getZone: (state) => state.zone,
        getWeather: (state) => state.weather,
        getTemperature: (state) => state.temperature,
        getCurrentTime: (state) => state.currentTime,
        getShortcuts: (state) => state.shortcuts,
        getNotification: (state) => state.notification
    },
})
