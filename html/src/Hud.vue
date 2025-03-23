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
        <div class="fill" :style="{ width: hunger + '%', minWidth: '10px' }"></div>
      </div>
      <div class="bar">
        <label>Soif</label>
        <div class="fill" :style="{ width: thirst + '%', minWidth: '10px' }"></div>
      </div>
      <div class="bar">
        <label>Fatigue</label>
        <div class="fill" :style="{ width: fatigue + '%', minWidth: '10px' }"></div>
      </div>
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

  </div>

  <Slots />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Slots from './hud/Slots.vue';

const money = ref(0);
const hunger = ref(0);
const thirst = ref(0);
const fatigue = ref(0);
const currentTime = ref('');
const playerName = ref('John Marston');
const zone = ref('Valentine');
const weather = ref('Clair');
const temperature = ref(21);
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

    const data = event.data;

    switch (data.action) {
      case 'metabolism:update':
        hunger.value = data.info.hunger;
        thirst.value = data.info.thirst;
        fatigue.value = data.info.tiredness;
        break;

      case 'wallet:balance':
        console.log('wallet:balance', data)
        money.value = data.info.balance;
        break;

      case 'player:update':
        playerName.value = data.name;
        break;

      case 'location:update':
        zone.value = data.zone;
        break;

      case 'weather:update':
        weather.value = data.weather;
        temperature.value = data.temperature;
        break;

      case 'buffs:update':
        activeBuffs.value = data.buffs;
        break;

      case 'notify:message':
        notification.value = data.message;
        setTimeout(() => {
          notification.value = '';
        }, 5000);
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
  top: 2vw;
  right: 2vw;
  background: rgba(20, 20, 20, 0.85);
  padding: 1.2vw;
  border-radius: 0.9vw;
  color: white;
  font-family: sans-serif;
  width: 18vw;
  font-size: 1vw;
  box-sizing: border-box;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6vw;
}

.money {
  color: #43d9ad;
  font-weight: bold;
}

.clock {
  opacity: 0.7;
}

.info {
  margin-bottom: 0.8vw;
  line-height: 1.3;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
  margin-bottom: 0.8vw;
}

.bar {
  background: #2b2b2b;
  border-radius: 0.4vw;
  overflow: hidden;
  height: 1.2vw;
  position: relative;
}

.bar label {
  position: absolute;
  left: 0.4vw;
  top: -1.1vw;
  font-size: 0.65vw;
  color: #ccc;
}

.fill {
  height: 100%;
  background: #4d5bce;
  transition: width 0.3s;
  border-radius: 6px;
}

.horse {
  margin-bottom: 0.8vw;
  font-style: italic;
  color: #ccc;
}

.buffs {
  display: flex;
  gap: 0.4vw;
  flex-wrap: wrap;
  margin-bottom: 0.8vw;
}

.buff {
  background: #e99287;
  padding: 0.3vw 0.6vw;
  border-radius: 0.4vw;
  font-size: 0.7vw;
  color: #000;
}

.notification {
  background: #43d9ad;
  padding: 0.6vw;
  border-radius: 0.6vw;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.8vw;
}

.log {
  font-size: 0.65vw;
  color: #aaa;
  display: flex;
  flex-direction: column;
  gap: 0.15vw;
}

/* Responsive fallback pour les petits écrans */
@media screen and (max-width: 1280px) {
  .hud {
    width: 30vw;
    font-size: 1.5vw;
  }

  .bar {
    height: 1.8vw;
  }

  .bar label {
    font-size: 1vw;
  }

  .buff {
    font-size: 1vw;
  }

  .log {
    font-size: 1vw;
  }
}
</style>
