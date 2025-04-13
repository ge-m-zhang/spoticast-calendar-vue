import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Contrast Cheker
// https://webaim.org/resources/contrastchecker/
const DISTINCT_COLORS = [
  '#255D88' /* Blue Steel */,
  '#296135' /* Forest Green */,
  '#93381A' /* Terracotta */,
  '#8B62AA' /* Amethyst */,
  '#6A4F11' /* Amber Gold */,
  '#245B58' /* Teal */,
  '#A02C4F' /* Raspberry */,
]

export const useColorStore = defineStore('color', () => {
  // State
  const availableColors = ref<Set<string>>(new Set(DISTINCT_COLORS))
  const selectedPodcastColors = ref<Map<string, string>>(new Map())

  // Getters
  /**
   * Get the color for a specific podcast id
   */
  const getPodcastColor = computed(() => (podcastId: string): string => {
    // If this podcast already has an assigned color, return it
    if (selectedPodcastColors.value.has(podcastId)) {
      return selectedPodcastColors.value.get(podcastId)!
    }

    // If there are available colors, use one
    if (availableColors.value.size > 0) {
      // Get the first available color
      const color = Array.from(availableColors.value)[0]
      // Remove from available colors
      availableColors.value.delete(color)
      // Assign to podcast
      selectedPodcastColors.value.set(podcastId, color)
      return color
    }

    // This should never happen with at most 5 podcasts and 7 colors
    // But just in case, use a deterministic fallback
    console.warn('Unexpectedly ran out of colors for podcasts')
    return DISTINCT_COLORS[0] // Default to first color as a safety measure
  })

  // Actions
  /**
   * Release a color when a podcast is deselected
   * @param podcastId Unique identifier for the podcast
   */
  function releasePodcastColor(podcastId: string): void {
    if (selectedPodcastColors.value.has(podcastId)) {
      // Get the color to release
      const color = selectedPodcastColors.value.get(podcastId)!
      // Add it back to available colors
      availableColors.value.add(color)
      // Remove from selected podcasts
      selectedPodcastColors.value.delete(podcastId)
    }
  }

  /**
   * Reset all color assignments
   * For a fresh start or testing
   */
  function resetPodcastColors(): void {
    // Clear the map of assigned colors
    selectedPodcastColors.value.clear()
    // Reset available colors to the full set
    availableColors.value.clear()
    DISTINCT_COLORS.forEach((color) => availableColors.value.add(color))
  }

  /**
   * Update color assignments based on selected podcasts
   * This ensures colors are properly managed when podcasts are selected/deselected
   * @param currentlySelectedIds Set of currently selected podcast IDs
   */
  function updateColorAssignments(currentlySelectedIds: Set<string>): void {
    // Check for podcasts that were deselected
    for (const podcastId of selectedPodcastColors.value.keys()) {
      if (!currentlySelectedIds.has(podcastId)) {
        releasePodcastColor(podcastId)
      }
    }
  }

  return {
    // State
    availableColors,
    selectedPodcastColors,
    // Getters
    getPodcastColor,
    // Actions
    releasePodcastColor,
    resetPodcastColors,
    updateColorAssignments,
  }
})
