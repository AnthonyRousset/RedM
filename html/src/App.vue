
<script setup>
import CharacterMenu from './menu/CharacterMenu.vue';
import InventoryMenu from './menu/InventoryMenu.vue';
import BankMenu from './menu/BankMenu.vue';
import AdminMenu from './menu/AdminMenu.vue';
import GameHud from './hud/Hud.vue';  
import { useUiStore } from './stores/uiStore.js';
import { sendNui } from './utils/nui.js';
const uiStore = useUiStore()

let timeout;
let execute = true;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (execute && !uiStore.isClosing) {
      uiStore.isClosing = true;
      setTimeout(() => {
        sendNui('ui-close')
        uiStore.closeMenu()
        uiStore.isClosing = false;
      }, 600);
    }
    execute = false
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      execute = true
    }, 500)
  }
})

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
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

ul{
  list-style: none;
  margin: 0;
  padding: 0;
}

.open-bank {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
} 
.__closing {
  animation: closeVault 0.6s ease-in forwards !important;
}

@keyframes closeVault {
  from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
  }

  to {
      transform: translateX(-50%) translateY(-150%);
      opacity: 1;
  }
}

@keyframes openVault {
  from {
      transform: translateX(-50%) translateY(-150%);
      opacity: 0;
  }

  to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
  }
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