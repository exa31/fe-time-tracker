<script setup lang="ts">
import {computed, ref} from "vue";

const props = defineProps<
    {
      label: string;
      type?: string;
      placeholder?: string;
      iconPosition?: "left" | "right";
      error?: string;
      id?: string;
      class?: string;
      theme: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "base";
    }
>()

const focus = ref(false)
const modelValue = defineModel<string | number>()


const classes = computed(() => {
  return {
    primary: "bg-primary-light hover:bg-primary-dark dark:bg-white dark:hover:bg-gray-300 text-white flex gap-2 dark:text-black " + props.class,
    secondary: "bg-gray-500 hover:bg-gray-700 text-white flex gap-2 " + props.class,
    success: "bg-green-500 hover:bg-green-700 text-white flex gap-2 " + props.class,
    danger: "bg-red-500 hover:bg-red-700 text-white flex gap-2 " + props.class,
    warning: "bg-yellow-500 hover:bg-yellow-700 text-white flex gap-2 " + props.class,
    info: "bg-teal-500 hover:bg-teal-700 text-white flex gap-2 " + props.class,
    base: "text-black  dark:text-white flex gap-2 border border-gray-600 dark:border-gray-200  ring:black dark:ring-white  " + props.class + " " + (focus.value ? " ring-1 " : " ring-0 ") + (props.error ? " border-red-500 " : " border-gray-300 ") + (props.iconPosition === "left" ? " flex-row-reverse " : " flex-row "),
  } [props.theme]
})
</script>

<template>
  <div class="flex flex-col my-5">
    <label :for="id" class="block font-medium text-lg text-gray-700 dark:text-gray-300">{{ label }}</label>
    <label :for="id" :class="classes">
      <slot name="icon"
      ></slot>
      <input
          :id="id"
          @focus="() => focus = true"
          @blur="() => focus = false"
          :type="type"
          :placeholder="placeholder"
          v-model="modelValue"
          class="outline-0 w-full autofill:!bg-transparent"
      />
    </label>
    <span v-if="error" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ error }}</span>
  </div>
</template>