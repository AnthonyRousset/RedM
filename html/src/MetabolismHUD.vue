<template>
  <div class="inventory">
    <h2>Sac à dos</h2>
    <div class="grid">
      <div
        v-for="(item, i) in slots"
        :key="i"
        class="slot"
        @contextmenu.prevent="item && showContext($event, item)"
        @dragover.prevent
        @drop="() => onDrop(item)"
      >
        <div
          v-if="item"
          class="item"
          draggable="true"
          @dragstart="() => onDragStart(item)"
        >
          <span>{{ item.name }}</span>
          <span class="qty">x{{ item.quantity }}</span>
        </div>
      </div>
    </div>

    <button @click="close">Fermer</button>

    <div
      v-if="contextVisible"
      class="context"
      :style="{ top: `${contextY}px`, left: `${contextX}px` }"
    >
      <div role="button" tabindex="0" @click="() => doAction('use')">Utiliser</div>
      <div role="button" tabindex="0" @click="() => doAction('drop')">Jeter</div>
      <div role="button" tabindex="0" @click="() => doAction('inspect')">Examiner</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { menu } from './stores.js'

const slots = ref(Array(20).fill(null))
const contextVisible = ref(false)
const contextX = ref(0)
const contextY = ref(0)
const selectedItem = ref(null)
const draggedItem = ref(null)

function close() {
  fetch('https://nui-svelte-starter/closeMenu', { method: 'POST' })
  menu.value = null
}

function showContext(e, item) {
  selectedItem.value = item
  contextX.value = e.clientX
  contextY.value = e.clientY
  contextVisible.value = true
}

function doAction(action) {
  if (selectedItem.value) {
    fetch('https://nui-svelte-starter/inventoryAction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, item: selectedItem.value }),
    })
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

  fetch('https://nui-svelte-starter/inventoryMove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: draggedItem.value, to: targetItem }),
  })

  draggedItem.value = null
}

function handleMessage(e) {
  if (e.data.action === 'inventory:setData') {
    const items = e.data.items
    slots.value = Array(20).fill(null)

    items.forEach(item => {
      if (item.slot >= 0 && item.slot < slots.value.length) {
        slots.value[item.slot] = item
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  window.addEventListener('click', closeContext)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
  window.removeEventListener('click', closeContext)
})
</script>

<style scoped>
.inventory {
  position: absolute;
  top: 20%;
  left: 30%;
  background: #111;
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 80px);
  grid-template-rows: repeat(4, 80px);
  gap: 10px;
  margin-top: 15px;
}

.slot {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  text-align: center;
}

.qty {
  font-size: 11px;
  color: #ccc;
}

button {
  margin-top: 20px;
  padding: 10px;
  background: #e99287;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.context {
  position: absolute;
  background: #333;
  border: 1px solid #555;
  color: white;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.context div {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.context div:hover {
  background: #555;
}
</style>
