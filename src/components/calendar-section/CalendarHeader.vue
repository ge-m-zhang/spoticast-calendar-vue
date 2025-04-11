<template>
  <div class="calendar-header">
    <h3>Podcast Episode Calendar</h3>

    <div class="header-content">
      <div class="podcast-stats">
        <span v-if="isLoading"> Loading episodes... </span>

        <span v-if="selectedPodcasts.length > 0 && !isLoading">
          Showing episodes from
          {{ selectedPodcasts.length }} podcast(s)
        </span>
        <span v-if="selectedPodcasts.length === 0">No podcasts selected</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePodcastStore } from '@/stores/podcastStore'
import { useEpisodeStore } from '@/stores/episodeStore'

const podcastStore = usePodcastStore()
const episodeStore = useEpisodeStore()
const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)

// Determine loading state
const isLoading = computed(() => {
  // If episodes are loading or if podcasts are selected but no episodes loaded yet
  return (
    episodeStore.isLoading ||
    (podcastStore.selectedPodcasts.length > 0 && episodeStore.episodes.length === 0)
  )
})
</script>

<style scoped>
.calendar-header {
  width: 100%;
  margin-bottom: 15px;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.podcast-stats {
  font-size: 0.9rem;
  color: #666;
}
</style>
