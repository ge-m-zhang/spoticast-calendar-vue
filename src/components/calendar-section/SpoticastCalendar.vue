<template>
  <div
    class="spoticast-calendar"
    ref="calendarRef"
    role="application"
    aria-label="Podcast episodes calendar"
  >
    <FullCalendar ref="fullCalendarRef" :options="calendarOptions" />

    <div v-if="isLoadingMore" class="loading-indicator">
      <span>Loading more episodes...</span>
    </div>

    <EpisodeModal
      v-if="showEpisodeModal"
      :episode="selectedEpisode"
      @close="closeModal"
      @keydown.esc="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import EpisodeModal from '@/components/calendar-section/EpisodeModal.vue'
import { useEpisodeStore } from '@/stores/episodeStore'
import { usePodcastStore } from '@/stores/podcastStore'
import { useCalendarStore } from '@/stores/calendarStore'
import { createEventContentRenderer, getCalendarOptions } from '@/configs/fullcalendar.config'
import { useCalendarKeyboardNavigation } from '@/utils/calendarKeyboardNavigation'

import type { Episode } from '@/types/app.type'
import type { DatesSetArg } from '@fullcalendar/core'

const episodeStore = useEpisodeStore()
const podcastStore = usePodcastStore()
const calendarStore = useCalendarStore()

const calendarRef = ref<HTMLElement | null>(null)
const fullCalendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const showEpisodeModal = ref(false)

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

const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)
const calendarEvents = computed(() => calendarStore.calendarEvents)
const isLoadingMore = computed(() => episodeStore.isLoadingMoreEpisodes)

// Initialize the keyboard navigation utility with direct access to the stores and refs
const { handleEventClick, makeEventsFocusable, closeModal } = useCalendarKeyboardNavigation(
  calendarStore,
  selectedEpisode,
  showEpisodeModal,
)

// Handle escape key globally for the modal
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showEpisodeModal.value) {
    closeModal()
  }
}

// **Handle dates change (calendar navigation)
const handleDatesSet = async (dateInfo: DatesSetArg) => {
  // Update the calendar store with the new date range and check if need to load more episodes
  const loadedNewEpisodes = await calendarStore.updateViewDateRange(dateInfo.start, dateInfo.end)

  // If loaded new episodes, make sure they are focusable
  if (loadedNewEpisodes) {
    setTimeout(makeEventsFocusable, 100)
  }
}

const calendarOptions = computed(() => {
  const customOptions = {
    initialDate:
      episodeStore.datesWithEpisodes.length > 0 ? episodeStore.datesWithEpisodes[0] : undefined,

    eventContent: createEventContentRenderer({
      includeA11y: true,
      removePodcastPrefix: true,
    }),

    eventsSet: () => {
      setTimeout(makeEventsFocusable, 100)
    },

    viewDidMount: () => {
      setTimeout(makeEventsFocusable, 100)
    },

    // Handle date changes for infinite scrolling pagination
    datesSet: handleDatesSet,

    // Use the event click handler from our utility
    eventClick: handleEventClick,
  }

  return getCalendarOptions(calendarEvents.value, handleEventClick, customOptions)
})

onMounted(() => {
  // Add global escape key handler
  document.addEventListener('keydown', handleEscKey)

  // Initial focus setup
  setTimeout(makeEventsFocusable, 100)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

watch(
  calendarEvents,
  () => {
    if (fullCalendarRef.value) {
      const calendarApi = fullCalendarRef.value.getApi()
      calendarApi.refetchEvents()
      setTimeout(makeEventsFocusable, 100)
    }
  },
  { deep: true },
)

// For some edge cases where the episode release date might be in the past
// when podcasts selection changes, navigate to most recent release date
watch(
  selectedPodcasts,
  () => {
    // Reset the initial render flag when podcasts change
    calendarStore.resetInitialRenderFlag()

    setTimeout(() => {
      if (fullCalendarRef.value && episodeStore.datesWithEpisodes.length > 0) {
        const calendarApi = fullCalendarRef.value.getApi()

        const sortedDates = [...episodeStore.datesWithEpisodes].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        )

        if (sortedDates.length > 0) {
          const mostRecentDate = sortedDates[sortedDates.length - 1]
          calendarApi.gotoDate(mostRecentDate)
          setTimeout(makeEventsFocusable, 100)
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
  position: relative;
}

.calendar-container {
  width: 100%;
  flex: 1;
}

/* Loading indicator for more episodes */
.loading-indicator {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(29, 185, 84, 0.7);
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Target FullCalendar elements with :deep() */

:deep(.fc-event) {
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}

:deep(.fc-event:focus) {
  outline: 2px solid #ffab00;
  background-color: #ffffff;
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
