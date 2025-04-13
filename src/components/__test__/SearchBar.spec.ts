import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchBar from '../search-section/SearchBar.vue'

// Mock the focusBackToSearch utility
vi.mock('@/utils/keyboardNavigation.util', () => ({
  focusBackToSearch: vi.fn(),
}))

describe('SearchBar.vue', () => {
  let wrapper: VueWrapper<unknown>

  beforeEach(() => {
    wrapper = mount(SearchBar)
  })

  afterEach(() => {
    wrapper.unmount()
    vi.resetAllMocks()
  })

  it('renders properly', () => {
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Search')
  })

  it('emits onSearch event when button is clicked with non-empty input', async () => {
    const input = wrapper.find('input')
    const button = wrapper.find('button')

    // No emission with empty input
    await button.trigger('click')
    expect(wrapper.emitted('onSearch')).toBeFalsy()

    // Input with value
    await input.setValue('test query')
    await button.trigger('click')

    expect(wrapper.emitted('onSearch')).toBeTruthy()
    expect(wrapper.emitted('onSearch')![0]).toEqual(['test query'])
  })

  it('emits onSearch event when Enter key is pressed with non-empty input', async () => {
    const input = wrapper.find('input')

    await input.setValue('test query')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('onSearch')).toBeTruthy()
    expect(wrapper.emitted('onSearch')![0]).toEqual(['test query'])
  })

  it('clears input when Escape key is pressed', async () => {
    const input = wrapper.find('input')

    await input.setValue('test query')
    expect((input.element as HTMLInputElement).value).toBe('test query')

    await input.trigger('keydown.esc')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('disables search button when input is empty or only whitespace', async () => {
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBe('')

    await wrapper.find('input').setValue('test')
    expect(button.attributes('disabled')).toBeUndefined()

    await wrapper.find('input').setValue('   ')
    expect(button.attributes('disabled')).toBe('')
  })

  it('focuses input after clearing search', async () => {
    const input = wrapper.find('input')

    // Mock element.focus
    const mockFocus = vi.fn()
    vi.spyOn(input.element, 'focus').mockImplementation(mockFocus)

    await input.setValue('test query')
    await input.trigger('keydown.esc')

    expect(mockFocus).toHaveBeenCalled()
  })

  it('handles global Escape key when input is focused', async () => {
    // Import the mocked function
    const { focusBackToSearch } = await import('@/utils/keyboardNavigation.util')

    const input = wrapper.find('input')
    await input.setValue('test query')

    // Simulate focus on input
    Object.defineProperty(document, 'activeElement', {
      value: input.element,
      writable: true,
    })

    // Trigger global keydown event
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    document.dispatchEvent(event)

    // Wait for Vue to process
    await nextTick()

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(focusBackToSearch).toHaveBeenCalled()
  })

  it('ignores global Escape key when input is not focused', async () => {
    // Import the mocked function
    const { focusBackToSearch } = await import('@/utils/keyboardNavigation.util')

    const input = wrapper.find('input')
    await input.setValue('test query')

    // Simulate focus not on input
    Object.defineProperty(document, 'activeElement', {
      value: document.body,
      writable: true,
    })

    // Trigger global keydown event
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    document.dispatchEvent(event)

    // Wait for Vue to process
    await nextTick()

    expect(preventDefaultSpy).not.toHaveBeenCalled()
    expect((input.element as HTMLInputElement).value).toBe('test query')
    expect(focusBackToSearch).not.toHaveBeenCalled()
  })

  it('sets up and removes event listeners correctly', async () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    // Create new wrapper to test mounted hooks
    const newWrapper = mount(SearchBar)

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    // Unmount to test cleanup
    newWrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
