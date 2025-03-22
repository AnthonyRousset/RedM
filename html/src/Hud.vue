<template>
  <div class="hud">
    <!-- TOP BAR -->
    <div class="top">
      <div class="money">${{ money.toLocaleString() }}</div>
      <div class="clock">{{ currentTime }}</div>
    </div>

    <!-- PLAYER INFO -->
    <div class="info">
      <div class="player-name">{{ playerName }}</div>
      <div class="zone">{{ zone }}</div>
      <div class="weather">
        {{ temperature }}°C - {{ weather }}
      </div>
    </div>

    <!-- METABOLISM BARS -->
    <div class="bars">
      <div class="bar">
        <label>Faim</label>
        {{ hunger }}
        <div class="fill" :style="{ width: hunger + '%' }"></div>
      </div>
      <div class="bar">
        <label>Soif</label>
        {{ thirst }}
        <div class="fill" :style="{ width: thirst + '%' }"></div>
      </div>
      <div class="bar">
        <label>Fatigue</label>
        {{ fatigue }}
        <div class="fill" :style="{ width: fatigue + '%' }"></div>
      </div>
    </div>

    <!-- HORSE -->
    <div class="horse" v-if="horseName">
      🐎 {{ horseName }} ({{ horseDistance }}m)
    </div>

    <!-- BUFFS -->
    <div class="buffs">
      <div v-for="buff in activeBuffs" :key="buff.id" class="buff">
        {{ buff.label }}
      </div>
    </div>

    <!-- NOTIFICATION -->
    <div class="notification" v-if="notification">
      {{ notification }}
    </div>

    <!-- LOG -->
    <div class="log">
      <div v-for="(line, index) in logs" :key="index" class="log-line">
        {{ line }}
      </div>
    </div>
  </div>

  <Slots />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Slots from './hud/Slots.vue';

const money = ref(1250);
const hunger = ref(0);
const thirst = ref(0);
const fatigue = ref(0);
const currentTime = ref('');
const playerName = ref('John Marston');
const zone = ref('Valentine');
const weather = ref('Clair');
const temperature = ref(21);
const horseName = ref('Tonnerre');
const horseDistance = ref(25);
const activeBuffs = ref([]);
const notification = ref('');
const logs = ref([]);


// Met à jour l'heure
const updateTime = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${h}:${m}`;
};

onMounted(() => {
  window.addEventListener('message', (event) => {
    console.log(event);

    const data = event.data;

    console.log(data);

    switch (data.action) {
      case 'metabolism:update':
        hunger.value = data.hunger;
        thirst.value = data.thirst;
        fatigue.value = data.tiredness;
        console.log(hunger.value, thirst.value, fatigue.value);
        break;

      case 'player:update':
        playerName.value = data.name;
        money.value = data.money;
        break;

      case 'location:update':
        zone.value = data.zone;
        break;

      case 'weather:update':
        weather.value = data.weather;
        temperature.value = data.temperature;
        break;

      case 'horse:update':
        horseName.value = data.name;
        horseDistance.value = data.distance;
        break;

      case 'buffs:update':
        activeBuffs.value = data.buffs;
        break;

      case 'notify':
        notification.value = data.message;
        setTimeout(() => {
          notification.value = '';
        }, 5000);
        break;

      case 'log':
        logs.value.unshift(data.message);
        if (logs.value.length > 5) logs.value.pop();
        break;
    }
  });

  updateTime();
  setInterval(updateTime, 60000);
});
</script>

<style scoped>
.hud {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.85);
  padding: 15px;
  border-radius: 12px;
  color: white;
  font-family: sans-serif;
  width: 250px;
  font-size: 14px;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.money {
  color: #43d9ad;
  font-weight: bold;
}

.clock {
  opacity: 0.7;
}

.info {
  margin-bottom: 10px;
  line-height: 1.2;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
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
  top: -18px;
  font-size: 0.75rem;
  color: #ccc;
}

.fill {
  height: 100%;
  background: #4d5bce;
  transition: width 0.3s;
}

.horse {
  margin-bottom: 10px;
  font-style: italic;
  color: #ccc;
}

.buffs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.buff {
  background: #e99287;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #000;
}

.notification {
  background: #43d9ad;
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.log {
  font-size: 0.75rem;
  color: #aaa;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
