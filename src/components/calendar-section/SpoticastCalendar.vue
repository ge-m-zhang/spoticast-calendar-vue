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
import { ref, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import EpisodeModal from '@/components/calendar-section/EpisodeModal.vue'
import { useEpisodeStore } from '@/stores/episodeStore'
import { usePodcastStore } from '@/stores/podcastStore'
import { useCalendarStore } from '@/stores/calendarStore'
import { createEventContentRenderer, getCalendarOptions } from '@/configs/fullcalendar.config'
import type { EventClickArg } from '@fullcalendar/core'
import type { Episode } from '@/types/app.type'

const episodeStore = useEpisodeStore()
const podcastStore = usePodcastStore()
const calendarStore = useCalendarStore()

// Local component state
const showEpisodeModal = ref(false)
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

// Selected episode for the modal
const selectedEpisode = ref<Episode>({
  id: '',
  name: '',
  releaseDate: '',
  releaseDatePrecision: '',
  podcastId: '',
  podcastName: '',
  description: '',
  htmlDescription: '',
  duration: 0,
  audioUrl: '',
  uri: '',
  images: [],
})

// Get selected podcasts from the podcast store
const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)

const calendarEvents = computed(() => calendarStore.calendarEvents)

// todo - in another file
// Handle event click to show episode details in modal
const handleEventClick = (info: EventClickArg) => {
  const episodeId = info.event.id

  const episode = calendarStore.findEpisodeById(episodeId)

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
      podcastId: info.event.extendedProps.podcastId || '',
      podcastName: info.event.extendedProps.podcastName || '',
      description: info.event.extendedProps.description || '',
      htmlDescription: info.event.extendedProps.htmlDescription || '',
      duration: info.event.extendedProps.duration || 0,
      audioUrl: info.event.extendedProps.audioUrl || '',
      uri: info.event.extendedProps.uri || '',
      images: info.event.extendedProps.images || [],
    }
  }

  showEpisodeModal.value = true
}

/**
 * Creates reactive calendar configuration that updates when episodes or selected podcasts change.
 * Sets initial date to first available episode date and customizes event display
 * with accessibility support and podcast prefix removal.
 */
const calendarOptions = computed(() => {
  const customOptions = {
    initialDate:
      episodeStore.datesWithEpisodes.length > 0 ? episodeStore.datesWithEpisodes[0] : undefined,

    eventContent: createEventContentRenderer({
      includeA11y: true,
      removePodcastPrefix: true,
    }),
  }

  return getCalendarOptions(calendarEvents.value, handleEventClick, customOptions)
})

// Force calendar refresh when events change
watch(
  calendarEvents,
  () => {
    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi()
      calendarApi.refetchEvents()
    }
  },
  { deep: true },
)

// For some edge cases where the episode realse date might be in the past
// when podcasts selection changes, navigate to most recent release date
watch(
  selectedPodcasts,
  () => {
    // Allow time for episodes to be fetched and events to update
    setTimeout(() => {
      if (calendarRef.value && episodeStore.datesWithEpisodes.length > 0) {
        const calendarApi = calendarRef.value.getApi()

        // Always navigate to the most recent episode when selecting any podcast
        const sortedDates = [...episodeStore.datesWithEpisodes].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        )

        if (sortedDates.length > 0) {
          // Always go to most recent episode date (last in sorted array)
          const mostRecentDate = sortedDates[sortedDates.length - 1]
          calendarApi.gotoDate(mostRecentDate)
        }
      }
    }, 300)
  },
  { deep: true },
)
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

:deep(.fc-event) {
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

/* Style for the podcast name */
:deep(.podcast-name) {
  font-size: 0.6em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Style for the episode title */
:deep(.episode-title) {
  font-weight: bold;
  font-size: 0.9em;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Limit to 1 line */
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
