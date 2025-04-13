// Helper function to focus the parent section with the class '.search'
export const focusBackToSearch = (): void => {
  const parentSection = document.querySelector('.search') as HTMLElement | null
  if (parentSection) {
    parentSection.focus()
  }
}

// Helper function to focus between sections
export const handleSectionKeyDown = (e: KeyboardEvent) => {
  // Only process keyboard navigation when the section itself has focus
  if (document.activeElement !== e.currentTarget) return

  // Navigate within the section with Arrow keys

  // Navigate to calendar section with ArrowRight/ArrowDown key
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    const calendarSection = document.querySelector('.calendar')
    if (calendarSection) {
      ;(calendarSection as HTMLElement).focus()
    }
  }

  // Navigate to search section with ArrowLeft/ArrowUp key
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    const searchSection = document.querySelector('.search')
    if (searchSection) {
      ;(searchSection as HTMLElement).focus()
    }
  }
}
