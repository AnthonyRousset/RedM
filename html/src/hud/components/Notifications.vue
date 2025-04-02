<!-- Notifications -->
<template>
  <div class="notifications">
    <div class="notification" v-for="notification in notifications" :key="notification.id">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const notifications = ref([]);
</script>



<style scoped>
.notifications {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
