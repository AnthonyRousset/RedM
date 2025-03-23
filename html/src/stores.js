import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isMenuOpen: false,
    notification: null,
  }),
  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    showNotification(message) {
      this.notification = message
      setTimeout(() => this.notification = null, 3000)
    },
  },
})
