<script lang="ts" setup>
import { focusBackToSearch } from '@/utils/keyboardNavigation.util'
import { ref, onMounted, onUnmounted } from 'vue'

const emits = defineEmits(['onSearch'])
const inputValue = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const onSearch = (): void => {
  if (inputValue.value.trim()) {
    emits('onSearch', inputValue.value)
  }
}

// Clear search handler with keyboard support
const clearSearch = (): void => {
  inputValue.value = ''
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

// Handle keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && document.activeElement === searchInput.value) {
    e.preventDefault()
    clearSearch()
    focusBackToSearch()
  }
}

// Set up global keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)

  //!* removing the global 'keydown' event listener
  // when the component is unmounted to avoid potential memory leaks
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<template>
  <div class="search-bar">
    <div class="input-wrapper">
      <label for="podcast-search" class="sr-only">Search for podcasts</label>
      <input
        id="podcast-search"
        ref="searchInput"
        v-model="inputValue"
        @keydown.enter="onSearch"
        @keydown.esc="clearSearch"
        placeholder="Search for podcasts..."
        aria-label="Search for podcasts"
        autocomplete="off"
      />
    </div>
    <button type="button" @click="onSearch" aria-label="Search" :disabled="!inputValue.trim()">
      Search
    </button>
  </div>
</template>

<style scoped lang="less">
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  position: relative;

  .input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
  }

  input {
    flex: 1;
    min-width: 0;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  button[type='button'] {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover,
    &:focus {
      background-color: #0056b3;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
}
</style>
