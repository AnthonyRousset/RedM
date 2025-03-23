/**
 * Appelle une fonction côté client via fetch NUI
 * @param {string} event - le nom de l'action côté client (ex: "admin-location")
 * @param {Object} data - les données à envoyer
 * @returns {Promise<any>} - réponse JSON ou null
 */
export async function sendNui(event, data = {}) {
    try {
      const res = await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
  
      if (!res.ok) {
        console.error(`[NUI] Échec de l'appel à "${event}" : ${res.status}`)
        return null
      }
  
      const json = await res.json()
      return json
    } catch (error) {
      console.error(`[NUI] Erreur lors de l'appel à "${event}"`, error)
      return null
    }
  }
  