<template>
  <div class="container">
    <h2>Création de personnage</h2>

    <input v-model="firstName" type="text" placeholder="Prénom" />
    <input v-model="lastName" type="text" placeholder="Nom" />

    <div class="gender">
      <label><input type="radio" value="male" v-model="gender" /> Homme</label>
      <label><input type="radio" value="female" v-model="gender" /> Femme</label>
    </div>

    <button @click="submit">Valider</button>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { useCaracterStore } from '../stores/caracterStore.js'
import { sendNui } from '../utils/nui.js'
import { useUiStore } from '../stores/uiStore.js'

const firstName = ref('')
const lastName = ref('')
const gender = ref('male')
const caracterStore = useCaracterStore()
const ui = useUiStore()

const submit = () => {
  if (!firstName.value || !lastName.value) return

  sendNui('character-submit', {
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value
  })

  ui.closeMenu()
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  color: white;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 10px;
  border: none;
  border-radius: 6px;
}
.gender {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
button {
  margin-top: 20px;
  padding: 12px;
  background: #43d9ad;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

</style>
