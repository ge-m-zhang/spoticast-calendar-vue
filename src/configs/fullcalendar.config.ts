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
 * Creates a standard event content renderer with podcast name and episode title.
 *
 * @param includeA11y Whether to include additional accessibility attributes
 */
export const createEventContentRenderer = (includeA11y = true) => {
  return (arg: EventContentArg) => {
    const podcastName = arg.event.extendedProps.podcastName || ''

    // Base CSS classes for styling
    const containerClass = 'event-content'
    const podcastClass = 'podcast-name'
    const titleClass = 'episode-title'

    // A11y attributes
    const a11yAttrs = includeA11y
      ? `tabindex="0" aria-label="${podcastName} - ${arg.event.title}"`
      : ''

    // Use the exact same structure that was working before
    return {
      html: `
        <div class="${containerClass}" ${a11yAttrs}>
          <div class="${podcastClass}">${podcastName}</div>
          <div class="${titleClass}">${arg.event.title}</div>
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
    navLinks: true,
    selectable: false,
    editable: false,
    dayMaxEvents: true,
    eventContent: createEventContentRenderer(true),
    eventDidMount: (info) => {
      // Basic keyboard accessibility
      info.el.setAttribute('tabindex', '0')
      info.el.setAttribute('role', 'button')

      info.el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
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
