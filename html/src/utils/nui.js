/**
 * Appelle une fonction côté client via fetch NUI
 * @param {string} event - le nom de l'action côté client (ex: "admin-location")
 * @param {Object} data - les données à envoyer
 * @returns {Promise<any>} - réponse JSON ou null
 */
const IS_NUI = typeof GetParentResourceName === 'function'

export async function sendNui(event, data = {}) {
  if (!IS_NUI) {
    console.log(`[NUI MOCK] ${event}`, data)
    return // ou appelle une fonction de mock
  }

  try {
    fetch(`https://${GetParentResourceName()}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(error => {
      console.error(`[NUI] Erreur lors de l'appel à "${event}"`, error)
    })
  } catch (error) {
    console.error(`[NUI] Exception JS lors de l'appel à "${event}"`, error)
  }
}
