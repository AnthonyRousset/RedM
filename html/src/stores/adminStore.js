// gérer les actions admin (ex : spawn, location, etc.)

import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        position: null,
        positionVisible: false,
        location: null,
        locationVisible: false,
        locationList: [
            { label: "Banque", model: "bank" },
            { label: "Boucherie", model: "butcher" },
            { label: "Peche", model: "fish" },
            { label: "Chasse", model: "hunter" },
            { label: "Drogue", model: "drug" },
            { label: "Médecin", model: "doctor" },
            { label: "Tenancier", model: "bar" }
        ],
        npcSelectorVisible: false,
        npcSelector: null,
        npcList: [
            { label: "Tenancier du saloon", model: "U_M_M_BARMAN_01" },
            { label: "Médecin", model: "U_M_M_DOCTOR_01" },
            { label: "U_M_M_ValDoctor_01", model: "U_M_M_ValDoctor_01" },
            { label: "Pecheur", model: "U_M_M_FISHERMAN_01" },
            { label: "CS_FISHCOLLECTOR", model: "CS_FISHCOLLECTOR" },
            { label: "Boucher", model: "U_M_M_BUTCHER_01" },
            { label: "S_M_M_UNIBUTCHERS_01", model: "S_M_M_UNIBUTCHERS_01" },
            { label: "Chasseur", model: "U_M_M_HUNTER_01" },
            { label: "U_M_M_UniBountyHunter_01", model: "U_M_M_UniBountyHunter_01" },
            { label: "Palefrenier", model: "U_M_M_PALFREY_01" },
            { label: "Vendeur de drogue", model: "U_M_M_DRUGSTORE_01" }
        ]
    }),
    actions: {
        update(data) {
            console.log('update', data)
        },
        setPosition(position) {
            this.position = position
        },
        setPositionVisible(visible) {
            this.positionVisible = visible
        },
        setLocation(location) {
            this.location = location
        },
        setLocationVisible(visible) {
            this.locationVisible = visible
        },
        setNpcSelector(npc) {
            this.npcSelector = npc
        },
        setNpcSelectorVisible(visible) {
            this.npcSelectorVisible = visible
        }
    }
})

