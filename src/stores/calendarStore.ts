import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useColorStore } from './colorStore'
import { useEpisodeStore } from './episodeStore'
import { usePodcastStore } from './podcastStore'
import type { CalendarEvent, Episode } from '@/types/app.type'

/**
 * Pinia store for managing calendar events and handling infinite scrolling.
 */
export const useCalendarStore = defineStore('calendar', () => {
  // State for tracking calendar view date range
  const lastViewStartDate = ref<Date | null>(null)
  const lastViewEndDate = ref<Date | null>(null)
  const isInitialRender = ref(true)

  // Get other stores
  const colorStore = useColorStore()
  const episodeStore = useEpisodeStore()
  const podcastStore = usePodcastStore()

  /**
   * Map episodes to FullCalendar event format
   */
  const calendarEvents = computed((): CalendarEvent[] => {
    const selectedPodcasts = podcastStore.selectedPodcasts
    const episodes = episodeStore.episodes

    if (!episodes.length || !selectedPodcasts.length) {
      return []
    }

    const currentlySelectedIds = new Set(selectedPodcasts.map((podcast) => podcast.id))

    // Update color assignments
    colorStore.updateColorAssignments(currentlySelectedIds)

    // Ensure all selected podcasts have colors assigned
    selectedPodcasts.forEach((podcast) => {
      colorStore.getPodcastColor(podcast.id)
    })

    // Filter episodes by selected podcasts
    const filteredEpisodes = episodes.filter((episode) =>
      currentlySelectedIds.has(episode.podcastId),
    )

    // Convert to calendar events
    return filteredEpisodes.map((episode) => {
      const color = colorStore.getPodcastColor(episode.podcastId)

      return {
        id: episode.id,
        title: `${episode.podcastName}: ${episode.name}`,
        start: new Date(episode.releaseDate),
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          episode,
          podcastName: episode.podcastName,
          podcastId: episode.podcastId,
        },
      }
    })
  })

  /**
   * Updates the view date range and checks if more episodes are needed
   */
  async function updateViewDateRange(startDate: Date, endDate: Date): Promise<boolean> {
    // Skip if this is the initial render
    if (isInitialRender.value) {
      isInitialRender.value = false
      lastViewStartDate.value = startDate
      lastViewEndDate.value = endDate
      return false
    }

    // Store the new view dates
    lastViewStartDate.value = startDate
    lastViewEndDate.value = endDate

    // Check if need to load more episodes based on the new date range
    return await episodeStore.checkAndLoadMoreEpisodes(startDate)
  }

  /**
   * Finds an episode by ID
   */
  function findEpisodeById(episodeId: string): Episode | undefined {
    return episodeStore.episodes.find((ep) => ep.id === episodeId)
  }

  /**
   * Reset the initial render flag (when changing podcasts)
   */
  function resetInitialRenderFlag(): void {
    isInitialRender.value = true
  }

  return {
    // State
    lastViewStartDate,
    lastViewEndDate,
    isInitialRender,

    // Getters
    calendarEvents,

    // Actions
    updateViewDateRange,
    findEpisodeById,
    resetInitialRenderFlag,
  }
})
