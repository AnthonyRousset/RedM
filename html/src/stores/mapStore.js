// afficher les icônes sur une carte style GTA/RDR

import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
    state: () => ({
        markers: []
    }),
    actions: {
        update(data) {
            console.log('update', data)
        },
        addMarker(marker) {
            this.markers.push(marker)
        }
    }
})  