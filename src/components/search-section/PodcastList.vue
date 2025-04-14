<script setup lang="ts">
import { computed, watch } from 'vue'
import { usePodcastStore } from '@/stores/podcastStore'
import PodcastItem from './PodcastItem.vue'
import { useEpisodeStore } from '@/stores/episodeStore'

const searchStore = usePodcastStore()
const podcasts = computed(() => searchStore.podcasts)
const selectedPodcastIds = computed(() => searchStore.selectedPodcastIds)
const maxSelectionsReached = computed(() => searchStore.maxSelectionsReached)

const episodeStore = useEpisodeStore()

// Watch for changes to selectedPodcastIds and fetch episodes when the selection changes.
watch(
  selectedPodcastIds,
  async (newIds) => {
    if (newIds.length > 0) {
      try {
        await episodeStore.fetchEpisodesForSelectedPodcasts()
      } catch (error) {
        console.error('Error fetching episodes:', error)
      }
    }
  },
  { deep: true },
)
// temp
console.log('First few episodes:', episodeStore.episodes.slice(0, 5))

const toggleSelect = (podcastId: string) => {
  searchStore.togglePodcastSelection(podcastId)
}
</script>

<template>
  <div></div>
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
