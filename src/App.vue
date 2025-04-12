<script setup lang="ts">
import CalendarSection from './components/calendar-section/CalendarSection.vue'
import SearchSection from './components/search-section/SearchSection.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Spoticast Calendar</h1>
    </header>

    <main>
      <div class="search"><SearchSection /></div>
      <div class="calendar"><CalendarSection /></div>
    </main>
  </div>
</template>

<style scoped>
header {
  background-color: var(--color-background-soft);
  text-align: center;
  padding: 1rem;
  font-size: 12px;
  font-weight: bold;
}

/* Layout container */
main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  height: calc(90vh - 130px);

  align-items: stretch;
}

/* Sections */

.search,
.calendar {
  padding: 20px;
  overflow: auto; /* Add individual scrollbars */
  height: 110%; /* Full height */
}
.search {
  flex: 1;
  background-color: #ecf3ed;
  padding: 1rem;

  flex-direction: column;
}

.calendar {
  flex: 2;
  background-color: #f0f7fc;
  padding: 1rem;
}

/* Responsive */
@media (min-width: 1024px) {
  main {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
