/**
 * Types for Podcast (Show) from Spotify's  search API response.
 *
 * These types model the structure returned when performing a search query with `type=show`.
 *
 * Reference: https://developer.spotify.com/documentation/web-api/reference/search
 */
export interface SpotifyShowSearchResponse {
  shows: ShowSearchResult
}

export interface ShowSearchResult {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: ShowItem[]
}

/**
 * Represents a single podcast show (also referred to as "type: show" in Spotify's API).
 */
export interface ShowItem {
  available_markets: string[]
  copyrights: Copyright[]
  description: string
  html_description: string
  explicit: boolean
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: ImageObject[]
  is_externally_hosted: boolean
  languages: string[]
  media_type: string
  name: string
  publisher: string
  type: string
  uri: string
  total_episodes: number
}

/**
 * Optional copyright metadata for podcast shows.
 */
export interface Copyright {
  text?: string
  type?: string
}

export interface ImageObject {
  url: string
  height: number
  width: number
}

/**
 * Types for Episode from Spotify's API response.
 *
 * These types model the structure returned when fetching episodes for a specific podcast.
 *
 * Ref: https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes
 */
export interface SpotifyEpisodeResponse {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: SpotifyEpisode[]
}

export interface SpotifyEpisode {
  audio_preview_url: string
  description: string
  html_description: string
  duration_ms: number
  explicit: boolean
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: SpotifyImage[]
  is_externally_hosted: boolean
  is_playable: boolean
  language: string
  languages: string[]
  name: string
  release_date: string
  release_date_precision: string
  resume_point: {
    fully_played: boolean
    resume_position_ms: number
  }
  type: string
  uri: string
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}
