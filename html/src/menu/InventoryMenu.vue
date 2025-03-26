<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/playerStore.js'
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'

const uiStore = useUiStore()
const playerStore = usePlayerStore()

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
        <div class="money">1000$</div> | <div class="zone">Zone</div>
      </div>
    </div>
    <div class="container">
        
      <div class="menu-vertical">
        <ul>
          <li @click="menuContent = 'inventory'"> 
            <img src="/images/weapons/lancaster.png" alt="Inventaire">
          </li>
          <li @click="menuContent = 'craft'">
            <img src="/images/weapons/lancaster.png" alt="Craft">
          </li>
          <li @click="menuContent = 'tutorial'">
            <img src="/images/weapons/lancaster.png" alt="Tutoriel">
          </li>
          <li @click="menuContent = 'announcements'">
            <img src="/images/weapons/lancaster.png" alt="Annonces">
          </li>
          <li @click="menuContent = 'options'">
            <img src="/images/weapons/lancaster.png" alt="Options">
          </li>
        </ul>
      </div>
      <div class="menu-content" v-if="menuContent === 'inventory'">
        <div class="inventory">
          <div class="_title_">INVENTAIRE</div>
          <div class="content">
            <ul>
              <li>
                <div class="item" v-for="item in playerStore.inventory" :key="item.id"> 
                  <div class="name">{{ item.name }}</div>
                </div>
              </li>
            </ul>
          </div>
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
  background-color: rgba(0, 0, 0, 1);
}

.window::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13329345/Red_Dead_Redemption_2_20181023103942.jpg?quality=90&strip=all&crop=0,0,100,100');
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
  height: 100px;
  width: 96%;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  padding: 0 2%;
}
.top .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.top .right div {
  margin: 0 10px;
}





.menu-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.menu-vertical ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding: 10px;
  height: 100%;
}
.menu-vertical ul li {
  height: 4rem;
  width: 4rem;
  position: relative;
}
.menu-vertical ul li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}



.window .container {
  height: calc(100% - 100px);
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.window .container .menu-content{
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
}

.menu-content ._title_{
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid #a1a1a1;
  color: #a1a1a1;
  padding-bottom: 4px;
  font-family: 'Oswald', sans-serif;
}

.menu-content .inventory{
  width: 400px;
  height: 100%;
}

.menu-content .inventory .content{
  width: 100%;
  height: 100%;
} 

.menu-content .inventory .content ul{
  width: 100%;
  height: 100%;
}  

.menu-content .inventory .content ul li{
  width: 100%;
  height: 100%;
} 

.menu-content .inventory .content ul li .item{
  width: 100%;
  height: 100%;
}  

.menu-content .inventory .content ul li .item .name{
  width: 100%;
  height: 100%;
}   

.menu-content .inventory .content ul li .item .description{
  width: 100%;
  height: 100%;
}   














</style>
