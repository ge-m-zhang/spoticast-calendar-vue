import { defineStore } from 'pinia'
import { searchPodcasts } from '@/api/spotify'
import type { ShowItem } from '@/types/Spotify.type'

interface SearchState {
  query: string
  results: ShowItem[]
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
    isLoading: false,
    error: null,
  }),
  actions: {
    async performSearch(newQuery: string): Promise<void> {
      this.query = newQuery
      this.isLoading = true
      this.error = null // Reset error for new search.
      try {
        const podcasts = await searchPodcasts(newQuery)
        this.results = podcasts
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'An error occurred'
      } finally {
        this.isLoading = false
      }
    },
    // Resets the search state to its initial values.
    resetSearch(): void {
      this.query = ''
      this.results = []
      this.error = null
    },
  },
})
