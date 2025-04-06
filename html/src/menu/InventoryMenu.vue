<script setup>
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore.js'
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { useHudStore } from '../stores/hudStore'
import itemsData from '../data/items.json'
import draggable from 'vuedraggable'

const tags = ref(itemsData.tags)
const categories = ref(itemsData.categories)
const items = ref(itemsData.items)

console.log(tags.value)

const uiStore = useUiStore()
const playerStore = usePlayerStore()
const hudStore = useHudStore()

const selectedItem = ref(null)
const menuContent = ref('inventory')

const currentItem = ref(null)

// open give window
const giveWindow = ref(false)
const target = ref('')
const quantity = ref(1)

// open drop window
const dropWindow = ref(false)

/*
function close() {
  sendNui('ui-close')
  uiStore.closeMenu()
}

function showContext(e, item) {
  selectedItem.value = item
  contextX.value = e.clientX
  contextY.value = e.clientY
  contextVisible.value = true
}
*/
const options = ref({
  visible: false,
  x: 0,
  y: 0
})

function showOptions(e, item) {
  currentItem.value = item
  options.value.visible = true
  options.value.x = e.clientX
  options.value.y = e.clientY
}

function doAction(action) {
  switch (action) {
    case 'equip':
      sendNui('inventory-request-equip', { id: currentItem.value.id, complexid: currentItem.value.complexid })
      playerStore.itemEquipedId = currentItem.value.id
      break
    case 'unequip':
      sendNui('inventory-request-unequip', { id: currentItem.value.id, complexid: currentItem.value.complexid })
      playerStore.itemEquipedId = null
      break
    case 'use':
      let complexid = null  
      switch (currentItem.value.category) {
        case '3': // consumable
          complexid = currentItem.value.complexid
          break
        default:
          complexid = null
      }
      sendNui('inventory-request-use', { id: currentItem.value.id, complexid: complexid })
      playerStore.useItem(currentItem.value.id)
      break
    case 'give':
      // Open window with target list (player, npc, ...) 
      giveWindow.value = true
      sendNui('inventory-near-users')
      break
    case 'drop':
      // Open window with quantity input
      dropWindow.value = true
      break
  }
  options.value.visible = false
}

function doGive() {
  let id = currentItem.value.id
  let complexid = null
  switch (currentItem.value.category) {
    case '1': // weapon
      complexid = currentItem.value.complexid
      break
    case '4': // tool
      complexid = currentItem.value.complexid
      break 
    case '5': // quest item
      complexid = currentItem.value.complexid
      break   
    case '6': // clothing
      complexid = currentItem.value.complexid
      break
    case '7': // document
      complexid = currentItem.value.complexid
      break   
    case '8': // reusable
      complexid = currentItem.value.complexid
      break
    default:
  }

  sendNui('inventory-request-give', { id: id, complexid: complexid, quantity: quantity.value, target: target.value })
  giveWindow.value = false
  target.value = ''
  quantity.value = 1
}

function doDrop() {
  let id = currentItem.value.id
  let complexid = null
  switch (currentItem.value.category) {
    case '1': // weapon
      complexid = currentItem.value.complexid
      break
    case '4': // tool
      complexid = currentItem.value.complexid
      break 
    case '5': // quest item
      complexid = currentItem.value.complexid
      break
    case '6': // clothing
      complexid = currentItem.value.complexid
      break 
    case '7': // document
      complexid = currentItem.value.complexid
      break
    case '8': // reusable
      complexid = currentItem.value.complexid
      break 
    default:
      complexid = null
  }

  sendNui('inventory-request-drop', { id: id, complexid: complexid, quantity: quantity.value })
  dropWindow.value = false
  quantity.value = 1
}


// i close inventory menu only if uiStore.menu is inventory
function closeInventory() {
  if (uiStore.menu === 'inventory') {
    sendNui('ui-close')
    uiStore.closeMenu()
  }
}

window.addEventListener('keydown', closeInventory) 


