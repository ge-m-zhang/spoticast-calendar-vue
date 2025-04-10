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
  duration?: number
  audioUrl?: string // audio_preview_url
  uri?: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string | Date
  backgroundColor: string
  borderColor: string
  extendedProps: {
    podcastId: string
    podcastName: string
    description?: string
    duration?: number
    audioUrl?: string
  }
}

export interface EpisodeDisplay extends Episode {
  color?: string
  backgroundColor?: string
  textColor?: string
}
