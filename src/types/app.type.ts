export interface Podcast {
  id: string
  name: string
  type: string
  description: string
  imageUrl?: string
  color?: string
  publisher: string
  uri?: string
  totalEpisodes: number
}

export interface Episode {
  id: string
  podcastId: string
  podcastName: string
  name: string
  description?: string
  releaseDate: string
  releaseDatePrecision: string
  durationMs?: number
  audioUrl?: string // audio_preview_url
  uri?: string
}

export interface CalendarEvent {
  title: string
  start: Date | string
  end?: Date | string
  backgroundColor?: string
  extendedProps?: {
    podcastId: string
    episodeId: string
    [key: string]: unknown
  }
}