function simulationPost() {
  window.postMessage({
    action: 'inventory:update',

    info: [
      {
        id: 'lancaster_rifle',
        quantity: 2000,
        quality: 100,
        weight: 100,
        tags: [0],
        category: 0
      },
      {
        id: 'coca_seeds',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 1012120,
        weight: 100,
        tags: [],
        category: 0
      },
      {
        id: 'cocaine',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 104450,
        weight: 100 ,
        tags: [2],
        category: 0
      },
      {
        id: 'rustic_bread',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [1],
        category: 0
      },
      {
        id: 'deer_hide',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 1045450,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'raw_deer_meat',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'pickaxe',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 1045450,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'rake',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 1454500,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'axe',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'weapon_bow',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'watering_can',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'cannabis_seeds',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [1],
        category: 0
      },
      {
        id: 'sugarcane_seeds',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'coca_seeds',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [2],
        category: 0
      },
      {
        id: 'fertilizer',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'cooked_deer_meat',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: []
      },
      {
        id: 'lancaster_rifle',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'shovel',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        category: 0,
        tags: [0]
      },
      {
        id: 'water_bottle',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        category: 0,
        tags: []
      },
      {
        id: 'lancaster_rifle1',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle2 ',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle3',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle4',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle5',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle6',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
      {
        id: 'lancaster_rifle7',
        quantity: Math.floor(Math.random() * 1000000),
        quality: 100,
        weight: 1,
        tags: [],
        category: 0
      },
    ]

  }, '*')
}

</script>


<template>
  <!-- TODO: Implement inventory menu Horizon forbidden west style -->
  <div class="window">
    <div class="top">
      <div class="left">
        <div class="name">Nom</div>
      </div>
      <div class="right">
        <div class="money">{{ playerStore.getWallet }}$</div> | <div class="zone"> {{ hudStore.zone }} </div>
      </div>
    </div>
    <div class="container">

      <button @click="simulationPost()">Simulation</button>

      <div class="menu-vertical">
        <ul>
          <li @click="menuContent = 'inventory'" :class="{ 'active': menuContent === 'inventory' }">
            <img src="/images/menu-inventory.png" alt="Inventaire">
          </li>
          <li @click="menuContent = 'craft'" :class="{ 'active': menuContent === 'craft' }">
            <img src="/images/menu-craft.png" alt="Craft">
          </li>
          <li @click="menuContent = 'tutorial'" :class="{ 'active': menuContent === 'tutorial' }">
            <img src="/images/menu-tutorial.png" alt="Tutoriel">
          </li>
          <li @click="menuContent = 'announcements'" :class="{ 'active': menuContent === 'announcements' }">
            <img src="/images/menu-announcements.png" alt="Annonces">
          </li>
          <li @click="menuContent = 'setting'" :class="{ 'active': menuContent === 'setting' }">
            <img src="/images/menu-setting.png" alt="Paramètres">
          </li>
        </ul>
      </div>
      <div class="menu-content" v-if="menuContent === 'inventory'">
        <div class="inventory">
          <PerfectScrollbar>
            <div class="_title_">INVENTAIRE</div>
            <div class="content">
              <draggable v-model="playerStore.inventory" :animation="150" :item-key="(item, index) => index"
                class="inventory-grid" :class="{ 'dragging': true }" :disabled="false" :forceFallback="true"
                :scroll="true" :scrollSensitivity="100" :scrollSpeed="10">
                <template #item="{ element: item, index }">
                  <li @click="(e) => showOptions(e, item)">
                    <div class="item">
                    <img :src="'./images/items/' + item.id + '.png'" alt="Item">
                      <div class="quantity" v-if="item.quantity > 1">{{ item.quantity }}</div>
                  </div>
                  <div class="status" v-for="tag in item.tags" :key="tag">
                      <img v-if="tags[tag]" :src="'./images/items/_' + tags[tag]?.image + '.png'" alt="Tag">
                  </div>
                </li>
                </template>
              </draggable>

              <!-- Item options 
              <div class="item-options" v-if="options.visible"
                :style="{ top: options.y + 'px', left: options.x + 'px' }">

                <div v-if="currentItem && currentItem.category === '3'" class="option"
                  @click="doAction('use', currentItem)">Utiliser</div>
                <div v-if="currentItem && currentItem.category === '8'" class="option"
                  @click="doAction('use', currentItem)">Utiliser</div>
                <div v-if="currentItem && currentItem.category === '6'" class="option"
                  @click="doAction('equip', currentItem)">Équiper</div>

                <div v-if="playerStore.itemEquipedId === currentItem.id">
                  <div v-if="currentItem.category === '4'" class="option" @click="doAction('unequip', currentItem)">
                    Déséquiper</div>
                  <div v-if="currentItem.category === '1'" class="option" @click="doAction('unequip', currentItem)">
                    Déséquiper</div>
                </div>
                <div v-else>
                  <div v-if="currentItem.category === '4'" class="option" @click="doAction('equip', currentItem)">
                    Équiper</div>
                  <div v-if="currentItem.category === '1'" class="option" @click="doAction('equip', currentItem)">
                    Équiper</div>
                </div>

                <div v-if="currentItem && currentItem.category === '7'" class="option"
                  @click="doAction('open', currentItem)">Ouvrir</div>
                <div class="option" @click="doAction('give', currentItem)">Donner</div>
                <div class="option" @click="doAction('drop', currentItem)">Détruire</div>
              </div>
              -->

              <!-- Drop window -->
              <div class="drop-window" v-if="dropWindow">
                <div class="form">
                  <input type="number" v-model="quantity" placeholder="Quantité" min="1" :max="currentItem.quantity">
                  <button @click="doDrop()">Jeter</button>
                  <button @click="dropWindow = false">Annuler</button>
                </div>
              </div>
              <!-- Give window -->
              <div class="near-users" v-if="giveWindow">
                <div class="form">
                  <select v-model="target">
                    <option v-for="user in playerStore.nearUsers" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                  <input type="number" v-model="quantity" placeholder="Quantité" min="1" :max="currentItem.quantity">
                  <button @click="doGive()">Donner</button>
                  <button @click="giveWindow = false">Annuler</button>
                </div>
              </div>

            </div>
          </PerfectScrollbar>
        </div>
        <div class="description" v-if="currentItem">
          <div class="title">{{items.find(item => item.id === currentItem.id).name}}</div>
          <div class="content">
            <div class="item">
              <div class="description">
                {{items.find(item => item.id === currentItem.id).description}}
              </div>

              <div class="item-options" :style="{ top: options.y + 'px', left: options.x + 'px' }">

                <div v-if="currentItem && currentItem.category === 3" class="option"
                  @click="doAction('use', currentItem)">
                  Utiliser</div>
                <div v-if="currentItem && currentItem.category === 8" class="option"
                  @click="doAction('use', currentItem)">
                  Utiliser</div>


                <div v-if="playerStore.itemEquipedId === currentItem.id">
                  <div v-if="currentItem.category === 4" class="option" @click="doAction('unequip', currentItem)">
                    Ranger</div>
                  <div v-if="currentItem.category === 1" class="option" @click="doAction('unequip', currentItem)">
                    Ranger</div>
                  <div v-if="currentItem.category === 6" class="option" @click="doAction('equip', currentItem)">
                    Se déshabiller</div>
                </div>
                <div v-else>
                  <div v-if="currentItem.category === 4" class="option" @click="doAction('equip', currentItem)">
                    Prendre en main</div>
                  <div v-if="currentItem.category === 1" class="option" @click="doAction('equip', currentItem)">
                    Prendre en main</div>
                  <div v-if="currentItem.category === 6" class="option" @click="doAction('equip', currentItem)">
                    Se vestir</div>
                </div>

                <div v-if="currentItem && currentItem.category === 7" class="option"
                  @click="doAction('open', currentItem)">
                  Ouvrir</div>

                <div class="option" @click="doAction('give', currentItem)">Donner</div>
                <div class="option" @click="doAction('drop', currentItem)">Détruire</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="menu-content" v-if="menuContent === 'craft'">
        <div class="craft">
          <div class="_title_">CRAFT</div>
          <div class="content">
            <div class="item">
              <div class="name">Nom</div>
              <div class="description">Description</div>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-content" v-if="menuContent === 'tutorial'">
        <div class="tutorial">
          <div class="_title_">TUTORIEL</div>
        </div>
      </div>

      <div class="menu-content" v-if="menuContent === 'announcements'">
        <div class="announcements">
          <div class="_title_">ANNOUNCES</div>
        </div>
      </div>

      <div class="menu-content" v-if="menuContent === 'setting'">
        <div class="setting">
          <div class="_title_">OPTIONS</div>
        </div>
      </div>

    </div>
  </div>



</template>



<style scoped>
* {
  color: #fff;
}


/* Ajout en haut du CSS */
:deep(.ps) {
  -ms-overflow-style: none !important;
  /* IE and Edge */
  scrollbar-width: none !important;
  /* Firefox */
}

:deep(.ps::-webkit-scrollbar) {
  display: none !important;
  /* Chrome, Safari and Opera */
}

:deep(.ps__rail-x),
:deep(.ps__rail-y) {
  display: none !important;
}

.ps {
  height: 100%;
}

.window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 100000;
}

