<script setup lang="ts">
// In PodcastList.vue script
import { computed } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import PodcastItem from './PodcastItem.vue'

const searchStore = useSearchStore()
const podcasts = computed(() => searchStore.podcasts)
const selectedPodcastIds = computed(() => searchStore.selectedPodcastIds)
const maxSelectionsReached = computed(() => searchStore.maxSelectionsReached)

// test ----

console.log('selectedPodcastIds', searchStore.selectedPodcastIds)

const toggleSelect = (podcastId: string) => {
  searchStore.togglePodcastSelection(podcastId)
}
</script>

<template>
  <div class="podcast-list" v-if="podcasts.length">
    <PodcastItem
      v-for="podcast in podcasts"
      :key="podcast.id"
      :podcast="podcast"
      :isSelected="selectedPodcastIds.includes(podcast.id)"
      :selectionDisabled="maxSelectionsReached && !selectedPodcastIds.includes(podcast.id)"
      @toggleSelect="toggleSelect"
    />
  </div>
  <div v-else>No podcasts found. Try searching!</div>
</template>
