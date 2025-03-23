
<script setup>
import { ref, onMounted } from 'vue';
import Slots from './components/Slots.vue';
import { useHudStore } from '../stores/hudStore';

const hudStore = useHudStore();
console.log('hudStore', hudStore)
 
// Met à jour l'heure
const currentTime = ref();
const updateTime = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${h}:${m}`;
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 60000);
});

</script>

<template>
  <div class="hud">
    <!-- TOP BAR -->
    <div class="top">
      <div class="money">${{ hudStore.money.toLocaleString() }}</div>
      <div class="clock">{{ currentTime }}</div>
    </div>

    <!-- PLAYER INFO -->
    <div class="info">
      <div class="player-name">{{ hudStore.name }}</div>
      <div class="zone">{{ hudStore.zone }}</div>
      <div class="weather">
        {{ hudStore.temperature }}°C - {{ hudStore.weather }}
      </div>
    </div>

    <!-- METABOLISM BARS -->
    <div class="bars">
      <div class="bar">
        <label>Faim</label>
        <div class="fill" :style="{ width: hudStore.hunger + '%', minWidth: '10px' }"></div>
      </div>
      <div class="bar">
        <label>Soif</label>
        <div class="fill" :style="{ width: hudStore.thirst + '%', minWidth: '10px' }"></div>
      </div>
      <div class="bar">
        <label>Fatigue</label>
        <div class="fill" :style="{ width: hudStore.tiredness + '%', minWidth: '10px' }"></div>
      </div>
    </div>

    <!-- BUFFS -->
    <div class="buffs">
      <div v-for="buff in hudStore.activeBuffs" :key="buff.id" class="buff">
        {{ buff.label }}
      </div>
    </div>

    <!-- MALADIES -->
    <div class="maladies">
      <div v-for="maladie in hudStore.sick" :key="maladie.id" class="maladie">
        {{ maladie.label }}
      </div>
    </div>

    <!-- NOTIFICATION -->
    <div class="notification" v-if="hudStore.notification">
      {{ hudStore.notification }}
    </div>

  </div>

  <Slots />

</template>



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

}
</style>