.window::before {
  content: "";
  position: absolute;
  inset: 0;
  /*background-image: url('https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13329345/Red_Dead_Redemption_2_20181023103942.jpg?quality=90&strip=all&crop=0,0,100,100');*/
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.4;
  z-index: -3;
}

.window::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0%;
  right: 0%;
  bottom: 0;
  overflow: hidden;
  z-index: -2;
  background: linear-gradient(108deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: flex-start;
  height: 120px;
  width: 96%;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  padding: 0 2%;
  display: none;
}

.top .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.top .right div {
  margin: 0 10px;
}







.window .container {
  /*height: calc(100% - 120px);*/
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.menu-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 70px 0 0 0;
}

.menu-vertical ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding: 0 30px;
  height: 100%;
}

.menu-vertical ul li {
  height: 3rem;
  width: 3rem;
  position: relative;
  margin-bottom: 20px;
}

.menu-vertical ul li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.menu-vertical ul li.active img {
  opacity: 1;
}



.window .container .menu-content {
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
}

.menu-content ._title_ {
  font-size: 1.5rem;
  font-weight: bold;
  color: #a1a1a1;
  padding-bottom: 8px;
  font-family: 'IM Fell English SC', 'Special Elite', 'Oswald', sans-serif;
  /* background line img*/
  background-image: url(/images/line.png);
  background-repeat: no-repeat;
  background-position: -9px 27px;
}

