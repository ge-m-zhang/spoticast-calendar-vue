<script setup lang="ts">
import CalendarSection from './components/calendar-section/CalendarSection.vue'
import SearchSection from './components/search-section/SearchSection.vue'
import { handleSectionKeyDown } from './utils/keyboardNavigation.util'
</script>

<template>
  <div id="app">
    <header role="banner">
      <h1>Spoticast Calendar</h1>
    </header>
    <main>
      <div
        class="search"
        aria-label="Podcast search section"
        tabindex="0"
        @keydown="handleSectionKeyDown"
        aria-description="Press Right/Down Arrow to navigate to Calendar section, Enter to navigate within section"
      >
        <SearchSection />
      </div>
      <div
        class="calendar"
        aria-label="Calendar section"
        tabindex="0"
        @keydown="handleSectionKeyDown"
        aria-description="Press Left/Up Arrow to navigate to Search section, Enter to navigate within section"
      >
        <CalendarSection />
      </div>
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

/* Focus styles for better keyboard navigation */
:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
