<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { usePodcastStore } from '@/stores/podcastStore'
import PodcastItem from './PodcastItem.vue'

const searchStore = usePodcastStore()
const podcasts = computed(() => searchStore.podcasts)
const selectedPodcastIds = computed(() => searchStore.selectedPodcastIds)
const maxSelectionsReached = computed(() => searchStore.maxSelectionsReached)

// test ---- temp!!

watchEffect(() => {
  console.log('Current selectedPodcastIds:', [...selectedPodcastIds.value])
})

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
