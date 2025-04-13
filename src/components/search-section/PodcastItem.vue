<script setup lang="ts">
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

const onToggleSelect = () => {
  if (!props.selectionDisabled) {
    emit('toggleSelect', props.podcast.id)
  }
}

// only having Enter for toggle selection, Space for default browser behavior - scroll down
const onKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !props.selectionDisabled) {
    event.preventDefault()
    onToggleSelect()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    focusBackToSearch()
  }
}
</script>

<template>
  <div
    class="podcast-item"
    :class="{
      'is-selected': isSelected,
      'disabled-selection': selectionDisabled,
    }"
    @click="onToggleSelect"
    @keydown="onKeyDown"
    tabindex="0"
    role="button"
    :aria-pressed="isSelected"
    :aria-label="`Select ${podcast.name} for calendar${isSelected ? ' (currently selected)' : ''}`"
  >
    <img :src="podcast.imageUrl" :alt="`Cover image for ${podcast.name}`" class="podcast-image" />
    <div class="podcast-info">
      <h3 class="podcast-name">{{ podcast.name }}</h3>
      <div class="podcast-meta">Publisher: {{ podcast.publisher }}</div>
      <div class="podcast-meta">Total Episodes: {{ podcast.totalEpisodes }}</div>
    </div>
    <div v-if="selectionDisabled" class="tooltip-container">
      <span class="tooltip" role="tooltip"> Maximum of 5 podcasts can be selected </span>
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
  background-color: #ffffff;
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  position: relative;
  outline: none;
}

.podcast-item:hover:not(.disabled-selection) {
  background-color: #f0f0f0;
}

.podcast-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
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

.podcast-name {
  color: #333;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.podcast-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

/* Disabled selection styles */
.disabled-selection {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Tooltip styles */
.tooltip-container {
  position: absolute;
  top: 0;
  right: 0;
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
  top: -5px;
  right: 0;
  transform: translateY(-100%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  white-space: normal;
  pointer-events: none;
}

.disabled-selection:hover .tooltip,
.disabled-selection:focus .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
