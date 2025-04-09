import { defineStore } from 'pinia'
import { searchPodcasts } from '@/api/spotify'
import type { ShowItem } from '@/types/Spotify.type'
import type { Podcast } from '@/types/app.type'

interface SearchState {
  query: string
  results: ShowItem[]
  podcasts: Podcast[]
  selectedPodcastIds: string[]
  isLoading: boolean
  error: string | null
}

/**
 * Pinia store for managing podcast search state and actions.
 *
 * Handles the search query, loading status, error state,
 * and stores results returned from Spotify's search endpoint.
 */
export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    query: '',
    results: [],
    podcasts: [],
    selectedPodcastIds: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async performSearch(newQuery: string): Promise<void> {
      this.query = newQuery
      this.isLoading = true
      this.error = null // Reset error for new search.
      try {
        this.results = await searchPodcasts(newQuery)

        this.podcasts = this.results.map((showItem) => this.transformToPodcast(showItem))
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'An error occurred'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Resets the search state to its initial values
     */
    resetSearch(): void {
      this.query = ''
      this.results = []
      this.podcasts = []
      this.error = null
      this.isLoading = false
    },

    /**
     * Transforms the Spotify API response into app's podcast format
     * @param showItem - The podcast item from Spotify API
     * @returns Formatted podcast object
     */
    transformToPodcast(showItem: ShowItem): Podcast {
      return {
        id: showItem.id,
        name: showItem.name,
        type: showItem.type,
        description: showItem.description,
        imageUrl: showItem.images?.[0]?.url ?? '',
        publisher: showItem.publisher,
        totalEpisodes: showItem.total_episodes,
        uri: showItem.uri,
      }
    },

    /**
     * Adds a podcast to the selected list (max 5)
     * @param podcastId - ID of the podcast to select
     */
    selectPodcast(podcastId: string) {
      if (this.selectedPodcastIds.length < 5 && !this.selectedPodcastIds.includes(podcastId)) {
        this.selectedPodcastIds.push(podcastId)
        return true
      }
      return false
    },

    /**
     * Removes a podcast from the selected list
     * @param podcastId - ID of the podcast to unselect
     */
    unselectPodcast(podcastId: string) {
      this.selectedPodcastIds = this.selectedPodcastIds.filter((id) => id !== podcastId)
    },

    /**
     * Toggles the selection state of a podcast
     * @param podcastId - ID of the podcast to toggle
     */
    togglePodcastSelection(podcastId: string) {
      if (this.selectedPodcastIds.includes(podcastId)) {
        this.unselectPodcast(podcastId)
      } else {
        this.selectPodcast(podcastId)
      }
    },
  },

  /**
   * Getters for computed properties
   */
  getters: {
    // Get an array of selected podcasts
    selectedPodcasts(): Podcast[] {
      return this.podcasts.filter((p) => this.selectedPodcastIds.includes(p.id))
    },

    /**
     * Checks if the maximum number of podcast selections has been reached.
     *
     * @returns {boolean} Returns true if the maximum number of selections (5) has been reached, false otherwise.
     */
    maxSelectionsReached(): boolean {
      return this.selectedPodcastIds.length >= 5
    },
  },
})
