import type { Episode, CalendarEvent } from '@/types/app.type'
import type { Podcast } from '@/types/app.type'

// todo: colors
export const mapEpisodesToEvents = (
  episodes: Episode[],
  selectedPodcasts: Podcast[],
): CalendarEvent[] => {
  if (!episodes || !selectedPodcasts || selectedPodcasts.length === 0) {
    return []
  }

  // Get currently selected podcast IDs
  const currentlySelectedIds = new Set(selectedPodcasts.map((podcast) => podcast.id))

  //! assign colors to podcasts

  // Filter episodes by selected podcasts
  const filteredEpisodes = episodes.filter((episode) => currentlySelectedIds.has(episode.podcastId))

  // Important: Properly normalize dates for accurate calendar display
  return filteredEpisodes.map((episode) => {
    // todo: colors

    // Parse the release date
    const releaseDate = new Date(episode.releaseDate)

    // Reset time part to ensure it shows on the correct day
    // This is critical - we want midnight in user's local timezone
    // for proper day-based display
    const normalizedDate = new Date(
      releaseDate.getFullYear(),
      releaseDate.getMonth(),
      releaseDate.getDate(),
    )

    return {
      id: episode.id,
      title: episode.name,
      start: normalizedDate,
      backgroundColor: 'color',
      borderColor: 'color',
      extendedProps: {
        podcastId: episode.podcastId,
        podcastName: episode.podcastName,
        description: episode.description,
        duration: episode.duration,
        audioUrl: episode.audioUrl,
      },
    }
  })
}
