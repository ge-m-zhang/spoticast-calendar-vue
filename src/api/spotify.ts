import axios from 'axios'
import { getAccessToken } from '@/auth/getAccessToken'
import type {
  ShowItem,
  SpotifyEpisode,
  SpotifyEpisodeResponse,
  SpotifyShowSearchResponse,
} from '@/types/Spotify.type'

/**
 * Spotify API utility functions.
 *
 * This file contains functions used to interact with the Spotify Web API,
 * including podcast search etc.
 *
 * See official Spotify docs for more details:
 * https://developer.spotify.com/documentation/web-api/reference/search
 *
 * Note: Spotify uses "show" as the type for podcasts in their API.
 *
 * @param {string} query - The search keyword (e.g. podcast name or topic)
 * @returns {Promise<ShowItem[]>} A promise that resolves to an array of podcast (show) items
 * @throws {Error} If the search fails or returns unexpected data
 */
export const searchPodcasts = async (query: string): Promise<ShowItem[]> => {
  const resultLimit = 20
  try {
    const token = await getAccessToken()
    const encodedQuery = encodeURIComponent(query)
    const endpoint = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=show&limit=${resultLimit}`

    const response = await axios.get<SpotifyShowSearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data?.shows?.items) {
      // to remove
      console.log(`Spotify search API response for query "${query}":`, response.data.shows.items)
      return response.data.shows.items
    } else {
      throw new Error('Spotify search response is missing expected show items')
    }
  } catch (error) {
    console.error(`Spotify search API failed for query "${query}":`, error)
    throw new Error('Unable to search podcasts on Spotify.')
  }
}

/**
 * Fetches episodes for a given podcast ID from Spotify.
 *
 * https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes
 * @param {string} podcastId - The Spotify ID of the podcast
 * @returns {Promise<SpotifyEpisode[]>} A promise that resolves to an array of Spotify episodes
 * @throws {Error} If the fetch fails or returns unexpected data
 */
export const fetchEpisodes = async (podcastId: string): Promise<SpotifyEpisode[]> => {
  const resultLimit = 50
  try {
    const token = await getAccessToken()
    const endpoint = `https://api.spotify.com/v1/shows/${podcastId}/episodes?limit=${resultLimit}`

    const response = await axios.get<SpotifyEpisodeResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`Spotify episodes API response for podcast "${podcastId}":`, response.data.items)

    // Return the raw episodes from Spotify
    return response.data.items
  } catch (error) {
    console.error(`Spotify episodes API failed for podcast "${podcastId}":`, error)
    throw new Error('Unable to fetch episodes from Spotify.')
  }
}
