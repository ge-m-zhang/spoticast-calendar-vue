<script lang="ts" setup>
import { ref } from 'vue'

const emits = defineEmits(['onSearch'])

const inputValue = ref('')

const onSearch = (): void => {
  if (inputValue.value.trim()) {
    emits('onSearch', inputValue.value)
  }
}
</script>

<template>
  <h3>Search for Podcasts</h3>
  <div class="search-bar">
    <input
      v-model="inputValue"
      @keydown.enter="onSearch"
      placeholder="Search for podcasts..."
      aria-label="Search for podcasts"
    />
    <button type="button" @click="onSearch">Search</button>
  </div>
</template>

<style scoped lang="less">
.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;

  input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #0056b3;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
      font-weight: bold;
    }
  }
}
</style>
