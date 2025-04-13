import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import App from '@/App.vue'
import SearchSection from '@/components/search-section/SearchSection.vue'
import CalendarSection from '@/components/calendar-section/CalendarSection.vue'
import KeyboardNavInstruction from '@/components/KeyboardNavInstruction.vue'
import { handleSectionKeyDown } from '@/utils/keyboardNavigation.util'

// Mock the imported components and utilities
vi.mock('@/components/search-section/SearchSection.vue', () => ({
  default: {
    name: 'SearchSection',
    render: () => null,
  },
}))

vi.mock('@/components/calendar-section/CalendarSection.vue', () => ({
  default: {
    name: 'CalendarSection',
    render: () => null,
  },
}))

vi.mock('@/components/KeyboardNavInstruction.vue', () => ({
  default: {
    name: 'KeyboardNavInstruction',
    render: () => null,
  },
}))

vi.mock('@/utils/keyboardNavigation.util', () => ({
  handleSectionKeyDown: vi.fn(),
}))

describe('App.vue', () => {
  let wrapper: VueWrapper<unknown>

  function createWrapper() {
    // Create a testing Pinia instance
    const pinia = createTestingPinia({
      createSpy: vi.fn, // Add this line to fix the error
    })

    // Mount the component
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          SearchSection: true,
          CalendarSection: true,
          KeyboardNavInstruction: true,
        },
      },
    })

    return wrapper
  }

  it('renders the basic structure correctly', () => {
    createWrapper()

    // App container
    expect(wrapper.find('#app').exists()).toBe(true)

    // Skip link
    const skipLink = wrapper.find('.skip-link')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#search-section')
    expect(skipLink.text()).toBe('Skip to content')

    // Header
    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.attributes('role')).toBe('banner')
    expect(header.attributes('aria-label')).toBe('Spoticast Calendar')
    expect(header.attributes('tabindex')).toBe('0')

    // Title
    expect(wrapper.find('h1').text()).toBe('Spoticast Calendar')

    // KeyboardNavInstruction component
    expect(wrapper.findComponent(KeyboardNavInstruction).exists()).toBe(true)
  })

  it('renders the main sections correctly', () => {
    createWrapper()

    // Main container
    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)

    // Search section
    const searchSection = wrapper.find('#search-section')
    expect(searchSection.exists()).toBe(true)
    expect(searchSection.classes()).toContain('search')
    expect(searchSection.attributes('aria-label')).toBe('Podcast search section')
    expect(searchSection.attributes('tabindex')).toBe('0')

    // Calendar section
    const calendarSection = wrapper.find('#calendar-section')
    expect(calendarSection.exists()).toBe(true)
    expect(calendarSection.classes()).toContain('calendar')
    expect(calendarSection.attributes('aria-label')).toBe('Calendar section')
    expect(calendarSection.attributes('tabindex')).toBe('0')
  })

  it('renders child components', () => {
    createWrapper()

    // Check if child components are rendered
    expect(wrapper.findComponent(SearchSection).exists()).toBe(true)
    expect(wrapper.findComponent(CalendarSection).exists()).toBe(true)
  })

  it('attaches keydown event handlers to sections', async () => {
    createWrapper()

    // Trigger keydown event on search section
    await wrapper.find('#search-section').trigger('keydown', { key: 'Tab' })

    // Check if the handler was called
    expect(handleSectionKeyDown).toHaveBeenCalled()

    // Reset mock
    vi.mocked(handleSectionKeyDown).mockClear()

    // Trigger keydown event on calendar section
    await wrapper.find('#calendar-section').trigger('keydown', { key: 'Tab' })

    // Check if the handler was called again
    expect(handleSectionKeyDown).toHaveBeenCalled()
  })

  it('has accessible elements with correct ARIA attributes', () => {
    createWrapper()

    // Check header accessibility attributes
    const header = wrapper.find('header')
    expect(header.attributes('role')).toBe('banner')
    expect(header.attributes('aria-label')).toBe('Spoticast Calendar')

    // Check search section accessibility attributes
    const searchSection = wrapper.find('#search-section')
    expect(searchSection.attributes('aria-label')).toBe('Podcast search section')
    expect(searchSection.attributes('tabindex')).toBe('0')

    // Check calendar section accessibility attributes
    const calendarSection = wrapper.find('#calendar-section')
    expect(calendarSection.attributes('aria-label')).toBe('Calendar section')
    expect(calendarSection.attributes('tabindex')).toBe('0')
  })
})
