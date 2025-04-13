<template>
  <div class="keyboard-nav-container">
    <button
      type="button"
      class="keyboard-help-button"
      :aria-expanded="showHelp"
      @click="toggleHelp"
      aria-label="Keyboard shortcuts"
    >
      <span aria-hidden="true">⌨</span>
    </button>

    <!-- Keyboard shortcuts tooltip -->
    <transition name="fade">
      <div
        v-if="showHelp"
        class="keyboard-shortcuts-tooltip"
        role="dialog"
        aria-labelledby="keyboard-help-title"
      >
        <h2 id="keyboard-help-title">Keyboard Navigation</h2>

        <div class="shortcuts-section">
          <h3>General</h3>
          <ul>
            <li><kbd>Tab</kbd> Navigate between interactive elements</li>
            <li><kbd>Shift</kbd> + <kbd>Tab</kbd> Navigate to previous element</li>
            <li><kbd>Esc</kbd> Return to previous context or close dialogs</li>
            <li><kbd>Enter</kbd> Activate focused item (select/deselect or open)</li>
          </ul>
        </div>

        <div class="shortcuts-section">
          <h3>Podcast Search</h3>
          <ul>
            <li><kbd>Space</kbd> Scroll through podcast list when not on controls</li>
          </ul>
        </div>

        <div class="shortcuts-section">
          <h3>Episode Calendar</h3>
          <ul>
            <li><kbd>Enter</kbd> Behavior for audio player may vary by browser</li>
          </ul>
        </div>

        <div class="shortcuts-section">
          <h3>Section Navigation</h3>
          <ul>
            <li><kbd>↓</kbd> <kbd>→</kbd> Navigate from Search to Calendar section</li>
            <li><kbd>↑</kbd> <kbd>←</kbd> Navigate from Calendar to Search section</li>
          </ul>
        </div>

        <button
          type="button"
          class="close-button"
          @click="toggleHelp"
          aria-label="Close keyboard shortcuts"
        >
          ×
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showHelp = ref(false)

const toggleHelp = () => {
  showHelp.value = !showHelp.value
}

// Close the help when clicking outside or pressing escape
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (
    showHelp.value &&
    !target.closest('.keyboard-shortcuts-tooltip') &&
    !target.closest('.keyboard-help-button')
  ) {
    showHelp.value = false
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (showHelp.value && event.key === 'Escape') {
    showHelp.value = false
  }
}

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

// Clean up event listeners
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
.keyboard-nav-container {
  position: relative;
  display: inline-block;
}

/* Keyboard help button */
.keyboard-help-button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
}

.keyboard-help-button:hover,
.keyboard-help-button:focus {
  background-color: #f5f5f5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Keyboard shortcuts tooltip */
.keyboard-shortcuts-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  width: 320px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  margin-top: 5px;
  text-align: left;
}

.shortcuts-section ul {
  list-style: none;
  padding: 0;
  margin: 5px;
}

.shortcuts-section li {
  margin-bottom: 6px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

kbd {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-size: 0.75rem;
  font-family: monospace;
  line-height: 1;
  padding: 3px 5px;
  margin-right: 3px;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
}

.close-button:hover,
.close-button:focus {
  color: #333;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .keyboard-shortcuts-tooltip {
    width: 350px;
  }
}

@media (max-width: 480px) {
  .keyboard-shortcuts-tooltip {
    width: 280px;
    right: -100px;
  }
}
</style>
