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
// Define the Episode type used within the application
export interface Episode {
  id: string
  podcastId: string
  podcastName: string
  name: string
  description: string
  htmlDescription: string
  releaseDate: string
  releaseDatePrecision: string
  duration: number
  audioUrl?: string
  uri: string
  images: {
    url: string
    height: number
    width: number
  }[]
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  extendedProps: {
    episode: Episode
    podcastName: string
    podcastId: string
  }
  backgroundColor?: string
  borderColor?: string
  textColor?: string
}

// Calendar view types
export type CalendarViewType = 'month' | 'week'
