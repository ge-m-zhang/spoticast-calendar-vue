<script setup lang="ts">
import CalendarSection from './components/calendar-section/CalendarSection.vue'
import SearchSection from './components/search-section/SearchSection.vue'
import KeyboardNavInstruction from './components/KeyboardNavInstruction.vue'
import { handleSectionKeyDown } from './utils/keyboardNavigation.util'
</script>

<template>
  <div id="app">
    <!-- Skip Link -->
    <a href="#search-section" class="skip-link">Skip to content</a>

    <header role="banner" aria-label="Spoticast Calendar" tabindex="0">
      <h1>Spoticast Calendar</h1>
      <KeyboardNavInstruction />
    </header>

    <main>
      <section
        id="search-section"
        class="search"
        aria-label="Podcast search section"
        tabindex="0"
        @keydown="handleSectionKeyDown"
      >
        <SearchSection />
      </section>

      <section
        id="calendar-section"
        class="calendar"
        aria-label="Calendar section"
        tabindex="0"
        @keydown="handleSectionKeyDown"
      >
        <CalendarSection />
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Skip link - hidden until focused */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #007bff;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

header {
  background-color: var(--color-background-soft);
  text-align: center;
  padding: 1rem;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header:focus {
  outline: none; /* Ensure no default outline even on focus */
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
