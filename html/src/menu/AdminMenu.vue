<template>
    <div class="admin-menu-overlay">
        <div class="admin-menu">
            <h1>Menu Administrateur</h1>
            <div class="button-group">
                <button @click="healPlayer">💉 Heal Joueur</button>
                <button @click="tpPlayer">🧭 Téléportation</button>
                <button @click="giveMoney">💰 Donner de l'argent</button>
                
                <!-- Obtenir la position -->
                <button @click="getPosition">📍 Obtenir la position</button>
                <div v-if="positionVisible" class="modal">
                    <div class="modal-content">

                        <h2>Position</h2>
                        <p>  X {{ position.x }} | Y {{ position.y }} | Z {{ position.z }}</p>   
                        <button @click="copyCoordsToClipboard">📋 Copier les coordonnées</button>
                        <button class="close" @click="closePosition">✖ Fermer</button> 
                    </div>
                </div>
                    
                <!-- etablisement du PNJ -->
                <button @click="openLocation">📍 Etablissement du PNJ</button>   
                <div v-if="locationVisible" class="modal">
                    <div class="modal-content">
                        <h2>Etablissement du PNJ</h2>
                        <select v-model="selectedLocation">
                            <option disabled value="">-- Sélectionner un établissement --</option>
                            <option v-for="location in locationList" :key="location.model" :value="location.model">
                                {{ location.label }}
                            </option>
                        </select>
                        <button @click="setLocation">✅ Valider</button>
                        <button class="close" @click="closeLocation">❌ Annuler</button>
                    </div>
                </div>

                <!-- Placer un PNJ -->
                <button @click="openNpcSelector">📍 Placer un PNJ</button>
                <div v-if="npcSelectorVisible" class="modal">
                    <div class="modal-content">
                        <h2>Choisir un PNJ</h2>
                        <select v-model="selectedNpc">
                            <option disabled value="">-- Sélectionner un PNJ --</option>
                            <option v-for="npc in npcList" :key="npc.model" :value="npc.model">
                                {{ npc.label }}
                            </option>
                        </select>
                        <div class="modal-buttons">
                            <button @click="setNpc">✅ Valider</button>
                            <button class="close" @click="closeNpcSelector">❌ Annuler</button>
                        </div>
                    </div>
                </div>

                <button class="close" @click="close">✖ Fermer</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const npcSelectorVisible = ref(false)
const positionVisible = ref(false)
const locationVisible = ref(false)
const selectedNpc = ref("")
const selectedLocation = ref("")
const position = ref("")    
const npcList = ref([
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
])
const locationList = ref([
    { label: "Banque", model: "bank" },
    { label: "Boucherie", model: "butcher" },
    { label: "Peche", model: "fish" },
    { label: "Chasse", model: "hunter" },
    { label: "Drogue", model: "drug" },
    { label: "Médecin", model: "doctor" },
    { label: "Tenancier", model: "bar" }
])



const copyCoordsToClipboard = () => {
  const text = `${position.value.x.toFixed(1)}f, ${position.value.y.toFixed(1)}f, ${position.value.z.toFixed(1)}f`

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const success = document.execCommand('copy')
    if (success) {
      console.log('Coordonnées copiées !')
    } else {
      console.warn('Échec de la copie')
    }
  } catch (err) {
    console.error('Erreur lors de la copie :', err)
  }

  document.body.removeChild(textarea)
}


const openNpcSelector = () => {
    npcSelectorVisible.value = true
}
const closeNpcSelector = () => {
    npcSelectorVisible.value = false
    selectedNpc.value = ""
}

const openLocation = () => {
    locationVisible.value = true
}
const closeLocation = () => {
    locationVisible.value = false
    selectedLocation.value = ""
}   

const closePosition = () => {
    positionVisible.value = false
}


const setNpc = () => {
    if (!selectedNpc.value) return
    console.log('PNJ selectionné : ', selectedNpc.value)

    fetch(`https://${GetParentResourceName()}/admin-spawn`, {
        method: 'POST',
        body: JSON.stringify({ model: selectedNpc.value })
    })
    closeNpcSelector()
}

const setLocation = () => {
    if (!selectedLocation.value) return
    console.log('lieu selectionné : ', selectedLocation.value)
    fetch(`https://${GetParentResourceName()}/admin-location`, {
        method: 'POST',
        body: JSON.stringify({ location: selectedLocation.value })
    })
    closeLocation()
}

const getPosition = () => {
    fetch(`https://${GetParentResourceName()}/admin-getpos`, { method: 'POST' })
} 

const close = () => {
    fetch(`https://${GetParentResourceName()}/admin-close`, {
        method: 'POST'
    })
} 

onMounted(() => {
  window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
        case 'admin:pos':
            console.log(data)
            position.value = data.info  
            positionVisible.value = true
            break;
    }
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500&display=swap');

.admin-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.admin-menu {
    background: #f5f1e3;
    /* Beige parchemin */
    border: 3px solid #5a3e2b;
    /* Brun bois */
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    width: 400px;
    text-align: center;
    font-family: 'Cinzel', serif;
}

.admin-menu h1 {
    margin-bottom: 1.5rem;
    color: #4e2e1e;
    font-size: 1.8rem;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

button {
    background-color: #7a5c43;
    /* cuir/bois */
    border: none;
    padding: 0.8rem 1rem;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background-color: #b18d4a;
    /* doré au survol */
}

button.close {
    background-color: #a94442;
}

button.close:hover {
    background-color: #c76565;
}

.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  
  .modal-content {
    background: #f5f1e3;
    padding: 1.5rem;
    border: 2px solid #5a3e2b;
    border-radius: 10px;
    width: 350px;
    text-align: center;
  }
  
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  
</style>