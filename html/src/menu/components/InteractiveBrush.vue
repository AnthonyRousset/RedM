<template>
    <div ref="container" class="interactive-block">
      {{ backgroundimg }}
      <img ref="background" :src="backgroundimg" class="background-brush" />
      <div ref="text" class="text-content">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUpdated, watch, nextTick } from 'vue'
  
  const props = defineProps({
    backgroundimg: {
      type: String,
      required: true,
    },
  })
  
  const container = ref(null)
  const text = ref(null)
  const background = ref(null)
  
  const adjustWidth = () => {
    if (!container.value || !text.value || !background.value) return
  
    const textWidth = text.value.offsetWidth
    const totalWidth = textWidth + 40 // 20px padding de chaque côté
  
    container.value.style.width = `${totalWidth}px`
    background.value.style.width = `${totalWidth}px`
  }
  
  onMounted(() => {
    nextTick(adjustWidth)
    window.addEventListener('resize', adjustWidth)
  })
  
  onUpdated(() => nextTick(adjustWidth))
  
  watch(() => text.value?.innerText, () => nextTick(adjustWidth))
  </script>
  
  <style scoped>
  .interactive-block {
    display: inline-block;
    position: relative;
    height: 80px; /* Hauteur fixe du tracé */
  }
  
  .background-brush {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    object-fit: none;
    object-position: left top;
    z-index: 0;
    pointer-events: none;
  }
  
  .text-content {
    position: relative;
    z-index: 1;
    padding: 0 20px;
    line-height: 80px;
    white-space: nowrap;
    cursor: pointer;
  }
  </style>
  