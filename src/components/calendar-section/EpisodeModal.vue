<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-backdrop"
      @click="closeModal"
      @keydown.esc="closeModal"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="modalId"
      ref="modalRef"
    >
      <div class="modal-content" @click.stop role="document">
        <button class="close-button" @click="closeModal" aria-label="Close modal">&times;</button>
        <div class="episode-header">
          <h3 :id="modalId">
            <a
              v-if="episodeUrl"
              :href="episodeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="episode-link"
              aria-label="Open episode on Spotify in a new tab"
            >
              {{ episode.name }}
            </a>
            <span v-else>{{ episode.name }}</span>
          </h3>
          <div class="podcast-info">
            <span class="podcast-name">{{ episode.podcastName }}</span>
            <span class="release-date">{{ formatDate(episode.releaseDate) }}</span>
          </div>
        </div>
        <div class="episode-body">
          <div v-if="episode.duration" class="duration">
            <span>Duration: {{ formatDuration(episode.duration) }}</span>
          </div>
          <div v-if="episode.htmlDescription" class="description">
            <h4>Episode Description</h4>
            <div v-html="episode.htmlDescription"></div>
          </div>
          <div v-else-if="episode.description" class="description">
            <h4>Episode Description</h4>
            <p>{{ episode.description }}</p>
          </div>
          <div v-if="episode.audioUrl" class="audio-preview">
            <h4>Audio Preview</h4>
            <audio controls :src="episode.audioUrl"></audio>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { formatDate, formatDuration } from '@/utils/formatters'
import type { Episode } from '@/types/app.type'

// Create a unique ID for accessibility
const modalId = `episode-modal-${Date.now()}`
const modalRef = ref<HTMLElement | null>(null)
const isOpen = ref(true)

const props = defineProps<{
  episode: Episode
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Compute the episode URL from the episode object
const episodeUrl = computed(() => {
  if (props.episode.uri && props.episode.uri.startsWith('spotify:episode:')) {
    const episodeId = props.episode.uri.split(':').pop()
    return `https://open.spotify.com/episode/${episodeId}`
  }

  // If we have an ID but no URI
  if (props.episode.id) {
    return `https://open.spotify.com/episode/${props.episode.id}`
  }

  // No URL information available
  return null
})

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

// Focus trap and keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  // Focus the modal when it opens for accessibility
  if (modalRef.value) {
    modalRef.value.focus()
  }
  // Prevent scrolling on the body
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  // Restore scrolling
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  outline: none;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px 10px;
  border-radius: 4px;
}

.close-button:hover,
.close-button:focus {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.close-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.episode-header {
  margin-bottom: 20px;
}

.episode-header h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.4rem;
}

.episode-link {
  color: #1db954; /* Spotify green */
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.episode-link:hover {
  border-bottom-color: currentColor;
}

.episode-link:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-radius: 2px;
}

.podcast-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.podcast-name {
  font-weight: 500;
}

.episode-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.duration {
  color: #666;
  font-size: 0.9rem;
}

.description h4,
.audio-preview h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #444;
}

.description p {
  margin: 0;
  line-height: 1.5;
  color: #333;
  white-space: pre-line;
}

.audio-preview audio {
  width: 100%;
  margin-top: 5px;
}
</style>
