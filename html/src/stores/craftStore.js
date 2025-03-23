// gérer les recettes de craft (ex : craft de bois, craft de pierre, craft de fer, craft de charbon, etc.)  

import { defineStore } from 'pinia'

export const useCraftStore = defineStore('craft', {
    state: () => ({
        recipes: []
    }),
    actions: {
        update(data) {
            console.log('update', data)
        },
        setRecipes(recipes) {
            this.recipes = recipes
        }
    }
})      
