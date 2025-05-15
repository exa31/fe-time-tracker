<script setup lang="ts">

import {computed} from "vue";

const props = defineProps<{
  theme: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "base";
  disabled?: boolean;
  class?: string;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  type: "button" | "submit" | "reset";
}>()

defineEmits(['click'])

const classes = computed(() => {
  return {
    primary: "bg-primary-light hover:bg-primary-dark dark:bg-white dark:hover:bg-gray-300 text-white dark:text-black hover:cursor-pointer " + props.class,
    secondary: "bg-gray-500 hover:bg-gray-700 text-white cursor-pointer  " + props.class,
    success: "bg-green-500 hover:bg-green-700 text-white " + props.class,
    danger: "bg-red-500 hover:bg-red-700 text-white " + props.class,
    warning: "bg-yellow-500 hover:bg-yellow-700 text-white " + props.class,
    info: "bg-teal-500 hover:bg-teal-700 text-white " + props.class,
    base: "text-black dark:text-white hover:cursor-pointer " + props.class,
  }[props.theme]
})

</script>


<template>
  <div class="">
    <button
        :class="classes"
        @click="$emit('click')">
      <slot></slot>
    </button>
  </div>
</template>