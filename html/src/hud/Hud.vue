<template>
  <div class="hud">
    <div class="top">
      <div class="money">${{ money.toLocaleString() }}</div>
      <div class="clock">{{ currentTime }}</div>
    </div>

    <div class="bars">
      <div class="bar">
        <label>Faim</label>
        <div class="fill" :style="{ width: hunger + '%' }"></div>
      </div>
      <div class="bar">
        <label>Soif</label>
        <div class="fill" :style="{ width: thirst + '%' }"></div>
      </div>
      <div class="bar">
        <label>Fatigue</label>
        <div class="fill" :style="{ width: fatigue + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const money = ref(1250);
const hunger = ref(0);
const thirst = ref(0);
const fatigue = ref(0);

const currentTime = ref('');

const updateTime = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${h}:${m}`;
};

onMounted(() => {

    // Si le store menu est une ref, on peut faire un watch ici si nécessaire
  window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
      case 'metabolism:update':
        hunger.value = data.hunger;
        thirst.value = data.thirst;
        fatigue.value = data.tiredness;
        break;
    }

  });

  updateTime();
  setInterval(updateTime, 60000); // maj toutes les minutes
});


</script>

<style scoped>
.hud {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.75);
  padding: 15px;
  border-radius: 12px;
  color: white;
  font-family: sans-serif;
  width: 220px;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.money {
  color: #43d9ad;
  font-weight: bold;
}

.clock {
  font-size: 0.9rem;
  opacity: 0.7;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar {
  background: #2b2b2b;
  border-radius: 6px;
  overflow: hidden;
  height: 16px;
  position: relative;
}

.bar label {
  position: absolute;
  left: 6px;
  top: -20px;
  font-size: 0.75rem;
  color: #ccc;
}

.fill {
  height: 100%;
  background: #4d5bce;
  transition: width 0.3s;
}
</style>
