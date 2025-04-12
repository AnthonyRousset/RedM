<script setup>
import uiCharacter from './menu/uiCharacter.vue';
import uiInventory from './menu/uiInventory.vue';
import uiBank from './menu/uiBank.vue';
import uiShop from './menu/uiShop.vue';
import uiAdmin from './menu/uiAdmin.vue';
import uiWheel from './menu/uiWheel.vue';
import GameHud from './hud/Hud.vue';  

import { sendNui } from './utils/nui.js';
import { useUiStore } from './stores/uiStore.js';
import { useBankStore } from './stores/bankStore.js';
import { useShopStore } from './stores/shopStore.js';

const uiStore = useUiStore()
const bankStore = useBankStore()
const shopStore = useShopStore()

let timeout;
let execute = true;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (execute && !uiStore.isClosing) {
      uiStore.isClosing = true;
      setTimeout(() => {
        switch (uiStore.menu) {
          case 'bank':
            sendNui('bank-close-' + bankStore.id, { id: bankStore.id })
            break;
          case 'shop':
            sendNui('shop-close-' + shopStore.id, { id: shopStore.id })
            break;
          default:
            sendNui('ui-close')
            break;
        }
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
  <div class="background-image" v-if="uiStore.visible === false"></div>
  <GameHud v-if="uiStore.visible" />
  <uiAdmin v-if="uiStore.menu === 'admin'" />
  <uiBank v-else-if="uiStore.menu === 'bank'" />
  <uiShop v-else-if="uiStore.menu === 'shop'" />
  <uiCharacter v-else-if="uiStore.menu === 'character'" />
  <uiInventory v-else-if="uiStore.menu === 'inventory'" />
  <uiWheel v-else-if="uiStore.menu === 'roue'" />
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
/* Bevan: Western, IM Fell English SC: , Oswald: , Special Elite:   */
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=IM+Fell+English+SC&family=Special+Elite&display=swap');

/* Wantedo.ttf , Wantedo.otf */
@font-face {
  font-family: 'Wantedo';
  src: url('./fonts/Wantedo.ttf') format('truetype'),
       url('./fonts/Wantedo.otf') format('opentype');
}

/* Rustler.ttf */
@font-face {
  font-family: 'Rustler';
  src: url('./fonts/RUSTLER_.TTF') format('truetype');
}


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
  background-image: url('/images/background-gameplay.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}
</style>