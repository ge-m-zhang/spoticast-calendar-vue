import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import PodcastItem from '../search-section/PodcastItem.vue'
import type { Podcast } from '@/types/app.type'

// Mock the focusBackToSearch utility
vi.mock('@/utils/keyboardNavigation.util', () => ({
  focusBackToSearch: vi.fn(),
}))

describe('PodcastItem.vue', () => {
  let wrapper: VueWrapper<unknown>

  // Mock podcast data
  const mockPodcast: Podcast = {
    id: 'podcast123',
    name: 'Test Podcast',
    publisher: 'Test Publisher',
    imageUrl: 'test-image.jpg',
    totalEpisodes: 42,
    type: '',
    description: '',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (isSelected = false, selectionDisabled = false) => {
    return mount(PodcastItem, {
      props: {
        podcast: mockPodcast,
        isSelected,
        selectionDisabled,
      },
    })
  }

  it('renders podcast information correctly', () => {
    wrapper = createWrapper()

    expect(wrapper.find('.podcast-name').text()).toBe('Test Podcast')
    expect(wrapper.find('.podcast-meta').text()).toContain('Publisher: Test Publisher')

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('test-image.jpg')
    expect(img.attributes('alt')).toBe('Cover image for Test Podcast')
  })

  it('applies correct classes based on props', () => {
    // Test when not selected and not disabled
    wrapper = createWrapper(false, false)
    expect(wrapper.classes()).toContain('podcast-item')
    expect(wrapper.classes()).not.toContain('is-selected')
    expect(wrapper.classes()).not.toContain('disabled-selection')

    // Test when selected
    wrapper = createWrapper(true, false)
    expect(wrapper.classes()).toContain('is-selected')

    // Test when selection disabled
    wrapper = createWrapper(false, true)
    expect(wrapper.classes()).toContain('disabled-selection')
  })

  it('applies correct accessibility attributes', () => {
    // Test when not selected
    wrapper = createWrapper(false, false)
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.attributes('aria-label')).toBe('Select Test Podcast for calendar')

    // Test when selected
    wrapper = createWrapper(true, false)
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe(
      'Select Test Podcast for calendar (currently selected)',
    )
  })

  it('emits toggleSelect event on click when not disabled', async () => {
    wrapper = createWrapper()

    await wrapper.trigger('click')

    expect(wrapper.emitted('toggleSelect')).toBeTruthy()
    expect(wrapper.emitted('toggleSelect')![0]).toEqual(['podcast123'])
  })

  it('does not emit toggleSelect event on click when disabled', async () => {
    wrapper = createWrapper(false, true)

    await wrapper.trigger('click')

    expect(wrapper.emitted('toggleSelect')).toBeFalsy()
  })

  it('shows tooltip when selection is disabled and hovered', async () => {
    wrapper = createWrapper(false, true)

    // Check if tooltip container exists
    expect(wrapper.find('.tooltip-container').exists()).toBe(true)
    expect(wrapper.find('.tooltip').text()).toContain('Maximum of 5 podcasts can be selected')

    // No tooltip when not disabled
    wrapper = createWrapper(false, false)
    expect(wrapper.find('.tooltip-container').exists()).toBe(false)
  })

  it('handles Enter key press correctly when not disabled', async () => {
    wrapper = createWrapper()

    // Use a more direct approach to trigger the keydown event with the correct key property
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('toggleSelect')).toBeTruthy()
    expect(wrapper.emitted('toggleSelect')![0]).toEqual(['podcast123'])
  })

  it('does not emit toggleSelect on Enter key press when disabled', async () => {
    wrapper = createWrapper(false, true)

    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('toggleSelect')).toBeFalsy()
  })

  it('calls focusBackToSearch on Escape key press', async () => {
    // Import the mocked function
    const { focusBackToSearch } = await import('@/utils/keyboardNavigation.util')

    wrapper = createWrapper()

    await wrapper.trigger('keydown', { key: 'Escape' })

    expect(focusBackToSearch).toHaveBeenCalled()
  })

  it('does not trigger special action on other key presses', async () => {
    wrapper = createWrapper()

    await wrapper.trigger('keydown', { key: 'Space' })

    expect(wrapper.emitted('toggleSelect')).toBeFalsy()
  })
})
