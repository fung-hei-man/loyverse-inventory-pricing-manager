<template>
  <v-icon
    @click="toggleTheme"
    size='large'
    :color="isDarkTheme ? 'yellow' : 'indigo'"
    :icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

const isDarkTheme = ref(false);
const vuetifyTheme = useTheme()

onMounted(() => {
  setInitialTheme();
});

const setInitialTheme = () => {
  const storedTheme = localStorage.getItem('color-scheme');
  if (storedTheme) {
    isDarkTheme.value = storedTheme === 'dark';
  } else {
    isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  updateTheme();
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  updateTheme();
};

const updateTheme = () => {
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark-theme');
    vuetifyTheme.global.name.value = 'dark'

  } else {
    document.documentElement.classList.remove('dark-theme');
    vuetifyTheme.global.name.value = 'light'
  }
};

watch(isDarkTheme, () => {
  localStorage.setItem('color-scheme', isDarkTheme.value ? 'dark' : 'light');
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  isDarkTheme.value = e.matches;
  updateTheme();
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  isDarkTheme.value = e.matches;
  updateTheme();
});
</script>
