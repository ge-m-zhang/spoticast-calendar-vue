import type { CalendarOptions } from '@fullcalendar/core'
import type { EventSourceInput, EventClickArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// todo - docs
// * FullCalendar docs for more details on available options:
// * https://fullcalendar.io/docs#toc
// * https://www.npmjs.com/package/@fullcalendar/vue3
// *

export const getCalendarOptions = (
  events: EventSourceInput,
  eventClickHandler: (info: EventClickArg) => void,
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

    events,
    eventClick: eventClickHandler,
    dayMaxEvents: true,
    weekNumbers: false,
    fixedWeekCount: false,

    eventDisplay: 'block',

    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 1.5,
  }

  return { ...defaultOptions, ...customOptions }
}
