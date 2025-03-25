
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
  <div class="open-bank">
    <button @click="uiStore.openMenu('bank')">Open Bank</button>
    <button @click="uiStore.openMenu('character')">Open Character</button>
    <button @click="uiStore.openMenu('inventory')">Open Inventory</button>
    <button @click="uiStore.openMenu('admin')">Open Admin</button>
  </div>
</template>

<style>
.open-bank {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
} 

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
* {
  /* unselected */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>