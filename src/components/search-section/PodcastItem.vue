<script setup lang="ts">
import type { Podcast } from '@/types/app.type'

const props = defineProps<{
  podcast: Podcast
  isSelected: boolean
  selectionDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleSelect', id: string): void
}>()

const onToggleSelect = () => {
  emit('toggleSelect', props.podcast.id)
}
</script>

<template>
  <div class="podcast-item">
    <img :src="podcast.imageUrl" alt="" class="podcast-image" />
    <div class="podcast-info">
      <h3>
        <a
          :href="podcast.uri ? `https://open.spotify.com/show/${podcast.uri.split(':')[2]}` : '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="podcast-link"
        >
          {{ podcast.name }}
        </a>
      </h3>
      <!-- <p>{{ podcast.description }}</p> -->
      <div class="podcast-meta">Publisher: {{ podcast.publisher }}</div>
      <div class="podcast-meta">Total Episodes: {{ podcast.totalEpisodes }}</div>
    </div>
    <div class="checkbox-container" :class="{ 'disabled-selection': selectionDisabled }">
      <input
        type="checkbox"
        :checked="isSelected"
        :disabled="selectionDisabled"
        @change="onToggleSelect"
      />
      <span v-if="selectionDisabled" class="tooltip">Maximum of 5 podcasts can be selected</span>
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

.checkbox-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.disabled-selection input[type='checkbox'] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
