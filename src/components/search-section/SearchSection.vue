<script setup lang="ts">
import { computed, ref } from 'vue'
import SearchBar from './SearchBar.vue'
import { usePodcastStore } from '@/stores/podcastStore'
import PodcastList from './PodcastList.vue'

const searchStore = usePodcastStore()
// Flag to track if a search has been initiated
const hasSearched = ref(false)

/**
 * Initiates podcast search with the given query
 */
const handleSearch = (query: string): void => {
  hasSearched.value = true
  // Clear previous selections before performing a new search
  searchStore.selectedPodcastIds = []
  searchStore.performSearch(query)
}

// Computed property to check if search has been done but no results found
const noResultsFound = computed(
  () => hasSearched.value && !searchStore.isLoading && searchStore.podcasts.length === 0,
)
</script>

<template>
  <div class="search-section" role="region" aria-labelledby="search-heading">
    <h3 id="search-heading" tabindex="-1">Search for Podcasts</h3>
    <SearchBar @onSearch="handleSearch" />

    <!-- Loading state with aria-live to announce status changes -->
    <div v-if="searchStore.isLoading" class="loading-indicator" role="status" aria-live="polite">
      Searching...
    </div>

    <!-- No results state -->
    <div v-else-if="noResultsFound" class="no-results" role="status" aria-live="polite">
      No podcasts found for your search. Try different keywords.
    </div>

    <!-- Results list -->
    <PodcastList v-else />
  </div>
</template>

<style scoped>
.search-section {
  width: 100%;
  height: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.loading-indicator,
.no-results {
  margin-top: 1rem;
  text-align: center;
  font-style: italic;
  padding: 10px;
  border-radius: 4px;
}

/* Make status messages more visible */
.loading-indicator {
  background-color: #f8f9fa;
}

.no-results {
  background-color: #fff3cd;
  color: #856404;
}

/* Improved heading styles */
#search-heading {
  margin-top: 0;
  margin-bottom: 1rem;
}

/* Focus indicator for keyboard navigation */
#search-heading:focus {
  outline: none;
  text-decoration: underline;
}
</style>
