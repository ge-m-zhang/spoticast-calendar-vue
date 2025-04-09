<script setup lang="ts">
import SearchSection from './components/SearchSection/SearchSection.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Spoticast Calendar</h1>
    </header>

    <main>
      <div class="search"><SearchSection /></div>
      <div class="calendar">Calendar Section</div>
    </main>
  </div>
</template>

<style scoped>
header {
  background-color: var(--color-background-soft);
  text-align: center;
  padding: 1.5rem;
  font-size: 12px;
  font-weight: bold;
}

/* Layout container */
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* Sections */
.search {
  background-color: #ecf3ed;
  padding: 1rem;
}

.calendar {
  background-color: #f0f7fc;
  padding: 1rem;
}

/* Responsive */
@media (min-width: 1024px) {
  main {
    flex-direction: row;
    align-items: flex-start;
  }

  .search {
    flex: 1;
  }

  .calendar {
    flex: 1;
  }
}
</style>
