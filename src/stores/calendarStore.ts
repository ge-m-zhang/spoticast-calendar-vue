import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useColorStore } from './colorStore'
import { useEpisodeStore } from './episodeStore'
import { usePodcastStore } from './podcastStore'
import type { CalendarEvent, Episode } from '@/types/app.type'

/**
 * Pinia store for managing calendar events and actions.
 *
 * This store is responsible for transforming episodes into
 * FullCalendar event format and managing the state of the calendar.
 *
 * Ref:
 * https://fullcalendar.io/docs/event-object
 */
export const useCalendarStore = defineStore('calendar', () => {
  const colorStore = useColorStore()
  const episodeStore = useEpisodeStore()
  const podcastStore = usePodcastStore()

  // Getters
  const selectedPodcasts = computed(() => podcastStore.selectedPodcasts)
  const episodes = computed(() => episodeStore.episodes)

  /**
   * Map episodes to FullCalendar event format with Date objects
   */
  const calendarEvents = computed((): CalendarEvent[] => {
    if (!episodes.value || !selectedPodcasts.value || selectedPodcasts.value.length === 0) {
      return []
    }

    const currentlySelectedIds = new Set(selectedPodcasts.value.map((podcast) => podcast.id))

    // Update color assignments based on currently selected podcasts
    colorStore.updateColorAssignments(currentlySelectedIds)

    // Ensure all selected podcasts have a color assigned
    selectedPodcasts.value.forEach((podcast) => {
      colorStore.getPodcastColor(podcast.id)
    })

    // Filter episodes by selected podcasts
    const filteredEpisodes = episodes.value.filter((episode) =>
      currentlySelectedIds.has(episode.podcastId),
    )

    return filteredEpisodes.map((episode) => {
      const color = colorStore.getPodcastColor(episode.podcastId)

      const startDate = new Date(episode.releaseDate)
      return {
        id: episode.id,
        title: `${episode.podcastName}: ${episode.name}`,
        start: startDate,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          episode: episode,
          podcastName: episode.podcastName,
          podcastId: episode.podcastId,
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