.menu-content .inventory {
  width: 500px;
  height: 100%;
}

.menu-content {
  height: 100%;
  margin-top: 10px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 15px 0 0;
  list-style: none;
}

.inventory-grid li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.inventory-grid>* {
  position: relative;
  cursor: grab;
  transition: none;
}

.inventory-grid>*:active {
  cursor: grabbing;
}

.inventory-grid.dragging {
  cursor: grabbing;
}

.inventory-grid .sortable-ghost {
  visibility: hidden;
}

.inventory-grid .sortable-drag {
  opacity: 1 !important;
}

.inventory-grid>* .item {
  /*background-color: #ffffff13;*/
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 2px;
  background-image: url(/images/slot2.png);
  background-size: 125% 125%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.inventory-grid>* .item img {
  width: 70%;
  height: 70%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  padding: 15%;
}


.inventory-grid>* .item .description {
  width: 100%;
  height: 100%;
}

.inventory-grid>* .status {
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: -13px;
  right: -13px;
}

.inventory-grid>* .status img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.inventory-grid>* .item .quantity {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

/* Item options */
.menu-content .item-options {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
}

.menu-content .item-options .option {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu-content .item-options .option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}


/* Drop window */
.menu-content .drop-window {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.menu-content .drop-window .title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.menu-content .drop-window .form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-content .drop-window .form input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.menu-content .drop-window .form button {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
}



/* Give window  */
.menu-content .near-users {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.menu-content .near-users .title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.menu-content .near-users .form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 200px;
}

.menu-content .near-users .form select {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.menu-content .near-users .form input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.menu-content .near-users .form button {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 1);
}



/* Craft */
.menu-content .craft {
  width: 500px;
  height: 100%;
}










/* Tutorial */
.menu-content .tutorial {
  width: 500px;
  height: 100%;
}









/* Announcements */
.menu-content .announcements {
  width: 500px;
  height: 100%;
}







/* Options */
.menu-content .setting {
  width: 500px;
  height: 100%;
}


@media (min-width: 2500px) {
  .window>* {
    /*zoom: 1.5;*/
  }
}

@media (min-width: 3500px) {
  .window>* {
    /*zoom: 2;*/
  }
}
</style>
