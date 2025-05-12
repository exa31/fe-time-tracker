<script setup lang="ts">
import {QuestionMarkCircleIcon} from '@heroicons/vue/24/outline';
import {useRouter} from "vue-router";

const router = useRouter()
const handleBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100 px-4 text-center">
    <div class="max-w-md">
      <div class="flex justify-center mb-6 text-gray-500 text-6xl">
        <QuestionMarkCircleIcon/>
      </div>
      <h1 class="text-6xl font-extrabold text-gray-800">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
      <p class="text-gray-500 mt-4">
        The page you're looking for doesn't seem to exist.
      </p>
      <button
          @click="handleBack"
          class="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  </div>
</template>