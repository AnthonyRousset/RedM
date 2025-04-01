<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/playerStore.js'
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { useHudStore } from '../stores/hudStore'

const uiStore = useUiStore()
const playerStore = usePlayerStore()
const hudStore = useHudStore()

const slots = ref(Array(20).fill(null))
const contextVisible = ref(false)
const contextX = ref(0)
const contextY = ref(0)
const selectedItem = ref(null)
const draggedItem = ref(null)
const menuContent = ref('inventory')


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

function doAction(action) {
  if (selectedItem.value) {
    sendNui('player-action', { action, item: selectedItem.value })
  }
  contextVisible.value = false
}

function closeContext() {
  contextVisible.value = false
}

function onDragStart(item) {
  draggedItem.value = item
}

function onDrop(targetItem) {
  if (!draggedItem.value) return

  sendNui('player-move', { from: draggedItem.value, to: targetItem })

  draggedItem.value = null
}

const tooltip = ref({
  visible: false,
  name: null,
  x: 0,
  y: 0
})

function moveTooltip(e) {
  tooltip.value.x = e.clientX + 10
  tooltip.value.y = e.clientY + 10
}

function showTooltip(name) {
  tooltip.value.visible = true
  tooltip.value.name = name
}

function hideTooltip() {
  tooltip.value.visible = false
  tooltip.value.name = null
}

window.addEventListener('message', (event) => {
  const { action, data } = event.data
  if (action === 'player-move') {
    console.log('player-move', data)
  }
})

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

      <div class="menu-vertical">
        <ul>
          <li @click="menuContent = 'inventory'" :class="{ 'active': menuContent === 'inventory' }">
            <img src="/images/inventory.png" alt="Inventaire">
          </li>
          <li @click="menuContent = 'craft'" :class="{ 'active': menuContent === 'craft' }">
            <img src="/images/craft.png" alt="Craft">
          </li>
          <li @click="menuContent = 'tutorial'" :class="{ 'active': menuContent === 'tutorial' }">
            <img src="/images/tutorial.png" alt="Tutoriel">
          </li>
          <li @click="menuContent = 'announcements'" :class="{ 'active': menuContent === 'announcements' }">
            <img src="/images/announcements.png" alt="Annonces">
          </li>
          <li @click="menuContent = 'options'" :class="{ 'active': menuContent === 'options' }">
            <img src="/images/weapons/lancaster.png" alt="Options">
          </li>
        </ul>
      </div>
      <div class="menu-content" v-if="menuContent === 'inventory'">
        <div class="inventory">
          <PerfectScrollbar>
            <div class="_title_">INVENTAIRE</div>
            <div class="content">
              <ul>
                <li v-for="item in playerStore.inventory" :key="item.id">
                  <div class="item" @mousemove="moveTooltip" @mouseenter="showTooltip(item.name)"
                    @mouseleave="hideTooltip">
                    <img :src="'./images/items/' + item.id + '.png'" alt="Item">
                  </div>
                  <div class="status" v-for="tag in item.tags" :key="tag">
                    <img :src="'./images/items/_' + tag + '.png'" alt="Tag">
                  </div>
                </li>
              </ul>
              <!-- Tooltip global (placé en dehors du v-for) -->
              <div class="tooltip" v-if="tooltip.visible" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                {{ tooltip.name }}
              </div>
            </div>
          </PerfectScrollbar>
        </div>
        <div class="description" v-if="selectedItem">
          <div class="title">Description</div>
          <div class="content">
            <div class="item">
              <div class="name">Nom</div>
              <div class="description">Description</div>
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

      <div class="menu-content" v-if="menuContent === 'options'">
        <div class="options">
          <div class="_title_">OPTIONS</div>
        </div>
      </div>

    </div>
  </div>



</template>



<style scoped>
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
  background: linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
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

.menu-content .inventory .content {
  height: 100%;
  margin-top: 10px;
}

.menu-content .inventory .content ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 5 colonnes */
  gap: 10px;
  padding: 0 15px 0 0;
}

.menu-content .inventory .content ul li {
  position: relative;
}

.menu-content .inventory .content ul li .item {
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

.menu-content .inventory .content ul li .item img {
  width: 70%;
  height: 70%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  padding: 15%;
}


.menu-content .inventory .content ul li .item .description {
  width: 100%;
  height: 100%;
}

.menu-content .inventory .content ul li .status {
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: -13px;
  right: -13px;
}

.menu-content .inventory .content ul li .status img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}


.menu-content .inventory .content .tooltip {
  position: fixed;
  /* suivre la souris */
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  pointer-events: none;
  /* ne bloque pas les interactions */
  z-index: 1000;
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
.menu-content .options {
  width: 500px;
  height: 100%;
}


@media (min-width: 2500px) {
  .window>* {
    zoom: 1.5;
  }
}

@media (min-width: 3500px) {
  .window>* {
    zoom: 2;
  }
}
</style>
