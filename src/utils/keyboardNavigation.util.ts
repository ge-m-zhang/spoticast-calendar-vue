// Helper function to focus the parent section with the class '.search'
export const focusBackToSearch = (): void => {
  const parentSection = document.querySelector('.search') as HTMLElement | null
  if (parentSection) {
    parentSection.focus()
  }
}

// keyboard-navigation.ts
export const handleSectionKeyDown = (event: KeyboardEvent): void => {
  const currentTarget = event.currentTarget as HTMLElement

  const isSearchSection = currentTarget.classList.contains('search')
  const isCalendarSection = currentTarget.classList.contains('calendar')

  // Check if the event target is the section itself and not a child element
  if (event.target === currentTarget) {
    // Handle Escape key to unfocus the current section
    if (event.key === 'Escape') {
      currentTarget.blur()
      return
    }

    if (isSearchSection && event.key === 'ArrowRight') {
      // Navigate from Search to Calendar
      event.preventDefault()
      const calendarElement = document.querySelector('.calendar') as HTMLElement
      if (calendarElement) calendarElement.focus()
    } else if (isCalendarSection && event.key === 'ArrowLeft') {
      // Navigate from Calendar to Search
      event.preventDefault()
      const searchElement = document.querySelector('.search') as HTMLElement
      if (searchElement) searchElement.focus()
    } else if (event.key === 'Enter') {
      // Handle navigation within section
      navigateWithinSection(currentTarget)
    }
  }

  // If the event target is a child element, let the event propagate
  // to be handled by child component handlers
}

export const navigateWithinSection = (section: HTMLElement): void => {
  // Implementation for inner navigation logic
  const firstFocusableElement = section.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ) as HTMLElement
  if (firstFocusableElement) {
    firstFocusableElement.focus()
  }
}
