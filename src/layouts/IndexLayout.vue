<script setup lang="ts">
import HeaderLayout from "../components/HeaderLayout.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderLayout/>
    <main class="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ">
      <RouterView/>
    </main>
  </div>
</template>
