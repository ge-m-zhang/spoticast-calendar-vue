import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useColorStore } from './colorStore'
import { useEpisodeStore } from './episodeStore'
import { usePodcastStore } from './podcastStore'
import type { CalendarEvent, Episode } from '@/types/app.type'

export const useCalendarStore = defineStore('calendar', () => {
  // Get related stores
  const colorStore = useColorStore()
  const episodeStore = useEpisodeStore()
  const podcastStore = usePodcastStore()

  // Getters
  const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)
  const episodes = computed(() => episodeStore.episodes)

  /**
   * Map episodes to FullCalendar event format with proper date handling
   */
  const calendarEvents = computed((): CalendarEvent[] => {
    if (!episodes.value || !selectedPodcasts.value || selectedPodcasts.value.length === 0) {
      return []
    }

    // Get currently selected podcast IDs
    const currentlySelectedIds = new Set(selectedPodcasts.value.map((podcast) => podcast.id))

    // Update color assignments based on currently selected podcasts
    colorStore.updateColorAssignments(currentlySelectedIds)

    // Ensure new podcasts have colors assigned
    selectedPodcasts.value.forEach((podcast) => {
      // Just accessing the color will assign it if needed
      colorStore.getPodcastColor(podcast.id)
    })

    // Filter episodes by selected podcasts
    const filteredEpisodes = episodes.value.filter((episode) =>
      currentlySelectedIds.has(episode.podcastId),
    )

    // Important: Properly normalize dates for accurate calendar display
    return filteredEpisodes.map((episode) => {
      const color = colorStore.getPodcastColor(episode.podcastId)

      // Parse the release date
      const releaseDate = new Date(episode.releaseDate)

      // Reset time part to ensure it shows on the correct day
      // ! critical - midnight in user's local timezone
      // for proper day-based display
      const normalizedDate = new Date(
        releaseDate.getFullYear(),
        releaseDate.getMonth(),
        releaseDate.getDate(),
      )

      // Determine if it's an all-day event based on release_date_precision
      const isAllDay = episode.releaseDatePrecision === 'day'

      return {
        id: episode.id,
        title: `${episode.podcastName}: ${episode.name}`,
        start: isAllDay ? normalizedDate.toISOString().split('T')[0] : normalizedDate.toISOString(),
        allDay: isAllDay,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff', // White text for better contrast
        extendedProps: {
          episode: episode,
          podcastName: episode.podcastName,
        },
      }
    })
  })

  /**
   * Finds an episode by ID from the episode store
   * @param episodeId The ID of the episode to find
   */
  function findEpisodeById(episodeId: string): Episode | undefined {
    return episodeStore.episodes.find((ep) => ep.id === episodeId)
  }

  return {
    // Getters
    calendarEvents,
    // Actions
    findEpisodeById,
  }
})
