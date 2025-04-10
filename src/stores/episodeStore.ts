import type { Episode } from '@/types/app.type'
import type { EpisodeItem } from '@/types/Spotify.type'
import { defineStore } from 'pinia'
import { fetchEpisodes } from '@/api/spotify'
import { usePodcastStore } from '@/stores/podcastStore'

interface EpisodeState {
  episodes: Episode[]
  episodesByDate: Record<string, Episode[]> // Key format: 'YYYY-MM-DD'
  episodesByPodcast: Record<string, Episode[]> // Key is podcast ID
  isLoading: boolean
  error: string | null
}

/**
 * Pinia store for managing episode state and actions.
 *
 * Handles fetching, transforming, and organizing episodes
 * from Spotify's API based on selected podcasts.
 */
export const useEpisodeStore = defineStore('episode', {
  state: (): EpisodeState => ({
    episodes: [],
    episodesByDate: {},
    episodesByPodcast: {},
    isLoading: false,
    error: null,
  }),

  actions: {
    /**
     * Fetches episodes for a given podcast ID and name from Spotify.
     *
     * @param {string} podcastId - The Spotify ID of the podcast
     * @param {string} podcastName - The name of the podcast
     * @returns {Promise<Episode[]>} A promise that resolves to an array of episodes
     */
    async fetchEpisodesForPodcast(podcastId: string, podcastName: string): Promise<Episode[]> {
      this.isLoading = true
      this.error = null

      try {
        const episodeItems = await fetchEpisodes(podcastId)

        const transformedEpisodes = episodeItems.map((item) =>
          this.transformToEpisode(item, podcastId, podcastName),
        )

        // Add to main episodes array
        this.episodes = [...this.episodes, ...transformedEpisodes]

        // Organize by podcast
        this.episodesByPodcast[podcastId] = transformedEpisodes

        // Organize by date
        transformedEpisodes.forEach((episode) => {
          const dateKey = this.getDateKey(episode.releaseDate)
          if (!this.episodesByDate[dateKey]) {
            this.episodesByDate[dateKey] = []
          }
          this.episodesByDate[dateKey] = [...this.episodesByDate[dateKey], episode]
        })

        return transformedEpisodes
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch episodes'
        return []
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetches episodes for all selected podcasts.
     *
     * This method will clear existing episodes before fetching new ones.
     */
    async fetchEpisodesForSelectedPodcasts(): Promise<void> {
      const searchStore = usePodcastStore()
      const selectedPodcasts = searchStore.selectedPodcasts

      // Clear existing episodes if needed
      this.clearEpisodes()

      const fetchPromises = selectedPodcasts.map((podcast) =>
        this.fetchEpisodesForPodcast(podcast.id, podcast.name),
      )

      await Promise.all(fetchPromises)
    },

    // Helper to get date key in YYYY-MM-DD format
    getDateKey(dateString: string): string {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    },

    // Transform Spotify API response to app's Episode type
    transformToEpisode(item: EpisodeItem, podcastId: string, podcastName: string): Episode {
      return {
        id: item.id,
        podcastId: podcastId,
        podcastName: podcastName,
        name: item.name,
        description: item.description,
        releaseDate: item.release_date,
        releaseDatePrecision: item.release_date_precision,
        duration: item.duration_ms,
        audioUrl: item.audio_preview_url || undefined,
        uri: item.uri,
      }
    },

    clearEpisodes(): void {
      this.episodes = []
      this.episodesByDate = {}
      this.episodesByPodcast = {}
    },
  },

  getters: {
    // Get episodes for a specific date
    getEpisodesByDate: (state) => (date: string) => {
      return state.episodesByDate[date] || []
    },

    // Get episodes for a specific podcast
    getEpisodesByPodcast: (state) => (podcastId: string) => {
      return state.episodesByPodcast[podcastId] || []
    },

    // Get all dates that have episodes (useful for calendar highlighting)
    datesWithEpisodes: (state) => {
      return Object.keys(state.episodesByDate)
    },
  },
})
