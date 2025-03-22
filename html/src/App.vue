<template>
  <GameHud />
  <AdminMenu v-if="currentMenu === 'admin'" />
  <BankMenu v-else-if="currentMenu === 'bank'" />
  <CharacterMenu v-else-if="currentMenu === 'character'" />
  <InventoryMenu v-else-if="currentMenu === 'inventory'" />
</template>

<style scoped>
#hud {
  position: fixed;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 1);
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import CharacterMenu from './menu/CharacterMenu.vue';
import InventoryMenu from './menu/InventoryMenu.vue';
import BankMenu from './menu/BankMenu.vue';
import AdminMenu from './menu/AdminMenu.vue';
import GameHud from './Hud.vue';
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

    switch (data.action) {
    //switch ("metabolism:update") {
      case 'character:open':
        menu.value = 'character';
        currentMenu.value = 'character';
        break;
      case 'character:close':
        menu.value = null;
        currentMenu.value = null;
        break;

      case 'inventory:open':
        menu.value = 'inventory';
        currentMenu.value = 'inventory';
        break;
      case 'inventory:close':
        menu.value = null;
        currentMenu.value = null;
        break;

      case 'admin:open':
        menu.value = 'admin';
        currentMenu.value = 'admin';
        break;
      case 'admin:close':
        menu.value = null;
        currentMenu.value = null;
        break;   

      case 'bank:open':
        menu.value = 'bank';
        currentMenu.value = 'bank';
        break;
      case 'bank:close':
        menu.value = null;
        currentMenu.value = null;
        break;
    }

    // test si bank est ouvert
    //menu.value = 'admin';
    //currentMenu.value = 'admin';

  });
});
</script>
