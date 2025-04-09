<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { usePodcastStore } from '@/stores/podcastStore'
import PodcastItem from './PodcastItem.vue'
import { useEpisodeStore } from '@/stores/episodeStore'

const searchStore = usePodcastStore()
const podcasts = computed(() => searchStore.podcasts)
const selectedPodcastIds = computed(() => searchStore.selectedPodcastIds)
const maxSelectionsReached = computed(() => searchStore.maxSelectionsReached)

// ---- test for episode fetching functions!

// test ---- temp!!

watchEffect(() => {
  console.log('Current selectedPodcastIds:', [...selectedPodcastIds.value])
  // If there are any selected podcasts, fetch episodes when selection changes
  if (selectedPodcastIds.value.length > 0) {
    console.log('Attempting to fetch episodes for selected podcasts...')
    fetchEpisodesAndLog()
  }
})

const episodeStore = useEpisodeStore()
// Function to fetch episodes and log results
const fetchEpisodesAndLog = async () => {
  try {
    await episodeStore.fetchEpisodesForSelectedPodcasts()

    console.log('First few episodes:', episodeStore.episodes.slice(0, 3))
    console.log('Dates with episodes:', Object.keys(episodeStore.episodesByDate))
  } catch (error) {
    console.error('Error fetching episodes:', error)
  }
}
// test ----------- end

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
