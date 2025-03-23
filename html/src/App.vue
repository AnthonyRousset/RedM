
<script setup>
import CharacterMenu from './menu/CharacterMenu.vue';
import InventoryMenu from './menu/InventoryMenu.vue';
import BankMenu from './menu/BankMenu.vue';
import AdminMenu from './menu/AdminMenu.vue';
import GameHud from './hud/Hud.vue';  
import { useUiStore } from './stores/uiStore.js';
const uiStore = useUiStore()

</script>

<template>
  <GameHud />
  <AdminMenu v-if="uiStore.menu === 'admin'" />
  <BankMenu v-else-if="uiStore.menu === 'bank'" />
  <CharacterMenu v-else-if="uiStore.menu === 'character'" />
  <InventoryMenu v-else-if="uiStore.menu === 'inventory'" />
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