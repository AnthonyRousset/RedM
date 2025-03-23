// afficher les règles / lois / factions (comme un menu "livret du shérif")

import { defineStore } from 'pinia'

export const useLoreStore = defineStore('lore', {
    state: () => ({
        rules: [],
        laws: [],
        factions: []
    }),
    actions: {
        update(data) {
            console.log('update', data)
        },
        setRules(rules) {
            this.rules = rules
        },
        setLaws(laws) {
            this.laws = laws
        },
        setFactions(factions) {
            this.factions = factions
        }
    }
})
