import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import EpisodeModal from '../calendar-section/EpisodeModal.vue'
import { formatDate, formatDuration } from '@/utils/formatters'
import type { Episode } from '@/types/app.type'

// Mock the formatters
vi.mock('@/utils/formatters', () => ({
  formatDate: vi.fn((date) => `Formatted: ${date}`),
  formatDuration: vi.fn(
    (ms) =>
      `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000)
        .toString()
        .padStart(2, '0')}`,
  ),
}))

describe('EpisodeModal.vue', () => {
  let wrapper: VueWrapper<unknown>
  let mockEpisode: Episode

  // Mock document methods
  beforeEach(() => {
    // Mock the document body
    document.body.innerHTML = '<div id="teleport-target"></div>'

    // Mock episode data
    mockEpisode = {
      id: 'episode123',
      name: 'Test Episode',
      podcastName: 'Test Podcast',
      podcastId: 'podcast123',
      releaseDate: '2023-05-15',
      releaseDatePrecision: 'day',
      duration: 1800000, // 30 minutes
      description: 'This is a test episode description',
      htmlDescription: '<p>This is a <strong>formatted</strong> description</p>',
      uri: 'spotify:episode:episode123',
      audioUrl: 'https://example.com/audio.mp3',
      images: [],
    }

    // Create a spy for document event listeners
    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  const createWrapper = (props = {}) => {
    return mount(EpisodeModal, {
      props: {
        episode: mockEpisode,
        ...props,
      },
      // Enable Teleport for testing
      global: {
        stubs: {
          Teleport: true, // This makes Teleport work in tests
        },
      },
    })
  }

  it('renders the episode details correctly', () => {
    wrapper = createWrapper()

    // Check that basic content is rendered
    expect(wrapper.find('h3').text()).toContain('Test Episode')
    expect(wrapper.find('.podcast-name').text()).toBe('Test Podcast')
    expect(wrapper.find('.release-date').text()).toBe('Formatted: 2023-05-15')
    expect(formatDate).toHaveBeenCalledWith('2023-05-15')

    // Check duration
    expect(wrapper.find('.duration span').text()).toBe('Duration: 30:00')
    expect(formatDuration).toHaveBeenCalledWith(1800000)

    // Check description (should use HTML version when available)
    const description = wrapper.find('.description div')
    expect(description.exists()).toBe(true)
    // Instead of checking exact HTML, check for content
    expect(description.html()).toContain('This is')
    expect(description.html()).toContain('formatted')

    // Check audio preview
    expect(wrapper.find('audio').exists()).toBe(true)
    expect(wrapper.find('audio').attributes('src')).toBe('https://example.com/audio.mp3')
  })

  it('computes the correct Spotify URL when URI is available', () => {
    wrapper = createWrapper()

    const link = wrapper.find('.episode-link')
    expect(link.attributes('href')).toBe('https://open.spotify.com/episode/episode123')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('computes the Spotify URL from id when URI is not available', () => {
    const episodeWithoutUri = { ...mockEpisode, uri: undefined }
    wrapper = createWrapper({ episode: episodeWithoutUri })

    const link = wrapper.find('.episode-link')
    expect(link.attributes('href')).toBe('https://open.spotify.com/episode/episode123')
  })

  it('renders plain text description when htmlDescription is not available', () => {
    const episodeWithoutHtml = { ...mockEpisode, htmlDescription: undefined }
    wrapper = createWrapper({ episode: episodeWithoutHtml })

    expect(wrapper.find('.description p').text()).toBe('This is a test episode description')
  })

  it('does not render audio section when audioUrl is not available', () => {
    const episodeWithoutAudio = { ...mockEpisode, audioUrl: undefined }
    wrapper = createWrapper({ episode: episodeWithoutAudio })

    expect(wrapper.find('.audio-preview').exists()).toBe(false)
  })

  it('adds keydown event listener on mount and removes on unmount', async () => {
    wrapper = createWrapper()

    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))

    wrapper.unmount()

    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('controls body overflow style on mount and unmount', async () => {
    // Initial state
    expect(document.body.style.overflow).toBe('')

    wrapper = createWrapper()

    // After mount
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()

    // After unmount
    expect(document.body.style.overflow).toBe('')
  })

  it('emits close event when close button is clicked', async () => {
    wrapper = createWrapper()

    await wrapper.find('.close-button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')!.length).toBe(1)
  })

  it('closes modal when clicking on backdrop', async () => {
    wrapper = createWrapper()

    // Click the backdrop but not the content
    await wrapper.find('.modal-backdrop').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not close modal when clicking inside content', async () => {
    wrapper = createWrapper()

    // Click inside the modal content
    await wrapper.find('.modal-content').trigger('click')

    // Should not emit close event
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('has proper accessibility attributes', () => {
    wrapper = createWrapper()

    const modal = wrapper.find('.modal-backdrop')
    expect(modal.attributes('role')).toBe('dialog')
    expect(modal.attributes('aria-modal')).toBe('true')
    expect(modal.attributes('aria-labelledby')).toMatch(/episode-modal-\d+/)

    // The ID of the heading should match the aria-labelledby
    const headingId = wrapper.find('h3').attributes('id')
    expect(modal.attributes('aria-labelledby')).toBe(headingId)
  })
})
