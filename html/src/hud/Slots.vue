<template>
  <!-- QUICK SLOTS -->
  <div class="quick-slots">
    <div v-for="(slot, index) in quickSlots" :key="index" class="slot">
      <div class="slot-index">{{ index + 1 }}</div>
      <div class="slot-content">
        <div v-if="slot" class="slot-filled" @click="useSlot(slot)">
          <div class="slot-icon">
            <img :src="getIcon(slot.icon)" alt="Icone du slot" />
          </div>
          <div class="slot-label">{{ slot.label }}</div>
        </div>
        <div v-else class="slot-empty">Vide</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const quickSlots = ref([
  { "label": "Lancaster", "icon": "weapon" },
  null,
  null,
  null
]);

function getIcon(name) {
  const icons = {
    weapon: './images/weapons/lancaster.png',
    weapon: 'images/weapons/lancaster.png',
    weapon: '/images/weapons/lancaster.png',
    weapon: 'public/images/weapons/lancaster.png',
    weapon: '/public/images/weapons/lancaster.png'
  };
  return icons[name] || '❔';
}

onMounted(() => {
  window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
      case 'slots:update':
        quickSlots.value = data.slots;
        break;
    }
  });
});
</script>

<style scoped>
.quick-slots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
}

.slot {
  background: #222;
  border-radius: 8px;
  padding: 8px;
  width: 80px;
  height: 80px;
  text-align: center;
  font-size: 0.7rem;
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slot-index {
  position: absolute;
  top: 4px;
  left: 6px;
  font-size: 0.6rem;
  color: #aaa;
}

.slot-filled {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slot-icon {
  font-size: 1.2rem;
}

.slot-icon img {
  width: 100%;
  height: 100%;
} 

.slot-label {
  position: absolute;
  bottom: 6px;
} 

.slot-empty {
  opacity: 0.4;
}
</style>
