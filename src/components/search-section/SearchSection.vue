<script setup lang="ts">
import { computed, ref } from 'vue'

import SearchBar from './SearchBar.vue'
import { useSearchStore } from '@/stores/searchStore'
import PodcastList from './PodcastList.vue'

const searchStore = useSearchStore()

// Flag to track if a search has been initiated
const hasSearched = ref(false)

/**
 * Initiates podcast search with the given query
 */
const handleSearch = (query: string): void => {
  hasSearched.value = true
  searchStore.performSearch(query)
}

// Computed property to check if search has been done but no results found
const noResultsFound = computed(
  () => hasSearched.value && !searchStore.isLoading && searchStore.podcasts.length === 0,
)
</script>

<template>
  <div class="search-section">
    <SearchBar @onSearch="handleSearch" />

    <div v-if="searchStore.isLoading" class="loading-indicator">Searching...</div>
    <div v-else-if="noResultsFound" class="no-results">
      No podcasts found for your search. Try different keywords.
    </div>

    <PodcastList v-else />
  </div>
</template>

<style scoped>
.search-section {
  width: 100%;
  height: 100%;
  padding: 1rem;
  margin-bottom: 2rem;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.loading,
.no-results {
  margin-top: 1rem;
  text-align: center;
  font-style: italic;
}
</style>
