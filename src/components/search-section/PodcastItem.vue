<script setup lang="ts">
import { ref } from 'vue'
import type { Podcast } from '@/types/app.type'
import { focusBackToSearch } from '@/utils/keyboardNavigation.util'

const props = defineProps<{
  podcast: Podcast
  isSelected: boolean
  selectionDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleSelect', id: string): void
}>()

const checkboxId = ref(`podcast-${props.podcast.id}`)

const onToggleSelect = () => {
  if (!props.selectionDisabled) {
    emit('toggleSelect', props.podcast.id)
  }
}

const onCheckboxKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onToggleSelect()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    focusBackToSearch()
  }
}

const aKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    event.preventDefault()
    focusBackToSearch()
  }
}
</script>

<template>
  <div class="podcast-item" :class="{ 'is-selected': isSelected }">
    <img :src="podcast.imageUrl" :alt="`Cover image for ${podcast.name}`" class="podcast-image" />
    <div class="podcast-info">
      <h3>
        <a
          :href="podcast.uri ? `https://open.spotify.com/show/${podcast.uri.split(':')[2]}` : '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="podcast-link"
          :aria-label="`Open ${podcast.name} on Spotify (opens in new tab)`"
          @keydown="aKeyDown"
        >
          {{ podcast.name }}
        </a>
      </h3>
      <div class="podcast-meta">Publisher: {{ podcast.publisher }}</div>
      <div class="podcast-meta">Total Episodes: {{ podcast.totalEpisodes }}</div>
    </div>
    <div class="checkbox-container" :class="{ 'disabled-selection': selectionDisabled }">
      <input
        type="checkbox"
        :id="checkboxId"
        :checked="isSelected"
        :disabled="selectionDisabled"
        @change="onToggleSelect"
        @keydown="onCheckboxKeyDown"
        :aria-label="`Select ${podcast.name} for calendar`"
      />
      <span v-if="selectionDisabled" class="tooltip" role="tooltip">
        Maximum of 5 podcasts can be selected
      </span>
    </div>
  </div>
</template>

<style scoped>
.podcast-item {
  display: flex;
  align-items: start;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  background-color: #ffffff; /* Light gray background */
  border-radius: 8px; /* Rounded corners */
  transition: background-color 0.2s ease; /* Smooth hover effect */
}

.podcast-item:hover {
  background-color: #f0f0f0; /* Slightly darker on hover */
}

.is-selected {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.podcast-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
}

.podcast-info {
  flex: 1;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  display: inline-block;
  max-width: 100%;
  margin-right: 1rem;
}

.podcast-link:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* visual feedback more then 5 select */
.checkbox-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tooltip {
  visibility: hidden;
  width: max-content;
  max-width: 180px;
  background-color: #4c4b4b;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 8px;
  position: absolute;
  z-index: 10;
  bottom: 100%;
  right: 0;
  transform: translateY(-5px);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  white-space: normal;
  pointer-events: none;
}

.checkbox-container:hover .tooltip,
.checkbox-container:focus-within .tooltip {
  visibility: visible;
  opacity: 1;
}

.disabled-selection input[type='checkbox'] {
  cursor: not-allowed;
  opacity: 0.6;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

input[type='checkbox']:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #007bff;
}
</style>
