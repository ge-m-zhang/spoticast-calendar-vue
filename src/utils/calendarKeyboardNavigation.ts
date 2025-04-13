import type { EventClickArg } from '@fullcalendar/core'
import type { Episode } from '@/types/app.type'
import type { Ref } from 'vue'
import { ref } from 'vue'

export function useCalendarKeyboardNavigation(
  calendarStore: { findEpisodeById: (id: string) => Episode | undefined },
  selectedEpisode: Ref<Episode>,
  showEpisodeModal: Ref<boolean>,
) {
  const lastFocusedElement = ref<HTMLElement | null>(null)

  // Handle event clicks to open modal
  const handleEventClick = (info: EventClickArg) => {
    const episodeId = info.event.id
    const episode = calendarStore.findEpisodeById(episodeId)

    // Save the element that triggered this action
    lastFocusedElement.value = info.el as HTMLElement

    if (episode) {
      selectedEpisode.value = { ...episode }
    } else {
      // Fallback to event data if episode not found in store
      const eventDate =
        info.event.start instanceof Date ? info.event.start : new Date(info.event.start || '')

      selectedEpisode.value = {
        id: info.event.id,
        name: info.event.title,
        releaseDate: eventDate.toISOString(),
        releaseDatePrecision: 'day',
        podcastId: info.event.extendedProps.podcastId || '',
        podcastName: info.event.extendedProps.podcastName || '',
        description: info.event.extendedProps.description || '',
        htmlDescription: info.event.extendedProps.htmlDescription || '',
        duration: info.event.extendedProps.duration || 0,
        audioUrl: info.event.extendedProps.audioUrl || '',
        uri: info.event.extendedProps.uri || '',
        images: info.event.extendedProps.images || [],
      }
    }

    showEpisodeModal.value = true
  }

  // Handles keyboard events on calendar events
  const handleEventKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Trigger click on the event
      ;(e.currentTarget as HTMLElement).click()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      const calendarSection = document.querySelector('.calendar')
      if (calendarSection) {
        ;(calendarSection as HTMLElement).focus()
      }
    }
  }

  // Adds keyboard event handlers to calendar events
  const makeEventsFocusable = () => {
    document.querySelectorAll('.fc-event').forEach((event) => {
      const el = event as HTMLElement
      el.addEventListener('keydown', handleEventKeyDown)
    })
  }

  // Close modal and restore focus
  const closeModal = () => {
    showEpisodeModal.value = false

    // Return focus to the last focused element
    setTimeout(() => {
      if (lastFocusedElement.value && document.contains(lastFocusedElement.value)) {
        lastFocusedElement.value.focus()
      } else {
        // Fallback to calendar if the last element is not available
        const calendarSection = document.querySelector('.calendar')
        if (calendarSection) {
          ;(calendarSection as HTMLElement).focus()
        }
      }
    }, 10)
  }

  return {
    handleEventClick,
    makeEventsFocusable,
    closeModal,
    handleEventKeyDown,
  }
}
