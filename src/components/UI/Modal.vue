<script setup lang="ts">
import {computed} from "vue";
import Button from "./form/Button.vue";

const props = defineProps<{
  show: boolean;
  size: "sm" | "md" | "lg" | "xl" | "full";
}>();

const emits = defineEmits(['close']);

const size = computed(
    () => {
      return {
        sm: "sm:w-1/3 w-full",
        md: "sm:w-1/2 w-full",
        lg: "sm:w-2/3 w-full",
        xl: "sm:w-3/4 w-full",
        full: "w-full",
      } [props.size]
    }
)

</script>

<template>
  <transition name="fade">
    <div v-show="show"
         class="fixed w-full h-full inset-0 flex items-center justify-center bg-[#03000093] dark:bg-[#C0C0C093] z-50">
      <div
          class="bg-white dark:bg-black rounded-lg shadow-lg p-6 "
          :class="size"
      >
        <div class="flex justify-between items-center">
          <slot name="header"></slot>
          <button
              @click="$emit('close')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        <slot name="body"></slot>
        <slot name="footer"></slot>
        <Button
            theme="secondary"
            class="px-5 duration-300 py-2 rounded-xl w-full mt-4"
            type="button"
            @click="$emit('close')"
        >
          Close
        </Button>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  display: none;
  transform: scale(0.5);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>