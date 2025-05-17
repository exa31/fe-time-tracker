<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  class?: string;
  placeholderOptions?: string;
  options: Array<{ value: string | number; text: string }>;
  theme: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "base";
  disabled?: boolean;
}>();

const emits = defineEmits(['change'])

const modelValue = defineModel<{
  value: string | number;
  text: string;
}>()

const classes = computed(() => {
  return {
    primary: "bg-primary-light hover:bg-primary-dark dark:bg-white dark:hover:bg-gray-300 text-white flex gap-2 dark:text-black " + props.class,
    secondary: "bg-gray-500 hover:bg-gray-700 text-white flex gap-2 " + props.class,
    success: "bg-green-500 hover:bg-green-700 text-white flex gap-2 " + props.class,
    danger: "bg-red-500 hover:bg-red-700 text-white flex gap-2 " + props.class,
    warning: "bg-yellow-500 hover:bg-yellow-700 text-white flex gap-2 " + props.class,
    info: "bg-teal-500 hover:bg-teal-700 text-white flex gap-2 " + props.class,
    base: "text-black bg-white dark:bg-black dark:text-white flex gap-2 border border-gray-600 dark:border-gray-200  ring:black dark:ring-white  " + props.class,
  }[props.theme]
});

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedOption = props.options.find(option => option.value === target.value);
  if (selectedOption) {
    emits('change', selectedOption);
    modelValue.value = selectedOption;
  }

};

</script>

<template>
  <div class="flex flex-col">
    <label :for="id" class="text-base mb-6 font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <select
        :id="id"
        :name="name"
        :class="classes"
        :disabled="disabled"
        @change="onChange"
        :placeholder="label"
    >
      <option disabled value="">{{ placeholderOptions || 'Select an option' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>