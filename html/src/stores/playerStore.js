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
        drugs: [], // drogues
        sick: [], // maladies
        activeBuffs: [], // buffs actifs
        nearUsers: [], // joueurs proches
        itemEquipedId: null, // item équipé
        inventory: [] // inventaire
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
            this.nearUsers = data.nearUsers ?? this.nearUsers
        },
        updateInventory(data) {
            if (!data || !Array.isArray(data)) return
            
            console.log('=== Mise à jour de l\'inventaire ===')
            console.log('Données reçues:', data)

            // Garder les items existants qui sont dans data et les mettre à jour
            const updatedInventory = this.inventory
                .filter(currentItem => data.some(newItem => newItem.id === currentItem.id))
                .map(currentItem => {
                    const newItem = data.find(item => item.id === currentItem.id)
                    return {
                        ...currentItem,
                        quantity: newItem.quantity,
                        quality: newItem.quality,
                        weight: newItem.weight,
                        tags: newItem.tags || currentItem.tags,
                        category: newItem.category
                    }
                })

            // Ajouter les nouveaux items qui n'existaient pas avant
            const newItems = data.filter(newItem => 
                !this.inventory.some(currentItem => currentItem.id === newItem.id)
            )

            // Combiner les items existants mis à jour avec les nouveaux items
            this.inventory = [...updatedInventory, ...newItems]

            console.log('Inventaire mis à jour:', this.inventory)
            console.log('=== Fin de la mise à jour ===')
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
