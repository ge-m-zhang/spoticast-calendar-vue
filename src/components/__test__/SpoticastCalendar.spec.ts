import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CalendarSection from '@/components/calendar-section/CalendarSection.vue'

// Mock FullCalendar
vi.mock('@fullcalendar/vue3', () => ({
  default: {
    name: 'FullCalendar',
    template: '<div class="mock-calendar">FullCalendar Mock</div>',
  },
}))

// Mock EpisodeModal
vi.mock('@/components/calendar-section/EpisodeModal.vue', () => ({
  default: {
    name: 'EpisodeModal',
    template: '<div class="mock-modal">Episode Modal Mock</div>',
    props: ['episode'],
  },
}))

// Mock the utilities
vi.mock('@/configs/fullcalendar.config', () => ({
  createEventContentRenderer: vi.fn(() => ({})),
  getCalendarOptions: vi.fn(() => ({})),
}))

vi.mock('@/utils/calendarKeyboardNavigation', () => ({
  useCalendarKeyboardNavigation: vi.fn(() => ({
    handleEventClick: vi.fn(),
    makeEventsFocusable: vi.fn(),
    closeModal: vi.fn(),
  })),
}))

describe('CalendarSection.vue - Basic Rendering', () => {
  let wrapper: VueWrapper<unknown>

  beforeEach(() => {
    // Suppress console warnings about missing Pinia
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  function createBasicWrapper() {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        episode: {
          episodes: [],
          datesWithEpisodes: [],
          isLoading: false,
        },
        podcast: {
          selectedPodcasts: [],
        },
        calendar: {
          calendarEvents: [],
        },
      },
    })

    wrapper = mount(CalendarSection, {
      global: {
        plugins: [pinia],
        stubs: {
          FullCalendar: true,
          EpisodeModal: true,
        },
      },
    })

    return wrapper
  }

  // some simple tests to check renderings

  it('renders the container with correct attributes', () => {
    createBasicWrapper()

    const container = wrapper.find('.spoticast-calendar')
    expect(container.exists()).toBe(true)
    expect(container.attributes('role')).toBe('application')
    expect(container.attributes('aria-label')).toBe('Podcast episodes calendar')
  })

  it('renders the FullCalendar component', () => {
    createBasicWrapper()

    const calendar = wrapper.findComponent({ name: 'FullCalendar' })
    expect(calendar.exists()).toBe(true)
  })

  it('does not render the modal by default', () => {
    createBasicWrapper()

    const modal = wrapper.findComponent({ name: 'EpisodeModal' })
    expect(modal.exists()).toBe(false)
  })
})
