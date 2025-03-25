<template>
    <div class="admin-menu-overlay">
        <div class="admin-menu">
            <h1>Menu Administrateur</h1>
            <div class="button-group">

                <!-- Obtenir la position -->
                <button @click="getPosition">📍 Obtenir la position</button>
                <div v-if="adminStore.positionVisible" class="modal">
                    <div class="modal-content">

                        <h2>Position</h2>
                        <p> X {{ adminStore.position.x }} | Y {{ adminStore.position.y }} | Z {{ adminStore.position.z }}</p>
                        <button @click="copyCoordsToClipboard">📋 Copier les coordonnées</button>
                        <button class="close" @click="adminStore.positionVisible = false">✖ Fermer</button>
                    </div>
                </div>

                <!-- etablisement du PNJ -->
                <button @click="adminStore.locationVisible = !adminStore.locationVisible">📍 Etablissement du PNJ</button>
                <div v-if="adminStore.locationVisible" class="modal">
                    <div class="modal-content">
                        <h2>Etablissement du PNJ</h2>
                        <select v-model="modelForm">
                            <option disabled value="">-- Sélectionner un établissement --</option>
                            <option v-for="location in adminStore.locationList" :key="location.model" :value="location">
                                {{ location.label }}
                            </option>
                        </select>
                        <input type="text" v-model="idForm" placeholder="ID du PNJ" class="id-input">
                        <div v-if="idFormError" class="id-input-error">Veuillez entrer un ID</div>
                        <div class="modal-buttons"> 
                            <button @click="setLocation">✅ Valider</button>
                            <button class="close" @click="adminStore.locationVisible = false">❌ Annuler</button>
                        </div>
                    </div>
                </div>

                <button class="close" @click="close">✖ Fermer</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendNui } from '../utils/nui'
import { useAdminStore } from '../stores/adminStore'
import { useUiStore } from '../stores/uiStore'

const adminStore = useAdminStore()
const uiStore = useUiStore()   
const modelForm = ref('')
const idForm = ref('')
const idFormError = ref(false)

const copyCoordsToClipboard = () => {
    const text = `${adminStore.position.x.toFixed(1)}f, ${adminStore.position.y.toFixed(1)}f, ${adminStore.position.z.toFixed(1)}f`

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


const setLocation = async () => {
    if (!modelForm.value) return idFormError.value = true;
    if (!idForm.value) return idFormError.value = true;
    console.log('lieu selectionné : ', modelForm.value);
    console.log('id : ', idForm.value);

    sendNui('admin-location', {
        type: modelForm.value.model,
        id: idForm.value    
    });

    adminStore.locationVisible = false;
    modelForm.value = '';
    idForm.value = '';
}

const getPosition = async () => {
    sendNui('admin-getpos');
}

const close = async () => {
    sendNui('ui-close'); 
    uiStore.closeMenu()  
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

.id-input-error {
    color: red;
    font-size: 0.8rem;
    margin-top: 0.5rem;
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
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.id-input {
    width: 96%;
    padding: 1%;
    font-size: 1rem;
}


</style>