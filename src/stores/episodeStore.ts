import { defineStore } from 'pinia'
import { fetchEpisodes } from '@/api/spotify'
import type { SpotifyEpisode } from '@/types/Spotify.type'
import { usePodcastStore } from './podcastStore'
import type { Episode } from '@/types/app.type'

interface EpisodeState {
  episodes: Episode[]
  episodesByDate: Record<string, Episode[]>
  episodesByPodcast: Record<string, Episode[]>
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
        // Use the updated fetchEpisodes function that returns SpotifyEpisode[]
        const spotifyEpisodes = await fetchEpisodes(podcastId)
        const transformedEpisodes = spotifyEpisodes.map((episode) =>
          this.transformToEpisode(episode, podcastId, podcastName),
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
      const podcastStore = usePodcastStore()
      const selectedPodcasts = podcastStore.selectedPodcasts

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
    transformToEpisode(episode: SpotifyEpisode, podcastId: string, podcastName: string): Episode {
      return {
        id: episode.id,
        podcastId: podcastId,
        podcastName: podcastName,
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
