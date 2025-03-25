<template>
    <div class="admin-menu-overlay">
        <div class="admin-menu">
            <h1>Menu Administrateur</h1>
            <div class="button-group">

                <!-- Obtenir la position -->
                <button @click="getPosition">📍 Obtenir la position</button>
                <div v-if="admin.positionVisible" class="modal">
                    <div class="modal-content">

                        <h2>Position</h2>
                        <p> X {{ admin.position.x }} | Y {{ admin.position.y }} | Z {{ admin.position.z }}</p>
                        <button @click="copyCoordsToClipboard">📋 Copier les coordonnées</button>
                        <button class="close" @click="admin.positionVisible = false">✖ Fermer</button>
                    </div>
                </div>

                <!-- etablisement du PNJ -->
                <button @click="admin.locationVisible = !admin.locationVisible">📍 Etablissement du PNJ</button>
                <div v-if="admin.locationVisible" class="modal">
                    <div class="modal-content">
                        <h2>Etablissement du PNJ</h2>
                        <select v-model="admin.location">
                            <option disabled value="">-- Sélectionner un établissement --</option>
                            <option v-for="location in admin.locationList" :key="location.model" :value="location.model">
                                {{ location.label }}
                            </option>
                        </select>
                        <button @click="setLocation">✅ Valider</button>
                        <button class="close" @click="admin.locationVisible = false">❌ Annuler</button>
                    </div>
                </div>

                <!-- Placer un PNJ -->
                <button @click="admin.npcSelectorVisible = !admin.npcSelectorVisible">📍 Placer un PNJ</button>
                <div v-if="admin.npcSelectorVisible" class="modal">
                    <div class="modal-content">
                        <h2>Choisir un PNJ</h2>
                        <select v-model="admin.npcSelector">
                            <option disabled value="">-- Sélectionner un PNJ --</option>
                            <option v-for="npc in admin.npcList" :key="npc.model" :value="npc.model">
                                {{ npc.label }}
                            </option>
                        </select>
                        <div class="modal-buttons">
                            <button @click="setNpc">✅ Valider</button>
                            <button class="close" @click="admin.npcSelectorVisible = false">❌ Annuler</button>
                        </div>
                    </div>
                </div>

                <button class="close" @click="close">✖ Fermer</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { sendNui } from '../utils/nui'
import { useAdminStore } from '../stores/adminStore'
import { useUiStore } from '../stores/uiStore'

const admin = useAdminStore()
const ui = useUiStore()     


const copyCoordsToClipboard = () => {
    const text = `${admin.position.x.toFixed(1)}f, ${admin.position.y.toFixed(1)}f, ${admin.position.z.toFixed(1)}f`

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


const setNpc = async () => {
    if (!admin.npcSelector) return;
    console.log('PNJ selectionné : ', admin.npcSelector);

    sendNui('admin-spawn', {
        model: admin.npcSelector
    });

    admin.npcSelectorVisible = false;
    admin.npcSelector = "";
}

const setLocation = async () => {
    if (!admin.location) return;
    console.log('lieu selectionné : ', admin.location);

    sendNui('admin-location', {
        location: admin.location
    });

    admin.locationVisible = false;
    admin.location = "";
}

const getPosition = async () => {
    sendNui('admin-getpos');
}

const close = async () => {
    sendNui('ui-close'); 
    ui.closeMenu()  
}


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