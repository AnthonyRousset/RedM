import { handleNuiEvent } from 'nuiHandler.js'

export function registerNuiListener() {
  console.log('registerNuiListener')
  window.addEventListener('message', handleNuiEvent)
}
