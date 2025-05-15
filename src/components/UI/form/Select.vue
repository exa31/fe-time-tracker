<script setup lang="ts">
const props = defineProps<{
  id: string;
  name?: string;
  label: string;
  options: Array<{ value: string | number; text: string }>;
  disabled?: boolean;
}>();

const emits = defineEmits(['change'])

const modelValue = defineModel<{
  value: string | number;
  text: string;
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedOption = props.options.find(option => option.value === target.value);
  if (selectedOption) {
    emits('change', selectedOption);
  }
};

</script>

<template>
  <div class="flex flex-col">
    <label :for="id" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <select
        :id="id"
        :name="name"
        :class="`block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`"
        :disabled="disabled"
        @change="onChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>