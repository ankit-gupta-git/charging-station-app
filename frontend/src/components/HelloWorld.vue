<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-center lg:text-left">
    <h1 class="text-green-600 font-medium text-4xl relative -top-2.5">{{ msg }}</h1>
    <h3 class="text-lg mt-2">
      You've successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener" class="text-blue-600 hover:underline">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener" class="text-green-600 hover:underline">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
