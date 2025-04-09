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
  title: string
  description?: string
  releaseDate: Date | string
  durationMs?: number
  audioUrl?: string
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
