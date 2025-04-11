<template>
  <div class="spoticast-calendar">
    <div class="calendar-container">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
    <EpisodeModal
      v-if="showEpisodeModal"
      :episode="selectedEpisode"
      @close="showEpisodeModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import EpisodeModal from '@/components/calendar-section/EpisodeModal.vue'
import { useEpisodeStore } from '@/stores/episodeStore'
import { usePodcastStore } from '@/stores/podcastStore'
import { mapEpisodesToEvents } from '@/utils/calendarUtils'
import { getCalendarOptions } from '@/configs/fullcalendar.config'
import type { EventClickArg } from '@fullcalendar/core'
import type { Episode } from '@/types/app.type'

const episodeStore = useEpisodeStore()
const podcastStore = usePodcastStore()
const showEpisodeModal = ref(false)
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const selectedEpisode = ref<Episode>({
  id: '',
  name: '',
  releaseDate: '',
  releaseDatePrecision: '',
  podcastId: '',
  podcastName: '',
  description: '',
  duration: 0,
  audioUrl: '',
})

const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)

//! Map episodes to calendar events
const calendarEvents = computed(() =>
  mapEpisodesToEvents(episodeStore.episodes, selectedPodcasts.value),
)

const handleEventClick = (info: EventClickArg) => {
  // Get the episode ID from the event
  const episodeId = info.event.id

  // Find the full episode data in the store
  const episode = episodeStore.episodes.find((ep) => ep.id === episodeId)

  if (episode) {
    selectedEpisode.value = { ...episode }
  } else {
    // Fallback to event data if episode not found in store
    const eventDate =
      info.event.start instanceof Date ? info.event.start : new Date(info.event.start || '')

    selectedEpisode.value = {
      id: info.event.id,
      name: info.event.title,
      releaseDate: eventDate.toISOString(),
      releaseDatePrecision: 'day',
      podcastId: info.event.extendedProps.podcastId,
      podcastName: info.event.extendedProps.podcastName,
      description: info.event.extendedProps.description || '',
      duration: info.event.extendedProps.duration || 0,
      audioUrl: info.event.extendedProps.audioUrl || '',
    }
  }

  showEpisodeModal.value = true
}

const calendarOptions = computed(() => getCalendarOptions(calendarEvents.value, handleEventClick))
</script>

<style scoped>
.spoticast-calendar {
  width: 100%;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.calendar-container {
  width: 100%;
  flex: 1;
}

/* Target FullCalendar elements with :deep() */

/* Compact event title display */
:deep(.fc-event-title) {
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
}

/* Today highlighting */
:deep(.fc-day-today) {
  background-color: rgba(29, 185, 84, 0.1) !important;
}

/* Add responsive styles */
@media (max-width: 768px) {
  :deep(.fc-toolbar) {
    flex-direction: column;
    align-items: center;
  }
}
</style>
