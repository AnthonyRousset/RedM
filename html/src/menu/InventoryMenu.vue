<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '../stores/playerStore.js'
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'

const ui = useUiStore()

const slots = ref(Array(20).fill(null))
const contextVisible = ref(false)
const contextX = ref(0)
const contextY = ref(0)
const selectedItem = ref(null)
const draggedItem = ref(null)
const playerStore = usePlayerStore()

function close() {
  sendNui('ui-close')
  ui.closeMenu()
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
    <div class="menu-vertical">
      <ul>
        <li>
          <img src="/images/weapons/lancaster.png" alt="item">
          <span class="tooltip">Nom</span>
        </li>
        <li>
          <img src="/images/weapons/lancaster.png" alt="item">
          <span class="tooltip">Nom</span>
        </li>
        <li>
          <img src="/images/weapons/lancaster.png" alt="item">
          <span class="tooltip">Nom</span>
        </li>
      </ul>
    </div>
    <div class="inventory">
      <div class="title">Sac à dos</div>
      <div class="content">
        <ul>
          <li>
            <div class="item">
              <div class="name">Nom</div>
              <div class="description">Description</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="description">
      <div class="title">Description</div>
      <div class="content">
        <div class="item">
          <div class="name">Nom</div>
          <div class="description">Description</div>
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
  background-image: url('https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13329345/Red_Dead_Redemption_2_20181023103942.jpg?quality=90&strip=all&crop=0,0,100,100');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
