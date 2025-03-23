import { handleNuiEvent } from './nuiHandler'

export function registerNuiListener() {
  window.addEventListener('message', handleNuiEvent)
}
