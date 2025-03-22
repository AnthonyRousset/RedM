<template>
  <CharacterMenu v-if="currentMenu === 'character'" />
  <InventoryMenu v-else-if="currentMenu === 'inventory'" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CharacterMenu from './menu/CharacterMenu.vue';
import InventoryMenu from './menu/InventoryMenu.vue';
import { menu } from './stores'; // store pinia ou reactive

// Référence locale à la valeur du menu
const currentMenu = ref(null);

// Watch du store (si c'est un ref dans ton store)
onMounted(() => {
  // Réactif si menu est un ref ou store Pinia
  currentMenu.value = menu.value;

  // Si le store menu est une ref, on peut faire un watch ici si nécessaire
  window.addEventListener('message', (event) => {
    const data = event.data;

    

    //switch (data.action) {
    switch ("metabolism:update") {
      case 'openCharacter':
        menu.value = 'character';
        currentMenu.value = 'character';
        break;
      case 'metabolism:update':
        menu.value = 'inventory';
        currentMenu.value = 'inventory';
        break;
      case 'closeMenu':
        menu.value = null;
        currentMenu.value = null;
        break;
    }
  });
});
</script>
