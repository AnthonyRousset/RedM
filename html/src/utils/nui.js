/**
 * Appelle une fonction côté client via fetch NUI
 * @param {string} event - le nom de l'action côté client (ex: "admin-location")
 * @param {Object} data - les données à envoyer
 * @returns {Promise<any>} - réponse JSON ou null
 */

export async function sendNui(event, data = {}) {

  console.log(`[NUI envoie sur Client.cs] [${event}]`, data)

  try {
    fetch(`https://${GetParentResourceName()}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(error => {
      
    })
  } catch (error) {
    
  }
}
