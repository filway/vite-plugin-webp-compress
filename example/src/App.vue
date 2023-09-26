<script setup lang="ts">
import ComponentDefault from './components/ComponentDefault.vue'
import ComponentWithImport from './components/ComponentWithImport.vue'
import ComponentWithAlias from './components/ComponentWithAlias.vue'
</script>

<template>
  <div>
    <ComponentDefault />
    <ComponentWithImport />
    <ComponentWithAlias />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
