import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleSectionKeyDown } from '@/utils/keyboardNavigation.util'

describe('keyboardNavigation.util', () => {
  // Mock elements
  let mockSearchSection: {
    classList: { contains: ReturnType<typeof vi.fn> }
    blur: ReturnType<typeof vi.fn>
    focus: ReturnType<typeof vi.fn>
  }

  let mockCalendarSection: {
    classList: { contains: ReturnType<typeof vi.fn> }
    blur: ReturnType<typeof vi.fn>
    focus: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    // Create mock elements with necessary methods
    mockSearchSection = {
      classList: { contains: vi.fn() },
      blur: vi.fn(),
      focus: vi.fn(),
    }

    mockCalendarSection = {
      classList: { contains: vi.fn() },
      blur: vi.fn(),
      focus: vi.fn(),
    }

    // Set up classList.contains to return correct values
    mockSearchSection.classList.contains.mockImplementation((className) => {
      return className === 'search'
    })

    mockCalendarSection.classList.contains = vi.fn().mockImplementation((className) => {
      return className === 'calendar'
    })

    // Mock document.querySelector
    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === '.search') {
        return mockSearchSection as unknown as HTMLElement
      }
      if (selector === '.calendar') {
        return mockCalendarSection as unknown as HTMLElement
      }
      return null
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('handleSectionKeyDown', () => {
    it('should blur the section when Escape key is pressed', () => {
      // Create a mock event
      const event = {
        key: 'Escape',
        currentTarget: mockSearchSection,
        target: mockSearchSection,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // Call the function
      handleSectionKeyDown(event)

      // Check that blur was called
      expect(mockSearchSection.blur).toHaveBeenCalled()
    })

    it('should move focus to calendar section when ArrowRight is pressed in search section', () => {
      // Create a mock event
      const event = {
        key: 'ArrowRight',
        currentTarget: mockSearchSection,
        target: mockSearchSection,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // Call the function
      handleSectionKeyDown(event)

      // Check expectations
      expect(event.preventDefault).toHaveBeenCalled()
      expect(mockCalendarSection.focus).toHaveBeenCalled()
    })

    it('should move focus to search section when ArrowLeft is pressed in calendar section', () => {
      // Create a mock event
      const event = {
        key: 'ArrowLeft',
        currentTarget: mockCalendarSection,
        target: mockCalendarSection,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // Call the function
      handleSectionKeyDown(event)

      // Check expectations
      expect(event.preventDefault).toHaveBeenCalled()
      expect(mockSearchSection.focus).toHaveBeenCalled()
    })

    it('should handle Enter key press', () => {
      // Create mock section with querySelector method
      const mockSectionWithQuerySelector = {
        ...mockSearchSection,
        querySelector: vi.fn().mockReturnValue(null),
      }

      const event = {
        key: 'Enter',
        currentTarget: mockSectionWithQuerySelector,
        target: mockSectionWithQuerySelector,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // This should not throw
      expect(() => handleSectionKeyDown(event)).not.toThrow()
    })

    it('should not do anything when event target is not the current target', () => {
      // Create a mock event where target is a child element
      const childElement = document.createElement('div')
      const event = {
        key: 'ArrowRight',
        currentTarget: mockSearchSection,
        target: childElement,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // Call the function
      handleSectionKeyDown(event)

      // Check that nothing happens
      expect(event.preventDefault).not.toHaveBeenCalled()
      expect(mockCalendarSection.focus).not.toHaveBeenCalled()
      expect(mockSearchSection.blur).not.toHaveBeenCalled()
    })

    it('should handle case when section elements are not found', () => {
      // Mock querySelector to return null
      vi.spyOn(document, 'querySelector').mockReturnValue(null)

      const event = {
        key: 'ArrowRight',
        currentTarget: mockSearchSection,
        target: mockSearchSection,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent

      // This should not throw an error
      expect(() => handleSectionKeyDown(event)).not.toThrow()
    })
  })
})
