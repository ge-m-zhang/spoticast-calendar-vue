import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type {
  CalendarOptions,
  EventSourceInput,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core'

/**
 * Creates a custom event content renderer for FullCalendar events.
 *
 * This function returns a renderer that generates HTML content for calendar events,
 * displaying podcast episode information in a customized block on the calendar.
 *
 * @param options - Configuration options for the renderer
 * @param options.includeA11y - Whether to include accessibility attributes (default: true)
 * @param options.removePodcastPrefix - Whether to remove the podcast name prefix from episode titles if present (default: false)
 *
 * @returns A function that takes an EventContentArg and returns an object with HTML content
 */
export const createEventContentRenderer = (
  options: {
    includeA11y?: boolean
    removePodcastPrefix?: boolean
  } = {},
) => {
  const { includeA11y = true, removePodcastPrefix = false } = options

  return (arg: EventContentArg) => {
    const podcastName = arg.event.extendedProps.podcastName || ''
    let episodeTitle = arg.event.title

    // Remove podcast name prefix if enabled and present
    if (removePodcastPrefix) {
      const prefix = podcastName + ': '
      if (episodeTitle.startsWith(prefix)) {
        episodeTitle = episodeTitle.substring(prefix.length)
      }
    }

    // Base CSS classes for styling
    const containerClass = 'event-content'
    const podcastClass = 'podcast-name'
    const titleClass = 'episode-title'

    // A11y attributes
    const a11yAttrs = includeA11y ? ` aria-label="${podcastName} - ${episodeTitle}"` : ''

    return {
      html: `
        <div class="${containerClass}" ${a11yAttrs}>
           <div class="${titleClass}">${episodeTitle}</div>
           <div class="${podcastClass}">${podcastName}</div>

        </div>
      `,
    }
  }
}

/**
 * Get calendar configuration with the specified events and event handler
 *
 * Ref:
 * https://fullcalendar.io/docs#toc
 * https://www.npmjs.com/package/@fullcalendar/vue3
 */
export const getCalendarOptions = (
  events: EventSourceInput,
  eventClickHandler: (arg: EventClickArg) => void,
  customOptions: Partial<CalendarOptions> = {},
): CalendarOptions => {
  const defaultOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    events: events,
    eventClick: eventClickHandler,
    firstDay: 0,
    height: 'auto',
    navLinks: false, //
    selectable: false,
    editable: false,
    dayMaxEvents: true,
    eventDisplay: 'block',
    eventContent: createEventContentRenderer({ includeA11y: true }),
    eventDidMount: (info) => {
      // Enhanced keyboard accessibility
      info.el.setAttribute('tabindex', '0')
      info.el.setAttribute('role', 'button')

      // Add attributes to help with keyboard navigation
      info.el.setAttribute('data-event-id', info.event.id)
      info.el.setAttribute('data-date', info.event.start?.toISOString().split('T')[0] || '')

      info.el.addEventListener('keydown', (e) => {
        // Handle Enter/Space for selection
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const clickArg: EventClickArg = {
            el: info.el,
            event: info.event,
            jsEvent: e as unknown as MouseEvent,
            view: info.view,
          }
          eventClickHandler(clickArg)
        }
      })
    },
  }
  return { ...defaultOptions, ...customOptions }
}
