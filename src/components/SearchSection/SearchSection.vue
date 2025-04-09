<script lang="ts" setup>
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()

// test searchStore
function handleSearch(query: string) {
  searchStore.performSearch(query)
}
</script>

<template>
  <h1>Search Section</h1>
  <button @click="handleSearch('technology')">Search</button>
</template>
