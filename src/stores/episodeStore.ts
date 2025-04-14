import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchEpisodes } from '@/api/spotify'
import type { SpotifyEpisode } from '@/types/Spotify.type'
import type { Episode } from '@/types/app.type'
import { usePodcastStore } from './podcastStore'

// Number of days before earliest loaded date to trigger loading more episodes
const LOAD_MORE_THRESHOLD_DAYS = 21 // Three weeks threshold

/**
 * Pinia store for managing episode state with infinite scrolling support.
 */
export const useEpisodeStore = defineStore('episode', () => {
  // State
  const episodes = ref<Episode[]>([])
  const episodesByDate = ref<Record<string, Episode[]>>({})
  const episodesByPodcast = ref<Record<string, Episode[]>>({})
  const paginationState = ref<
    Record<
      string,
      {
        offset: number
        hasMore: boolean
        earliestDate: string
        isLoadingMore: boolean
      }
    >
  >({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const datesWithEpisodes = computed(() => Object.keys(episodesByDate.value))
  const isLoadingMoreEpisodes = computed(() =>
    Object.values(paginationState.value).some((state) => state.isLoadingMore),
  )

  /**
   * Fetches episodes for a given podcast.
   */
  async function fetchEpisodesForPodcast(
    podcastId: string,
    podcastName: string,
    offset: number = 0,
  ): Promise<Episode[]> {
    // Set appropriate loading state
    if (offset === 0) {
      isLoading.value = true
    } else if (paginationState.value[podcastId]) {
      paginationState.value[podcastId].isLoadingMore = true
    }

    error.value = null

    try {
      // Fetch episodes with pagination
      const result = await fetchEpisodes(podcastId, offset)
      const newEpisodes = result.items.map((episode) =>
        transformToEpisode(episode, podcastId, podcastName),
      )

      // Update pagination tracking
      updatePaginationTracking(podcastId, newEpisodes, result.hasMore, offset + result.items.length)

      // Add episodes to collections (with duplicate prevention)
      addEpisodesToCollections(podcastId, newEpisodes)

      return newEpisodes
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch episodes'
      return []
    } finally {
      // Reset loading state
      if (offset === 0) {
        isLoading.value = false
      } else if (paginationState.value[podcastId]) {
        paginationState.value[podcastId].isLoadingMore = false
      }
    }
  }

  /**
   * Update pagination tracking for a podcast
   */
  function updatePaginationTracking(
    podcastId: string,
    newEpisodes: Episode[],
    hasMore: boolean,
    newOffset: number,
  ): void {
    // Find earliest date in new episodes
    const earliestDate = findEarliestDate(newEpisodes)

    // Initialize or update pagination state
    if (!paginationState.value[podcastId]) {
      // First fetch for this podcast
      paginationState.value[podcastId] = {
        offset: newOffset,
        hasMore,
        earliestDate,
        isLoadingMore: false,
      }
    } else {
      // Update existing state
      const currentState = paginationState.value[podcastId]
      paginationState.value[podcastId] = {
        offset: newOffset,
        hasMore,
        // Only update if new batch has earlier date
        earliestDate:
          earliestDate < currentState.earliestDate ? earliestDate : currentState.earliestDate,
        isLoadingMore: false,
      }
    }
  }

  /**
   * Add episodes to all collections with duplicate prevention
   */
  function addEpisodesToCollections(podcastId: string, newEpisodes: Episode[]): void {
    if (newEpisodes.length === 0) return

    // Add to main episodes array (avoiding duplicates)
    const newEpisodeIds = new Set(newEpisodes.map((ep) => ep.id))
    episodes.value = [...episodes.value.filter((ep) => !newEpisodeIds.has(ep.id)), ...newEpisodes]

    // Add to podcast-specific collection
    if (!episodesByPodcast.value[podcastId]) {
      episodesByPodcast.value[podcastId] = newEpisodes
    } else {
      // Prevent duplicates
      const existingIds = new Set(episodesByPodcast.value[podcastId].map((ep) => ep.id))
      episodesByPodcast.value[podcastId] = [
        ...episodesByPodcast.value[podcastId],
        ...newEpisodes.filter((ep) => !existingIds.has(ep.id)),
      ]
    }

    // Add to date-specific collections
    newEpisodes.forEach((episode) => {
      const dateKey = getDateKey(episode.releaseDate)
      if (!episodesByDate.value[dateKey]) {
        episodesByDate.value[dateKey] = []
      }
      // Prevent duplicates
      if (!episodesByDate.value[dateKey].some((ep) => ep.id === episode.id)) {
        episodesByDate.value[dateKey] = [...episodesByDate.value[dateKey], episode]
      }
    })
  }

  /**
   * Fetch episodes for all selected podcasts
   */
  async function fetchEpisodesForSelectedPodcasts(): Promise<void> {
    const podcastStore = usePodcastStore()
    const selectedPodcasts = podcastStore.selectedPodcasts

    // Clear existing data
    clearEpisodes()

    // Fetch all podcasts in parallel
    await Promise.all(
      selectedPodcasts.map((podcast) => fetchEpisodesForPodcast(podcast.id, podcast.name)),
    )
  }

  /**
   * Check if more episodes need to be loaded based on calendar view
   */
  async function checkAndLoadMoreEpisodes(viewStartDate: Date): Promise<boolean> {
    const podcastStore = usePodcastStore()
    const viewStartDateStr = viewStartDate.toISOString().split('T')[0]
    let loadedNewContent = false

    for (const podcast of podcastStore.selectedPodcasts) {
      const state = paginationState.value[podcast.id]

      // Skip if no more episodes or already loading
      if (!state || !state.hasMore || state.isLoadingMore) continue

      // Calculate threshold date
      const thresholdDate = new Date(state.earliestDate)
      thresholdDate.setDate(thresholdDate.getDate() - LOAD_MORE_THRESHOLD_DAYS)
      const thresholdDateStr = thresholdDate.toISOString().split('T')[0]

      // Check if should load more content
      if (viewStartDateStr <= thresholdDateStr) {
        // Load more episodes
        const newEpisodes = await fetchEpisodesForPodcast(podcast.id, podcast.name, state.offset)

        if (newEpisodes.length > 0) {
          loadedNewContent = true
        }
      }
    }

    return loadedNewContent
  }

  // Helper functions
  function findEarliestDate(episodes: Episode[]): string {
    if (episodes.length === 0) return new Date().toISOString().split('T')[0]

    const dates = episodes.map((ep) => new Date(ep.releaseDate))
    const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    return earliestDate.toISOString().split('T')[0]
  }

  function getDateKey(dateString: string): string {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  function transformToEpisode(
    episode: SpotifyEpisode,
    podcastId: string,
    podcastName: string,
  ): Episode {
    return {
      id: episode.id,
      podcastId,
      podcastName,
      name: episode.name,
      description: episode.description,
      htmlDescription: episode.html_description,
      releaseDate: episode.release_date,
      releaseDatePrecision: episode.release_date_precision,
      duration: episode.duration_ms,
      audioUrl: episode.audio_preview_url || undefined,
      uri: episode.uri,
      images: episode.images.map((img) => ({
        url: img.url,
        height: img.height,
        width: img.width,
      })),
    }
  }

  function getEpisodesByDate(date: string): Episode[] {
    return episodesByDate.value[date] || []
  }

  function getEpisodesByPodcast(podcastId: string): Episode[] {
    return episodesByPodcast.value[podcastId] || []
  }

  function clearEpisodes(): void {
    episodes.value = []
    episodesByDate.value = {}
    episodesByPodcast.value = {}
    paginationState.value = {}
  }

  return {
    // State
    episodes,
    episodesByDate,
    episodesByPodcast,
    isLoading,
    error,

    // Getters
    datesWithEpisodes,
    isLoadingMoreEpisodes,

    // Actions
    fetchEpisodesForPodcast,
    fetchEpisodesForSelectedPodcasts,
    checkAndLoadMoreEpisodes,
    getEpisodesByDate,
    getEpisodesByPodcast,
    clearEpisodes,
  }
})
