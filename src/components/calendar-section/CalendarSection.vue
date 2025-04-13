<template>
  <section class="calendar-section" role="region" aria-labelledby="calendar-heading">
    <CalendarHeader />
    <div class="calendar-wrapper" aria-label="Podcast episodes calendar">
      <SpoticastCalendar />
    </div>
  </section>
</template>

<script setup lang="ts">
import SpoticastCalendar from './SpoticastCalendar.vue'
import CalendarHeader from './CalendarHeader.vue'
</script>

<style scoped>
.calendar-section {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calendar-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  flex-grow: 1;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border-radius: 8px;
}

.loading-content {
  background-color: white;
  padding: 15px 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #666;
  font-size: 1rem;
}
</style>
