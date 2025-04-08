
<script setup>
import CharacterMenu from './menu/CharacterMenu.vue';
import InventoryMenu from './menu/InventoryMenu.vue';
import BankMenu from './menu/BankMenu.vue';
import ShopMenu from './menu/ShopMenu.vue';
import AdminMenu from './menu/AdminMenu.vue';
import WheelMenu from './menu/WheelMenu.vue';
import GameHud from './hud/Hud.vue';  
import { useUiStore } from './stores/uiStore.js';
import { usePlayerStore } from './stores/playerStore.js';
import { sendNui } from './utils/nui.js';
const uiStore = useUiStore()
const playerStore = usePlayerStore()

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
  <div class="background-image" v-if="playerStore.name === 'Player'"></div>
  <GameHud v-if="uiStore.visible" />
  <AdminMenu v-if="uiStore.menu === 'admin'" />
  <BankMenu v-else-if="uiStore.menu === 'bank'" />
  <ShopMenu v-else-if="uiStore.menu === 'shop'" />
  <CharacterMenu v-else-if="uiStore.menu === 'character'" />
  <InventoryMenu v-else-if="uiStore.menu === 'inventory'" />
  <WheelMenu v-else-if="uiStore.menu === 'roue'" />
  <div class="open-bank">
    <button @click="uiStore.openMenu('bank')">Open Bank</button>
    <button @click="uiStore.openMenu('shop')">Open Shop</button>
    <button @click="uiStore.openMenu('character')">Open Character</button>
    <button @click="uiStore.openMenu('inventory')">Open Inventory</button>
    <button @click="uiStore.openMenu('admin')">Open Admin</button>
    <button @click="uiStore.openMenu('roue')">Open alt</button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Oswald:wght@200..700&family=Special+Elite&display=swap');
* {
  /*font-family: 'IM Fell English SC', 'Special Elite', 'Oswald',  sans-serif;*/
}
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
      transform: translateX(0%) translateY(0);
      opacity: 1;
  }

  to {
      transform: translateX(0%) translateY(-150%);
      opacity: 1;
  }
}

@keyframes openVault {
  from {
      transform: translateX(0%) translateY(-150%);
      opacity: 0;
  }

  to {
      transform: translateX(0%) translateY(0);
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

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  background-image: url('/images/background-image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}
</style>